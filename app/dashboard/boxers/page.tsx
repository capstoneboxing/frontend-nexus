
"use client"

import { useState, useMemo, useEffect } from "react"
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
import { supabase } from "@/lib/supabaseClient"

// ============================================================
// TYPE — matches your ranked_boxer table columns
// ============================================================
export type Boxer = {
  ranked_boxer_id: number
  boxer_name: string
  ranking_position: number
  weight_class_id: number
  height_cm: number
  reach_cm: number
  hand_speed: number
  foot_speed: number
  strength: number
  endurance: number
  reaction_time: number
  punch_accuracy: number
  punch_variety: number
  defensive_guard_efficiency: number
  head_movement: number
  footwork_technique: number
  counterpunching_ability: number
  combination_efficiency: number
  ring_iq: number
  adaptability_mid_fight: number
  distance_control: number
  tempo_control: number
  opponent_pattern_recognition: number
  fight_planning_discipline: number
  composure_under_pressure: number
  aggression_control: number
  mental_toughness: number
  focus_consistency: number
  resilience_after_knockdown: number
  win_ratio: number
  knockout_ratio: number
  title_fight_experience: number
  strength_of_opposition: number
  performance_consistency: number
  source_note: string
}

// ============================================================
// HELPER — calculate overall score from attributes (avg of key skills)
// ============================================================
function calculateScore(boxer: Boxer): string {
  const attrs = [
    boxer.hand_speed,
    boxer.foot_speed,
    boxer.strength,
    boxer.endurance,
    boxer.reaction_time,
    boxer.punch_accuracy,
    boxer.punch_variety,
    boxer.defensive_guard_efficiency,
    boxer.head_movement,
    boxer.footwork_technique,
    boxer.counterpunching_ability,
    boxer.combination_efficiency,
    boxer.ring_iq,
    boxer.adaptability_mid_fight,
    boxer.distance_control,
    boxer.tempo_control,
    boxer.opponent_pattern_recognition,
    boxer.fight_planning_discipline,
    boxer.composure_under_pressure,
    boxer.mental_toughness,
  ]
  const avg = attrs.reduce((a, b) => a + b, 0) / attrs.length
  return avg.toFixed(1)
}

// ============================================================
// PAGE
// ============================================================
export default function BoxersPage() {
  const [boxers, setBoxers] = useState<Boxer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedBoxer, setSelectedBoxer] = useState<Boxer | null>(null)

  // ----------------------------------------------------------
  // Fetch ranked_boxer from Supabase on mount
  // ----------------------------------------------------------
  useEffect(() => {
    async function fetchBoxers() {
      const { data, error } = await supabase
        .from("all_time_ranked_boxer") //table sets 
        .select("*")
        .order("ranking_position", { ascending: true })

      if (error) {
        console.error("❌ Supabase error:", error)
        setError("Failed to load boxer data.")
      } else {
        setBoxers(data as Boxer[])
      }
      setLoading(false)
    }

    fetchBoxers()
  }, [])

  // ----------------------------------------------------------
  // Filter by search
  // ----------------------------------------------------------
  const filteredBoxers = useMemo(() => {
    if (!search) return boxers
    const q = search.toLowerCase()
    return boxers.filter((b) => b.boxer_name.toLowerCase().includes(q))
  }, [boxers, search])

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Boxer Database
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse fighter profiles, compare attributes, and analyze performance data.
        </p>
      </div>

      {/* Search */}
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
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading fighters from database...</p>
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
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBoxers.map((boxer) => {
                  const score = calculateScore(boxer)
                  return (
                    <tr
                      key={boxer.ranked_boxer_id}
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
                    >
                      {/* Rank */}
                      <td className="px-5 py-3.5">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                          {boxer.ranking_position}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                            {boxer.boxer_name.charAt(0)}
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {boxer.boxer_name}
                          </p>
                        </div>
                      </td>

                      {/* Win ratio */}
                      <td className="hidden px-5 py-3.5 text-sm text-muted-foreground sm:table-cell">
                        {(boxer.win_ratio * 100).toFixed(1)}%
                      </td>

                      {/* KO ratio */}
                      <td className="hidden px-5 py-3.5 text-sm text-muted-foreground md:table-cell">
                        {(boxer.knockout_ratio * 100).toFixed(1)}%
                      </td>

                      {/* Score */}
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
                No fighters found matching your search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Modal — passes the selected boxer through */}
      {selectedBoxer && (
        <BoxerProfileModal
          boxer={selectedBoxer}
          open={!!selectedBoxer}
          onClose={() => setSelectedBoxer(null)}
        />
      )}
    </div>
  )
}
