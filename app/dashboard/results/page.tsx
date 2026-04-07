"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  ChevronRight,
  Percent,
  TrendingUp,
  Swords,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { predictionHistoryApi } from "@/lib/api-client"
import type { PredictionHistoryResponse } from "@/generated-api/models"

const RECENT_LIMIT = 10

function getPredictedWinnerLabel(pred: PredictionHistoryResponse): string {
  if (pred.predictedWinner === "BOXER_A") return pred.boxerAName ?? "Boxer A"
  if (pred.predictedWinner === "BOXER_B") return pred.boxerBName ?? "Boxer B"
  if (pred.predictedWinner === "DRAW") return "Draw"
  return pred.predictedWinner ?? "Unknown"
}

function getPredictedWinnerClass(pred: PredictionHistoryResponse): string {
  if (pred.predictedWinner === "BOXER_A") return "text-red-400"
  if (pred.predictedWinner === "BOXER_B") return "text-yellow-300"
  if (pred.predictedWinner === "DRAW") return "text-sky-300"
  return "text-foreground"
}

function formatMatchWinMethod(method?: string): string {
  if (!method) return "Pending"

  switch (method) {
    case "KO":
      return "KO"
    case "TKO":
      return "TKO"
    case "DECISION":
      return "Decision"
    case "DISQUALIFICATION":
      return "Disqualification"
    default:
      return method
  }
}

function matchupLabel(pred: PredictionHistoryResponse): string {
  const a = pred.boxerAName?.split(" ").pop() ?? "A"
  const b = pred.boxerBName?.split(" ").pop() ?? "B"
  return `${a} v ${b}`
}

export default function ResultsPage() {
  const [predictions, setPredictions] = useState<PredictionHistoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const data = await predictionHistoryApi.getPredictionHistories()
        setPredictions(
            [...data].sort(
                (a, b) =>
                    (b.predictionDate?.getTime() ?? 0) -
                    (a.predictionDate?.getTime() ?? 0)
            )
        )
      } catch (err) {
        console.error(err)
        setError("Failed to load results.")
      } finally {
        setLoading(false)
      }
    }

    void fetchPredictions()
  }, [])

  const recentPredictions = useMemo(
      () => predictions.slice(0, RECENT_LIMIT),
      [predictions]
  )

  const avgProbA = useMemo(() => {
    if (!predictions.length) return 0
    return (
        predictions.reduce((sum, pred) => sum + (pred.probabilityA ?? 0), 0) /
        predictions.length
    )
  }, [predictions])

  const avgProbB = useMemo(() => {
    if (!predictions.length) return 0
    return (
        predictions.reduce((sum, pred) => sum + (pred.probabilityB ?? 0), 0) /
        predictions.length
    )
  }, [predictions])

  const redFavouredCount = useMemo(
      () => predictions.filter((pred) => (pred.probabilityA ?? 0) >= 0.5).length,
      [predictions]
  )

  const barData = useMemo(
      () =>
          recentPredictions
              .slice()
              .reverse()
              .map((pred) => ({
                label: matchupLabel(pred),
                probA: Math.round((pred.probabilityA ?? 0) * 100),
                probB: Math.round((pred.probabilityB ?? 0) * 100),
              })),
      [recentPredictions]
  )

  const pieData = useMemo(() => {
    const redFavoured = predictions.filter(
        (pred) => (pred.probabilityA ?? 0) >= 0.5
    ).length
    const yellowFavoured = predictions.length - redFavoured

    return [
      {
        name: "Red Corner Favoured",
        value: redFavoured,
        color: "oklch(0.58 0.22 25)",
      },
      {
        name: "Yellow Corner Favoured",
        value: yellowFavoured,
        color: "oklch(0.78 0.15 80)",
      },
    ]
  }, [predictions])

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Prediction Results
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Visualise confidence levels and outcomes across stored predictions.
            </p>
          </div>
        </div>

        {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading results...</p>
            </div>
        )}

        {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
        )}

        {!loading && !error && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Total Predictions
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-primary">
                        {predictions.length}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Swords className="size-4 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Avg Probability A
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-red-400">
                        {(avgProbA * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-red-400/10 p-2">
                      <Percent className="size-4 text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Avg Probability B
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-yellow-300">
                        {(avgProbB * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-yellow-300/10 p-2">
                      <TrendingUp className="size-4 text-yellow-300" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Red Corner Favoured
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-foreground">
                        {redFavouredCount}
                        <span className="text-sm font-normal text-muted-foreground">
                      /{predictions.length}
                    </span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Trophy className="size-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Recent Win Probability per Matchup
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Latest {recentPredictions.length} predictions. Red = Boxer A, Yellow = Boxer B.
                      </p>
                    </div>

                    <Link href="/dashboard/history">
                      <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis
                            dataKey="label"
                            tick={{ fill: "oklch(0.65 0 0)", fontSize: 9 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
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
                        <Bar
                            dataKey="probA"
                            name="Boxer A %"
                            fill="oklch(0.58 0.22 25)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="probB"
                            name="Boxer B %"
                            fill="oklch(0.78 0.15 80)"
                            radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Favourite Distribution
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      How often each corner was the predicted favourite
                    </p>
                  </div>

                  <div className="flex h-72 items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                          {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
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

                  <div className="mt-2 flex justify-center gap-6">
                    {pieData.map((item) => (
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
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Recent Predictions
                  </h3>

                  <Link href="/dashboard/history">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {recentPredictions.map((pred) => (
                      <div
                          key={pred.predictionId}
                          className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                            <Swords className="size-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {pred.boxerAName ?? "Boxer A"}{" "}
                              <span className="text-muted-foreground">vs</span>{" "}
                              {pred.boxerBName ?? "Boxer B"}
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

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Predicted Winner
                            </p>
                            <p
                                className={`text-sm font-medium ${getPredictedWinnerClass(pred)}`}
                            >
                              {getPredictedWinnerLabel(pred)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Win Method
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {formatMatchWinMethod(pred.matchWinMethod)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Prob A / B
                            </p>
                            <p className="text-sm font-medium">
                        <span className="text-red-400">
                          {((pred.probabilityA ?? 0) * 100).toFixed(0)}%
                        </span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-yellow-300">
                          {((pred.probabilityB ?? 0) * 100).toFixed(0)}%
                        </span>
                            </p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>

                {recentPredictions.length === 0 && (
                    <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No predictions yet.
                    </div>
                )}
              </div>
            </>
        )}
      </div>
  )
}