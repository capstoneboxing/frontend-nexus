"use client"

import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface AttributeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  description: string
}

export function AttributeSlider({
  label,
  value,
  onChange,
  description,
}: AttributeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-foreground">{label}</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`Info about ${label}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="font-display text-sm font-bold text-primary">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={10}
        step={1}
        className="w-full"
      />
    </div>
  )
}
