"use client"

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
import { Percent, TrendingUp, Swords, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import type { PredictionRecord } from "@/lib/mock-data"

// ============================================================
// PAGE
// ============================================================
export default function ResultsPage() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ----------------------------------------------------------
  // Fetch fight_predictions from Supabase
  // ----------------------------------------------------------
  useEffect(() => {
    async function fetchPredictions() {
      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .order("prediction_date", { ascending: false })

      if (error) {
        console.error("❌ Supabase error:", error)
        setError("Failed to load results.")
      } else {
        setPredictions(data as PredictionRecord[])
      }
      setLoading(false)
    }

    fetchPredictions()
  }, [])

  // ----------------------------------------------------------
  // Derived stats
  // ----------------------------------------------------------
  const avgProbA = useMemo(() => {
    if (!predictions.length) return 0
    return predictions.reduce((s, p) => s + p.probability_a, 0) / predictions.length
  }, [predictions])

  const avgProbB = useMemo(() => {
    if (!predictions.length) return 0
    return predictions.reduce((s, p) => s + p.probability_b, 0) / predictions.length
  }, [predictions])

  // Bar chart — confidence per fight
  const barData = useMemo(() =>
    predictions.map((p) => ({
      label: `${p.boxer_a_name.split(" ").pop()} v ${p.boxer_b_name.split(" ").pop()}`,
      probA: Math.round(p.probability_a * 100),
      probB: Math.round(p.probability_b * 100),
    })),
    [predictions]
  )

  // Pie chart — how many times A was favoured vs B
  const pieData = useMemo(() => {
    const aFavoured = predictions.filter((p) => p.probability_a >= 0.5).length
    const bFavoured = predictions.length - aFavoured
    return [
      { name: "Boxer A Favoured", value: aFavoured, color: "oklch(0.58 0.22 25)" },
      { name: "Boxer B Favoured", value: bFavoured, color: "oklch(0.78 0.15 80)" },
    ]
  }, [predictions])

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Prediction Results
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualise confidence levels and outcomes across all stored predictions.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading results...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Top metrics */}
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
                  <p className="mt-2 font-display text-2xl font-bold text-primary">
                    {(avgProbA * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Percent className="size-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Avg Probability B
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-accent">
                    {(avgProbB * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 p-2">
                  <TrendingUp className="size-4 text-accent" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    A Favoured
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">
                    {predictions.filter((p) => p.probability_a >= 0.5).length}
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

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Win Probability per Matchup
                </h3>
                <p className="text-xs text-muted-foreground">
                  Red = Boxer A, Gold = Boxer B
                </p>
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
                    <Bar dataKey="probA" name="Boxer A %" fill="oklch(0.58 0.22 25)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="probB" name="Boxer B %" fill="oklch(0.78 0.15 80)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart */}
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
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fight-by-fight table */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                All Predictions
              </h3>
            </div>
            <div className="divide-y divide-border">
              {predictions.map((pred) => (
                <div
                  key={pred.prediction_id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <Swords className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {pred.boxer_a_name}{" "}
                        <span className="text-muted-foreground">vs</span>{" "}
                        {pred.boxer_b_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pred.prediction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Decision
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {pred.match_decision}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Prob A / B
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {(pred.probability_a * 100).toFixed(0)}% /{" "}
                        {(pred.probability_b * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
