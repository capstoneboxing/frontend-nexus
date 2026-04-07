"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { RefreshCcw, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { allTimeRankedBoxersApi, weightClassesApi } from "@/lib/api-client"
import { isLoggedIn } from "@/lib/auth"
import {
  mapAllTimeRankedBoxerToFormValues,
  mapAllTimeRankedBoxerToUI,
} from "@/lib/all-time-ranked-boxer-mappers"
import type {
  AllTimeRankedBoxerFormValues,
  AllTimeRankedBoxerUI,
} from "@/lib/all-time-ranked-boxer-types"
import { AllTimeRankedBoxerEditor } from "@/components/all-time-ranked-boxer-editor"

type WeightClass = {
  weightClassId?: number
  className?: string
}

export default function BoxersPage() {
  const ready = useAuthGuard()
  const canEdit = isLoggedIn()

  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([])
  const [weightClassMap, setWeightClassMap] = useState<Record<number, string>>({})

  const [allBoxers, setAllBoxers] = useState<AllTimeRankedBoxerUI[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedWc, setSelectedWc] = useState<string>("all")
  const [search, setSearch] = useState("")

  const [selectedBoxer, setSelectedBoxer] = useState<AllTimeRankedBoxerUI | null>(null)
  const [editorValues, setEditorValues] = useState<AllTimeRankedBoxerFormValues | null>(null)

  const sortBoxers = useCallback((boxers: AllTimeRankedBoxerUI[]) => {
    return [...boxers].sort((a, b) => {
      const weightClassDiff =
          (a.weightClassId ?? Number.MAX_SAFE_INTEGER) -
          (b.weightClassId ?? Number.MAX_SAFE_INTEGER)

      if (weightClassDiff !== 0) return weightClassDiff

      const rankDiff = (a.rankingPosition ?? 999) - (b.rankingPosition ?? 999)
      if (rankDiff !== 0) return rankDiff

      return a.boxerName.localeCompare(b.boxerName)
    })
  }, [])

  const loadPageData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const [weightClassData, boxerData] = await Promise.all([
        weightClassesApi.getWeightClasses(),
        allTimeRankedBoxersApi.getAllActive(),
      ])

      setWeightClasses(weightClassData)

      const map = Object.fromEntries(
          weightClassData
              .filter((wc) => wc.weightClassId != null)
              .map((wc) => [wc.weightClassId as number, wc.className ?? "Unknown"])
      )
      setWeightClassMap(map)

      const mappedBoxers = sortBoxers(
          boxerData.map((boxer) =>
              mapAllTimeRankedBoxerToUI(
                  boxer,
                  boxer.weightClassId != null
                      ? map[boxer.weightClassId] ?? "Unknown"
                      : "Unknown"
              )
          )
      )

      setAllBoxers(mappedBoxers)
    } catch (err) {
      console.error(err)
      setError("Failed to load active ranked boxers.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [sortBoxers])

  useEffect(() => {
    if (!ready) return
    void loadPageData()
  }, [ready, loadPageData])

  const boxers = useMemo(() => {
    if (selectedWc === "all") {
      return allBoxers
    }

    const weightClassId = Number(selectedWc)
    return allBoxers.filter((boxer) => boxer.weightClassId === weightClassId)
  }, [allBoxers, selectedWc])

  const filtered = useMemo(() => {
    if (!search.trim()) return boxers

    return boxers.filter((b) =>
        b.boxerName.toLowerCase().includes(search.toLowerCase())
    )
  }, [boxers, search])

  function openEditor(boxer: AllTimeRankedBoxerUI) {
    setSelectedBoxer(boxer)
    setEditorValues(mapAllTimeRankedBoxerToFormValues(boxer))
  }

  function closeEditor() {
    setSelectedBoxer(null)
    setEditorValues(null)
  }

  function handleSaved(updated: AllTimeRankedBoxerUI) {
    setAllBoxers((prev) =>
        sortBoxers(
            prev.map((b) => (b.rankedBoxerId === updated.rankedBoxerId ? updated : b))
        )
    )

    setSelectedBoxer(updated)
    setEditorValues(mapAllTimeRankedBoxerToFormValues(updated))
  }

  if (!ready) return null

  return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Top All Time Ranked Boxers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse to app time ranked boxer profiles, compare and edit attributes.
          </p>
        </div>

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

          <Select value={selectedWc} onValueChange={setSelectedWc}>
            <SelectTrigger className="w-full border-border bg-card text-foreground sm:w-56">
              <SelectValue placeholder="Select weight class" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              <SelectItem value="all">All</SelectItem>
              {weightClasses.map((wc) => (
                  <SelectItem
                      key={wc.weightClassId}
                      value={String(wc.weightClassId)}
                  >
                    {wc.className}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
              type="button"
              variant="outline"
              onClick={() => void loadPageData(true)}
              disabled={loading || refreshing}
              className="border-border bg-card text-foreground"
          >
            <RefreshCcw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading && (
            <div className="flex justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading fighters...</p>
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
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Fighter
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Win %
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                      KO %
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                      Generated
                    </th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                  {filtered.map((boxer) => (
                      <tr
                          key={boxer.rankedBoxerId}
                          onClick={() => openEditor(boxer)}
                          className="cursor-pointer transition-colors hover:bg-secondary/30"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              openEditor(boxer)
                            }
                          }}
                      >
                        <td className="px-5 py-3.5">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                        {boxer.rankingPosition ?? "—"}
                      </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                              {boxer.boxerName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {boxer.boxerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {boxer.weightClassName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="hidden px-5 py-3.5 text-sm text-muted-foreground sm:table-cell">
                          {(boxer.winRatio * 100).toFixed(0)}%
                        </td>

                        <td className="hidden px-5 py-3.5 text-sm text-muted-foreground md:table-cell">
                          {(boxer.knockoutRatio * 100).toFixed(0)}%
                        </td>

                        <td className="hidden px-5 py-3.5 text-sm text-muted-foreground lg:table-cell">
                          {boxer.generatedAtLabel} at {boxer.generatedTimeLabel}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No fighters found.
                    </p>
                  </div>
              )}
            </div>
        )}

        {selectedBoxer && editorValues && (
            <AllTimeRankedBoxerEditor
                boxer={selectedBoxer}
                values={editorValues}
                onValuesChange={setEditorValues}
                onClose={closeEditor}
                onSaved={handleSaved}
                canEdit={canEdit}
                weightClassName={
                  selectedBoxer.weightClassId != null
                      ? weightClassMap[selectedBoxer.weightClassId] ?? selectedBoxer.weightClassName
                      : selectedBoxer.weightClassName
                }
            />
        )}
      </div>
  )
}