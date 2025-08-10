import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import '@wokwi/elements';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import Editor from '@monaco-editor/react';

// avr8js imports for UNO emulation
import { CPU, avrInstruction, AVRTimer, timer0Config } from 'avr8js';

// Intel HEX -> flash bytes (Uint8Array) -> program words (Uint16Array)
function parseIntelHex(hexText: string, flashSize = 32 * 1024): Uint8Array {
  const flash = new Uint8Array(flashSize);
  let upper = 0;
  const lines = hexText.split(/\r?\n/);
  for (const line of lines) {
    if (!line || line[0] !== ':') continue;
    const bytes = line.slice(1);
    const len = parseInt(bytes.slice(0, 2), 16);
    const addr = parseInt(bytes.slice(2, 6), 16);
    const type = parseInt(bytes.slice(6, 8), 16);
    if (type === 0) {
      // data record
      const start = upper + addr;
      for (let i = 0; i < len; i++) {
        const b = parseInt(bytes.slice(8 + i * 2, 10 + i * 2), 16);
        if (start + i < flash.length) flash[start + i] = b;
      }
    } else if (type === 4) {
      // extended linear address
      upper = parseInt(bytes.slice(8, 12), 16) << 16;
    } else if (type === 1) {
      // EOF
      break;
    }
  }
  return flash;
}

function bytesToWords(bytes: Uint8Array): Uint16Array {
  const words = new Uint16Array(bytes.length >>> 1);
  for (let i = 0; i < words.length; i++) {
    const lo = bytes[i * 2] | 0;
    const hi = bytes[i * 2 + 1] | 0;
    words[i] = lo | (hi << 8);
  }
  return words;
}

// Addresses for ATmega328P I/O space mapped into data memory
const PINB = 0x23;
const DDRB = 0x24; // not used, here for reference
const PORTB = 0x25;
const PIND = 0x29;
// USART0 Data Register address in data memory (ATmega328p)
const UDR0 = 0xC6;
const UCSR0A = 0xC0; // USART Control and Status Register A

type Template = { name: string; description?: string; url: string; language: 'cpp' | 'python'; code: string };

const TEMPLATES: { arduino: Template[]; rp2040: Template[]; esp32: Template[] } = {
  arduino: [
    {
      name: 'Blink (UNO)',
      description: 'Built-in LED on pin 13',
      url: 'https://wokwi.com/projects/new/arduino-uno?embed=1',
      language: 'cpp',
      code: `// Blink\nvoid setup(){ pinMode(13, OUTPUT);}\nvoid loop(){ digitalWrite(13, HIGH); delay(500); digitalWrite(13, LOW); delay(500);}\n`
    },
    {
      name: 'Serial Echo',
      description: 'Echo typed characters to Serial',
      url: 'https://wokwi.com/projects/new/arduino-uno?embed=1',
      language: 'cpp',
      code: `// Serial Echo\nvoid setup(){ Serial.begin(115200);}\nvoid loop(){ if(Serial.available()){ int c=Serial.read(); Serial.write(c);} }\n`
    }
  ],
  rp2040: [
    {
      name: 'MicroPython REPL',
      description: 'Interactive REPL on UART',
      url: 'https://wokwi.com/projects/new/wokwi-pi-pico?embed=1',
      language: 'python',
      code: `# Try: print('hello')\n# Or write a blink loop using machine.Pin\n`
    },
    {
      name: 'Blink (MicroPython)',
      description: 'On-board LED toggle',
      url: 'https://wokwi.com/projects/new/wokwi-pi-pico?embed=1',
      language: 'python',
      code: `from machine import Pin\nimport time\nled=Pin(25, Pin.OUT)\nwhile True:\n  led.toggle(); time.sleep(0.5)\n`
    }
  ],
  esp32: [
    {
      name: 'Blink (ESP32)',
      description: 'Basic Arduino sketch',
      url: 'https://wokwi.com/projects/new/esp32?embed=1',
      language: 'cpp',
      code: `void setup(){ pinMode(2, OUTPUT);}\nvoid loop(){ digitalWrite(2, !digitalRead(2)); delay(500);}\n`
    },
    {
      name: 'Serial Echo (ESP32)',
      description: 'Echo typed characters',
      url: 'https://wokwi.com/projects/new/esp32?embed=1',
      language: 'cpp',
      code: `void setup(){ Serial.begin(115200);}\nvoid loop(){ if(Serial.available()){ int c=Serial.read(); Serial.write(c);} }\n`
    }
  ]
};

const SerialTerminal: React.FC<{ data$: (cb: (s: string) => void) => () => void; onInput?: (s: string) => void }>
= ({ data$, onInput }) => {
  const termRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!termRef.current) return;
    const term = new Terminal({ convertEol: true, fontSize: 12, theme: { background: '#0b0d12' } });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);
    fitAddon.fit();
    const unsub = data$((s) => term.write(s));
    const disp = term.onData((s) => onInput?.(s));
    return () => { unsub(); disp.dispose(); term.dispose(); };
  }, [termRef.current]);
  return <div ref={termRef} className="h-48 w-full rounded-md border" />;
};

export default function MicrocontrollerLab() {
  const [tab, setTab] = useState<'arduino' | 'rp2040' | 'esp32'>('arduino');
  const [mode, setMode] = useState<'embedded' | 'local'>('embedded');
  const [selection, setSelection] = useState<{ [k in 'arduino' | 'rp2040' | 'esp32']: number }>({ arduino: 0, rp2040: 0, esp32: 0 });
  const subs = useRef<((s: string) => void)[]>([]);
  const publish = (s: string) => subs.current.forEach(cb => cb(s));
  const data$ = (cb: (s: string) => void) => { subs.current.push(cb); return () => {
    subs.current = subs.current.filter(x => x !== cb);
  }};

  const [hex, setHex] = useState<string | null>(null);
  const [uf2, setUf2] = useState<ArrayBuffer | null>(null);
  const hexInputRef = useRef<HTMLInputElement | null>(null);
  const uf2InputRef = useRef<HTMLInputElement | null>(null);
  const blinkTimer = useRef<number | null>(null);
  const picoTimer = useRef<number | null>(null);

  // AVR/UNO emulator state
  const avrRef = useRef<{
    cpu: CPU;
    timer0: AVRTimer;
    running: boolean;
    loopId: number | null;
    lastCycles: number;
    receiveByte: (b: number) => void;
  } | null>(null);

  const currentTpl = TEMPLATES[tab][selection[tab]];

  // Demo feeds for Local (beta)
  const stopBlink = () => { if (blinkTimer.current) { window.clearInterval(blinkTimer.current); blinkTimer.current = null; } };
  const stopPicoBlink = () => { if (picoTimer.current) { window.clearInterval(picoTimer.current); picoTimer.current = null; } };

  // Hook pushbutton to PIND2 (D2). We use pointer events on the Wokwi element.
  useEffect(() => {
    if (mode !== 'local') return;
    const btn = document.getElementById('btn') as HTMLElement | null;
    if (!btn) return;
    const onDown = () => {
      const s = avrRef.current?.cpu?.data;
      if (s) {
        // pull low when pressed (active-low button)
        s[PIND] &= ~(1 << 2);
      }
    };
    const onUp = () => {
      const s = avrRef.current?.cpu?.data;
      if (s) {
        // release -> high
        s[PIND] |= (1 << 2);
      }
    };
    btn.addEventListener('pointerdown', onDown);
    btn.addEventListener('pointerup', onUp);
    btn.addEventListener('pointerleave', onUp);
    return () => {
      btn.removeEventListener('pointerdown', onDown);
      btn.removeEventListener('pointerup', onUp);
      btn.removeEventListener('pointerleave', onUp);
    };
  }, [mode, tab]);

  // Real UNO run using avr8js
  const startAvrLoop = () => {
    const MHZ = 16_000_000;
    const targetHz = 60; // approximately 60fps
    const cyclesPerFrame = Math.floor(MHZ / targetHz);
    const step = () => {
      const st = avrRef.current;
      if (!st || !st.running) return;
      let cycles = 0;
      while (cycles < cyclesPerFrame) {
        avrInstruction(st.cpu);
        (st.timer0 as unknown as { tick: () => void }).tick();
        cycles++;
      }
      st.lastCycles += cycles;
      st.loopId = window.setTimeout(step, 1000 / targetHz);
    };
    avrRef.current!.loopId = window.setTimeout(step, 0);
  };

  const teardownAvr = () => {
    const st = avrRef.current;
    if (st?.loopId) {
      clearTimeout(st.loopId);
      st.loopId = null;
    }
    if (st) st.running = false;
  };

  const runArduino = () => {
    // stop placeholder blink if any
    stopBlink();
    // stop any previous AVR loop
    teardownAvr();

    if (!hex) {
      publish('\r\n[UNO] Please load a compiled .hex file to run on the emulator.');
      return;
    }

    // Create CPU + timer0
    const flashBytes = parseIntelHex(hex);
    const program = bytesToWords(flashBytes);
    const cpu = new CPU(program);
    const timer0 = new AVRTimer(cpu, timer0Config);

    // Map PB5 (D13) LED
    const led = document.getElementById('led13') as HTMLElement | null;
    cpu.writeHooks[PORTB] = (value: number, oldValue: number) => {
      const PB5 = 1 << 5;
      if (((value ^ oldValue) & PB5) && led) {
        const on = (value & PB5) ? '1' : '0';
        led.setAttribute('on', on);
      }
    };

    // Initialize default levels: set PIND2 high (unpressed)
    cpu.data[PIND] |= (1 << 2);
    // Make UART TX ready (UDRE0 = 1) so writes occur
    cpu.data[UCSR0A] |= (1 << 5);

    // USART0 TX -> terminal. We hook UDR0 writes and print bytes.
    cpu.writeHooks[UDR0] = (value: number) => {
      const ch = String.fromCharCode(value & 0xff);
      publish(ch);
    };
    // Clear RXC0 flag when UDR0 is read (cast to access readHooks)
    (cpu as any).readHooks[UDR0] = (value: number) => {
      cpu.data[UCSR0A] &= ~(1 << 7);
      return value;
    };
    // Helper to inject a received byte
    const receiveByte = (b: number) => {
      cpu.data[UDR0] = b & 0xff;
      cpu.data[UCSR0A] |= (1 << 7); // RXC0 set
    };

    // Store state
    avrRef.current = { cpu, timer0, running: true, loopId: null, lastCycles: 0, receiveByte };

    publish('\r\n[UNO] Emulation started. Running at ~real-time.');
    startAvrLoop();
  };

  const stopArduino = () => {
    teardownAvr();
    publish('\r\n[UNO] Stopped.');
  };

  const resetArduino = () => {
    const st = avrRef.current;
    if (!st) return;
    teardownAvr();
    // Reset LED visual
    const led = document.getElementById('led13') as HTMLElement | null;
    if (led) led.setAttribute('on', '0');
    // Re-run with same HEX
    if (hex) runArduino();
    else publish('\r\n[UNO] Reset. Load a HEX and Run.');
  };

  const runPico = () => {
    stopPicoBlink();
    const leds = document.querySelectorAll('wokwi-led[color="green"]');
    const led = leds[0] as any;
    if (!led) { publish('\r\n[RP2040] LED element not found.'); return; }
    publish(`\r\n[RP2040] ${uf2 ? 'UF2 loaded. Emulator wiring pending.' : 'No UF2 loaded. Running demo blink.'}\r\n>>> `);
    if (!uf2) {
      let on = false;
      picoTimer.current = window.setInterval(() => {
        on = !on; led.setAttribute('on', on ? '1' : '0');
      }, 500);
    }
  };

  const stopPico = () => { stopPicoBlink(); publish('\r\n[RP2040] Stopped.\r\n>>> '); };
  const resetPico = () => { stopPicoBlink(); const leds = document.querySelectorAll('wokwi-led[color="green"]'); const led = leds[0] as any; if (led) led.setAttribute('on','0'); publish('\r\n[RP2040] Reset.\r\n>>> '); };

  const runEsp32 = () => publish('\r\n[ESP32] (beta) Local emulation TBD. Using Wokwi elements here.\r\n');

  // Handlers for file uploads
  const onLoadHexClick = () => hexInputRef.current?.click();
  const onHexSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setHex(text);
    publish(`\r\n[UNO] HEX loaded (${file.name}, ${text.length} chars).\r\n`);
  };
  const onLoadUf2Click = () => uf2InputRef.current?.click();
  const onUf2Selected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    setUf2(buf);
    publish(`\r\n[RP2040] UF2 loaded (${file.name}, ${buf.byteLength} bytes).\r\n>>> `);
  };

  // Render a Wokwi Elements canvas for the selected template
  const TemplateCanvas = () => {
    if (tab === 'arduino') {
      return (
        <div className="flex gap-4 items-center p-3 overflow-x-auto">
          <wokwi-arduino-uno></wokwi-arduino-uno>
          <wokwi-breadboard></wokwi-breadboard>
          <wokwi-led color="red" id="tpl-led"></wokwi-led>
          <wokwi-pushbutton id="tpl-btn"></wokwi-pushbutton>
        </div>
      );
    }
    if (tab === 'rp2040') {
      return (
        <div className="flex gap-4 items-center p-3 overflow-x-auto">
          <wokwi-pi-pico></wokwi-pi-pico>
          <wokwi-breadboard></wokwi-breadboard>
          <wokwi-led color="green" id="tpl-led"></wokwi-led>
        </div>
      );
    }
    // esp32
    return (
      <div className="flex gap-4 items-center p-3 overflow-x-auto">
        <wokwi-esp32-devkit-v1></wokwi-esp32-devkit-v1>
        <wokwi-breadboard></wokwi-breadboard>
        <wokwi-led color="yellow" id="tpl-led"></wokwi-led>
      </div>
    );
  };

  // Simple local interaction: toggle template LED on Run as a placeholder
  const runTemplate = () => {
    const led = document.getElementById('tpl-led');
    if (led) {
      const on = (led as any).getAttribute('on') === '1';
      (led as any).setAttribute('on', on ? '0' : '1');
    }
    publish(`\r\n[${tab.toUpperCase()}] Running template: ${currentTpl.name}\r\n`);
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Microcontroller Lab</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={mode === 'embedded' ? 'secondary' : 'outline'} onClick={() => setMode('embedded')}>Templates</Button>
            <Button size="sm" variant={mode === 'local' ? 'secondary' : 'outline'} onClick={() => setMode('local')}>Local (beta)</Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="arduino">Arduino</TabsTrigger>
            <TabsTrigger value="rp2040">RP2040</TabsTrigger>
            <TabsTrigger value="esp32">ESP32</TabsTrigger>
          </TabsList>

          {/* Templates mode - in-app Wokwi Elements, no iframe */}
          {mode === 'embedded' && (
            <TabsContent value={tab} className="space-y-3">
              <Card className="p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {TEMPLATES[tab].map((t, i) => (
                    <Button key={t.name} size="sm" variant={selection[tab] === i ? 'secondary' : 'outline'} onClick={() => setSelection(s => ({ ...s, [tab]: i }))}>
                      {t.name}
                    </Button>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Card className="p-0 overflow-hidden">
                  <TemplateCanvas />
                </Card>
                <div className="space-y-2">
                  <Card className="p-0 overflow-hidden">
                    <Editor height="280px" defaultLanguage={currentTpl.language} value={currentTpl.code} options={{ readOnly: true }} />
                  </Card>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={runTemplate}>Run</Button>
                    <Button size="sm" variant="secondary">Stop</Button>
                    <Button size="sm" variant="outline">Reset</Button>
                  </div>
                  <SerialTerminal data$={data$} />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Local beta mode */}
          {mode === 'local' && (
            <>
              <TabsContent value="arduino" className="space-y-3">
                <Card className="p-3 flex gap-3 items-center overflow-x-auto">
                  <wokwi-arduino-uno></wokwi-arduino-uno>
                  <wokwi-breadboard></wokwi-breadboard>
                  <wokwi-led color="red" id="led13"></wokwi-led>
                  <wokwi-pushbutton id="btn"></wokwi-pushbutton>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Card className="p-0 overflow-hidden">
                    <Editor height="320px" defaultLanguage="cpp" defaultValue={`// Upload a HEX soon. Using preview runner.\n`} />
                  </Card>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button size="sm" onClick={runArduino}>Run</Button>
                      <Button size="sm" variant="secondary" onClick={stopArduino}>Stop</Button>
                      <Button size="sm" variant="outline" onClick={resetArduino}>Reset</Button>
                      <Button size="sm" variant="outline" onClick={onLoadHexClick}>Load HEX</Button>
                      <input ref={hexInputRef} type="file" accept=".hex,.ihex,.txt" className="hidden" onChange={onHexSelected} />
                    </div>
                    <SerialTerminal data$={data$} onInput={(s) => {
                      // send each character to AVR
                      for (const ch of s) avrRef.current?.receiveByte?.(ch.charCodeAt(0));
                    }} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rp2040" className="space-y-3">
                <Card className="p-3 flex gap-3 items-center overflow-x-auto">
                  <wokwi-pi-pico></wokwi-pi-pico>
                  <wokwi-breadboard></wokwi-breadboard>
                  <wokwi-led color="green"></wokwi-led>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Card className="p-0 overflow-hidden">
                    <Editor height="320px" defaultLanguage="python" defaultValue={`# Load a MicroPython UF2 soon. Using preview runner.\n`} />
                  </Card>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button size="sm" onClick={runPico}>Run</Button>
                      <Button size="sm" variant="secondary" onClick={stopPico}>Stop</Button>
                      <Button size="sm" variant="outline" onClick={resetPico}>Reset</Button>
                      <Button size="sm" variant="outline" onClick={onLoadUf2Click}>Load UF2</Button>
                      <input ref={uf2InputRef} type="file" accept=".uf2" className="hidden" onChange={onUf2Selected} />
                    </div>
                    <SerialTerminal data$={data$} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="esp32" className="space-y-3">
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">Local ESP32 emulation TBD. Using Wokwi elements here.</div>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Card className="p-3 overflow-x-auto flex items-center gap-3">
                    <wokwi-esp32-devkit-v1></wokwi-esp32-devkit-v1>
                    <wokwi-led color="yellow"></wokwi-led>
                  </Card>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={runEsp32}>Run</Button>
                      <Button size="sm" variant="secondary">Stop</Button>
                      <Button size="sm" variant="outline">Reset</Button>
                    </div>
                    <SerialTerminal data$={data$} />
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
