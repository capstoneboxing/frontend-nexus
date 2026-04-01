"use client"

import { useEffect, useState } from "react"
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
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { weightDistributionData } from "@/lib/mock-data"
import type { Boxer, PredictionRecord } from "@/lib/mock-data"

// ============================================================
// PAGE
// ============================================================
export default function DashboardPage() {
  const [boxers, setBoxers] = useState<Boxer[]>([])
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(true)

  // ----------------------------------------------------------
  // Fetch both tables on mount
  // ----------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      const [boxersRes, predictionsRes] = await Promise.all([
        supabase
          .from("all_time_ranked_boxer")
          .select("ranked_boxer_id, boxer_name, ranking_position")
          .order("ranking_position", { ascending: true }),
        supabase
          .from("prediction_history")
          .select("*")
          .order("prediction_date", { ascending: false })
          .limit(4),
      ])

      if (boxersRes.error) console.error("❌ Boxers error:", boxersRes.error)
      else setBoxers(boxersRes.data as Boxer[])

      if (predictionsRes.error) console.error("❌ Predictions error:", predictionsRes.error)
      else setPredictions(predictionsRes.data as PredictionRecord[])

      setLoading(false)
    }
    fetchData()
  }, [])

  // ----------------------------------------------------------
  // Derived stats from real data
  // ----------------------------------------------------------
  const avgProbA =
    predictions.length > 0
      ? predictions.reduce((s, p) => s + p.probability_a, 0) / predictions.length
      : 0

  const confidenceData = [
    {//to be adjust to match the calucaltions
      name: "High (>50%)",
      value: predictions.filter((p) => p.probability_a > 0.).length,
      color: "oklch(0.58 0.22 25)",
    },
    {
      name: "Medium (>50%)",
      value: predictions.filter((p) => p.probability_b > 0.5).length,
      color: "oklch(0.78 0.15 80)",
    },
    {
      name: "Low (<50% each)",
      value: predictions.filter(
        (p) => p.probability_a <= 0.5 && p.probability_b <= 0.5
      ).length,
      color: "oklch(0.65 0 0)",
    },
  ]

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Fighters"
          value={loading ? "—" : boxers.length}
          subtitle="In database"
          icon={Users}
        />
        <StatsCard
          title="Predictions Made"
          value={loading ? "—" : predictions.length}
          subtitle="Stored in history"
          icon={Target}
        />
        <StatsCard
          title="Model Accuracy"
          //to be adjusted 
          value={loading ? "—" : `${(avgProbA * 100).toFixed(1)}%`}
          subtitle="Based on Historical data"
          icon={Activity}
        />
        <StatsCard
          title="AVG Confidence"
          //to be adjusted to match
          value={
            loading
              ? "—"
              : predictions.filter((p) => p.probability_a >= 0.5).length
          }
          subtitle={`Across predictions`}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attribute Weight Distribution — static, always shown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Attribute Weight Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Impact of each attribute on predictions
            </p>
          </div>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightDistributionData} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="attribute"
                  type="category"
                  width={100}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.005 250)",
                    border: "1px solid oklch(0.28 0.005 250)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Weight"]}
                />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                  {weightDistributionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index < 3
                          ? "oklch(0.58 0.22 25)"
                          : index < 6
                            ? "oklch(0.78 0.15 80)"
                            : "oklch(0.45 0 0)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Confidence — from real data */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Prediction Confidence
            </h3>
            <p className="text-xs text-muted-foreground">
              Distribution across stored predictions
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">No predictions yet.</p>
              <Link href="/dashboard/predict">
                <Button size="sm" variant="outline">Make your first prediction</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex h-64 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={confidenceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {confidenceData.map((entry, index) => (
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
                      formatter={(value: number) => [value, "Predictions"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-4">
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

      {/* Recent Predictions — from real data */}
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
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">Loading predictions...</p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <p className="text-sm text-muted-foreground">No predictions yet.</p>
            <Link href="/dashboard/predict">
              <Button size="sm" variant="outline">Make your first prediction</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {predictions.map((pred) => (
              <div
                key={pred.prediction_id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Swords className="size-3.5 text-primary" />
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
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">
                    {pred.match_decision}
                  </p>
                  <p className="text-xs text-muted-foreground">

                    {/* to be adjust to get corect model confidence number */}

                    {(pred.probability_a * 100).toFixed(0)}% /{" "}
                    {(pred.probability_b * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/predict"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
        >
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Swords className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Predict Match</h4>
            <p className="text-xs text-muted-foreground">
              Pick two fighters and generate a prediction
            </p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/dashboard/boxers"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
        >
          <div className="rounded-lg bg-accent/10 p-2.5">
            <Database className="size-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Boxer Database</h4>
            <p className="text-xs text-muted-foreground">
              Browse all {loading ? "..." : boxers.length} ranked fighters
            </p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/dashboard/history"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
        >
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Activity className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Prediction History</h4>
            <p className="text-xs text-muted-foreground">
              Review all {loading ? "..." : predictions.length} stored predictions
            </p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
