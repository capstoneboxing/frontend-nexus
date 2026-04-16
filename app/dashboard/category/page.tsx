"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Crosshair,
  Dumbbell,
  Loader2,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
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
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { fetchWeightClasses, fetchCategoryWeights, updateCategoryWeightByWeightClassId } from "@/lib/api"
import { appToast } from "@/lib/toast"
import type {
  CategoryWeightResponse,
  CategoryWeightUpdateRequest,
  WeightClassResponse,
} from "@/generated-api/models"

type WeightFormState = {
  physicalWeight: number
  technicalWeight: number
  tacticalWeight: number
  psychologicalWeight: number
  experienceWeight: number
}

type WeightField = keyof WeightFormState

const defaultForm: WeightFormState = {
  physicalWeight: 20,
  technicalWeight: 20,
  tacticalWeight: 20,
  psychologicalWeight: 20,
  experienceWeight: 20,
}

const categoryMeta: {
  key: WeightField
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    key: "physicalWeight",
    label: "Physical",
    description: "Power, speed, endurance, strength, and physical tools.",
    icon: Dumbbell,
  },
  {
    key: "technicalWeight",
    label: "Technical",
    description: "Punching form, defensive technique, combinations, and execution.",
    icon: Sparkles,
  },
  {
    key: "tacticalWeight",
    label: "Tactical",
    description: "Game plan, adjustments, ring IQ, and strategic decision-making.",
    icon: Crosshair,
  },
  {
    key: "psychologicalWeight",
    label: "Psychological",
    description: "Confidence, resilience, composure, focus, and mental toughness.",
    icon: Brain,
  },
  {
    key: "experienceWeight",
    label: "Performance & Experience",
    description: "Quality of opposition, consistency, activity, and ring experience.",
    icon: Scale,
  },
]

function decimalToPercent(value?: number): number {
  if (value == null || Number.isNaN(value)) return 0
  return Math.round(value * 100)
}

function percentToDecimal(value: number): number {
  return value / 100
}

function responseToForm(data?: CategoryWeightResponse | null): WeightFormState {
  if (!data) return defaultForm

  return {
    physicalWeight: decimalToPercent(data.physicalWeight),
    technicalWeight: decimalToPercent(data.technicalWeight),
    tacticalWeight: decimalToPercent(data.tacticalWeight),
    psychologicalWeight: decimalToPercent(data.psychologicalWeight),
    experienceWeight: decimalToPercent(data.experienceWeight),
  }
}

function formToRequest(form: WeightFormState): CategoryWeightUpdateRequest {
  return {
    physicalWeight: percentToDecimal(form.physicalWeight),
    technicalWeight: percentToDecimal(form.technicalWeight),
    tacticalWeight: percentToDecimal(form.tacticalWeight),
    psychologicalWeight: percentToDecimal(form.psychologicalWeight),
    experienceWeight: percentToDecimal(form.experienceWeight),
  }
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

export default function CriteriaPage() {
  const ready = useAuthGuard()

  const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([])
  const [allCategoryWeights, setAllCategoryWeights] = useState<CategoryWeightResponse[]>([])
  const [selectedWeightClassId, setSelectedWeightClassId] = useState<string>("")

  const [form, setForm] = useState<WeightFormState>(defaultForm)
  const [initialForm, setInitialForm] = useState<WeightFormState>(defaultForm)

  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!ready) return

    async function loadPageData() {
      try {
        setPageLoading(true)

        const [classes, categoryWeights] = await Promise.all([
          fetchWeightClasses(),
          fetchCategoryWeights(),
        ])

        setWeightClasses(classes)
        setAllCategoryWeights(categoryWeights)

        if (classes.length > 0) {
          const firstId = String(classes[0].weightClassId ?? "")
          setSelectedWeightClassId(firstId)
        }
      } catch (error) {
        console.error("Failed to load category weight page data:", error)
        appToast.error("Failed to load category weights.")
      } finally {
        setPageLoading(false)
      }
    }

    void loadPageData()
  }, [ready])

  const selectedCategoryWeight = useMemo(() => {
    if (!selectedWeightClassId) return null

    return (
        allCategoryWeights.find(
            (item) => String(item.weightClassId ?? "") === selectedWeightClassId
        ) ?? null
    )
  }, [allCategoryWeights, selectedWeightClassId])

  useEffect(() => {
    if (!selectedWeightClassId) return

    const mapped = responseToForm(selectedCategoryWeight)
    setForm(mapped)
    setInitialForm(mapped)
  }, [selectedWeightClassId, selectedCategoryWeight])

  const total = useMemo(() => {
    return (
        form.physicalWeight +
        form.technicalWeight +
        form.tacticalWeight +
        form.psychologicalWeight +
        form.experienceWeight
    )
  }, [form])

  const isValidTotal = total === 100

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm)
  }, [form, initialForm])

  const selectedWeightClassName = useMemo(() => {
    return (
        weightClasses.find(
            (wc) => String(wc.weightClassId ?? "") === selectedWeightClassId
        )?.className ?? "Selected Weight Class"
    )
  }, [weightClasses, selectedWeightClassId])

  const updateField = (key: WeightField, value: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: clampPercent(value),
    }))
  }

  const incrementField = (key: WeightField, amount: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: clampPercent(prev[key] + amount),
    }))
  }

  const handleReset = () => {
    setForm(initialForm)
  }

  const handleSave = async () => {
    if (!selectedWeightClassId) return

    if (!isValidTotal) {
      appToast.error("The category weights must add up to exactly 100%.")
      return
    }

    try {
      setSaving(true)

      const updated = await updateCategoryWeightByWeightClassId(
          Number(selectedWeightClassId),
          formToRequest(form)
      )

      const mapped = responseToForm(updated)
      setForm(mapped)
      setInitialForm(mapped)

      setAllCategoryWeights((prev) => {
        const exists = prev.some(
            (item) => String(item.weightClassId ?? "") === selectedWeightClassId
        )

        if (!exists) {
          return [...prev, updated]
        }

        return prev.map((item) =>
            String(item.weightClassId ?? "") === selectedWeightClassId
                ? updated
                : item
        )
      })

      appToast.success(`Category weights updated for ${selectedWeightClassName}.`)
    } catch (error) {
      console.error("Failed to update category weights:", error)
      appToast.error("Failed to update category weights.")
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Category Weights
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Adjust how much each attribute category contributes to predictions for
              each weight class. The total must equal 100% before saving.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty || pageLoading || saving}
                className="border-border text-foreground hover:bg-secondary"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset
            </Button>

            <Button
                onClick={() => void handleSave()}
                disabled={!isDirty || !isValidTotal || pageLoading || saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
              ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Weights
                  </>
              )}
            </Button>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr] md:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Weight Class
              </label>
              <Select
                  value={selectedWeightClassId}
                  onValueChange={setSelectedWeightClassId}
                  disabled={pageLoading || saving}
              >
                <SelectTrigger className="border-border bg-secondary text-foreground">
                  <SelectValue placeholder="Select weight class" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  {weightClasses.map((wc) => (
                      <SelectItem
                          key={wc.weightClassId}
                          value={String(wc.weightClassId ?? "")}
                      >
                        {wc.className ?? `Weight Class ${wc.weightClassId}`}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Current Total
                  </p>
                  <p
                      className={`text-lg font-semibold ${
                          isValidTotal ? "text-foreground" : "text-destructive"
                      }`}
                  >
                    {total}%
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {isValidTotal ? (
                      <>
                        <CheckCircle2 className="size-4 text-primary" />
                        <span className="text-muted-foreground">
                      Ready to save for {selectedWeightClassName}
                    </span>
                      </>
                  ) : (
                      <>
                        <AlertCircle className="size-4 text-destructive" />
                        <span className="text-muted-foreground">
                      Total must equal exactly 100%
                    </span>
                      </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {pageLoading ? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading category weights...
              </div>
            </div>
        ) : (
            <div className="grid gap-4">
              {categoryMeta.map((category) => {
                const Icon = category.icon
                const value = form[category.key]

                return (
                    <section
                        key={category.key}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2.5">
                            <Icon className="size-4 text-primary" />
                          </div>

                          <div>
                            <h2 className="text-sm font-semibold text-foreground">
                              {category.label}
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => incrementField(category.key, -5)}
                                disabled={saving}
                                className="w-12"
                            >
                              -5
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => incrementField(category.key, -1)}
                                disabled={saving}
                                className="w-12"
                            >
                              -1
                            </Button>
                          </div>

                          <div className="min-w-28">
                            <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
                              Percentage
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={value}
                                onChange={(e) =>
                                    updateField(category.key, Number(e.target.value))
                                }
                                className="border-border bg-secondary text-center text-foreground"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => incrementField(category.key, 1)}
                                disabled={saving}
                                className="w-12"
                            >
                              +1
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => incrementField(category.key, 5)}
                                disabled={saving}
                                className="w-12"
                            >
                              +5
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Weight allocation</span>
                          <span className="font-medium text-foreground">{value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    </section>
                )
              })}
            </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">
            Category Weight Summary
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {categoryMeta.map((category) => (
                <div
                    key={category.key}
                    className="rounded-lg bg-secondary px-3 py-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {category.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {form[category.key]}%
                  </p>
                </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span
                  className={`text-sm font-semibold ${
                      isValidTotal ? "text-primary" : "text-destructive"
                  }`}
              >
              {total}%
            </span>
            </div>
          </div>
        </div>
      </div>
  )
}