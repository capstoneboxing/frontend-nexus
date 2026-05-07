"use client"

import { useEffect, useMemo, useState } from "react"
import { appToast } from "@/lib/toast"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCcw,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchPredictionHistories, fetchWeightClasses, updatePredictionHistory, deletePredictionHistory } from "@/lib/api"
import { isLoggedIn } from "@/lib/auth"
import { mapPredictionHistoryToUI } from "@/lib/history-mappers"
import type { PredictionHistoryUI } from "@/lib/history-types"
import type { PredictionResultUpdateRequest } from "@/generated-api/models"
import { PredictionHistoryRow } from "@/components/prediction-history-row"
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

function getActualWinnerLabel(pred: PredictionHistoryUI): string {
  if (!pred.matchWinnerRaw) return "Pending"
  if (pred.matchWinnerRaw === "BOXER_A") return pred.boxerAName
  if (pred.matchWinnerRaw === "BOXER_B") return pred.boxerBName
  if (pred.matchWinnerRaw === "DRAW") return "Draw"
  return "Pending"
}

function getActualWinnerTextClass(pred: PredictionHistoryUI): string {
  if (!pred.matchWinnerRaw) return "text-foreground"
  if (pred.matchWinnerRaw === "BOXER_A") return "text-red-400"
  if (pred.matchWinnerRaw === "BOXER_B") return "text-yellow-300"
  if (pred.matchWinnerRaw === "DRAW") return "text-sky-300"
  return "text-foreground"
}

function getDisplayStatus(pred: PredictionHistoryUI): "pending" | "correct" | "incorrect" {
  if (!pred.matchWinnerRaw) return "pending"

  return pred.predictedWinnerRaw === pred.matchWinnerRaw
      ? "correct"
      : "incorrect"
}

function getStatusBadgeClass(pred: PredictionHistoryUI): string {
  const status = getDisplayStatus(pred)

  if (status === "correct") {
    return "bg-green-500/10 text-green-400 border border-green-500/20"
  }

  if (status === "incorrect") {
    return "bg-destructive/10 text-destructive border border-destructive/20"
  }

  return "bg-muted text-foreground border border-border"
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
  const [selectedWeightClassId, setSelectedWeightClassId] = useState<string>("all")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editMatchWinner, setEditMatchWinner] = useState<MatchWinnerToken>("")
  const [editMatchWinMethod, setEditMatchWinMethod] =
      useState<MatchWinMethodToken>("")
  const [savingUpdate, setSavingUpdate] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function fetchAll(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [historyData, weightClassData] = await Promise.all([
        fetchPredictionHistories(),
        fetchWeightClasses(),
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

  const weightClassOptions = useMemo(() => {
    return Object.entries(weightClassMap)
        .map(([id, name]) => ({
          id,
          name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
  }, [weightClassMap])

  useEffect(() => {
    void fetchAll()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    const weightFiltered =
        selectedWeightClassId === "all"
            ? [...predictions]
            : predictions.filter(
                (p) => String(p.weightClassId) === selectedWeightClassId
            )

    const searched = q
        ? weightFiltered.filter(
            (p) =>
                p.boxerAName.toLowerCase().includes(q) ||
                p.boxerBName.toLowerCase().includes(q) ||
                p.predictedWinnerLabel.toLowerCase().includes(q) ||
                (p.matchWinnerLabel ?? "").toLowerCase().includes(q) ||
                getActualWinnerLabel(p).toLowerCase().includes(q) ||
                getDisplayStatus(p).toLowerCase().includes(q)
        )
        : weightFiltered

    searched.sort((a, b) => {
      let cmp = 0

      if (sortField === "predictionDate") {
        cmp =
            (a.predictionDate?.getTime() ?? 0) -
            (b.predictionDate?.getTime() ?? 0)
      } else if (sortField === "probabilityA") {
        cmp = a.probabilityA - b.probabilityA
      } else if (sortField === "probabilityB") {
        cmp = a.probabilityB - b.probabilityB
      }

      return sortDir === "desc" ? -cmp : cmp
    })

    return searched
  }, [predictions, search, selectedWeightClassId, sortField, sortDir])

  const stats = useMemo(() => {
    const total = predictions.length

    const correct = predictions.filter(
        (p) => getDisplayStatus(p) === "correct"
    ).length

    const incorrect = predictions.filter(
        (p) => getDisplayStatus(p) === "incorrect"
    ).length


    const resolved = correct + incorrect

    const accuracyRate = resolved === 0 ? 0 : (correct / resolved) * 100

    return { total, correct, incorrect, accuracyRate }
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

      const updated = await updatePredictionHistory(pred.id, payload)

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

      appToast.success("Prediction actual result updated successfully.")
    } catch (err) {
      console.error(err)
      appToast.error("Failed to update prediction history.")
    } finally {
      setSavingUpdate(false)
    }
  }

  const deletePrediction = async (pred: PredictionHistoryUI) => {
    if (!loggedIn) return

    try {
      setDeletingId(pred.id)
      setError(null)

      await deletePredictionHistory(pred.id)

      setPredictions((prev) => prev.filter((p) => p.id !== pred.id))

      if (expandedId === pred.id) {
        setExpandedId(null)
      }

      if (editingId === pred.id) {
        cancelEditing()
      }

      appToast.success("Prediction deleted successfully.")
    } catch (err) {
      console.error(err)
      appToast.error("Failed to delete prediction history.")
    } finally {
      setDeletingId(null)
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

        <div className="grid gap-4 sm:grid-cols-4">
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
              Accuracy Rate
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {loading ? "—" : `${stats.accuracyRate.toFixed(1)}%`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <select
              value={selectedWeightClassId}
              onChange={(e) => setSelectedWeightClassId(e.target.value)}
              className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring lg:w-56"
          >
            <option value="all">All Weight Classes</option>

            {weightClassOptions.map((wc) => (
                <option key={wc.id} value={wc.id}>
                  {wc.name}
                </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search by fighter, prediction, result, or status..."
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
              className="lg:w-auto"
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
                      Weight Class
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
                      Actual Winner
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>

                    {loggedIn && (
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Actions
                        </th>
                    )}
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                  {filtered.map((pred) => (
                      <PredictionHistoryRow
                          key={pred.id}
                          pred={pred}
                          isExpanded={expandedId === pred.id}
                          loggedIn={loggedIn}
                          editingId={editingId}
                          editMatchWinner={editMatchWinner}
                          editMatchWinMethod={editMatchWinMethod}
                          savingUpdate={savingUpdate}
                          deletingId={deletingId}
                          onToggleExpand={(id) =>
                              setExpandedId(expandedId === id ? null : id)
                          }
                          getPredictedWinnerTextClass={getPredictedWinnerTextClass}
                          getActualWinnerLabel={getActualWinnerLabel}
                          getActualWinnerTextClass={getActualWinnerTextClass}
                          getDisplayStatus={getDisplayStatus}
                          getStatusBadgeClass={getStatusBadgeClass}
                          getAllowedMethods={getAllowedMethods}
                          isValidWinnerMethodCombo={isValidWinnerMethodCombo}
                          startEditing={startEditing}
                          setEditMatchWinner={setEditMatchWinner}
                          setEditMatchWinMethod={setEditMatchWinMethod}
                          saveUpdate={saveUpdate}
                          cancelEditing={cancelEditing}
                          deletePrediction={deletePrediction}
                      />
                  ))}
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