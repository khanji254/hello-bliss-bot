import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Isaac Sim (Omniverse) typically streams via a WebRTC client URL.
// Provide your Streaming Client URL(s) below or paste one into the input.
// Selecting a template switches the input to that template's URL (if configured).

type Template = {
  id: string;
  label: string;
  description?: string;
  url: string; // Full streaming client URL for that bot/template (leave blank until configured)
};

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "warehouse-bot",
    label: "Warehouse Bot",
    description: "Mobile base with pallet and simple nav",
    url: "", // Configure your endpoint
  },
  {
    id: "manipulator",
    label: "Manipulator Arm",
    description: "6-DOF arm with grasping demo",
    url: "", // Configure your endpoint
  },
  {
    id: "inspection-drone",
    label: "Inspection Drone",
    description: "Quadrotor inspection scene",
    url: "", // Configure your endpoint
  },
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
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export default function IsaacSim(): JSX.Element {
  const [templates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useLocalStorage(
    "isaac.template",
    templates[0]?.id ?? ""
  );
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? templates[0],
    [templates, selectedTemplateId]
  );

  const [customUrl, setCustomUrl] = useLocalStorage(
    "isaac.customUrl",
    ""
  );
  // Start with empty src to avoid loading placeholder domains
  const [src, setSrc] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // When switching template, only update the input (do not auto-load)
  useEffect(() => {
    if (selectedTemplate) {
      setCustomUrl(selectedTemplate.url || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  // Support deep links: /simulations/isaac?template=warehouse-bot&url=https://...
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const tpl = sp.get("template");
    const url = sp.get("url");
    if (tpl && templates.some((t) => t.id === tpl)) {
      setSelectedTemplateId(tpl);
      const t = templates.find((x) => x.id === tpl)!;
      setCustomUrl(t.url || "");
    }
    if (url) {
      try {
        // Normalize URL (prepend https:// if protocol missing)
        const normalized = url.match(/^https?:\/\//i) ? url : `https://${url}`;
        // Validate
        // eslint-disable-next-line no-new
        new URL(normalized);
        setSrc(normalized);
        setCustomUrl(normalized);
      } catch {
        // ignore invalid url
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openByUrl = () => {
    const v = customUrl.trim();
    if (!v) return;
    const normalized = v.match(/^https?:\/\//i) ? v : `https://${v}`;
    try {
      // Validate
      // eslint-disable-next-line no-new
      new URL(normalized);
      setSrc(normalized);
    } catch {
      // ignore invalid url
    }
  };

  const newSession = () => {
    if (!src) return;
    try {
      const u = new URL(src, window.location.href);
      u.searchParams.set("_", Date.now().toString());
      setSrc(u.toString());
    } catch {
      // ignore
    }
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
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            {selectedTemplate?.description ? (
              <span className="mt-1 text-xs text-gray-500">
                {selectedTemplate.description}
              </span>
            ) : null}
          </div>

          <div className="flex grow basis-[360px] flex-col">
            <label className="mb-1 text-sm font-medium">Streaming Client URL</label>
            <Input
              className="h-10 w-full"
              placeholder="https://your-streaming-host/session"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") openByUrl();
              }}
            />
          </div>

          <Button onClick={openByUrl}>Open</Button>
          <Button variant="outline" onClick={newSession}>New Session</Button>
        </div>

        {!src ? (
          <div className="flex h-[640px] items-center justify-center rounded-md border border-dashed p-8 text-center text-sm text-gray-500">
            Enter a valid Isaac Sim streaming URL or select a configured template, then click Open.
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Isaac Sim"
            src={src}
            className="h-[700px] w-full rounded-md border"
            allow="autoplay; clipboard-read; clipboard-write; fullscreen; microphone; camera; display-capture;"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        )}

        <div className="text-xs text-muted-foreground">
          Note: Isaac Sim requires a running streaming server (Omniverse/Kit) and a compatible Streaming Client URL. Ensure your server allows iframe embedding (frame-ancestors) and uses HTTPS.
        </div>
      </div>
    </Layout>
  );
}
