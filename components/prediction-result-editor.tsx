"use client"

import { Button } from "@/components/ui/button"
import type { PredictionHistoryUI } from "@/lib/history-types"

type MatchWinnerToken = "" | "BOXER_A" | "BOXER_B" | "DRAW"
type MatchWinMethodToken = "" | "KO" | "TKO" | "DECISION" | "DISQUALIFICATION"

interface PredictionResultEditorProps {
    pred: PredictionHistoryUI
    loggedIn: boolean
    editingId: number | null
    editMatchWinner: MatchWinnerToken
    editMatchWinMethod: MatchWinMethodToken
    savingUpdate: boolean
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
}

export function PredictionResultEditor({
                                           pred,
                                           loggedIn,
                                           editingId,
                                           editMatchWinner,
                                           editMatchWinMethod,
                                           savingUpdate,
                                           getAllowedMethods,
                                           isValidWinnerMethodCombo,
                                           startEditing,
                                           setEditMatchWinner,
                                           setEditMatchWinMethod,
                                           saveUpdate,
                                           cancelEditing,
                                       }: PredictionResultEditorProps) {
    if (!loggedIn) return null

    const allowedMethods = getAllowedMethods(
        editingId === pred.id ? editMatchWinner : ""
    )

    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Update Actual Result
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
                <select
                    value={editingId === pred.id ? editMatchWinner : ""}
                    onChange={(e) => {
                        if (editingId !== pred.id) startEditing(pred)

                        const nextWinner = e.target.value as MatchWinnerToken
                        setEditMatchWinner(nextWinner)

                        if (!isValidWinnerMethodCombo(nextWinner, editMatchWinMethod)) {
                            setEditMatchWinMethod("")
                        }
                    }}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="">Select winner</option>
                    <option value="BOXER_A">{pred.boxerAName}</option>
                    <option value="BOXER_B">{pred.boxerBName}</option>
                    <option value="DRAW">Draw</option>
                </select>

                <select
                    value={editingId === pred.id ? editMatchWinMethod : ""}
                    onChange={(e) => {
                        if (editingId !== pred.id) startEditing(pred)
                        setEditMatchWinMethod(e.target.value as MatchWinMethodToken)
                    }}
                    disabled={editingId !== pred.id || !editMatchWinner}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-60"
                >
                    <option value="">Select method</option>
                    {allowedMethods.map((method) => (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={() => saveUpdate(pred)}
                        disabled={
                            savingUpdate ||
                            editingId !== pred.id ||
                            !editMatchWinner ||
                            !editMatchWinMethod ||
                            !isValidWinnerMethodCombo(editMatchWinner, editMatchWinMethod)
                        }
                    >
                        {savingUpdate && editingId === pred.id ? "Saving..." : "Save"}
                    </Button>

                    {editingId === pred.id && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={savingUpdate}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            {editingId === pred.id &&
                editMatchWinner &&
                editMatchWinMethod &&
                !isValidWinnerMethodCombo(editMatchWinner, editMatchWinMethod) && (
                    <p className="mt-3 text-sm text-destructive">
                        That winner and method combination does not make sense.
                    </p>
                )}
        </div>
    )
}