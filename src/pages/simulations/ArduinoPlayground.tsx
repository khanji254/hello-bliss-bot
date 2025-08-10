import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Wokwi-only integration. Native simulator and Serial UI removed.

type BoardId = 'arduino-uno' | 'arduino-nano' | 'esp32';

type Template = {
  id: string;
  label: string;
  description: string;
  board: BoardId | 'any';
  projectId: string; // Wokwi public project id
};

const boardToNewUrl = (board: BoardId) => {
  if (board === 'arduino-nano') return 'https://wokwi.com/projects/new/arduino-nano?embed=1';
  if (board === 'esp32') return 'https://wokwi.com/projects/new/esp32?embed=1';
  return 'https://wokwi.com/projects/new/arduino-uno?embed=1';
};

export default function ArduinoPlayground() {
  const [selectedBoard, setSelectedBoard] = useState<BoardId>('arduino-uno');
  const [wokwiSrc, setWokwiSrc] = useState<string>(boardToNewUrl('arduino-uno'));
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [openIdInput, setOpenIdInput] = useState<string>('');

  const wokwiFrameRef = useRef<HTMLIFrameElement | null>(null);

  // File inputs
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const hexInputRef = useRef<HTMLInputElement | null>(null);

  // For safe HEX firmware update
  const [pendingFirmwareHex, setPendingFirmwareHex] = useState<string | null>(null);
  const [isWokwiReady, setIsWokwiReady] = useState<boolean>(false);
  const pendingMessages = useRef<any[]>([]);
  const hexFallbackTimer = useRef<number | null>(null);

  const TEMPLATES: Template[] = useMemo(() => [
    // UNO
    { id: 'tpl-uno-blink', label: 'UNO: Blink', description: 'Basic Blink example (public Wokwi project).', board: 'arduino-uno', projectId: '344891652101374548' },
    { id: 'tpl-uno-rtc', label: 'UNO: Alarm Clock (RTC)', description: 'RTC demo project.', board: 'arduino-uno', projectId: '297787059514376717' },
    { id: 'tpl-uno-simon', label: 'UNO: Simon Game', description: 'Button/memory game demo.', board: 'arduino-uno', projectId: '328451800839488084' },
    // Nano
    { id: 'tpl-nano-pong', label: 'Nano: Pong', description: 'Mini OLED Pong demo.', board: 'arduino-nano', projectId: '348849468083274322' },
    // ESP32
    { id: 'tpl-esp32-ntp', label: 'ESP32: NTP Clock', description: 'NTP time with display/serial.', board: 'esp32', projectId: '321525495180034642' },
    { id: 'tpl-esp32-joke', label: 'ESP32: Joke Machine', description: 'HTTP + display demo.', board: 'esp32', projectId: '342032431249883731' },
  ], []);

  // Persist last template per board
  useEffect(() => {
    const key = `wokwi:lastTemplate:${selectedBoard}`;
    const saved = localStorage.getItem(key);
    if (saved) setSelectedTemplate(saved);
  }, [selectedBoard]);

  useEffect(() => {
    if (selectedTemplate) localStorage.setItem(`wokwi:lastTemplate:${selectedBoard}`, selectedTemplate);
  }, [selectedTemplate, selectedBoard]);

  // Messages from Wokwi: ready/loaded + fs.read for HEX
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as any;
      if (!d || typeof d !== 'object') return;

      // Mark ready on common events
      if (
        (d.type === 'wokwi' && (d.event === 'ready' || d.event === 'loaded' || d.event === 'started')) ||
        d.type === 'wokwi-ready'
      ) {
        setIsWokwiReady(true);
        // flush pending messages
        const win = wokwiFrameRef.current?.contentWindow;
        if (win && pendingMessages.current.length) {
          pendingMessages.current.forEach((m) => win.postMessage(m, '*'));
          pendingMessages.current = [];
        }
      }

      // fs.read responses for diagram.json during HEX update
      const fileName = d.name || d.file;
      if (d.type === 'wokwi' && d.event === 'fs.read' && typeof fileName === 'string') {
        if (fileName === 'diagram.json' && typeof d.content === 'string' && pendingFirmwareHex) {
          try {
            const diagram = JSON.parse(d.content);
            const parts = Array.isArray(diagram?.parts) ? diagram.parts : [];
            const mcuIdx = parts.findIndex((p: any) => typeof p?.type === 'string' && (p.type.includes('arduino') || p.type.includes('esp32') || p.type.includes('rp2040') || p.type.includes('pico')));
            if (mcuIdx >= 0) {
              const attrs = { ...(parts[mcuIdx].attrs || {}) };
              (attrs as any).firmware = 'firmware.hex';
              parts[mcuIdx] = { ...parts[mcuIdx], attrs };
              diagram.parts = parts;
              pushFilesToWokwi([
                { name: 'diagram.json', content: JSON.stringify(diagram, null, 2) },
                { name: 'firmware.hex', content: pendingFirmwareHex }
              ], true);
              setPendingFirmwareHex(null);
              requestStart();
            } else {
              pushFilesToWokwi([{ name: 'firmware.hex', content: pendingFirmwareHex }], true);
              setPendingFirmwareHex(null);
              requestStart();
            }
          } catch {
            pushFilesToWokwi([{ name: 'firmware.hex', content: pendingFirmwareHex }], true);
            setPendingFirmwareHex(null);
            requestStart();
          }
        }
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [pendingFirmwareHex]);

  // Mark ready and flush when iframe loads (not all builds emit a ready event)
  const onIframeLoad = () => {
    setIsWokwiReady(true);
    const win = wokwiFrameRef.current?.contentWindow;
    if (win && pendingMessages.current.length) {
      pendingMessages.current.forEach((m) => win.postMessage(m, '*'));
      pendingMessages.current = [];
    }
  };

  // Generalized post helper: queue until ready, and send
  const postToWokwi = (msg: any) => {
    const win = wokwiFrameRef.current?.contentWindow;
    if (!win || !isWokwiReady) {
      pendingMessages.current.push(msg);
      return;
    }
    win.postMessage(msg, '*');
  };

  // Send multiple command variants for broader compatibility
  const postAllVariants = (files?: { name: string; content: string }[], code?: string) => {
    if (files && files.length) {
      postToWokwi({ type: 'wokwi', command: 'fs.update', files });
      files.forEach(f => postToWokwi({ type: 'wokwi', command: 'fs.write', name: f.name, content: f.content }));
      files.forEach(f => postToWokwi({ action: 'fs.write', name: f.name, content: f.content } as any));
      files.forEach(f => postToWokwi({ type: 'wokwi', command: 'fs.put', path: f.name, data: f.content } as any));
    }
    if (typeof code === 'string') {
      postToWokwi({ type: 'wokwi', action: 'loadCode', code });
      postToWokwi({ action: 'load-code', code });
      postToWokwi({ type: 'wokwi', command: 'code.load', code });
    }
    // Try to apply changes
    postToWokwi({ type: 'wokwi', action: 'reload' });
    postToWokwi({ type: 'wokwi', command: 'reload' });
    postToWokwi({ action: 'reload' });
  };

  const pushFilesToWokwi = (files: { name: string; content: string }[], alsoReload = false) => {
    postAllVariants(files);
    if (alsoReload) {
      postToWokwi({ type: 'wokwi', action: 'reload' });
    }
  };

  const requestStart = () => {
    // Try various start/resume commands silently
    postToWokwi({ type: 'wokwi', action: 'run' });
    postToWokwi({ action: 'simulate' });
    postToWokwi({ type: 'wokwi', command: 'start' });
    postToWokwi({ type: 'wokwi', action: 'play' });
    postToWokwi({ action: 'start' });
  };

  // Fallback: if we cannot read diagram.json, inject a minimal diagram with firmware for new projects or when requested
  const pushMinimalFirmwareDiagram = (firmware: string) => {
    const baseType = selectedBoard === 'arduino-nano' ? 'wokwi-arduino-nano' : (selectedBoard === 'esp32' ? 'wokwi-esp32-devkit-v1' : 'wokwi-arduino-uno');
    const diagram = { parts: [{ id: 'board-1', type: baseType, attrs: { firmware: 'firmware.hex' } }] };
    pushFilesToWokwi([
      { name: 'diagram.json', content: JSON.stringify(diagram, null, 2) },
      { name: 'firmware.hex', content: firmware }
    ], true);
    requestStart();
  };

  // UI handlers
  const handleBoardChange = (value: string) => {
    const board = value as BoardId;
    setSelectedBoard(board);
    setIsWokwiReady(false);
    setWokwiSrc(boardToNewUrl(board));
  };

  const onTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setIsWokwiReady(false);
    setWokwiSrc(`https://wokwi.com/projects/${tpl.projectId}?embed=1`);
  };

  const onUploadCodeClick = () => codeInputRef.current?.click();
  const onCodeSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0]; if (!f) return; const text = await f.text();
    postAllVariants([{ name: 'sketch.ino', content: text }], text);
    requestStart();
    e.currentTarget.value = '';
  };

  const onUploadHexClick = () => hexInputRef.current?.click();
  const onHexSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0]; if (!f) return; const text = await f.text();
    setPendingFirmwareHex(text);
    // Try reading current diagram.json
    const win = wokwiFrameRef.current?.contentWindow; if (win) {
      win.postMessage({ type: 'wokwi', command: 'fs.read', name: 'diagram.json' }, '*');
      win.postMessage({ action: 'fs.read', name: 'diagram.json' } as any, '*');
    }
    // Fallback after 1.2s: if still pending, inject minimal diagram (safe for new projects)
    if (hexFallbackTimer.current) window.clearTimeout(hexFallbackTimer.current);
    hexFallbackTimer.current = window.setTimeout(() => {
      if (pendingFirmwareHex) {
        pushMinimalFirmwareDiagram(pendingFirmwareHex);
        setPendingFirmwareHex(null);
      }
    }, 1200) as unknown as number;
    e.currentTarget.value = '';
  };

  const openByIdOrUrl = () => {
    const v = openIdInput.trim(); if (!v) return;
    const m = v.match(/projects\/(\d+)/);
    const id = m?.[1] || v.replace(/[^0-9]/g, '');
    if (id) {
      setIsWokwiReady(false);
      setWokwiSrc(`https://wokwi.com/projects/${id}?embed=1`);
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedBoard} onValueChange={handleBoardChange}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Board" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="arduino-uno">Arduino Uno</SelectItem>
              <SelectItem value="arduino-nano">Arduino Nano</SelectItem>
              <SelectItem value="esp32">ESP32</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-4">
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger className="w-[360px]"><SelectValue placeholder="Choose a Wokwi template" /></SelectTrigger>
              <SelectContent>
                {TEMPLATES.filter(t => t.board === selectedBoard || t.board === 'any').map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                className="h-9 w-[260px] border rounded px-2"
                placeholder="Open Wokwi by URL or ID"
                value={openIdInput}
                onChange={(e) => setOpenIdInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') openByIdOrUrl(); }}
              />
              <Button variant="outline" onClick={openByIdOrUrl}>Open</Button>
            </div>

            <Button variant="outline" onClick={() => { setIsWokwiReady(false); setWokwiSrc(boardToNewUrl(selectedBoard)); }}>New Project</Button>
            <Button variant="outline" onClick={onUploadCodeClick}>Upload Code</Button>
            <input ref={codeInputRef} type="file" accept=".ino,.cpp,.c,.h,.hpp,.txt" onChange={onCodeSelected} className="hidden" />
            <Button variant="outline" onClick={onUploadHexClick}>Upload HEX</Button>
            <input ref={hexInputRef} type="file" accept=".hex" onChange={onHexSelected} className="hidden" />
          </div>
        </div>

        <div className="space-y-3 w-full">
          <iframe
            ref={wokwiFrameRef}
            title="Wokwi"
            className="w-full h-[600px] border rounded"
            src={wokwiSrc}
            onLoad={onIframeLoad}
            allow="clipboard-write"
          />
        </div>
      </div>
    </Layout>
  );
}