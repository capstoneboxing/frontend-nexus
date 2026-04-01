


// ============================================================
// lib/mock-data.ts
//
// ✅ Fake boxer/prediction data removed — now fetched from Supabase
// ✅ Utility functions, types, weights and labels kept
// ✅ weightClasses, fightStyles, stanceOptions now pulled from Supabase
//    via weight_classes table — static fallbacks kept for CriteriaPage selects
// ============================================================

// ============================================================
// SUPABASE BOXER TYPE — matches ranked_boxer table
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
// SUPABASE PREDICTION TYPE — matches fight_predictions table
// ============================================================
export type PredictionRecord = {
  prediction_id: number
  boxer_a_name: string
  boxer_b_name: string
  match_decision: string
  weight_class_id: number
  probability_a: number
  probability_b: number
  breakdown_snapshot: string  // JSON string — parse where needed
  prediction_date: string
}

// ============================================================
// SUPABASE PERFECT BOXER TYPE — matches perfect_boxer table
// ============================================================
export type PerfectBoxer = {
  perfect_boxer_id: number
  batch_id: number
  weight_class_id: number
  height_cm: number
  reach_cm: number
  weight_class_alignment: number
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
}

// ============================================================
// SUPABASE WEIGHT CLASS TYPE — matches weight_classes table
// ============================================================
export type WeightClass = {
  weight_class_id: number
  class_name: string
  max_weight_lb: number
  min_weight_lb: number
}

// ============================================================
// BOXER ATTRIBUTES — used by PredictPage input form
// These are the sliders the user fills in manually
// ============================================================
export interface BoxerAttributes {
  // Anthropometric
  height: number
  reach: number
  bodyFat: number
  shoulderToWaistRatio: number
  // Performance Metrics
  handSpeed: number
  punchOutput: number
  vo2Max: number
  lactateThreshold: number
  knockoutForce: number
  reactTime: number
  // Technical Attributes
  punchAccuracy: number
  defensiveSlipRate: number
  opponentConnectPct: number
  footworkEfficiency: number
  // Tactical Intelligence
  adaptationSpeed: number
  counterSuccessRate: number
  ringIQ: number
  // Psychological Traits
  mentalResilience: number
  composure: number
  emotionalRegulation: number
}

export type AttributeCategory =
  | "physical"
  | "performance"
  | "technical"
  | "tactical"
  | "psychological"

export interface CategoryInfo {
  key: AttributeCategory
  label: string
  description: string
  attributes: (keyof BoxerAttributes)[]
}

export const attributeCategories: CategoryInfo[] = [
  {
    key: "physical",
    label: "Physical Atrributes",
    description: "Physical build and body measurements",
    attributes: ["height", "reach", "bodyFat", "shoulderToWaistRatio"],
  },
  {
    key: "performance",
    label: "Experience & Performance ",
    description: "Measurable physical performance indicators",
    attributes: ["handSpeed", "punchOutput", "vo2Max", "lactateThreshold", "knockoutForce", "reactTime"],
  },
  {
    key: "technical",
    label: "Technical Attributes",
    description: "Skill-based boxing technique metrics",
    attributes: ["punchAccuracy", "defensiveSlipRate", "opponentConnectPct", "footworkEfficiency"],
  },
  {
    key: "tactical",
    label: "Tactical Attributes",
    description: "Strategic fight IQ and adaptability",
    attributes: ["adaptationSpeed", "counterSuccessRate", "ringIQ"],
  },
  {
    key: "psychological",
    label: "Psychological Attributes",
    description: "Mental fortitude and emotional control",
    attributes: ["mentalResilience", "composure", "emotionalRegulation"],
  },
]

// ============================================================
// PREDICTION RESULT — returned by generatePrediction()
// ============================================================
export interface PredictionResult {
  boxerA: { name: string; score: number; winProbability: number }
  boxerB: { name: string; score: number; winProbability: number }
  drawProbability: number
  attributeComparison: { attribute: string; boxerA: number; boxerB: number }[]
}

// ============================================================
// ATTRIBUTE WEIGHTS — used by score calculation
// ============================================================
export const attributeWeights: Record<keyof BoxerAttributes, number> = {
  height: 0.04,
  reach: 0.05,
  bodyFat: 0.03,
  shoulderToWaistRatio: 0.03,
  handSpeed: 0.07,
  punchOutput: 0.06,
  vo2Max: 0.05,
  lactateThreshold: 0.05,
  knockoutForce: 0.07,
  reactTime: 0.05,
  punchAccuracy: 0.06,
  defensiveSlipRate: 0.06,
  opponentConnectPct: 0.05,
  footworkEfficiency: 0.05,
  adaptationSpeed: 0.05,
  counterSuccessRate: 0.05,
  ringIQ: 0.06,
  mentalResilience: 0.04,
  composure: 0.04,
  emotionalRegulation: 0.04,
}

export const attributeDescriptions: Record<keyof BoxerAttributes, string> = {
  height: "Fighter's height advantage in the ring, affecting reach and angles",
  reach: "Arm span and ability to land punches from distance",
  bodyFat: "Body composition — lower fat means better conditioning and speed",
  shoulderToWaistRatio: "Upper body V-taper indicating power generation potential",
  handSpeed: "Measured hand speed for jabs, crosses, and combinations",
  punchOutput: "Total punches thrown per round — volume and work rate",
  vo2Max: "Maximum oxygen uptake — aerobic endurance capacity",
  lactateThreshold: "Ability to sustain high intensity before fatigue sets in",
  knockoutForce: "Peak punching force measured in PSI or force units",
  reactTime: "Speed of defensive reactions and counter-punching timing",
  punchAccuracy: "Percentage of landed punches vs total thrown",
  defensiveSlipRate: "Percentage of incoming punches successfully slipped or evaded",
  opponentConnectPct: "How often opponents land cleanly — lower is better defense",
  footworkEfficiency: "Ring movement, cut-off angles, and positional control",
  adaptationSpeed: "How quickly the fighter adjusts strategy mid-fight",
  counterSuccessRate: "Success rate of counter-punches after defensive actions",
  ringIQ: "Overall fight strategy, tactical awareness, and in-ring intelligence",
  mentalResilience: "Recovery from knockdowns, handling adversity and pressure",
  composure: "Ability to stay calm under fire and execute the game plan",
  emotionalRegulation: "Control over emotions — avoids reckless or panicked fighting",
}

export const attributeLabels: Record<keyof BoxerAttributes, string> = {
  height: "Height",
  reach: "Reach",
  bodyFat: "Body Fat %",
  shoulderToWaistRatio: "Shoulder-to-Waist Ratio",
  handSpeed: "Hand Speed",
  punchOutput: "Punch Output",
  vo2Max: "VO2 Max",
  lactateThreshold: "Lactate Threshold",
  knockoutForce: "Knockout Force",
  reactTime: "Reaction Time",
  punchAccuracy: "Punch Accuracy %",
  defensiveSlipRate: "Defensive Slip Rate",
  opponentConnectPct: "Opponent Connect %",
  footworkEfficiency: "Footwork Efficiency",
  adaptationSpeed: "Adaptation Speed",
  counterSuccessRate: "Counter Success Rate",
  ringIQ: "Ring IQ",
  mentalResilience: "Mental Resilience",
  composure: "Composure",
  emotionalRegulation: "Emotional Regulation",
}

// ============================================================
// SCORE CALCULATOR — used by PredictPage
// ============================================================
export function calculateScore(attributes: BoxerAttributes): number {
  let score = 0
  for (const key of Object.keys(attributeWeights) as (keyof BoxerAttributes)[]) {
    score += attributes[key] * attributeWeights[key]
  }
  return Math.round(score * 100) / 10
}

// ============================================================
// PREDICTION GENERATOR — used by PredictPage
// Takes two sets of manually entered attributes and returns
// win probabilities. Does NOT hit Supabase — pure math.
// The result is then saved to Supabase after generation.
// ============================================================
export function generatePrediction(
  boxerAName: string,
  boxerAAttrs: BoxerAttributes,
  boxerBName: string,
  boxerBAttrs: BoxerAttributes
): PredictionResult {
  const scoreA = calculateScore(boxerAAttrs)
  const scoreB = calculateScore(boxerBAttrs)

  const diff = scoreA - scoreB
  const sigmoid = 1 / (1 + Math.exp(-diff * 0.8))

  const drawBase = 0.05
  const drawBonus = Math.max(0, 0.1 - Math.abs(diff) * 0.02)
  const drawProb = Math.min(drawBase + drawBonus, 0.15)

  const winA = sigmoid * (1 - drawProb)
  const winB = (1 - sigmoid) * (1 - drawProb)

  const comparison = (Object.keys(attributeWeights) as (keyof BoxerAttributes)[]).map(
    (key) => ({
      attribute: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      boxerA: boxerAAttrs[key],
      boxerB: boxerBAttrs[key],
    })
  )

  return {
    boxerA: {
      name: boxerAName,
      score: scoreA,
      winProbability: Math.round(winA * 1000) / 10,
    },
    boxerB: {
      name: boxerBName,
      score: scoreB,
      winProbability: Math.round(winB * 1000) / 10,
    },
    drawProbability: Math.round(drawProb * 1000) / 10,
    attributeComparison: comparison,
  }
}

// ============================================================
// STATIC FALLBACKS — used by CriteriaPage dropdowns
// The real list comes from weight_classes table in Supabase,
// but these are kept as a safe fallback if the fetch fails
// ============================================================
export const weightClasses = [
  "Minimumweight", "Light Flyweight", "Flyweight", "Super Flyweight",
  "Bantamweight", "Super Bantamweight", "Featherweight", "Super Featherweight",
  "Lightweight", "Super Lightweight", "Welterweight", "Super Welterweight",
  "Middleweight", "Super Middleweight", "Light Heavyweight",
  "Cruiserweight", "Heavyweight",
]

export const fightStyles = [
  "Brawler", "Out-boxer", "Swarmer", "Slugger", "Counter-puncher", "Pressure Fighter",
]

export const stanceOptions = ["Orthodox", "Southpaw", "Switch"]

// ============================================================
// WEIGHT DISTRIBUTION DATA — used by ModelPage chart
// Static — these are the weights themselves, not real data
// ============================================================
export const weightDistributionData = [
  { attribute: "Hand Speed", weight: 7 },
  { attribute: "KO Force", weight: 7 },
  { attribute: "Punch Accuracy", weight: 6 },
  { attribute: "Ring IQ", weight: 6 },
  { attribute: "Punch Output", weight: 6 },
  { attribute: "Slip Rate", weight: 6 },
  { attribute: "Reach", weight: 5 },
  { attribute: "VO2 Max", weight: 5 },
  { attribute: "Lactate Thresh.", weight: 5 },
  { attribute: "React Time", weight: 5 },
  { attribute: "Opp. Connect %", weight: 5 },
  { attribute: "Footwork Eff.", weight: 5 },
  { attribute: "Adaptation", weight: 5 },
  { attribute: "Counter Rate", weight: 5 },
  { attribute: "Height", weight: 4 },
  { attribute: "Composure", weight: 4 },
  { attribute: "Resilience", weight: 4 },
  { attribute: "Emotional Reg.", weight: 4 },
  { attribute: "Body Fat", weight: 3 },
  { attribute: "Shoulder Ratio", weight: 3 },
]
