import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size?: number) => ({
  width: size ?? 16,
  height: size ?? 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const ResistorIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M2 12h3l2-3 2 6 2-6 2 6 2-6 2 3h3" />
  </svg>
);

export const CapacitorIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M3 12h6" />
    <path d="M9 6v12" />
    <path d="M15 6v12" />
    <path d="M15 12h6" />
  </svg>
);

export const InductorIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M2 12c1.5-4 4.5-4 6 0 1.5-4 4.5-4 6 0 1.5-4 4.5-4 6 0" />
  </svg>
);

export const DiodeIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M2 12h6" />
    <path d="M8 7v10l6-5-6-5z" />
    <path d="M14 12h8" />
  </svg>
);

export const LedIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <circle cx="12" cy="10" r="3" />
    <path d="M12 13v7" />
    <path d="M10 20h4" />
    <path d="M7 7l-2-2" />
    <path d="M17 7l2-2" />
  </svg>
);

export const TransistorNPNIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <circle cx="8" cy="12" r="3" />
    <path d="M8 9V5" />
    <path d="M8 15v4" />
    <path d="M11 12h7" />
    <path d="M14 9l4 3-4 3" />
  </svg>
);

export const OpAmpIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M4 5l12 7-12 7z" />
    <path d="M16 12h4" />
    <path d="M6 10h4" />
    <path d="M6 14h4" />
  </svg>
);

export const BatteryIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="3" y="7" width="16" height="10" rx="2" />
    <path d="M21 10v4" />
    <path d="M7 10v4m4-4v4" />
  </svg>
);

export const OscilloscopeIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M5 12l3-2 2 4 2-3 2 2 2-1" />
  </svg>
);

export const BreadboardIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M6 8v8M10 8v8M14 8v8M18 8v8" />
  </svg>
);

export const MicrocontrollerIcon: React.FC<IconProps> = ({ size, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 3v3M15 3v3M9 21v-3M15 21v-3M3 9h3M3 15h3M21 9h-3M21 15h-3" />
  </svg>
);
