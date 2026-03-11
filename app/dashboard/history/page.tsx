"use client"

import { useState, useMemo } from "react"
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
import { predictionHistory, type PredictionRecord } from "@/lib/mock-data"

type SortField = "date" | "winProbability" | "boxerAScore"
type SortDir = "asc" | "desc"

const statusColors: Record<
  PredictionRecord["status"],
  { bg: string; text: string; label: string }
> = {
  correct: {
    bg: "bg-primary/10",
    text: "text-primary",
    label: "Correct",
  },
  incorrect: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Incorrect",
  },
  draw: {
    bg: "bg-accent/10",
    text: "text-accent",
    label: "Draw",
  },
  pending: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Pending",
  },
}

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [weightFilter, setWeightFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const weightClasses = useMemo(
    () => [...new Set(predictionHistory.map((p) => p.weightClass))],
    []
  )

  const filtered = useMemo(() => {
    let data = [...predictionHistory]

    // Search
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (p) =>
          p.boxerA.toLowerCase().includes(q) ||
          p.boxerB.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter)
    }

    // Weight filter
    if (weightFilter !== "all") {
      data = data.filter((p) => p.weightClass === weightFilter)
    }

    // Sort
    data.sort((a, b) => {
      let cmp = 0
      if (sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === "winProbability") {
        cmp = a.winProbability - b.winProbability
      } else if (sortField === "boxerAScore") {
        cmp =
          Math.abs(a.boxerAScore - a.boxerBScore) -
          Math.abs(b.boxerAScore - b.boxerBScore)
      }
      return sortDir === "desc" ? -cmp : cmp
    })

    return data
  }, [search, statusFilter, weightFilter, sortField, sortDir])

  const stats = useMemo(() => {
    const total = predictionHistory.length
    const correct = predictionHistory.filter(
      (p) => p.status === "correct"
    ).length
    const incorrect = predictionHistory.filter(
      (p) => p.status === "incorrect"
    ).length
    const draws = predictionHistory.filter((p) => p.status === "draw").length
    return { total, correct, incorrect, draws, accuracy: total > 0 ? ((correct / (total - draws)) * 100).toFixed(1) : "0" }
  }, [])

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Prediction History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all past predictions, filter by outcome, and review detailed
          fight breakdowns.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Predictions
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Correct
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-primary">
            {stats.correct}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Incorrect
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-destructive">
            {stats.incorrect}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Accuracy Rate
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {stats.accuracy}%
          </p>
        </div>
      </div>

      {/* Filters */}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-border bg-card text-foreground sm:w-40">
            <Filter className="mr-2 size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-foreground">
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="correct">Correct</SelectItem>
            <SelectItem value="incorrect">Incorrect</SelectItem>
            <SelectItem value="draw">Draw</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={weightFilter} onValueChange={setWeightFilter}>
          <SelectTrigger className="w-full border-border bg-card text-foreground sm:w-48">
            <SelectValue placeholder="Weight Class" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-foreground">
            <SelectItem value="all">All Weight Classes</SelectItem>
            {weightClasses.map((wc) => (
              <SelectItem key={wc} value={wc}>
                {wc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th
                  onClick={() => toggleSort("date")}
                  className="cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-1">
                    Date <SortIcon field="date" />
                  </span>
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Matchup
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Class
                </th>
                <th
                  onClick={() => toggleSort("winProbability")}
                  className="hidden cursor-pointer px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground sm:table-cell"
                >
                  <span className="flex items-center gap-1">
                    Confidence <SortIcon field="winProbability" />
                  </span>
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Predicted
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Actual
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((pred) => {
                const st = statusColors[pred.status]
                const isExpanded = expandedId === pred.id
                return (
                  <tr
                    key={pred.id}
                    className="cursor-pointer transition-colors hover:bg-secondary/30"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : pred.id)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setExpandedId(isExpanded ? null : pred.id)
                      }
                    }}
                    aria-label={`View prediction details: ${pred.boxerA} vs ${pred.boxerB}`}
                  >
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3 shrink-0" />
                        {pred.date}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                          <Swords className="size-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {pred.boxerA.split(" ").pop()}
                            <span className="text-muted-foreground">
                              {" "}
                              vs{" "}
                            </span>
                            {pred.boxerB.split(" ").pop()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {pred.weightClass}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 sm:table-cell">
                      <span className="font-display text-sm font-bold text-foreground">
                        {pred.winProbability}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                      {pred.predictedWinner.split(" ").pop()}
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-muted-foreground lg:table-cell">
                      {pred.actualWinner
                        ? pred.actualWinner === "Draw"
                          ? "Draw"
                          : pred.actualWinner.split(" ").pop()
                        : "--"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Badge
                        variant="secondary"
                        className={`${st.bg} ${st.text} border-0`}
                      >
                        {st.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded Detail Row */}
        {expandedId && (
          <div className="border-t border-border bg-secondary/30 px-5 py-4">
            {(() => {
              const pred = predictionHistory.find(
                (p) => p.id === expandedId
              )
              if (!pred) return null
              const st = statusColors[pred.status]
              return (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Fighter A
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {pred.boxerA}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {pred.boxerAScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Fighter B
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {pred.boxerB}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {pred.boxerBScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Result Details
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {pred.method || "--"}{" "}
                      {pred.round ? `(R${pred.round})` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Draw Prob: {pred.drawProbability}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Outcome
                    </p>
                    <Badge
                      variant="secondary"
                      className={`mt-0.5 ${st.bg} ${st.text} border-0`}
                    >
                      {st.label}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Winner: {pred.actualWinner || "TBD"}
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No predictions found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
