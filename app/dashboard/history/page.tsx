
"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Search,
  Swords,
  Trophy,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import type { PredictionRecord } from "@/lib/mock-data"

// ============================================================
// SORT TYPES
// ============================================================
type SortField = "prediction_date" | "probability_a"
type SortDir = "asc" | "desc"

const statusColors = {
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" },
  correct: { bg: "bg-primary/10", text: "text-primary", label: "Correct" },
  incorrect: { bg: "bg-destructive/10", text: "text-destructive", label: "Incorrect" },
  draw: { bg: "bg-accent/10", text: "text-accent", label: "Draw" },
}

// ============================================================
// PAGE
// ============================================================
export default function HistoryPage() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("prediction_date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // ----------------------------------------------------------
  // Fetch fight_predictions from Supabase on mount
  // ----------------------------------------------------------
  useEffect(() => {
    async function fetchPredictions() {
      const { data, error } = await supabase
        .from("prediction_history")
        .select("*")
        .order("prediction_date", { ascending: false })

      if (error) {
        console.error("❌ Supabase error:", error)
        setError("Failed to load prediction history.")
      } else {
        setPredictions(data as PredictionRecord[])
      }
      setLoading(false)
    }

    fetchPredictions()
  }, [])

  // ----------------------------------------------------------
  // Filter + sort
  // ----------------------------------------------------------
  const filtered = useMemo(() => {
    let data = [...predictions]

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (p) =>
          p.boxer_a_name.toLowerCase().includes(q) ||
          p.boxer_b_name.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      let cmp = 0
      if (sortField === "prediction_date") {
        cmp = new Date(a.prediction_date).getTime() - new Date(b.prediction_date).getTime()
      } else if (sortField === "probability_a") {
        cmp = a.probability_a - b.probability_a
      }
      return sortDir === "desc" ? -cmp : cmp
    })

    return data
  }, [predictions, search, sortField, sortDir])

  // ----------------------------------------------------------
  // Summary stats
  // ----------------------------------------------------------
  const stats = useMemo(() => {
    const total = predictions.length
    // probability_a > 0.5 means boxer A was the predicted favourite
    const highConfidence = predictions.filter((p) => p.probability_a > 0.5).length
    return { total, highConfidence }
  }, [predictions])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
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

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Prediction History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all past predictions and review detailed fight breakdowns.
        </p>
      </div>

      {/* Summary Stats */}
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
            {/* Boxer A Favoured */}
            Correct
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-primary">
            {loading ? "—" : stats.highConfidence}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {/* Boxer B Favoured */}
            Incorrect
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {loading ? "—" : stats.total - stats.highConfidence}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {/* Boxer B Favoured */}
            Draw
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {loading ? "—" : stats.total - stats.highConfidence}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {/* Boxer B Favoured */}
           Accuarcy Rate
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {loading ? "—" : stats.total - stats.highConfidence}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by fighter name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading predictions...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th
                    onClick={() => toggleSort("prediction_date")}
                    className="cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex items-center gap-1">
                      Date <SortIcon field="prediction_date" />
                    </span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Matchup
                  </th>
                  <th
                    onClick={() => toggleSort("probability_a")}
                    className="hidden cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground sm:table-cell"
                  >
                    <span className="flex items-center gap-1">
                      Probability A <SortIcon field="probability_a" />
                    </span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Decision
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((pred) => {
                  const isExpanded = expandedId === pred.prediction_id
                  return (
                    <tr
                      key={pred.prediction_id}
                      className="cursor-pointer transition-colors hover:bg-secondary/30"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : pred.prediction_id)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setExpandedId(isExpanded ? null : pred.prediction_id)
                        }
                      }}
                    >
                      {/* Date */}
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3 shrink-0" />
                          {new Date(pred.prediction_date).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Matchup */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                            <Swords className="size-3 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {pred.boxer_a_name}
                            <span className="text-muted-foreground"> vs </span><br />
                            {pred.boxer_b_name}
                          </p>
                        </div>
                      </td>

                      {/* Probability A */}
                      <td className="hidden px-5 py-3.5 sm:table-cell">
                        <span className="font-display text-sm font-bold text-foreground">
                          {(pred.probability_a * 100).toFixed(0)}%
                        </span>
                      </td>

                      {/* Decision */}
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {pred.match_decision}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Expanded detail row */}
          {expandedId !== null && (() => {
            const pred = predictions.find((p) => p.prediction_id === expandedId)
            if (!pred) return null

            let breakdown: Record<string, { A: number; B: number }> = {}
            try {
              breakdown = JSON.parse(pred.breakdown_snapshot)
            } catch {
              // ignore parse errors
            }

            return (
              <div className="border-t border-border bg-secondary/30 px-5 py-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fighter A</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{pred.boxer_a_name}</p>
                    <p className="text-xs text-muted-foreground">Win prob: {(pred.probability_a * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fighter B</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{pred.boxer_b_name}</p>
                    <p className="text-xs text-muted-foreground">Win prob: {(pred.probability_b * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Decision</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{pred.match_decision}</p>
                  </div>
                  {Object.keys(breakdown).length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Breakdown</p>
                      <div className="mt-1 space-y-1">
                        {Object.entries(breakdown).map(([key, val]) => (
                          <p key={key} className="text-xs text-muted-foreground">
                            {key}: A={val.A} / B={val.B}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No predictions found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
