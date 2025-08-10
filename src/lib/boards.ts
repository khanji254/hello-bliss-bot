export type PortLetter = "B" | "C" | "D";
export type PinId = string; // e.g. "D13", "A0"

export interface DigitalPinMap {
  port: PortLetter;
  bit: number; // 0..7
}

export interface BoardDefinition {
  id: string; // internal id like 'arduino-uno'
  displayName: string;
  mcu: "atmega328p" | "rp2040" | string;
  digital: Record<PinId, DigitalPinMap>;
  analog: Record<string, { port: PortLetter; bit: number }>; // A0..A5 => PC0..PC5
}

export const avrRegs = (port: PortLetter) => {
  // atmega328p register map
  switch (port) {
    case "B":
      return { PIN: 0x23, DDR: 0x24, PORT: 0x25 };
    case "C":
      return { PIN: 0x26, DDR: 0x27, PORT: 0x28 };
    case "D":
      return { PIN: 0x29, DDR: 0x2a, PORT: 0x2b };
  }
};

export const ARDUINO_UNO: BoardDefinition = {
  id: "arduino-uno",
  displayName: "Arduino Uno",
  mcu: "atmega328p",
  digital: {
    D0: { port: "D", bit: 0 },
    D1: { port: "D", bit: 1 },
    D2: { port: "D", bit: 2 },
    D3: { port: "D", bit: 3 },
    D4: { port: "D", bit: 4 },
    D5: { port: "D", bit: 5 },
    D6: { port: "D", bit: 6 },
    D7: { port: "D", bit: 7 },
    D8: { port: "B", bit: 0 },
    D9: { port: "B", bit: 1 },
    D10: { port: "B", bit: 2 },
    D11: { port: "B", bit: 3 },
    D12: { port: "B", bit: 4 },
    D13: { port: "B", bit: 5 },
  },
  analog: {
    A0: { port: "C", bit: 0 },
    A1: { port: "C", bit: 1 },
    A2: { port: "C", bit: 2 },
    A3: { port: "C", bit: 3 },
    A4: { port: "C", bit: 4 },
    A5: { port: "C", bit: 5 },
  },
};

export const getBoardDef = (id: string): BoardDefinition | undefined => {
  if (id === ARDUINO_UNO.id) return ARDUINO_UNO;
  return undefined;
};

export async function loadBoardDefFromJson(id: string): Promise<BoardDefinition | undefined> {
  try {
    const res = await fetch(`/boards/${id}.json`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return data as BoardDefinition;
  } catch {
    return undefined;
  }
}
