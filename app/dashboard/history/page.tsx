"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCcw,
  Search,
  Swords,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { predictionHistoryApi, weightClassesApi } from "@/lib/api-client"
import { isLoggedIn } from "@/lib/auth"
import { mapPredictionHistoryToUI } from "@/lib/history-mappers"
import type { PredictionHistoryUI } from "@/lib/history-types"
import type { PredictionResultUpdateRequest } from "@/generated-api/models"

type SortField = "predictionDate" | "probabilityA" | "probabilityB"
type SortDir = "asc" | "desc"

type WeightClassOption = {
  weightClassId?: number
  className?: string
}

type MatchWinnerToken = "" | "BOXER_A" | "BOXER_B" | "DRAW"
type MatchWinMethodToken = "" | "KO" | "TKO" | "DECISION" | "DISQUALIFICATION"

function getAllowedMethods(winner: MatchWinnerToken): MatchWinMethodToken[] {
  if (winner === "DRAW") return ["DECISION"]
  if (winner === "BOXER_A" || winner === "BOXER_B") {
    return ["KO", "TKO", "DECISION", "DISQUALIFICATION"]
  }
  return []
}

function isValidWinnerMethodCombo(
    winner: MatchWinnerToken,
    method: MatchWinMethodToken
): boolean {
  if (!winner || !method) return false

  if (winner === "DRAW") {
    return method === "DECISION"
  }

  if (winner === "BOXER_A" || winner === "BOXER_B") {
    return ["KO", "TKO", "DECISION", "DISQUALIFICATION"].includes(method)
  }

  return false
}

function getPredictedWinnerTextClass(pred: PredictionHistoryUI): string {
  if (pred.predictedWinnerRaw === "BOXER_A") return "text-red-400"
  if (pred.predictedWinnerRaw === "BOXER_B") return "text-yellow-300"
  if (pred.predictedWinnerRaw === "DRAW") return "text-sky-300"
  return "text-foreground"
}

function getStatusBadgeClass(pred: PredictionHistoryUI): string {
  if (pred.status === "correct") {
    return "bg-green-500/10 text-green-400 border border-green-500/20"
  }

  if (pred.status === "draw") {
    return "bg-sky-300/10 text-sky-300 border border-sky-300/20"
  }

  if (pred.status === "incorrect") {
    return "bg-destructive/10 text-destructive border border-destructive/20"
  }

  return "bg-muted text-muted-foreground border border-border"
}

export default function HistoryPage() {
  const loggedIn = isLoggedIn()

  const [predictions, setPredictions] = useState<PredictionHistoryUI[]>([])
  const [weightClassMap, setWeightClassMap] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("predictionDate")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editMatchWinner, setEditMatchWinner] = useState<MatchWinnerToken>("")
  const [editMatchWinMethod, setEditMatchWinMethod] =
      useState<MatchWinMethodToken>("")
  const [savingUpdate, setSavingUpdate] = useState(false)

  async function fetchAll(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [historyData, weightClassData] = await Promise.all([
        predictionHistoryApi.getPredictionHistories(),
        weightClassesApi.getWeightClasses(),
      ])

      const wcMap = Object.fromEntries(
          (weightClassData as WeightClassOption[])
              .filter((wc) => wc.weightClassId != null)
              .map((wc) => [wc.weightClassId as number, wc.className ?? "Unknown"])
      )

      setWeightClassMap(wcMap)

      const mapped = historyData.map((item) => {
        const ui = mapPredictionHistoryToUI(item)
        return {
          ...ui,
          weightClassName:
              ui.weightClassId != null ? wcMap[ui.weightClassId] ?? "Unknown" : "N/A",
        }
      })

      setPredictions(mapped)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load prediction history.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void fetchAll()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const data = [...predictions]

    const searched = q
        ? data.filter(
            (p) =>
                p.boxerAName.toLowerCase().includes(q) ||
                p.boxerBName.toLowerCase().includes(q) ||
                p.predictedWinnerLabel.toLowerCase().includes(q) ||
                (p.matchWinnerLabel ?? "").toLowerCase().includes(q) ||
                p.weightClassName.toLowerCase().includes(q)
        )
        : data

    searched.sort((a, b) => {
      let cmp = 0

      if (sortField === "predictionDate") {
        cmp =
            (a.predictionDate?.getTime() ?? 0) - (b.predictionDate?.getTime() ?? 0)
      } else if (sortField === "probabilityA") {
        cmp = a.probabilityA - b.probabilityA
      } else if (sortField === "probabilityB") {
        cmp = a.probabilityB - b.probabilityB
      }

      return sortDir === "desc" ? -cmp : cmp
    })

    return searched
  }, [predictions, search, sortField, sortDir])

  const stats = useMemo(() => {
    const total = predictions.length
    const correct = predictions.filter((p) => p.status === "correct").length
    const incorrect = predictions.filter((p) => p.status === "incorrect").length
    const draw = predictions.filter((p) => p.status === "draw").length
    const resolved = predictions.filter((p) => p.status !== "pending").length
    const accuracyRate = resolved === 0 ? 0 : (correct / resolved) * 100

    return { total, correct, incorrect, draw, accuracyRate }
  }, [predictions])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) =>
      sortField === field ? (
          sortDir === "desc" ? (
              <ChevronDown className="size-3" />
          ) : (
              <ChevronUp className="size-3" />
          )
      ) : null

  const startEditing = (pred: PredictionHistoryUI) => {
    setEditingId(pred.id)

    const winnerValue =
        pred.matchWinnerRaw === "BOXER_A" ||
        pred.matchWinnerRaw === "BOXER_B" ||
        pred.matchWinnerRaw === "DRAW"
            ? (pred.matchWinnerRaw as MatchWinnerToken)
            : ""

    const methodValue =
        pred.matchWinMethod === "KO" ||
        pred.matchWinMethod === "TKO" ||
        pred.matchWinMethod === "DECISION" ||
        pred.matchWinMethod === "DISQUALIFICATION"
            ? (pred.matchWinMethod as MatchWinMethodToken)
            : ""

    setEditMatchWinner(winnerValue)
    setEditMatchWinMethod(methodValue)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditMatchWinner("")
    setEditMatchWinMethod("")
  }

  const saveUpdate = async (pred: PredictionHistoryUI) => {
    if (!editMatchWinner || !editMatchWinMethod) {
      setError("Please select both the actual winner and win method.")
      return
    }

    if (!isValidWinnerMethodCombo(editMatchWinner, editMatchWinMethod)) {
      setError("That winner and method combination does not make sense.")
      return
    }

    try {
      setSavingUpdate(true)
      setError(null)

      const payload: PredictionResultUpdateRequest = {
        matchWinner: editMatchWinner,
        matchWinMethod: editMatchWinMethod,
      }

      const updated = await predictionHistoryApi.updatePredictionHistory({
        id: pred.id,
        predictionResultUpdateRequest: payload,
      })

      const mapped = mapPredictionHistoryToUI(updated)
      const merged: PredictionHistoryUI = {
        ...mapped,
        weightClassName:
            mapped.weightClassId != null
                ? weightClassMap[mapped.weightClassId] ?? "Unknown"
                : "N/A",
      }

      setPredictions((prev) =>
          prev.map((p) => (p.id === pred.id ? merged : p))
      )

      cancelEditing()
    } catch (err) {
      console.error(err)
      setError("Failed to update prediction history.")
    } finally {
      setSavingUpdate(false)
    }
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Prediction History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse past predictions, actual results, timestamps, and saved breakdowns.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Predictions
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {loading ? "—" : stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Correct
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">
              {loading ? "—" : stats.correct}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Incorrect
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-destructive">
              {loading ? "—" : stats.incorrect}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Draw
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-accent">
              {loading ? "—" : stats.draw}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Accuracy Rate
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {loading ? "—" : `${stats.accuracyRate.toFixed(1)}%`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search by fighter, result, or weight class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
              type="button"
              variant="outline"
              onClick={() => void fetchAll(true)}
              disabled={loading || refreshing}
              className="sm:w-auto"
          >
            {refreshing ? (
                <>
                  <RefreshCcw className="mr-2 size-4 animate-spin" />
                  Refreshing...
                </>
            ) : (
                <>
                  <RefreshCcw className="mr-2 size-4" />
                  Refresh
                </>
            )}
          </Button>
        </div>

        {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading prediction history...</p>
            </div>
        )}

        {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
        )}

        {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th
                        onClick={() => toggleSort("predictionDate")}
                        className="cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                    <span className="flex items-center gap-1">
                      Date / Time <SortIcon field="predictionDate" />
                    </span>
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Matchup
                    </th>

                    <th
                        onClick={() => toggleSort("probabilityA")}
                        className="hidden cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground sm:table-cell"
                    >
                    <span className="flex items-center gap-1">
                      Probability A <SortIcon field="probabilityA" />
                    </span>
                    </th>

                    <th
                        onClick={() => toggleSort("probabilityB")}
                        className="hidden cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground md:table-cell"
                    >
                    <span className="flex items-center gap-1">
                      Probability B <SortIcon field="probabilityB" />
                    </span>
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Predicted Winner
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                  {filtered.map((pred) => {
                    const isExpanded = expandedId === pred.id
                    const snapshot = pred.breakdownSnapshot
                    const boxerACategory = snapshot?.categoryScores?.boxerA
                    const boxerBCategory = snapshot?.categoryScores?.boxerB
                    const perfectCategory = snapshot?.categoryScores?.perfectBoxer
                    const allowedMethods = getAllowedMethods(
                        editingId === pred.id ? editMatchWinner : ""
                    )

                    return (
                        <>
                          <tr
                              key={pred.id}
                              className={`cursor-pointer border-l-4 transition-colors ${
                                  isExpanded
                                      ? "border-l-red-800"
                                      : "border-l-transparent hover:bg-secondary/30"
                              }`}
                              onClick={() => setExpandedId(isExpanded ? null : pred.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  setExpandedId(isExpanded ? null : pred.id)
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
                          </tr>

                          {isExpanded && (
                              <tr className="border-l-4 border-red-800">
                                <td colSpan={6} className="px-5 py-4">
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

                                    {loggedIn && (
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

                                                  if (
                                                      !isValidWinnerMethodCombo(
                                                          nextWinner,
                                                          editMatchWinMethod
                                                      )
                                                  ) {
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
                                                  setEditMatchWinMethod(
                                                      e.target.value as MatchWinMethodToken
                                                  )
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
                                                      !isValidWinnerMethodCombo(
                                                          editMatchWinner,
                                                          editMatchWinMethod
                                                      )
                                                  }
                                              >
                                                {savingUpdate && editingId === pred.id
                                                    ? "Saving..."
                                                    : "Save"}
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
                                              !isValidWinnerMethodCombo(
                                                  editMatchWinner,
                                                  editMatchWinMethod
                                              ) && (
                                                  <p className="mt-3 text-sm text-destructive">
                                                    That winner and method combination does not make sense.
                                                  </p>
                                              )}
                                        </div>
                                    )}

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div className="rounded-lg border border-border bg-card p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                          Closeness & Probabilities
                                        </p>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                          <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerAName} Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                              {pred.boxerAClosenessScore.toFixed(2)}
                                            </p>
                                          </div>

                                          <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerBName} Closeness
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                              {pred.boxerBClosenessScore.toFixed(2)}
                                            </p>
                                          </div>

                                          <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerAName} Probability
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                              {(pred.probabilityA * 100).toFixed(0)}%
                                            </p>
                                          </div>

                                          <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerBName} Probability
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                              {(pred.probabilityB * 100).toFixed(0)}%
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="rounded-lg border border-border bg-card p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                          Overall Scores
                                        </p>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                          <div className="rounded-md border border-red-900/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerAName}
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-red-400">
                                              {snapshot?.overallScores?.boxerA?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                          </div>

                                          <div className="rounded-md border border-yellow-300/20 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              {pred.boxerBName}
                                            </p>
                                            <p className="mt-1 font-display text-lg font-bold text-yellow-300">
                                              {snapshot?.overallScores?.boxerB?.toFixed?.(2) ?? "N/A"}
                                            </p>
                                          </div>

                                          <div className="rounded-md border border-sky-300/20 p-3 sm:col-span-2">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                              Perfect Boxer
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
                                        {pred.aiExplanation}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                          )}
                        </>
                    )
                  })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No prediction history found.
                    </p>
                  </div>
              )}
            </div>
        )}
      </div>
  )
}