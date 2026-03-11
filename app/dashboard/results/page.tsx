"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import {
  AlertTriangle,
  CheckCircle2,
  Percent,
  TrendingUp,
  XCircle,
} from "lucide-react"
import { predictionHistory } from "@/lib/mock-data"

export default function ResultsPage() {
  // Derive stats from prediction history
  const resolved = useMemo(
    () => predictionHistory.filter((p) => p.status !== "pending"),
    []
  )

  const correct = useMemo(
    () => resolved.filter((p) => p.status === "correct"),
    []
  )
  const incorrect = useMemo(
    () => resolved.filter((p) => p.status === "incorrect"),
    []
  )
  const draws = useMemo(
    () => resolved.filter((p) => p.status === "draw"),
    []
  )

  const accuracy = useMemo(() => {
    const nonDraw = resolved.filter((p) => p.status !== "draw").length
    return nonDraw > 0
      ? ((correct.length / nonDraw) * 100).toFixed(1)
      : "0"
  }, [resolved, correct])

  // Bar chart: per-prediction confidence vs outcome
  const confidenceOutcomeData = useMemo(
    () =>
      resolved.map((p) => ({
        label: `${p.boxerA.split(" ").pop()} v ${p.boxerB.split(" ").pop()}`,
        confidence: p.winProbability,
        status: p.status,
        date: p.date,
      })),
    [resolved]
  )

  // Scatter plot: predicted confidence vs actual correctness (1/0)
  const scatterData = useMemo(
    () =>
      resolved
        .filter((p) => p.status !== "draw")
        .map((p) => ({
          confidence: p.winProbability,
          outcome: p.status === "correct" ? 1 : 0,
          name: `${p.boxerA.split(" ").pop()} v ${p.boxerB.split(" ").pop()}`,
        })),
    [resolved]
  )

  // Pie chart: outcome distribution
  const outcomeDistribution = useMemo(
    () => [
      {
        name: "Correct",
        value: correct.length,
        color: "oklch(0.58 0.22 25)",
      },
      {
        name: "Incorrect",
        value: incorrect.length,
        color: "oklch(0.55 0.22 25)",
      },
      {
        name: "Draw",
        value: draws.length,
        color: "oklch(0.78 0.15 80)",
      },
    ],
    [correct, incorrect, draws]
  )

  // Confidence bucket accuracy
  const bucketData = useMemo(() => {
    const buckets = [
      { label: "50-55%", min: 50, max: 55 },
      { label: "55-60%", min: 55, max: 60 },
      { label: "60-65%", min: 60, max: 65 },
      { label: "65-70%", min: 65, max: 70 },
    ]
    return buckets.map((b) => {
      const inBucket = resolved.filter(
        (p) =>
          p.winProbability >= b.min &&
          p.winProbability < b.max &&
          p.status !== "draw"
      )
      const correctInBucket = inBucket.filter(
        (p) => p.status === "correct"
      ).length
      return {
        bucket: b.label,
        accuracy:
          inBucket.length > 0
            ? Math.round((correctInBucket / inBucket.length) * 100)
            : 0,
        count: inBucket.length,
      }
    })
  }, [resolved])

  // Method breakdown for correct vs incorrect
  const methodBreakdown = useMemo(() => {
    const methods: Record<string, { correct: number; incorrect: number }> = {}
    resolved
      .filter((p) => p.status !== "draw" && p.method)
      .forEach((p) => {
        const m = p.method!
        if (!methods[m]) methods[m] = { correct: 0, incorrect: 0 }
        if (p.status === "correct") methods[m].correct++
        else methods[m].incorrect++
      })
    return Object.entries(methods).map(([method, counts]) => ({
      method,
      ...counts,
    }))
  }, [resolved])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Prediction vs Results
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare model predictions against actual fight outcomes. Evaluate
          accuracy across confidence levels, methods, and matchups.
        </p>
      </div>

      {/* Top-Level Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Overall Accuracy
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">
                {accuracy}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Excluding draws
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
                Correct Predictions
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">
                {correct.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                of {resolved.length} total
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <CheckCircle2 className="size-4 text-primary" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Incorrect Predictions
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-destructive">
                {incorrect.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {((incorrect.length / (resolved.length - draws.length)) * 100).toFixed(1)}% miss rate
              </p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-2">
              <XCircle className="size-4 text-destructive" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg Confidence
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-accent">
                {(
                  resolved.reduce((s, p) => s + p.winProbability, 0) /
                  resolved.length
                ).toFixed(1)}
                %
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across all predictions
              </p>
            </div>
            <div className="rounded-lg bg-accent/10 p-2">
              <TrendingUp className="size-4 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Confidence vs Outcome Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Prediction Confidence by Fight
            </h3>
            <p className="text-xs text-muted-foreground">
              Bar color indicates correct (primary) vs incorrect (red) vs draw
              (gold)
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceOutcomeData}>
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
                  domain={[40, 75]}
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
                  formatter={(value: number) => [`${value}%`, "Confidence"]}
                />
                <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                  {confidenceOutcomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.status === "correct"
                          ? "oklch(0.58 0.22 25)"
                          : entry.status === "draw"
                            ? "oklch(0.78 0.15 80)"
                            : "oklch(0.45 0.15 25)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Distribution Pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Outcome Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Breakdown of prediction results
            </p>
          </div>
          <div className="flex h-72 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {outcomeDistribution.map((entry, index) => (
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
            {outcomeDistribution.map((item) => (
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

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accuracy by Confidence Bucket */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Accuracy by Confidence Level
            </h3>
            <p className="text-xs text-muted-foreground">
              How well do high-confidence predictions perform vs low-confidence
              ones?
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bucketData}>
                <XAxis
                  dataKey="bucket"
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
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
                  formatter={(value: number, name: string) => [
                    name === "accuracy" ? `${value}%` : value,
                    name === "accuracy" ? "Accuracy" : "Sample Size",
                  ]}
                />
                <Bar
                  dataKey="accuracy"
                  fill="oklch(0.58 0.22 25)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex justify-center gap-4">
            {bucketData.map((b) => (
              <span
                key={b.bucket}
                className="text-[10px] text-muted-foreground"
              >
                {b.bucket}: n={b.count}
              </span>
            ))}
          </div>
        </div>

        {/* Accuracy by Win Method */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Accuracy by Win Method
            </h3>
            <p className="text-xs text-muted-foreground">
              Correct vs incorrect predictions grouped by how the fight ended
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodBreakdown}>
                <XAxis
                  dataKey="method"
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
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
                />
                <Bar
                  dataKey="correct"
                  name="Correct"
                  fill="oklch(0.58 0.22 25)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="incorrect"
                  name="Incorrect"
                  fill="oklch(0.45 0.15 25)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scatter: Confidence vs Outcome */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Confidence vs Outcome (Scatter)
          </h3>
          <p className="text-xs text-muted-foreground">
            Each dot is a prediction. Y=1 means correct, Y=0 means incorrect.
            X-axis is model confidence.
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.005 250)"
              />
              <XAxis
                dataKey="confidence"
                type="number"
                domain={[45, 75]}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                name="Confidence"
                unit="%"
              />
              <YAxis
                dataKey="outcome"
                type="number"
                domain={[-0.2, 1.2]}
                ticks={[0, 1]}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                name="Correct"
                tickFormatter={(v) => (v === 1 ? "Yes" : v === 0 ? "No" : "")}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.005 250)",
                  border: "1px solid oklch(0.28 0.005 250)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Correct") return [value === 1 ? "Yes" : "No", name]
                  return [`${value}%`, name]
                }}
              />
              <Scatter
                data={scatterData}
                fill="oklch(0.58 0.22 25)"
                r={6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Fight Results Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            Fight-by-Fight Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Every prediction compared against the actual result
          </p>
        </div>
        <div className="divide-y divide-border">
          {resolved.map((pred) => {
            const isCorrect = pred.status === "correct"
            const isDraw = pred.status === "draw"
            return (
              <div
                key={pred.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      isCorrect
                        ? "bg-primary/10"
                        : isDraw
                          ? "bg-accent/10"
                          : "bg-destructive/10"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="size-4 text-primary" />
                    ) : isDraw ? (
                      <AlertTriangle className="size-4 text-accent" />
                    ) : (
                      <XCircle className="size-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pred.boxerA.split("'").pop()?.trim().split(" ").pop()}{" "}
                      <span className="text-muted-foreground">vs</span>{" "}
                      {pred.boxerB.split("'").pop()?.trim().split(" ").pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pred.date} &middot; {pred.weightClass}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Predicted
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {pred.predictedWinner.split(" ").pop()} ({pred.winProbability}%)
                    </p>
                  </div>
                  <div className="text-muted-foreground">vs</div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Actual
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isCorrect
                          ? "text-primary"
                          : isDraw
                            ? "text-accent"
                            : "text-destructive"
                      }`}
                    >
                      {pred.actualWinner === "Draw"
                        ? "Draw"
                        : pred.actualWinner?.split(" ").pop()}{" "}
                      {pred.method ? `(${pred.method})` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
