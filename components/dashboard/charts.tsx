"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueSeries, utilizationSeries } from "@/lib/data";

export function RevenuePipelineChart({
  accent = "rgb(var(--accent-2))",
  gradientId = "revenue",
}: {
  accent?: string;
  gradientId?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={revenueSeries} margin={{ left: -20, right: 8, top: 12 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={accent} stopOpacity={0.45} />
            <stop offset="95%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="rgb(var(--muted))" tickLine={false} />
        <YAxis stroke="rgb(var(--muted))" tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
            borderRadius: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={accent}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="rgb(var(--accent))"
          fill="transparent"
          strokeDasharray="5 5"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function UtilizationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={utilizationSeries} layout="vertical" margin={{ left: 22, right: 8 }}>
        <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
        <XAxis type="number" stroke="rgb(var(--muted))" tickLine={false} />
        <YAxis
          dataKey="department"
          type="category"
          width={86}
          stroke="rgb(var(--muted))"
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
            borderRadius: 12,
          }}
        />
        <Bar dataKey="capacity" fill="rgb(var(--border))" radius={[5, 5, 5, 5]} />
        <Bar dataKey="utilization" fill="rgb(var(--accent-2))" radius={[5, 5, 5, 5]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
