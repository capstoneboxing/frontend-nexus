"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"
import type { BoxerAttributes } from "@/lib/mock-data"
import { attributeLabels, perfectBoxer } from "@/lib/mock-data"

interface RadarAttributeChartProps {
  attributes: BoxerAttributes
  showPerfect?: boolean
}

export function RadarAttributeChart({
  attributes,
  showPerfect = false,
}: RadarAttributeChartProps) {
  const data = (
    Object.keys(attributeLabels) as (keyof BoxerAttributes)[]
  ).map((key) => ({
    attribute: attributeLabels[key],
    value: attributes[key],
    perfect: perfectBoxer[key],
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid
          stroke="oklch(0.28 0.005 250)"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fill: "oklch(0.65 0 0)", fontSize: 9 }}
        />
        {showPerfect && (
          <Radar
            name="Perfect Boxer"
            dataKey="perfect"
            stroke="oklch(0.78 0.15 80)"
            fill="oklch(0.78 0.15 80)"
            fillOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}
        <Radar
          name="Fighter"
          dataKey="value"
          stroke="oklch(0.58 0.22 25)"
          fill="oklch(0.58 0.22 25)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "oklch(0.17 0.005 250)",
            border: "1px solid oklch(0.28 0.005 250)",
            borderRadius: "8px",
            color: "oklch(0.95 0 0)",
            fontSize: "12px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
