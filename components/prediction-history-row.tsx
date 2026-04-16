"use client"

import {
    Calendar,
    Clock,
    ShieldCheck,
    Swords,
    Trash2,
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { PredictionHistoryUI } from "@/lib/history-types"
import { PredictionResultEditor } from "@/components/prediction-result-editor"

type MatchWinnerToken = "" | "BOXER_A" | "BOXER_B" | "DRAW"
type MatchWinMethodToken = "" | "KO" | "TKO" | "DECISION" | "DISQUALIFICATION"

interface PredictionHistoryRowProps {
    pred: PredictionHistoryUI
    isExpanded: boolean
    loggedIn: boolean
    editingId: number | null
    editMatchWinner: MatchWinnerToken
    editMatchWinMethod: MatchWinMethodToken
    savingUpdate: boolean
    deletingId: number | null
    onToggleExpand: (id: number) => void
    getPredictedWinnerTextClass: (pred: PredictionHistoryUI) => string
    getStatusBadgeClass: (pred: PredictionHistoryUI) => string
    getAllowedMethods: (winner: MatchWinnerToken) => MatchWinMethodToken[]
    isValidWinnerMethodCombo: (
        winner: MatchWinnerToken,
        method: MatchWinMethodToken
    ) => boolean
    startEditing: (pred: PredictionHistoryUI) => void
    setEditMatchWinner: (value: MatchWinnerToken) => void
    setEditMatchWinMethod: (value: MatchWinMethodToken) => void
    saveUpdate: (pred: PredictionHistoryUI) => void
    cancelEditing: () => void
    deletePrediction: (pred: PredictionHistoryUI) => void
}

export function PredictionHistoryRow({
                                         pred,
                                         isExpanded,
                                         loggedIn,
                                         editingId,
                                         editMatchWinner,
                                         editMatchWinMethod,
                                         savingUpdate,
                                         deletingId,
                                         onToggleExpand,
                                         getPredictedWinnerTextClass,
                                         getStatusBadgeClass,
                                         getAllowedMethods,
                                         isValidWinnerMethodCombo,
                                         startEditing,
                                         setEditMatchWinner,
                                         setEditMatchWinMethod,
                                         saveUpdate,
                                         cancelEditing,
                                         deletePrediction,
                                     }: PredictionHistoryRowProps) {
    const snapshot = pred.breakdownSnapshot

    const boxerACategory = snapshot?.categoryScores?.boxerA
    const boxerBCategory = snapshot?.categoryScores?.boxerB
    const perfectCategory = snapshot?.categoryScores?.perfectBoxer

    const boxerABaseCloseness = snapshot?.closeness?.boxerA?.base
    const boxerAAdjustedCloseness = snapshot?.closeness?.boxerA?.adjusted

    const boxerBBaseCloseness = snapshot?.closeness?.boxerB?.base
    const boxerBAdjustedCloseness = snapshot?.closeness?.boxerB?.adjusted

    const boxerAConfidence = snapshot?.attributeConfidence?.boxerA
    const boxerBConfidence = snapshot?.attributeConfidence?.boxerB

    const snapshotProbabilityA = snapshot?.probabilities?.boxerA
    const snapshotProbabilityB = snapshot?.probabilities?.boxerB

    return (
        <>
            <tr
                className={`cursor-pointer border-l-4 transition-colors ${
                    isExpanded
                        ? "border-l-red-800"
                        : "border-l-transparent hover:bg-secondary/30"
                }`}
                onClick={() => onToggleExpand(pred.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onToggleExpand(pred.id)
                    }
                }}
            >
                <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    <div className="space-y-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3 shrink-0" />
                {pred.predictionDateLabel}
            </span>
                        <span className="flex items-center gap-1.5">
              <Clock className="size-3 shrink-0" />
                            {pred.predictionTimeLabel}
            </span>
                    </div>
                </td>

                <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex size-7 items-center justify-center rounded-md ${
                                isExpanded ? "bg-red-900/30" : "bg-primary/10"
                            }`}
                        >
                            <Swords className="size-3 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            {pred.boxerAName}
                            <span className="text-muted-foreground"> vs </span>
                            <br />
                            {pred.boxerBName}
                        </p>
                    </div>
                </td>

                <td className="hidden px-5 py-3.5 sm:table-cell">
          <span className="font-display text-sm font-bold text-red-400">
            {(pred.probabilityA * 100).toFixed(0)}%
          </span>
                </td>

                <td className="hidden px-5 py-3.5 md:table-cell">
          <span className="font-display text-sm font-bold text-yellow-300">
            {(pred.probabilityB * 100).toFixed(0)}%
          </span>
                </td>

                <td
                    className={`px-5 py-3.5 text-sm font-medium ${getPredictedWinnerTextClass(
                        pred
                    )}`}
                >
                    {pred.predictedWinnerLabel}
                </td>

                <td className="px-5 py-3.5">
          <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                  pred
              )}`}
          >
            {pred.status}
          </span>
                </td>

                {loggedIn && (
                    <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Prediction</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete{" "}
                                        <span className="font-semibold">
                      {pred.boxerAName} vs {pred.boxerBName}
                    </span>
                                        ? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={() => deletePrediction(pred)}
                                        disabled={deletingId === pred.id}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        {deletingId === pred.id ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </td>
                )}
            </tr>

            {isExpanded && (
                <tr className="border-l-4 border-red-800">
                    <td colSpan={loggedIn ? 7 : 6} className="px-5 py-4">
                        <div className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                        Prediction Timestamp
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-foreground">
                                        {pred.predictionDateLabel}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {pred.predictionTimeLabel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                        Predicted Winner
                                    </p>
                                    <p
                                        className={`mt-0.5 text-sm font-medium ${getPredictedWinnerTextClass(
                                            pred
                                        )}`}
                                    >
                                        {pred.predictedWinnerLabel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                        Actual Result
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-foreground">
                                        {pred.matchWinnerLabel ?? "Pending"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {pred.matchWinMethod ?? "No method recorded"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                        Weight Class
                                    </p>
                                    <p className="mt-0.5 text-sm font-medium text-foreground">
                                        {pred.weightClassName}
                                    </p>
                                </div>
                            </div>

                            <PredictionResultEditor
                                pred={pred}
                                loggedIn={loggedIn}
                                editingId={editingId}
                                editMatchWinner={editMatchWinner}
                                editMatchWinMethod={editMatchWinMethod}
                                savingUpdate={savingUpdate}
                                getAllowedMethods={getAllowedMethods}
                                isValidWinnerMethodCombo={isValidWinnerMethodCombo}
                                startEditing={startEditing}
                                setEditMatchWinner={setEditMatchWinner}
                                setEditMatchWinMethod={setEditMatchWinMethod}
                                saveUpdate={saveUpdate}
                                cancelEditing={cancelEditing}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Closeness & Probabilities
                                    </p>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerAName} Base Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                                {boxerABaseCloseness?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerAName} Adjusted Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                                {boxerAAdjustedCloseness?.toFixed?.(2) ??
                                                    pred.boxerAClosenessScore.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerBName} Base Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                                {boxerBBaseCloseness?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerBName} Adjusted Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                                {boxerBAdjustedCloseness?.toFixed?.(2) ??
                                                    pred.boxerBClosenessScore.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerAName} Probability
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                                {((snapshotProbabilityA ?? pred.probabilityA) * 100).toFixed(0)}%
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerBName} Probability
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                                {((snapshotProbabilityB ?? pred.probabilityB) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Overall Scores & Confidence
                                    </p>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerAName} Overall Score
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                                {snapshot?.overallScores?.boxerA?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerAName} Confidence
                                            </p>
                                            <p className="mt-1 flex items-center gap-1 font-display text-lg font-bold text-red-400">
                                                <ShieldCheck className="size-4" />
                                                {boxerAConfidence != null
                                                    ? `${(boxerAConfidence * 100).toFixed(0)}%`
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerBName} Overall Score
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                                {snapshot?.overallScores?.boxerB?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                {pred.boxerBName} Confidence
                                            </p>
                                            <p className="mt-1 flex items-center gap-1 font-display text-lg font-bold text-yellow-300">
                                                <ShieldCheck className="size-4" />
                                                {boxerBConfidence != null
                                                    ? `${(boxerBConfidence * 100).toFixed(0)}%`
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="rounded-md border border-sky-300/20 p-3 sm:col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                Perfect Boxer Overall Score
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-sky-300">
                                                {snapshot?.overallScores?.perfectBoxer?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-3">
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Category Scores — {pred.boxerAName}
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <p><strong>Physical:</strong> {boxerACategory?.physical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Technical:</strong> {boxerACategory?.technical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Tactical:</strong> {boxerACategory?.tactical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Experience:</strong> {boxerACategory?.experience?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Psychological:</strong> {boxerACategory?.psychological?.toFixed?.(2) ?? "N/A"}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Category Scores — {pred.boxerBName}
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <p><strong>Physical:</strong> {boxerBCategory?.physical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Technical:</strong> {boxerBCategory?.technical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Tactical:</strong> {boxerBCategory?.tactical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Experience:</strong> {boxerBCategory?.experience?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Psychological:</strong> {boxerBCategory?.psychological?.toFixed?.(2) ?? "N/A"}</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Category Scores — Perfect Boxer
                                    </p>
                                    <div className="mt-3 space-y-2 text-sm">
                                        <p><strong>Physical:</strong> {perfectCategory?.physical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Technical:</strong> {perfectCategory?.technical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Tactical:</strong> {perfectCategory?.tactical?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Experience:</strong> {perfectCategory?.experience?.toFixed?.(2) ?? "N/A"}</p>
                                        <p><strong>Psychological:</strong> {perfectCategory?.psychological?.toFixed?.(2) ?? "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-card p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    AI Explanation
                                </p>
                                <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                                    {snapshot?.aiExplanation ?? pred.aiExplanation}
                                </p>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}