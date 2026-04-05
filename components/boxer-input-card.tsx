"use client"

import { useState } from "react"
import {
  ChevronDown,
  Database,
  Ruler,
  Zap,
  Crosshair,
  Brain,
  Heart,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AttributeSlider } from "@/components/attribute-slider"
import {
  type BoxerAttributes,
  attributeLabels,
  attributeDescriptions,
  attributeCategories,
} from "@/lib/predict-types"

interface BoxerInputCardProps {
  label: string
  color: "red" | "blue"
  name: string
  onNameChange: (name: string) => void
  attributes: BoxerAttributes
  onAttributeChange: (key: keyof BoxerAttributes, value: number) => void
}

const categoryIcons = {
  physical: Ruler,
  performance: Zap,
  technical: Crosshair,
  tactical: Brain,
  psychological: Heart,
}

const categoryColors = {
  physical: "text-chart-1",
  performance: "text-chart-2",
  technical: "text-chart-4",
  tactical: "text-chart-5",
  psychological: "text-chart-3",
}

function getSliderConfig(key: keyof BoxerAttributes, value: number) {
  if (key === "heightCm" || key === "reachCm") {
    return {
      min: 100,
      max: 300,
      step: 1,
      displayValue: `${value} cm`,
    }
  }

  if (key === "winRatio" || key === "knockoutRatio") {
    return {
      min: 0,
      max: 1,
      step: 0.01,
      displayValue: `${(value * 100).toFixed(0)}%`,
    }
  }

  return {
    min: 1,
    max: 10,
    step: 1,
    displayValue: `${value}`,
  }
}

export function BoxerInputCard({
                                 label,
                                 color,
                                 name,
                                 onNameChange,
                                 attributes,
                                 onAttributeChange,
                               }: BoxerInputCardProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    physical: true,
  })

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
      <div className="rounded-xl border border-border bg-card">
        <div
            className={`flex items-center justify-between rounded-t-xl border-b border-border px-5 py-3 ${
                color === "red" ? "bg-primary/5" : "bg-accent/5"
            }`}
        >
          <div className="flex items-center gap-2">
            <div
                className={`size-3 rounded-full ${
                    color === "red" ? "bg-primary" : "bg-accent"
                }`}
            />
            <span className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            {label}
          </span>
          </div>

          <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              disabled
          >
            <Database className="mr-1.5 size-3" />
            Auto-fill
          </Button>
        </div>

        <div className="space-y-3 p-5">
          <div>
            <label
                htmlFor={`boxer-${color}-name`}
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Fighter Name
            </label>
            <Input
                id={`boxer-${color}-name`}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter boxer name"
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            {attributeCategories.map((category) => {
              const Icon = categoryIcons[category.key]
              const isOpen = openCategories[category.key] ?? false
              const colorClass = categoryColors[category.key]

              return (
                  <div
                      key={category.key}
                      className="overflow-hidden rounded-lg border border-border"
                  >
                    <button
                        type="button"
                        onClick={() => toggleCategory(category.key)}
                        className="flex w-full items-center justify-between bg-secondary/50 px-4 py-3 text-left transition-colors hover:bg-secondary/80"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-md bg-background">
                          <Icon className={`size-3.5 ${colorClass}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {category.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {category.attributes.length} attributes
                          </p>
                        </div>
                      </div>

                      <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isOpen && (
                        <div className="space-y-4 border-t border-border bg-card px-4 py-4">
                          {category.attributes.map((attrKey) => {
                            const value = attributes[attrKey]
                            const config = getSliderConfig(attrKey, value)

                            return (
                                <AttributeSlider
                                    key={attrKey}
                                    label={attributeLabels[attrKey]}
                                    value={value}
                                    onChange={(newValue) => onAttributeChange(attrKey, newValue)}
                                    description={attributeDescriptions[attrKey]}
                                    min={config.min}
                                    max={config.max}
                                    step={config.step}
                                    displayValue={config.displayValue}
                                />
                            )
                          })}
                        </div>
                    )}
                  </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}