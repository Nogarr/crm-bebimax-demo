"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/format";

// ---------- StatCard ----------
export function StatCard({
  label,
  value,
  icon,
  accent = "brand",
  hint,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: "brand" | "emerald" | "violet" | "blue" | "amber" | "rose";
  hint?: string;
}) {
  const accents: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          accents[accent]
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

// ---------- Bar chart (vertical) ----------
export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({
  data,
  height = 180,
  format = (v) => formatARS(v),
}: {
  data: BarDatum[];
  height?: number;
  format?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => {
        const h = Math.max((d.value / max) * (height - 34), 3);
        return (
          <div
            key={d.label}
            className="group flex flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-[11px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">
              {format(d.value)}
            </span>
            <div
              className="w-full rounded-t-lg transition-all"
              style={{
                height: h,
                background: d.color ?? "#f97316",
              }}
            />
            <span className="text-xs font-medium text-slate-500">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Donut chart ----------
export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  size = 160,
  centerLabel,
  centerValue,
}: {
  data: DonutDatum[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const radius = size / 2 - 14;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eef1f6"
          strokeWidth={14}
        />
        {data.map((d) => {
          const len = (d.value / total) * circ;
          const el = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={14}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
        {centerValue && (
          <g className="rotate-90" style={{ transformOrigin: "center" }}>
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              className="fill-slate-900 text-lg font-bold"
              style={{ fontSize: 20 }}
            >
              {centerValue}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              className="fill-slate-400"
              style={{ fontSize: 11 }}
            >
              {centerLabel}
            </text>
          </g>
        )}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-slate-600">{d.label}</span>
            <span className="ml-auto font-semibold text-slate-900">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Progress bar ----------
export function ProgressBar({
  value,
  max,
  color = "#f97316",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100);
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
