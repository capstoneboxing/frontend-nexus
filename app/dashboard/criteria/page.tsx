"use client"

import { useState } from "react"
import {
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Brain,
  Crosshair,
  MapPin,
  Save,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  weightClasses,
  fightStyles,
  stanceOptions,
} from "@/lib/mock-data"

interface CriteriaState {
  weightClass: string
  minFights: number
  stance: string
  ageMin: number
  ageMax: number
  priorityAttribute: string
  fightStyle: string
  koPreference: number
  roundsExpected: number
  pressureHandling: number
  comebackAbility: number
  venueType: string
  homeAdvantage: boolean
}

const defaultCriteria: CriteriaState = {
  weightClass: "",
  minFights: 10,
  stance: "",
  ageMin: 18,
  ageMax: 45,
  priorityAttribute: "",
  fightStyle: "",
  koPreference: 5,
  roundsExpected: 12,
  pressureHandling: 5,
  comebackAbility: 5,
  venueType: "",
  homeAdvantage: false,
}

const priorityAttributes = [
  "Speed",
  "Strength",
  "Ring IQ",
  "Defensive Ability",
  "Endurance",
  "Footwork",
  "Reach",
  "Mental Resilience",
  "Reaction Time",
  "Conditioning",
]

const venueTypes = ["Small Arena", "Medium Arena", "Large Stadium", "Outdoor"]

const categoryIcons = {
  physical: Dumbbell,
  tactical: Crosshair,
  mental: Brain,
  environmental: MapPin,
}

const categoryLabels = {
  physical: "Physical Requirements",
  tactical: "Tactical Preferences",
  mental: "Mental Attributes",
  environmental: "Environmental Factors",
}

export default function CriteriaPage() {
  const [criteria, setCriteria] = useState<CriteriaState>({ ...defaultCriteria })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setCriteria({ ...defaultCriteria })
    setSaved(false)
  }

  const updateCriteria = <K extends keyof CriteriaState>(
    key: K,
    value: CriteriaState[K]
  ) => {
    setCriteria((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Prediction Criteria
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define what matters most to you when analyzing fights. These
            preferences shape how predictions are weighted and displayed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-border text-foreground hover:bg-secondary"
          >
            <RotateCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saved ? (
              <>
                <CheckCircle2 className="mr-2 size-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Criteria
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Physical Requirements */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Dumbbell className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Physical Requirements
            </h2>
            <p className="text-xs text-muted-foreground">
              Set physical criteria for fighter analysis
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          {/* Weight Class */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Weight Class
            </label>
            <Select
              value={criteria.weightClass}
              onValueChange={(v) => updateCriteria("weightClass", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Select weight class" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {weightClasses.map((wc) => (
                  <SelectItem key={wc} value={wc}>
                    {wc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Fights */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Minimum Professional Fights
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              value={criteria.minFights}
              onChange={(e) =>
                updateCriteria("minFights", parseInt(e.target.value) || 0)
              }
              className="border-border bg-secondary text-foreground"
            />
          </div>

          {/* Stance */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Stance Preference
            </label>
            <Select
              value={criteria.stance}
              onValueChange={(v) => updateCriteria("stance", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Any stance" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {stanceOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Age Range: {criteria.ageMin} - {criteria.ageMax}
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={16}
                max={60}
                value={criteria.ageMin}
                onChange={(e) =>
                  updateCriteria("ageMin", parseInt(e.target.value) || 18)
                }
                className="w-20 border-border bg-secondary text-foreground"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input
                type="number"
                min={16}
                max={60}
                value={criteria.ageMax}
                onChange={(e) =>
                  updateCriteria("ageMax", parseInt(e.target.value) || 45)
                }
                className="w-20 border-border bg-secondary text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tactical Preferences */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-lg bg-accent/10 p-2">
            <Crosshair className="size-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Tactical Preferences
            </h2>
            <p className="text-xs text-muted-foreground">
              Shape predictions based on fight tactics
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          {/* Priority Attribute */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Priority Attribute
            </label>
            <Select
              value={criteria.priorityAttribute}
              onValueChange={(v) => updateCriteria("priorityAttribute", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Select top attribute" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {priorityAttributes.map((attr) => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fight Style */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Fight Style
            </label>
            <Select
              value={criteria.fightStyle}
              onValueChange={(v) => updateCriteria("fightStyle", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Any style" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {fightStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* KO Preference Slider */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              KO Preference: {criteria.koPreference}/10
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">Decision</span>
              <Slider
                value={[criteria.koPreference]}
                onValueChange={(v) => updateCriteria("koPreference", v[0])}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-[10px] text-muted-foreground">KO Power</span>
            </div>
          </div>

          {/* Rounds Expected */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Expected Rounds: {criteria.roundsExpected}
            </label>
            <Slider
              value={[criteria.roundsExpected]}
              onValueChange={(v) => updateCriteria("roundsExpected", v[0])}
              min={4}
              max={12}
              step={1}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-[10px] text-muted-foreground">4 rounds</span>
              <span className="text-[10px] text-muted-foreground">12 rounds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Attributes */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Brain className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Mental Attributes
            </h2>
            <p className="text-xs text-muted-foreground">
              How important are mental factors in your analysis
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          {/* Pressure Handling */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Pressure Handling Importance: {criteria.pressureHandling}/10
            </label>
            <Slider
              value={[criteria.pressureHandling]}
              onValueChange={(v) => updateCriteria("pressureHandling", v[0])}
              min={1}
              max={10}
              step={1}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <span className="text-[10px] text-muted-foreground">Critical</span>
            </div>
          </div>

          {/* Comeback Ability */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Comeback Ability Importance: {criteria.comebackAbility}/10
            </label>
            <Slider
              value={[criteria.comebackAbility]}
              onValueChange={(v) => updateCriteria("comebackAbility", v[0])}
              min={1}
              max={10}
              step={1}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <span className="text-[10px] text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Factors */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="rounded-lg bg-accent/10 p-2">
            <MapPin className="size-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Environmental Factors
            </h2>
            <p className="text-xs text-muted-foreground">
              External conditions that may influence predictions
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          {/* Venue Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Venue Type
            </label>
            <Select
              value={criteria.venueType}
              onValueChange={(v) => updateCriteria("venueType", v)}
            >
              <SelectTrigger className="border-border bg-secondary text-foreground">
                <SelectValue placeholder="Any venue" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {venueTypes.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Home Advantage */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Home Advantage Factor
            </label>
            <button
              type="button"
              onClick={() =>
                updateCriteria("homeAdvantage", !criteria.homeAdvantage)
              }
              className={`flex w-full items-center justify-between rounded-md border px-4 py-2.5 text-sm transition-colors ${
                criteria.homeAdvantage
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground"
              }`}
            >
              <span>
                {criteria.homeAdvantage
                  ? "Enabled - factored into predictions"
                  : "Disabled - not considered"}
              </span>
              <div
                className={`size-4 rounded-full border-2 transition-colors ${
                  criteria.homeAdvantage
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <ClipboardList className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Your Criteria Summary
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              These preferences are applied when generating new predictions and
              browsing fighters.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Weight Class",
                  value: criteria.weightClass || "Any",
                },
                { label: "Style", value: criteria.fightStyle || "Any" },
                {
                  label: "Priority",
                  value: criteria.priorityAttribute || "Default",
                },
                {
                  label: "KO Pref",
                  value: `${criteria.koPreference}/10`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md bg-secondary px-3 py-2"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
