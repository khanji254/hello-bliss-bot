import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Webots Online (webots.cloud) can be embedded when you have a share/run URL.
// Paste a full Webots URL (e.g., https://webots.cloud/run?... ) in the input below.
// Templates only preselect names; they won't auto-load unless you provide a URL for them.

type Template = {
  id: string;
  label: string;
  description?: string;
  url?: string; // Optional: full Webots Online URL for that template
};

const DEFAULT_TEMPLATES: Template[] = [
  { id: "e-puck", label: "e-puck Mobile Robot", description: "Classic differential-drive robot" },
  { id: "panda-arm", label: "Panda Manipulator", description: "7-DOF robotic arm" },
  { id: "drone", label: "Quadrotor Drone", description: "Aerial robot demo" },
];

function useLocalStorage(key: string, initial: string) {
  const [value, setValue] = useState<string>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, value); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export default function WebotsSim(): JSX.Element {
  const [templates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useLocalStorage("webots.template", templates[0]?.id ?? "");
  const selectedTemplate = useMemo(() => templates.find(t => t.id === selectedTemplateId) ?? templates[0], [templates, selectedTemplateId]);

  const [customUrl, setCustomUrl] = useLocalStorage("webots.customUrl", "");
  const [src, setSrc] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Only prefill input when switching template (don’t autoload to avoid invalid links)
  useEffect(() => {
    setCustomUrl(selectedTemplate?.url || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  // Deep link support: /simulations/webots?template=e-puck&url=https://...
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const tpl = sp.get("template");
    const url = sp.get("url");
    if (tpl && templates.some(t => t.id === tpl)) {
      setSelectedTemplateId(tpl);
      const t = templates.find(x => x.id === tpl)!;
      setCustomUrl(t.url || "");
    }
    if (url) {
      try {
        const normalized = url.match(/^https?:\/\//i) ? url : `https://${url}`;
        // eslint-disable-next-line no-new
        new URL(normalized);
        setSrc(normalized);
        setCustomUrl(normalized);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openByUrl = () => {
    const v = customUrl.trim();
    if (!v) return;
    const normalized = v.match(/^https?:\/\//i) ? v : `https://${v}`;
    try {
      // eslint-disable-next-line no-new
      new URL(normalized);
      setSrc(normalized);
    } catch {}
  };

  const newSession = () => {
    if (!src) return;
    try {
      const u = new URL(src, window.location.href);
      u.searchParams.set("_", Date.now().toString());
      setSrc(u.toString());
    } catch {}
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-[260px] flex-col">
            <label className="mb-1 text-sm font-medium">Template</label>
            <select
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:outline-none"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {selectedTemplate?.description && (
              <span className="mt-1 text-xs text-gray-500">{selectedTemplate.description}</span>
            )}
          </div>

          <div className="flex grow basis-[360px] flex-col">
            <label className="mb-1 text-sm font-medium">Webots Online URL</label>
            <Input
              className="h-10 w-full"
              placeholder="https://webots.cloud/run?..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') openByUrl(); }}
            />
          </div>

          <Button onClick={openByUrl}>Open</Button>
          <Button variant="outline" onClick={newSession}>New Session</Button>
        </div>

        {!src ? (
          <div className="flex h-[640px] items-center justify-center rounded-md border border-dashed p-8 text-center text-sm text-gray-500">
            Paste a valid Webots Online URL (webots.cloud) or select a configured template, then click Open.
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Webots"
            src={src}
            className="h-[700px] w-full rounded-md border"
            allow="autoplay; clipboard-read; clipboard-write; fullscreen; microphone; camera; display-capture;"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        )}

        <div className="text-xs text-muted-foreground">
          Note: Use public Webots Online share/run links. Ensure the target allows embedding and HTTPS is used.
        </div>
      </div>
    </Layout>
  );
}
