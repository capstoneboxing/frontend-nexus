"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PredictionUIResult } from "@/lib/predict-mappers"

interface PredictionResultsProps {
    result: PredictionUIResult
}

export function PredictionResults({
                                      result,

                                  }: PredictionResultsProps) {
    const [showExplanation, setShowExplanation] = useState(false)

    const isBoxerAWinner = result.predictedWinner === result.boxerA.name
    const isBoxerBWinner = result.predictedWinner === result.boxerB.name
    const isDraw = result.predictedWinner === "Draw"

    let winnerColorClass = "text-muted-foreground"
    let winnerPanelClass = "bg-secondary"

    if (isBoxerAWinner) {
        winnerColorClass = "text-red-400"
        winnerPanelClass = "border border-red-400/30 bg-red-400/10"
    } else if (isBoxerBWinner) {
        winnerColorClass = "text-yellow-300"
        winnerPanelClass = "border border-yellow-300/30 bg-yellow-300/10"
    } else if (isDraw) {
        winnerColorClass = "text-sky-300"
        winnerPanelClass = "border border-sky-300/30 bg-sky-300/10"
    }

    return (
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Prediction Result
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                    {result.boxerA.name} <span className="text-muted-foreground">vs</span>{" "}
                    {result.boxerB.name}
                </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div
                    className={`rounded-lg p-4 text-center ${
                        isBoxerAWinner
                            ? "border border-red-400 bg-red-400/10"
                            : "border border-red-400/20 bg-red-400/5"
                    }`}
                >
                    <p className="text-xs text-muted-foreground">{result.boxerA.name}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-red-400">
                        {result.boxerA.score}
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground">Closeness</p>
                </div>

                <div
                    className={`flex flex-col items-center justify-center rounded-lg p-4 text-center ${winnerPanelClass}`}
                >
                    <p className="text-[10px] uppercase text-muted-foreground">
                        Predicted Winner
                    </p>
                    <p className={`mt-1 font-display text-lg font-bold ${winnerColorClass}`}>
                        {result.predictedWinner}
                    </p>
                </div>

                <div
                    className={`rounded-lg p-4 text-center ${
                        isBoxerBWinner
                            ? "border border-yellow-300 bg-yellow-300/10"
                            : "border border-yellow-300/20 bg-yellow-300/5"
                    }`}
                >
                    <p className="text-xs text-muted-foreground"> {result.boxerB.name}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-yellow-300">
                        {result.boxerB.score}
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground">Closeness</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Win Probability
                </h3>

                <div className="space-y-3">
                    <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-3">
                        <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                 {result.boxerA.name}
              </span>
                            <span className="font-display text-sm font-bold text-red-400">
                {result.boxerA.winProbability}%
              </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-red-400"
                                style={{ width: `${result.boxerA.winProbability}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-yellow-300/20 bg-yellow-300/5 p-3">
                        <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                 {result.boxerB.name}
              </span>
                            <span className="font-display text-sm font-bold text-yellow-300">
                {result.boxerB.winProbability}%
              </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-yellow-300"
                                style={{ width: `${result.boxerB.winProbability}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

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
                        <p>{result.explanation}</p>
                        <p>
                            <strong className="text-foreground">Interpretation:</strong>{" "}
                            A higher closeness score means the boxer is closer to the perfect
                            boxer profile for the selected weight class.
                        </p>
                        <p>
                            <strong className="text-foreground">Uncertainty Note:</strong>{" "}
                            Predictions are still probabilistic and should not be treated as
                            guaranteed outcomes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
