// "use client"

// import {
//   Activity,
//   BarChart3,
//   Brain,
//   Calculator,
//   Crown,
//   Scale,
//   Sigma,
//   Target,
//   TrendingUp,
// } from "lucide-react"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { RadarAttributeChart } from "@/components/radar-attribute-chart"
// import { attributeWeights, attributeLabels } from "@/lib/mock-data"
// import type { BoxerAttributes } from "@/lib/mock-data"

// export default function ModelPage() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="font-display text-2xl font-bold text-foreground">
//           Model Explanation
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Understand the theoretical concepts, methodology, and calculations
//           behind the prediction system.
//         </p>
//       </div>

//       {/* Accordion Sections */}
//       <Accordion type="multiple" defaultValue={["perfect-boxer"]} className="space-y-3">
//         {/* Section 1: Perfect Boxer */}
//         <AccordionItem
//           value="perfect-boxer"
//           className="rounded-xl border border-border bg-card px-5"
//         >
//           <AccordionTrigger className="py-4 text-foreground hover:no-underline [&[data-state=open]>div>.icon]:text-primary">
//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-primary/10 p-2">
//                 <Crown className="icon size-4 text-muted-foreground transition-colors" />
//               </div>
//               <div className="text-left">
//                 <p className="text-sm font-semibold">
//                   The Perfect Boxer Model
//                 </p>
//                 <p className="text-xs font-normal text-muted-foreground">
//                   Theoretical upper bound for fighter evaluation
//                 </p>
//               </div>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="pb-5">
//             <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
//               <p>
//                 The Perfect Boxer represents a theoretical fighter who scores a
//                 perfect 10 out of 10 across all 20 measured performance
//                 attributes spanning 5 categories. This model serves as the absolute benchmark — no
//                 real fighter can match it, but every fighter is evaluated
//                 relative to it.
//               </p>
//               <p>
//                 By establishing this upper bound, we create a consistent and
//                 comparable scale for rating fighters across different weight
//                 classes, eras, and fighting styles.
//               </p>
//               <div className="h-72 rounded-lg border border-border bg-secondary/30 p-4">
//                 <RadarAttributeChart
//                   attributes={perfectBoxer}
//                   showPerfect={false}
//                 />
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 The radar chart above shows the Perfect Boxer&apos;s attribute
//                 profile — a fully filled polygon representing maximum scores
//                 in every dimension.
//               </p>
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* Section 2: Attribute Weighting */}
//         <AccordionItem
//           value="attribute-weighting"
//           className="rounded-xl border border-border bg-card px-5"
//         >
//           <AccordionTrigger className="py-4 text-foreground hover:no-underline">
//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-accent/10 p-2">
//                 <Scale className="size-4 text-muted-foreground" />
//               </div>
//               <div className="text-left">
//                 <p className="text-sm font-semibold">
//                   Attribute Weighting System
//                 </p>
//                 <p className="text-xs font-normal text-muted-foreground">
//                   How each attribute impacts the overall score
//                 </p>
//               </div>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="pb-5">
//             <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
//               <p>
//                 Not all boxing attributes are created equal. Through analysis
//                 of historical fight data and expert consultation, each
//                 attribute is assigned a weight representing its relative
//                 importance in determining fight outcomes.
//               </p>
//               <div className="grid gap-2 sm:grid-cols-2">
//                 {(
//                   Object.keys(attributeWeights) as (keyof BoxerAttributes)[]
//                 ).map((key) => (
//                   <div
//                     key={key}
//                     className="flex items-center justify-between rounded-md bg-secondary px-3 py-2.5"
//                   >
//                     <span className="text-xs text-foreground">
//                       {attributeLabels[key]}
//                     </span>
//                     <div className="flex items-center gap-2">
//                       <div className="h-1.5 w-20 overflow-hidden rounded-full bg-background">
//                         <div
//                           className="h-full rounded-full bg-primary"
//                           style={{
//                             width: `${attributeWeights[key] * 100 * (100/13)}%`,
//                           }}
//                         />
//                       </div>
//                       <span className="w-8 text-right font-display text-xs font-bold text-primary">
//                         {(attributeWeights[key] * 100).toFixed(0)}%
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <p>
//                 The highest-weighted category is Performance Metrics (35%),
//                 covering Hand Speed (7%), KO Force (7%), Punch Output (6%),
//                 and more. Technical Attributes (22%) and Tactical Intelligence
//                 (16%) follow, reflecting that measurable skill and ring IQ
//                 are the strongest predictors of success.
//               </p>
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* Section 3: Score Calculation */}
//         <AccordionItem
//           value="score-calculation"
//           className="rounded-xl border border-border bg-card px-5"
//         >
//           <AccordionTrigger className="py-4 text-foreground hover:no-underline">
//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-primary/10 p-2">
//                 <Calculator className="size-4 text-muted-foreground" />
//               </div>
//               <div className="text-left">
//                 <p className="text-sm font-semibold">
//                   Score Calculation Process
//                 </p>
//                 <p className="text-xs font-normal text-muted-foreground">
//                   From individual attributes to a single performance metric
//                 </p>
//               </div>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="pb-5">
//             <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
//               <p>
//                 A fighter&apos;s overall performance score is calculated as the
//                 weighted sum of their attribute ratings:
//               </p>
//               <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
//                 <p className="font-mono text-xs text-foreground">
//                   {'Score = (w'}
//                   <sub>{'1'}</sub>
//                   {' x a'}
//                   <sub>{'1'}</sub>
//                   {') + (w'}
//                   <sub>{'2'}</sub>
//                   {' x a'}
//                   <sub>{'2'}</sub>
//                   {') + ... + (w'}
//                   <sub>{'20'}</sub>
//                   {' x a'}
//                   <sub>{'20'}</sub>
//                   {')'}
//                 </p>
//                 <p className="mt-2 text-[10px] text-muted-foreground">
//                   Where w = attribute weight and a = attribute rating (0-10), across 20 attributes in 5 categories
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <p className="font-medium text-foreground">Example:</p>
//                 <p>
//                   A fighter with Hand Speed=9, KO Force=8, Ring IQ=7, and all
//                   other attributes at 6:
//                 </p>
//                 <p className="rounded-md bg-secondary px-3 py-2 font-mono text-xs text-accent">
//                   {'Score = (0.07 x 9) + (0.07 x 8) + (0.06 x 7) + ... = 6.5 / 10'}
//                 </p>
//               </div>
//               <p>
//                 The resulting score is a normalized value out of 10, making it
//                 easy to compare any two fighters regardless of weight class or
//                 style.
//               </p>
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         {/* Section 4: Probability Conversion */}
//         <AccordionItem
//           value="probability-conversion"
//           className="rounded-xl border border-border bg-card px-5"
//         >
//           <AccordionTrigger className="py-4 text-foreground hover:no-underline">
//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-accent/10 p-2">
//                 <TrendingUp className="size-4 text-muted-foreground" />
//               </div>
//               <div className="text-left">
//                 <p className="text-sm font-semibold">
//                   Probability Conversion Logic
//                 </p>
//                 <p className="text-xs font-normal text-muted-foreground">
//                   Turning score differences into win probabilities
//                 </p>
//               </div>
//             </div>
//           </AccordionTrigger>
//           <AccordionContent className="pb-5">
//             <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
//               <p>
//                 The score difference between two fighters is converted to win
//                 probabilities using a{" "}
//                 <strong className="text-foreground">sigmoid function</strong>,
//                 a well-established method in prediction modeling:
//               </p>
//               <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
//                 <p className="font-mono text-xs text-foreground">
//                   {'P(A wins) = 1 / (1 + e'}
//                   <sup>{'-k(S_A - S_B)'}</sup>
//                   {')'}
//                 </p>
//                 <p className="mt-2 text-[10px] text-muted-foreground">
//                   Where k is the sensitivity factor (0.8) and S = overall score
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <p className="font-medium text-foreground">Key Properties:</p>
//                 <ul className="list-inside list-disc space-y-1.5 pl-2">
//                   <li>
//                     Equal scores produce a ~50/50 split (accounting for draw
//                     probability)
//                   </li>
//                   <li>
//                     Small differences (0.1–0.5) produce close probability
//                     margins
//                   </li>
//                   <li>
//                     Large differences (1.0+) produce high confidence predictions
//                   </li>
//                   <li>
//                     A base draw probability of 5% is included, increasing up
//                     to 15% for close matchups
//                   </li>
//                 </ul>
//               </div>
//               <p>
//                 This approach ensures predictions are proportional to the
//                 actual performance gap while maintaining realistic uncertainty
//                 bounds — no fighter ever receives a 100% or 0% win probability.
//               </p>
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       {/* Summary Card */}
//       <div className="rounded-xl border border-border bg-card p-6">
//         <div className="flex items-start gap-4">
//           <div className="rounded-lg bg-primary/10 p-2.5">
//             <Brain className="size-5 text-primary" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-foreground">
//               Important Disclaimer
//             </h3>
//             <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
//               This prediction model is designed for educational and analytical
//               purposes. It evaluates fighters based on quantifiable attributes
//               only and does not account for injuries, training camp quality,
//               emotional state, referee influence, or other unpredictable
//               factors. All predictions carry inherent uncertainty and should
//               not be used for gambling purposes.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import {
  Brain,
  Calculator,
  Crown,
  Scale,
  TrendingUp,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RadarAttributeChart } from "@/components/radar-attribute-chart"
import { attributeWeights, attributeLabels } from "@/lib/mock-data"
import type { BoxerAttributes, PerfectBoxer } from "@/lib/mock-data"
import { supabase } from "@/lib/supabaseClient"

// ============================================================
// Convert PerfectBoxer (Supabase columns) → BoxerAttributes
// (the shape RadarAttributeChart expects)
// ============================================================
function toChartAttributes(p: PerfectBoxer): BoxerAttributes {
  return {
    height: p.height_cm / 20,           // normalise cm → 0-10
    reach: p.reach_cm / 20,
    bodyFat: 10,                         // not stored, default max
    shoulderToWaistRatio: 10,
    handSpeed: p.hand_speed,
    punchOutput: p.combination_efficiency,
    vo2Max: p.endurance,
    lactateThreshold: p.endurance,
    knockoutForce: p.strength,
    reactTime: p.reaction_time,
    punchAccuracy: p.punch_accuracy,
    defensiveSlipRate: p.defensive_guard_efficiency,
    opponentConnectPct: p.head_movement,
    footworkEfficiency: p.footwork_technique,
    adaptationSpeed: p.adaptability_mid_fight,
    counterSuccessRate: p.counterpunching_ability,
    ringIQ: p.ring_iq,
    mentalResilience: p.resilience_after_knockdown,
    composure: p.composure_under_pressure,
    emotionalRegulation: p.mental_toughness,
  }
}

// ============================================================
// PAGE
// ============================================================
export default function ModelPage() {
  const [perfectBoxer, setPerfectBoxer] = useState<PerfectBoxer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerfectBoxer() {
      const { data, error } = await supabase
        .from("perfect_boxer")
        .select("*")
        .limit(1)
        .single()

      if (error) {
        console.error("❌ Perfect boxer error:", error)
      } else {
        setPerfectBoxer(data as PerfectBoxer)
      }
      setLoading(false)
    }
    fetchPerfectBoxer()
  }, [])

  const chartAttributes = perfectBoxer ? toChartAttributes(perfectBoxer) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Model Explanation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Understand the theoretical concepts, methodology, and calculations
          behind the prediction system.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["perfect-boxer"]} className="space-y-3">

        {/* Section 1: Perfect Boxer */}
        <AccordionItem value="perfect-boxer" className="rounded-xl border border-border bg-card px-5">
          <AccordionTrigger className="py-4 text-foreground hover:no-underline [&[data-state=open]>div>.icon]:text-primary">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Crown className="icon size-4 text-muted-foreground transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">The Perfect Boxer Model</p>
                <p className="text-xs font-normal text-muted-foreground">
                  Theoretical upper bound for fighter evaluation
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                The Perfect Boxer represents a theoretical fighter who scores a
                perfect 10 out of 10 across all measured performance attributes.
                This model serves as the absolute benchmark — no real fighter can
                match it, but every fighter is evaluated relative to it.
              </p>
              <p>
                By establishing this upper bound, we create a consistent and
                comparable scale for rating fighters across different weight
                classes, eras, and fighting styles.
              </p>

              {/* Radar chart — real data from Supabase */}
              <div className="h-72 rounded-lg border border-border bg-secondary/30 p-4">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-muted-foreground">Loading perfect boxer data...</p>
                  </div>
                ) : chartAttributes ? (
                  <RadarAttributeChart attributes={chartAttributes} showPerfect={false} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-muted-foreground">Could not load perfect boxer data.</p>
                  </div>
                )}
              </div>

              {/* Show key stats from Supabase if loaded */}
              {perfectBoxer && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "Ring IQ", value: perfectBoxer.ring_iq },
                    { label: "Hand Speed", value: perfectBoxer.hand_speed },
                    { label: "Strength", value: perfectBoxer.strength },
                    { label: "Mental Toughness", value: perfectBoxer.mental_toughness },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-secondary px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 font-display text-lg font-bold text-primary">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                The radar chart above shows the Perfect Boxer&apos;s attribute
                profile — a fully filled polygon representing maximum scores
                in every dimension.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Attribute Weighting */}
        <AccordionItem value="attribute-weighting" className="rounded-xl border border-border bg-card px-5">
          <AccordionTrigger className="py-4 text-foreground hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Scale className="size-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Attribute Weighting System</p>
                <p className="text-xs font-normal text-muted-foreground">
                  How each attribute impacts the overall score
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Not all boxing attributes are created equal. Each attribute is
                assigned a weight representing its relative importance in
                determining fight outcomes.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(attributeWeights) as (keyof BoxerAttributes)[]).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md bg-secondary px-3 py-2.5"
                  >
                    <span className="text-xs text-foreground">{attributeLabels[key]}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${attributeWeights[key] * 100 * (100 / 13)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-display text-xs font-bold text-primary">
                        {(attributeWeights[key] * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                The highest-weighted category is Performance Metrics (35%),
                covering Hand Speed (7%), KO Force (7%), Punch Output (6%),
                and more. Technical Attributes (22%) and Tactical Intelligence
                (16%) follow.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Score Calculation */}
        <AccordionItem value="score-calculation" className="rounded-xl border border-border bg-card px-5">
          <AccordionTrigger className="py-4 text-foreground hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calculator className="size-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Score Calculation Process</p>
                <p className="text-xs font-normal text-muted-foreground">
                  From individual attributes to a single performance metric
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                A fighter&apos;s overall performance score is calculated as the
                weighted sum of their attribute ratings:
              </p>
              <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                <p className="font-mono text-xs text-foreground">
                  {'Score = (w'}<sub>{'1'}</sub>{' x a'}<sub>{'1'}</sub>
                  {') + (w'}<sub>{'2'}</sub>{' x a'}<sub>{'2'}</sub>
                  {') + ... + (w'}<sub>{'20'}</sub>{' x a'}<sub>{'20'}</sub>{')'}
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Where w = attribute weight and a = attribute rating (0-10)
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Example:</p>
                <p>A fighter with Hand Speed=9, KO Force=8, Ring IQ=7, and all other attributes at 6:</p>
                <p className="rounded-md bg-secondary px-3 py-2 font-mono text-xs text-accent">
                  {'Score = (0.07 x 9) + (0.07 x 8) + (0.06 x 7) + ... = 6.5 / 10'}
                </p>
              </div>
              <p>
                The resulting score is a normalized value out of 10, making it
                easy to compare any two fighters regardless of weight class or style.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Probability Conversion */}
        <AccordionItem value="probability-conversion" className="rounded-xl border border-border bg-card px-5">
          <AccordionTrigger className="py-4 text-foreground hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <TrendingUp className="size-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Probability Conversion Logic</p>
                <p className="text-xs font-normal text-muted-foreground">
                  Turning score differences into win probabilities
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                The score difference between two fighters is converted to win
                probabilities using a{" "}
                <strong className="text-foreground">sigmoid function</strong>,
                a well-established method in prediction modeling:
              </p>
              <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                <p className="font-mono text-xs text-foreground">
                  {'P(A wins) = 1 / (1 + e'}<sup>{'-k(S_A - S_B)'}</sup>{')'}
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Where k is the sensitivity factor (0.8) and S = overall score
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Key Properties:</p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li>Equal scores produce a ~50/50 split (accounting for draw probability)</li>
                  <li>Small differences (0.1–0.5) produce close probability margins</li>
                  <li>Large differences (1.0+) produce high confidence predictions</li>
                  <li>A base draw probability of 5% is included, increasing up to 15% for close matchups</li>
                </ul>
              </div>
              <p>
                This approach ensures predictions are proportional to the actual
                performance gap while maintaining realistic uncertainty bounds —
                no fighter ever receives a 100% or 0% win probability.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Disclaimer */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Brain className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Important Disclaimer</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              This prediction model is designed for educational and analytical
              purposes. It evaluates fighters based on quantifiable attributes
              only and does not account for injuries, training camp quality,
              emotional state, referee influence, or other unpredictable factors.
              All predictions carry inherent uncertainty and should not be used
              for gambling purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
