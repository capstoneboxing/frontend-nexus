"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BoxerProfileModal } from "@/components/boxer-profile-modal"
import { mockBoxers, calculateScore, type Boxer } from "@/lib/mock-data"

export default function BoxersPage() {
  const [search, setSearch] = useState("")
  const [weightFilter, setWeightFilter] = useState("all")
  const [selectedBoxer, setSelectedBoxer] = useState<Boxer | null>(null)

  const weightClasses = useMemo(
    () => [...new Set(mockBoxers.map((b) => b.weight))],
    []
  )

  const filteredBoxers = useMemo(() => {
    return mockBoxers.filter((boxer) => {
      const matchesSearch =
        boxer.name.toLowerCase().includes(search.toLowerCase()) ||
        boxer.nickname.toLowerCase().includes(search.toLowerCase())
      const matchesWeight =
        weightFilter === "all" || boxer.weight === weightFilter
      return matchesSearch && matchesWeight
    })
  }, [search, weightFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Boxer Database
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse fighter profiles, compare attributes, and analyze performance
          data. WHY
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search fighters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Select value={weightFilter} onValueChange={setWeightFilter}>
          <SelectTrigger className="w-full border-border bg-card text-foreground sm:w-48">
            <SlidersHorizontal className="mr-2 size-3.5 text-muted-foreground" />
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
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Fighter
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Record
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Weight Class
                </th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Nationality
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBoxers.map((boxer) => {
                const score = calculateScore(boxer.attributes)
                return (
                  <tr
                    key={boxer.id}
                    onClick={() => setSelectedBoxer(boxer)}
                    className="cursor-pointer transition-colors hover:bg-secondary/30"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedBoxer(boxer)
                      }
                    }}
                    aria-label={`View profile for ${boxer.name}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                          {boxer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {boxer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            &quot;{boxer.nickname}&quot;
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-muted-foreground sm:table-cell">
                      {boxer.record}
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {boxer.weight}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-muted-foreground lg:table-cell">
                      {boxer.nationality}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-display text-sm font-bold text-primary">
                        {score}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredBoxers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No fighters found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <BoxerProfileModal
        boxer={selectedBoxer}
        open={!!selectedBoxer}
        onClose={() => setSelectedBoxer(null)}
      />
    </div>
  )
}
