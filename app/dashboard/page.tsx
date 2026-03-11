"use client"

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
import {
  mockBoxers,
  recentPredictions,
  weightDistributionData,
} from "@/lib/mock-data"

const confidenceData = [
  { name: "High (>60%)", value: 35, color: "oklch(0.58 0.22 25)" },
  { name: "Medium (50-60%)", value: 45, color: "oklch(0.78 0.15 80)" },
  { name: "Low (<50%)", value: 20, color: "oklch(0.65 0 0)" },
]

export default function DashboardPage() {
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
          title="Total Boxers"
          value={mockBoxers.length}
          subtitle="In database"
          icon={Users}
          trend="+2 this month"
        />
        <StatsCard
          title="Predictions Made"
          value={recentPredictions.length}
          subtitle="Last 30 days"
          icon={Target}
        />
        <StatsCard
          title="Model Accuracy"
          value="94.2%"
          subtitle="Based on historical data"
          icon={Activity}
          trend="+1.3% improvement"
        />
        <StatsCard
          title="Avg Confidence"
          value="56.9%"
          subtitle="Across predictions"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attribute Weight Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Attribute Weight Distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Impact of each attribute on predictions
              </p>
            </div>
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
                  {weightDistributionData.map((entry, index) => (
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

        {/* Prediction Confidence Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Prediction Confidence
            </h3>
            <p className="text-xs text-muted-foreground">
              Distribution of confidence levels
            </p>
          </div>
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
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6">
            {confidenceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Predictions */}
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
          <Link href="/dashboard/predict">
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
        <div className="divide-y divide-border">
          {recentPredictions.map((prediction) => (
            <div
              key={prediction.id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Swords className="size-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {prediction.boxerA}{" "}
                    <span className="text-muted-foreground">vs</span>{" "}
                    {prediction.boxerB}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prediction.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-accent">
                  {prediction.winner}
                </p>
                <p className="text-xs text-muted-foreground">
                  {prediction.confidence}% confidence
                </p>
              </div>
            </div>
          ))}
        </div>
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
            <h4 className="text-sm font-semibold text-foreground">
              Predict Match
            </h4>
            <p className="text-xs text-muted-foreground">
              Input fighter data and generate predictions
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
            <h4 className="text-sm font-semibold text-foreground">
              Boxer Database
            </h4>
            <p className="text-xs text-muted-foreground">
              Browse and search fighter profiles
            </p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/dashboard/model"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
        >
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Activity className="size-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Model Info
            </h4>
            <p className="text-xs text-muted-foreground">
              Learn about the prediction methodology
            </p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
