// "use client"

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { RadarAttributeChart } from "@/components/radar-attribute-chart"
// import {
//   type Boxer,
//   type BoxerAttributes,
//   attributeLabels,
//   attributeCategories,
//   calculateScore,
// } from "@/lib/mock-data"

// interface BoxerProfileModalProps {
//   boxer: Boxer | null
//   open: boolean
//   onClose: () => void
// }

// export function BoxerProfileModal({
//   boxer,
//   open,
//   onClose,
// }: BoxerProfileModalProps) {
//   if (!boxer) return null

//   const score = calculateScore(boxer.attributes)

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
//       <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card text-foreground">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3">
//             <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
//               {boxer.name.charAt(0)}
//             </div>
//             <div>
//               <span className="font-display text-lg text-foreground">
//                 {boxer.name}
//               </span>
//               <p className="text-xs font-normal text-muted-foreground">
//                 {boxer.nickname} &middot; {boxer.weight} &middot;{" "}
//                 {boxer.nationality}
//               </p>
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 pt-2">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-3 gap-3">
//             <div className="rounded-lg bg-secondary p-3 text-center">
//               <p className="text-[10px] uppercase text-muted-foreground">
//                 Record
//               </p>
//               <p className="mt-1 font-display text-sm font-bold text-foreground">
//                 {boxer.record}
//               </p>
//             </div>
//             <div className="rounded-lg bg-primary/5 p-3 text-center">
//               <p className="text-[10px] uppercase text-muted-foreground">
//                 Overall Score
//               </p>
//               <p className="mt-1 font-display text-xl font-bold text-primary">
//                 {score}
//               </p>
//             </div>
//             <div className="rounded-lg bg-secondary p-3 text-center">
//               <p className="text-[10px] uppercase text-muted-foreground">
//                 Weight Class
//               </p>
//               <p className="mt-1 font-display text-sm font-bold text-foreground">
//                 {boxer.weight}
//               </p>
//             </div>
//           </div>

//           {/* Radar Chart */}
//           <div>
//             <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               Attribute Profile vs Perfect Boxer
//             </h4>
//             <div className="h-72">
//               <RadarAttributeChart
//                 attributes={boxer.attributes}
//                 showPerfect
//               />
//             </div>
//           </div>

//           {/* Attribute Breakdown by Category */}
//           <div>
//             <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               Attribute Breakdown
//             </h4>
//             <div className="space-y-4">
//               {attributeCategories.map((category) => (
//                 <div key={category.key}>
//                   <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
//                     {category.label}
//                   </p>
//                   <div className="grid grid-cols-2 gap-2">
//                     {category.attributes.map((key) => (
//                       <div
//                         key={key}
//                         className="flex items-center justify-between rounded-md bg-secondary px-3 py-2"
//                       >
//                         <span className="text-xs text-muted-foreground">
//                           {attributeLabels[key]}
//                         </span>
//                         <div className="flex items-center gap-2">
//                           <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background">
//                             <div
//                               className="h-full rounded-full bg-primary"
//                               style={{
//                                 width: `${boxer.attributes[key] * 10}%`,
//                               }}
//                             />
//                           </div>
//                           <span className="w-5 text-right font-display text-xs font-bold text-foreground">
//                             {boxer.attributes[key]}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Historical Performance Placeholder */}
//           <div className="rounded-lg border border-dashed border-border p-6 text-center">
//             <p className="text-xs text-muted-foreground">
//               Historical performance data will be available when connected to
//               the backend API.
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

// ============================================================
// components/boxer-profile-modal.tsx
//
// Updated to use the Supabase Boxer type from mock-data.ts
// All attribute references now match ranked_boxer column names
// ============================================================

import { X } from "lucide-react"
import type { Boxer } from "@/lib/mock-data"

interface BoxerProfileModalProps {
  boxer: Boxer | null
  open: boolean
  onClose: () => void
}

// Groups of attributes to display in the modal
const attributeGroups = [
  {
    label: "Physical",
    attrs: [
      { key: "height_cm", label: "Height (cm)" },
      { key: "reach_cm", label: "Reach (cm)" },
    ],
  },
  {
    label: "Offensive Skills",
    attrs: [
      { key: "hand_speed", label: "Hand Speed" },
      { key: "punch_accuracy", label: "Punch Accuracy" },
      { key: "punch_variety", label: "Punch Variety" },
      { key: "combination_efficiency", label: "Combination Efficiency" },
      { key: "strength", label: "Strength" },
    ],
  },
  {
    label: "Defensive Skills",
    attrs: [
      { key: "defensive_guard_efficiency", label: "Guard Efficiency" },
      { key: "head_movement", label: "Head Movement" },
      { key: "counterpunching_ability", label: "Counterpunching" },
    ],
  },
  {
    label: "Movement & Footwork",
    attrs: [
      { key: "foot_speed", label: "Foot Speed" },
      { key: "footwork_technique", label: "Footwork Technique" },
      { key: "distance_control", label: "Distance Control" },
    ],
  },
  {
    label: "Tactical & Mental",
    attrs: [
      { key: "ring_iq", label: "Ring IQ" },
      { key: "adaptability_mid_fight", label: "Adaptability" },
      { key: "tempo_control", label: "Tempo Control" },
      { key: "opponent_pattern_recognition", label: "Pattern Recognition" },
      { key: "fight_planning_discipline", label: "Fight Planning" },
      { key: "composure_under_pressure", label: "Composure" },
      { key: "mental_toughness", label: "Mental Toughness" },
      { key: "focus_consistency", label: "Focus Consistency" },
      { key: "resilience_after_knockdown", label: "Resilience" },
    ],
  },
  {
    label: "Record",
    attrs: [
      { key: "win_ratio", label: "Win Ratio", isPercent: true },
      { key: "knockout_ratio", label: "KO Ratio", isPercent: true },
      { key: "title_fight_experience", label: "Title Fight Exp." },
      { key: "strength_of_opposition", label: "Opposition Strength" },
      { key: "performance_consistency", label: "Consistency" },
    ],
  },
]

// Render a single stat bar (value 0–10 scale, or 0–1 for ratios)
function StatBar({
  label,
  value,
  isPercent,
}: {
  label: string
  value: number
  isPercent?: boolean
}) {
  // Normalise to 0–10 for the bar width
  const normalised = isPercent ? value * 10 : value
  const display = isPercent
    ? `${(value * 100).toFixed(1)}%`
    : value.toFixed(1)

  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-1 items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(normalised / 10) * 100}%` }}
          />
        </div>
        <span className="w-10 text-right font-display text-xs font-bold text-primary">
          {display}
        </span>
      </div>
    </div>
  )
}

export function BoxerProfileModal({ boxer, open, onClose }: BoxerProfileModalProps) {
  if (!open || !boxer) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-display text-xl font-bold text-primary">
              {boxer.boxer_name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                {boxer.boxer_name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Rank #{boxer.ranking_position} &middot; Weight Class ID {boxer.weight_class_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Source note */}
          {boxer.source_note && (
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <p className="text-xs italic text-muted-foreground">{boxer.source_note}</p>
            </div>
          )}

          {/* Attribute groups */}
          {attributeGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.attrs.map(({ key, label, isPercent }) => {
                  const raw = boxer[key as keyof Boxer]
                  const value = typeof raw === "number" ? raw : 0
                  return (
                    <StatBar
                      key={key}
                      label={label}
                      value={value}
                      isPercent={isPercent}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

