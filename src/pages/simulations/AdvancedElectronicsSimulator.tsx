import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Embedded Advanced Electronics Simulator (CircuitJS / Falstad, GPLv2)
// We embed their UI directly for full functionality and fidelity.

const DEFAULT_SRC = 'https://www.falstad.com/circuit/circuitjs.html';

export default function AdvancedElectronicsSimulator() {
  const [src, setSrc] = useState<string>(DEFAULT_SRC);
  const [openValue, setOpenValue] = useState<string>('');

  const openByUrlOrId = () => {
    const v = openValue.trim();
    if (!v) return;
    // Accept full URLs or raw share IDs (we try to extract the numeric/encoded part if present)
    // Example full URL: https://www.falstad.com/circuit/circuitjs.html?cct=XXXX
    // We pass through any URL the user provides.
    try {
      // If it looks like a full URL, use it as-is
      const maybeUrl = new URL(v);
      setSrc(maybeUrl.toString());
      return;
    } catch {
      // Not a full URL: if user pasted an ID, attempt a best-effort link build
      // Many shared links are encoded after cct=, but without a guaranteed pattern we cannot reconstruct reliably.
      // Fall back to setting as-is (if it's a query string) or ignore.
      if (v.startsWith('?') || v.includes('cct=')) {
        setSrc(`${DEFAULT_SRC}${v.startsWith('?') ? v : `?${v}`}`);
      }
    }
  };

  const resetToNew = () => {
    // Force a hard reload of the default simulator URL to clear the circuit
    const ts = Date.now();
    setSrc(`${DEFAULT_SRC}?_=${ts}`);
    setOpenValue('');
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Advanced Electronics (CircuitJS): use the simulator menu to add parts, run, and view scopes.
          </div>
          <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
            <Input
              className="h-9 w-[300px]"
              placeholder="Open CircuitJS by URL or query (e.g. ?cct=...)"
              value={openValue}
              onChange={(e) => setOpenValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') openByUrlOrId(); }}
            />
            <Button variant="outline" onClick={openByUrlOrId}>Open</Button>
            <Button variant="outline" onClick={resetToNew}>New</Button>
          </div>
        </div>

        <div className="space-y-3 w-full">
          <iframe
            title="CircuitJS"
            className="w-full h-[700px] border rounded"
            src={src}
            allow="clipboard-write; clipboard-read"
          />
        </div>
      </div>
    </Layout>
  );
}
