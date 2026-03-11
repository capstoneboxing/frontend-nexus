"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts"
import { Progress } from "@/components/ui/progress"
import type { PredictionResult } from "@/lib/mock-data"
import { attributeWeights } from "@/lib/mock-data"

interface PredictionResultsProps {
  result: PredictionResult
}

export function PredictionResults({ result }: PredictionResultsProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  const winnerName =
    result.boxerA.winProbability > result.boxerB.winProbability
      ? result.boxerA.name
      : result.boxerB.name

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Prediction Result
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-foreground">
          {result.boxerA.name}{" "}
          <span className="text-muted-foreground">vs</span>{" "}
          {result.boxerB.name}
        </h2>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {result.boxerA.name}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-primary">
            {result.boxerA.score}
          </p>
          <p className="text-[10px] uppercase text-muted-foreground">Score</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-secondary p-4 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">
            Predicted Winner
          </p>
          <p className="mt-1 font-display text-lg font-bold text-accent">
            {winnerName}
          </p>
        </div>
        <div className="rounded-lg bg-accent/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {result.boxerB.name}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {result.boxerB.score}
          </p>
          <p className="text-[10px] uppercase text-muted-foreground">Score</p>
        </div>
      </div>

      {/* Win Probability Bars */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Win Probability
        </h3>

        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {result.boxerA.name}
              </span>
              <span className="font-display text-sm font-bold text-primary">
                {result.boxerA.winProbability}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${result.boxerA.winProbability}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {result.boxerB.name}
              </span>
              <span className="font-display text-sm font-bold text-accent">
                {result.boxerB.winProbability}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all duration-1000 ease-out"
                style={{ width: `${result.boxerB.winProbability}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Draw
              </span>
              <span className="font-display text-sm font-bold text-muted-foreground">
                {result.drawProbability}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-muted-foreground transition-all duration-1000 ease-out"
                style={{ width: `${result.drawProbability}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Comparison Chart */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Attribute Comparison
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={result.attributeComparison}
              layout="vertical"
              barGap={2}
            >
              <XAxis
                type="number"
                domain={[0, 10]}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="attribute"
                type="category"
                width={100}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
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
                dataKey="boxerA"
                name={result.boxerA.name}
                fill="oklch(0.58 0.22 25)"
                radius={[0, 3, 3, 0]}
              />
              <Bar
                dataKey="boxerB"
                name={result.boxerB.name}
                fill="oklch(0.78 0.15 80)"
                radius={[0, 3, 3, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="rounded-lg border border-border">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-secondary/50"
        >
          <span>Prediction Explanation</span>
          {showExplanation ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>
        {showExplanation && (
          <div className="space-y-3 border-t border-border px-4 py-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Weights Applied:</strong>{" "}
              Performance Metrics (35%): Hand Speed, Punch Output, VO2 Max, Lactate Threshold, KO Force, Reaction Time.
              Technical (22%): Punch Accuracy, Slip Rate, Opponent Connect %, Footwork Efficiency.
              Tactical (16%): Adaptation Speed, Counter Success Rate, Ring IQ.
              Anthropometric (15%): Height, Reach, Body Fat, Shoulder-to-Waist Ratio.
              Psychological (12%): Resilience, Composure, Emotional Regulation.
            </p>
            <p>
              <strong className="text-foreground">
                Score Interpretation:
              </strong>{" "}
              The score difference of{" "}
              {Math.abs(
                Math.round(
                  (result.boxerA.score - result.boxerB.score) * 10
                ) / 10
              )}{" "}
              indicates{" "}
              {Math.abs(result.boxerA.score - result.boxerB.score) < 0.3
                ? "an extremely close and evenly matched fight."
                : Math.abs(result.boxerA.score - result.boxerB.score) < 1
                  ? "a competitive fight with a slight edge."
                  : "a clear advantage for the predicted winner."}
            </p>
            <p>
              <strong className="text-foreground">Uncertainty Note:</strong>{" "}
              These predictions are based on attribute data only and do not
              account for external factors such as injury, fight camp quality,
              or emotional state. All predictions carry inherent uncertainty.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
