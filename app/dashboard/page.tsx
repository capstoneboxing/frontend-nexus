"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ChevronRight,
  Database,
  Swords,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"

import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import {
  allTimeRankedBoxersApi,
  predictionHistoryApi,
  weightClassesApi,
} from "@/lib/api-client"
import { isLoggedIn } from "@/lib/auth"
import type {
  AllTimeRankedBoxerResponse,
  PredictionHistoryResponse,
  WeightClassResponse,
} from "@/generated-api/models"

type PredictedWinnerType = "BOXER_A" | "BOXER_B" | "DRAW" | "UNKNOWN"

type DashboardPrediction = {
  predictionId: number
  boxerAName: string
  boxerBName: string
  predictedWinner: string
  predictedWinnerType: PredictedWinnerType
  probabilityA: number
  probabilityB: number
  predictionDate: Date | null
}

type AttributeSummaryRow = {
  attribute: string
  category: string
  averageValue: string
  scale: string
  sortValue: number
}

function resolvePredictedWinnerLabel(prediction: PredictionHistoryResponse): string {
  if (prediction.predictedWinner === "BOXER_A") {
    return prediction.boxerAName ?? "Boxer A"
  }

  if (prediction.predictedWinner === "BOXER_B") {
    return prediction.boxerBName ?? "Boxer B"
  }

  if (prediction.predictedWinner === "DRAW") {
    return "Draw"
  }

  return prediction.predictedWinner ?? "Unknown"
}

function resolvePredictedWinnerType(
    prediction: PredictionHistoryResponse
): PredictedWinnerType {
  if (prediction.predictedWinner === "BOXER_A") return "BOXER_A"
  if (prediction.predictedWinner === "BOXER_B") return "BOXER_B"
  if (prediction.predictedWinner === "DRAW") return "DRAW"
  return "UNKNOWN"
}

function getPredictedWinnerTextClass(type: PredictedWinnerType): string {
  if (type === "BOXER_A") return "text-red-400"
  if (type === "BOXER_B") return "text-yellow-300"
  if (type === "DRAW") return "text-sky-300"
  return "text-accent"
}

function mapPredictionToDashboardItem(
    item: PredictionHistoryResponse
): DashboardPrediction {
  return {
    predictionId: item.predictionId ?? 0,
    boxerAName: item.boxerAName ?? "Boxer A",
    boxerBName: item.boxerBName ?? "Boxer B",
    predictedWinner: resolvePredictedWinnerLabel(item),
    predictedWinnerType: resolvePredictedWinnerType(item),
    probabilityA: item.probabilityA ?? 0,
    probabilityB: item.probabilityB ?? 0,
    predictionDate: item.predictionDate ?? null,
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function buildAttributeSummaryRows(
    boxers: AllTimeRankedBoxerResponse[]
): AttributeSummaryRow[] {
  if (!boxers.length) return []

  const scored = (
      label: string,
      category: string,
      values: number[]
  ): AttributeSummaryRow => ({
    attribute: label,
    category,
    averageValue: average(values).toFixed(1),
    scale: "1–10",
    sortValue: average(values),
  })

  const centimeters = (
      label: string,
      category: string,
      values: number[]
  ): AttributeSummaryRow => ({
    attribute: label,
    category,
    averageValue: `${average(values).toFixed(1)} cm`,
    scale: "cm",
    sortValue: average(values),
  })

  const percent = (
      label: string,
      category: string,
      values: number[]
  ): AttributeSummaryRow => ({
    attribute: label,
    category,
    averageValue: `${(average(values) * 100).toFixed(1)}%`,
    scale: "%",
    sortValue: average(values),
  })

  return [
    centimeters("Height", "Physical", boxers.map((b) => b.heightCm ?? 0)),
    centimeters("Reach", "Physical", boxers.map((b) => b.reachCm ?? 0)),

    scored(
        "Weight Class Alignment",
        "Physical",
        boxers.map((b) => b.weightClassAlignment ?? 0)
    ),
    scored("Hand Speed", "Physical", boxers.map((b) => b.handSpeed ?? 0)),
    scored("Foot Speed", "Physical", boxers.map((b) => b.footSpeed ?? 0)),
    scored("Strength", "Physical", boxers.map((b) => b.strength ?? 0)),
    scored("Endurance", "Physical", boxers.map((b) => b.endurance ?? 0)),
    scored("Reaction Time", "Physical", boxers.map((b) => b.reactionTime ?? 0)),

    scored(
        "Punch Accuracy",
        "Technical",
        boxers.map((b) => b.punchAccuracy ?? 0)
    ),
    scored("Punch Variety", "Technical", boxers.map((b) => b.punchVariety ?? 0)),
    scored(
        "Defensive Guard Efficiency",
        "Technical",
        boxers.map((b) => b.defensiveGuardEfficiency ?? 0)
    ),
    scored("Head Movement", "Technical", boxers.map((b) => b.headMovement ?? 0)),
    scored(
        "Footwork Technique",
        "Technical",
        boxers.map((b) => b.footworkTechnique ?? 0)
    ),
    scored(
        "Counterpunching Ability",
        "Technical",
        boxers.map((b) => b.counterpunchingAbility ?? 0)
    ),
    scored(
        "Combination Efficiency",
        "Technical",
        boxers.map((b) => b.combinationEfficiency ?? 0)
    ),

    scored("Ring IQ", "Tactical", boxers.map((b) => b.ringIq ?? 0)),
    scored(
        "Adaptability Mid-Fight",
        "Tactical",
        boxers.map((b) => b.adaptabilityMidFight ?? 0)
    ),
    scored(
        "Distance Control",
        "Tactical",
        boxers.map((b) => b.distanceControl ?? 0)
    ),
    scored("Tempo Control", "Tactical", boxers.map((b) => b.tempoControl ?? 0)),
    scored(
        "Opponent Pattern Recognition",
        "Tactical",
        boxers.map((b) => b.opponentPatternRecognition ?? 0)
    ),
    scored(
        "Fight Planning Discipline",
        "Tactical",
        boxers.map((b) => b.fightPlanningDiscipline ?? 0)
    ),

    scored(
        "Composure Under Pressure",
        "Psychological",
        boxers.map((b) => b.composureUnderPressure ?? 0)
    ),
    scored(
        "Aggression Control",
        "Psychological",
        boxers.map((b) => b.aggressionControl ?? 0)
    ),
    scored(
        "Mental Toughness",
        "Psychological",
        boxers.map((b) => b.mentalToughness ?? 0)
    ),
    scored(
        "Focus Consistency",
        "Psychological",
        boxers.map((b) => b.focusConsistency ?? 0)
    ),
    scored(
        "Resilience After Knockdown",
        "Psychological",
        boxers.map((b) => b.resilienceAfterKnockdown ?? 0)
    ),

    percent("Win Ratio", "Experience", boxers.map((b) => b.winRatio ?? 0)),
    percent(
        "Knockout Ratio",
        "Experience",
        boxers.map((b) => b.knockoutRatio ?? 0)
    ),
    scored(
        "Title Fight Experience",
        "Experience",
        boxers.map((b) => b.titleFightExperience ?? 0)
    ),
    scored(
        "Strength Of Opposition",
        "Experience",
        boxers.map((b) => b.strengthOfOpposition ?? 0)
    ),
    scored(
        "Recent Fight Activity",
        "Experience",
        boxers.map((b) => b.recentFightActivity ?? 0)
    ),
    scored(
        "Performance Consistency",
        "Experience",
        boxers.map((b) => b.performanceConsistency ?? 0)
    ),
  ]
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const loggedIn = mounted ? isLoggedIn() : false

  const [predictions, setPredictions] = useState<DashboardPrediction[]>([])
  const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([])
  const [boxerCount, setBoxerCount] = useState<number | null>(null)
  const [activeWeightClassCount, setActiveWeightClassCount] = useState<number>(0)
  const [attributeSummaryRows, setAttributeSummaryRows] = useState<
      AttributeSummaryRow[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function fetchData() {
      try {
        setLoading(true)

        const [predictionData, weightClassData, activeBoxers] = await Promise.all([
          predictionHistoryApi.getPredictionHistories(),
          weightClassesApi.getWeightClasses(),
          allTimeRankedBoxersApi.getAllActive(),
        ])

        const mappedPredictions = predictionData
            .map(mapPredictionToDashboardItem)
            .sort(
                (a, b) =>
                    (b.predictionDate?.getTime() ?? 0) -
                    (a.predictionDate?.getTime() ?? 0)
            )

        const uniqueWeightClasses = new Set(
            activeBoxers
                .map((boxer) => boxer.weightClassId)
                .filter((id): id is number => id != null)
        )

        setPredictions(mappedPredictions)
        setWeightClasses(weightClassData)
        setBoxerCount(activeBoxers.length)
        setActiveWeightClassCount(uniqueWeightClasses.size)
        setAttributeSummaryRows(buildAttributeSummaryRows(activeBoxers))
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [mounted])

  const recent = useMemo(() => predictions.slice(0, 4), [predictions])

  const avgProbA = useMemo(() => {
    return predictions.length
        ? predictions.reduce((sum, p) => sum + p.probabilityA, 0) / predictions.length
        : 0
  }, [predictions])

  const confidenceData = useMemo(
      () => [
        {
          name: "A Favoured",
          value: predictions.filter((p) => p.probabilityA >= 0.5).length,
          color: "oklch(0.58 0.22 25)",
        },
        {
          name: "B Favoured",
          value: predictions.filter((p) => p.probabilityB > 0.5).length,
          color: "oklch(0.78 0.15 80)",
        },
      ],
      [predictions]
  )

  const quickLinks = useMemo(() => {
    const items = [
      {
        href: "/dashboard/predict",
        icon: Swords,
        color: "text-primary",
        bg: "bg-primary/10",
        title: "Predict Match",
        desc: "Enter fighter names and generate AI predictions",
      },
      {
        href: "/dashboard/history",
        icon: Activity,
        color: "text-primary",
        bg: "bg-primary/10",
        title: "Prediction History",
        desc: `Review all ${predictions.length} stored predictions`,
      },
    ]

    if (loggedIn) {
      items.splice(1, 0, {
        href: "/dashboard/boxers",
        icon: Database,
        color: "text-accent",
        bg: "bg-accent/10",
        title: "Boxer Database",
        desc: "Browse ranked fighters",
      })
    }

    return items
  }, [loggedIn, predictions.length])

  if (!mounted) {
    return null
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor predictions, analytics, and fighter performance at a glance.
            </p>
          </div>

          <Link href="/dashboard/predict">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Swords className="mr-2 size-4" />
              New Prediction
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
              title="Active Fighters"
              value={loading ? "—" : boxerCount ?? "—"}
              subtitle={
                loading ? "Across active batches" : `${activeWeightClassCount} active divisions`
              }
              icon={Users}
          />
          <StatsCard
              title="Predictions Made"
              value={loading ? "—" : predictions.length}
              subtitle="Stored in history"
              icon={Target}
          />
          <StatsCard
              title="Avg Win Prob A"
              value={loading ? "—" : `${(avgProbA * 100).toFixed(1)}%`}
              subtitle="Across all predictions"
              icon={Activity}
          />
          <StatsCard
              title="Weight Classes"
              value={loading ? "—" : weightClasses.length}
              subtitle="Available divisions"
              icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Active Boxer Attribute Summary
              </h3>
              <p className="text-xs text-muted-foreground">
                Average values across all active ranked boxers.
              </p>
            </div>

            {loading ? (
                <div className="flex h-96 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            ) : attributeSummaryRows.length === 0 ? (
                <div className="flex h-96 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No active boxer attributes available.
                  </p>
                </div>
            ) : (
                <div className="max-h-136 overflow-auto rounded-lg border border-border">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-secondary/60 backdrop-blur">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Attribute
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Average
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Scale
                      </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                    {attributeSummaryRows.map((row) => (
                        <tr key={row.attribute} className="hover:bg-secondary/20">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {row.attribute}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {row.category}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-foreground">
                            {row.averageValue}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                            {row.scale}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Prediction Confidence
              </h3>
              <p className="text-xs text-muted-foreground">
                Who is favoured across stored predictions
              </p>
            </div>

            {loading ? (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            ) : predictions.length === 0 ? (
                <div className="flex h-80 flex-col items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">No predictions yet.</p>
                  <Link href="/dashboard/predict">
                    <Button size="sm" variant="outline">
                      Make your first prediction
                    </Button>
                  </Link>
                </div>
            ) : (
                <>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                            data={confidenceData}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="85%"
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                          {confidenceData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "oklch(0.17 0.005 250)",
                              border: "1px solid oklch(0.28 0.005 250)",
                              borderRadius: "8px",
                              color: "oklch(0.95 0 0)",
                              fontSize: "12px",
                            }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex justify-center gap-4">
                    {confidenceData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-muted-foreground">
                      {item.name} ({item.value})
                    </span>
                        </div>
                    ))}
                  </div>
                </>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Recent Predictions
              </h3>
              <p className="text-xs text-muted-foreground">
                Latest match outcome predictions
              </p>
            </div>

            <Link href="/dashboard/history">
              <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
              >
                View All
                <ChevronRight className="ml-1 size-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
          ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <p className="text-sm text-muted-foreground">No predictions yet.</p>
                <Link href="/dashboard/predict">
                  <Button size="sm" variant="outline">
                    Make your first prediction
                  </Button>
                </Link>
              </div>
          ) : (
              <div className="divide-y divide-border">
                {recent.map((pred) => (
                    <div
                        key={pred.predictionId}
                        className="flex items-center justify-between px-5 py-3.5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <Swords className="size-3.5 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {pred.boxerAName}{" "}
                            <span className="text-muted-foreground">vs</span>{" "}
                            {pred.boxerBName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pred.predictionDate
                                ? pred.predictionDate.toLocaleString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })
                                : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                            className={`text-sm font-semibold ${getPredictedWinnerTextClass(
                                pred.predictedWinnerType
                            )}`}
                        >
                          {pred.predictedWinner}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(pred.probabilityA * 100).toFixed(0)}% /{" "}
                          {(pred.probabilityB * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        <div
            className={`grid gap-4 ${
                quickLinks.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
            }`}
        >
          {quickLinks.map((item) => (
              <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className={`rounded-lg ${item.bg} p-2.5`}>
                  <item.icon className={`size-5 ${item.color}`} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>

                <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
          ))}
        </div>
      </div>
  )
}