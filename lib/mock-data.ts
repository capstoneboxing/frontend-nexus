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
  | "anthropometric"
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
    key: "anthropometric",
    label: "Anthropometric",
    description: "Physical build and body measurements",
    attributes: ["height", "reach", "bodyFat", "shoulderToWaistRatio"],
  },
  {
    key: "performance",
    label: "Performance Metrics",
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
    label: "Tactical Intelligence",
    description: "Strategic fight IQ and adaptability",
    attributes: ["adaptationSpeed", "counterSuccessRate", "ringIQ"],
  },
  {
    key: "psychological",
    label: "Psychological Traits",
    description: "Mental fortitude and emotional control",
    attributes: ["mentalResilience", "composure", "emotionalRegulation"],
  },
]

export interface Boxer {
  id: string
  name: string
  nickname: string
  record: string
  weight: string
  nationality: string
  attributes: BoxerAttributes
}

export interface PredictionResult {
  boxerA: { name: string; score: number; winProbability: number }
  boxerB: { name: string; score: number; winProbability: number }
  drawProbability: number
  attributeComparison: { attribute: string; boxerA: number; boxerB: number }[]
}

export const attributeWeights: Record<keyof BoxerAttributes, number> = {
  // Anthropometric (total ~15%)
  height: 0.04,
  reach: 0.05,
  bodyFat: 0.03,
  shoulderToWaistRatio: 0.03,
  // Performance Metrics (total ~35%)
  handSpeed: 0.07,
  punchOutput: 0.06,
  vo2Max: 0.05,
  lactateThreshold: 0.05,
  knockoutForce: 0.07,
  reactTime: 0.05,
  // Technical Attributes (total ~22%)
  punchAccuracy: 0.06,
  defensiveSlipRate: 0.06,
  opponentConnectPct: 0.05,
  footworkEfficiency: 0.05,
  // Tactical Intelligence (total ~16%)
  adaptationSpeed: 0.05,
  counterSuccessRate: 0.05,
  ringIQ: 0.06,
  // Psychological Traits (total ~12%)
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

export const mockBoxers: Boxer[] = [
  {
    id: "1",
    name: "Marcus 'The Storm' Rivera",
    nickname: "The Storm",
    record: "34-2-0 (28 KOs)",
    weight: "Heavyweight",
    nationality: "USA",
    attributes: {
      height: 8, reach: 9, bodyFat: 7, shoulderToWaistRatio: 8,
      handSpeed: 7, punchOutput: 8, vo2Max: 8, lactateThreshold: 7, knockoutForce: 9, reactTime: 7,
      punchAccuracy: 8, defensiveSlipRate: 7, opponentConnectPct: 7, footworkEfficiency: 7,
      adaptationSpeed: 8, counterSuccessRate: 7, ringIQ: 9,
      mentalResilience: 8, composure: 8, emotionalRegulation: 7,
    },
  },
  {
    id: "2",
    name: "Viktor Petrov",
    nickname: "Iron Fist",
    record: "29-1-1 (24 KOs)",
    weight: "Heavyweight",
    nationality: "Russia",
    attributes: {
      height: 9, reach: 8, bodyFat: 6, shoulderToWaistRatio: 9,
      handSpeed: 6, punchOutput: 7, vo2Max: 9, lactateThreshold: 8, knockoutForce: 10, reactTime: 6,
      punchAccuracy: 7, defensiveSlipRate: 6, opponentConnectPct: 6, footworkEfficiency: 6,
      adaptationSpeed: 6, counterSuccessRate: 6, ringIQ: 7,
      mentalResilience: 9, composure: 8, emotionalRegulation: 7,
    },
  },
  {
    id: "3",
    name: "Rafael Santos",
    nickname: "Lightning",
    record: "27-3-0 (18 KOs)",
    weight: "Middleweight",
    nationality: "Brazil",
    attributes: {
      height: 6, reach: 7, bodyFat: 8, shoulderToWaistRatio: 7,
      handSpeed: 10, punchOutput: 9, vo2Max: 8, lactateThreshold: 7, knockoutForce: 7, reactTime: 9,
      punchAccuracy: 8, defensiveSlipRate: 8, opponentConnectPct: 7, footworkEfficiency: 9,
      adaptationSpeed: 7, counterSuccessRate: 8, ringIQ: 8,
      mentalResilience: 7, composure: 7, emotionalRegulation: 6,
    },
  },
  {
    id: "4",
    name: "James 'The Ghost' O'Brien",
    nickname: "The Ghost",
    record: "31-2-1 (20 KOs)",
    weight: "Light Heavyweight",
    nationality: "Ireland",
    attributes: {
      height: 7, reach: 8, bodyFat: 7, shoulderToWaistRatio: 7,
      handSpeed: 8, punchOutput: 7, vo2Max: 9, lactateThreshold: 9, knockoutForce: 7, reactTime: 8,
      punchAccuracy: 9, defensiveSlipRate: 9, opponentConnectPct: 8, footworkEfficiency: 9,
      adaptationSpeed: 9, counterSuccessRate: 8, ringIQ: 10,
      mentalResilience: 8, composure: 9, emotionalRegulation: 9,
    },
  },
  {
    id: "5",
    name: "Takeshi Yamamoto",
    nickname: "Samurai",
    record: "25-4-0 (16 KOs)",
    weight: "Welterweight",
    nationality: "Japan",
    attributes: {
      height: 5, reach: 6, bodyFat: 9, shoulderToWaistRatio: 6,
      handSpeed: 9, punchOutput: 8, vo2Max: 8, lactateThreshold: 8, knockoutForce: 6, reactTime: 10,
      punchAccuracy: 8, defensiveSlipRate: 9, opponentConnectPct: 8, footworkEfficiency: 10,
      adaptationSpeed: 8, counterSuccessRate: 9, ringIQ: 8,
      mentalResilience: 9, composure: 8, emotionalRegulation: 8,
    },
  },
  {
    id: "6",
    name: "Diego 'El Toro' Martinez",
    nickname: "El Toro",
    record: "38-1-0 (32 KOs)",
    weight: "Super Middleweight",
    nationality: "Mexico",
    attributes: {
      height: 7, reach: 7, bodyFat: 7, shoulderToWaistRatio: 8,
      handSpeed: 8, punchOutput: 9, vo2Max: 7, lactateThreshold: 6, knockoutForce: 10, reactTime: 7,
      punchAccuracy: 7, defensiveSlipRate: 6, opponentConnectPct: 5, footworkEfficiency: 7,
      adaptationSpeed: 7, counterSuccessRate: 7, ringIQ: 8,
      mentalResilience: 10, composure: 9, emotionalRegulation: 7,
    },
  },
]

export const perfectBoxer: BoxerAttributes = {
  height: 10, reach: 10, bodyFat: 10, shoulderToWaistRatio: 10,
  handSpeed: 10, punchOutput: 10, vo2Max: 10, lactateThreshold: 10, knockoutForce: 10, reactTime: 10,
  punchAccuracy: 10, defensiveSlipRate: 10, opponentConnectPct: 10, footworkEfficiency: 10,
  adaptationSpeed: 10, counterSuccessRate: 10, ringIQ: 10,
  mentalResilience: 10, composure: 10, emotionalRegulation: 10,
}

export function calculateScore(attributes: BoxerAttributes): number {
  let score = 0
  for (const key of Object.keys(attributeWeights) as (keyof BoxerAttributes)[]) {
    score += attributes[key] * attributeWeights[key]
  }
  return Math.round(score * 100) / 10
}

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

export const recentPredictions = [
  { id: 1, boxerA: "Rivera", boxerB: "Petrov", winner: "Rivera", confidence: 62.4, date: "2026-02-15" },
  { id: 2, boxerA: "Santos", boxerB: "O'Brien", winner: "O'Brien", confidence: 55.8, date: "2026-02-12" },
  { id: 3, boxerA: "Yamamoto", boxerB: "Martinez", winner: "Martinez", confidence: 58.1, date: "2026-02-10" },
  { id: 4, boxerA: "Rivera", boxerB: "Santos", winner: "Rivera", confidence: 51.3, date: "2026-02-08" },
]

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

// === Prediction History (past predictions stored in the "database") ===

export interface PredictionRecord {
  id: string
  date: string
  boxerA: string
  boxerB: string
  boxerAScore: number
  boxerBScore: number
  predictedWinner: string
  winProbability: number
  drawProbability: number
  weightClass: string
  status: "pending" | "correct" | "incorrect" | "draw"
  actualWinner?: string
  method?: string
  round?: number
}

export const predictionHistory: PredictionRecord[] = [
  {
    id: "pred-001",
    date: "2026-02-28",
    boxerA: "Marcus 'The Storm' Rivera",
    boxerB: "Viktor Petrov",
    boxerAScore: 8.2,
    boxerBScore: 7.8,
    predictedWinner: "Marcus 'The Storm' Rivera",
    winProbability: 62.4,
    drawProbability: 6.8,
    weightClass: "Heavyweight",
    status: "correct",
    actualWinner: "Marcus 'The Storm' Rivera",
    method: "TKO",
    round: 9,
  },
  {
    id: "pred-002",
    date: "2026-02-25",
    boxerA: "Rafael Santos",
    boxerB: "James 'The Ghost' O'Brien",
    boxerAScore: 7.9,
    boxerBScore: 8.5,
    predictedWinner: "James 'The Ghost' O'Brien",
    winProbability: 55.8,
    drawProbability: 9.2,
    weightClass: "Light Heavyweight",
    status: "correct",
    actualWinner: "James 'The Ghost' O'Brien",
    method: "UD",
    round: 12,
  },
  {
    id: "pred-003",
    date: "2026-02-22",
    boxerA: "Takeshi Yamamoto",
    boxerB: "Diego 'El Toro' Martinez",
    boxerAScore: 7.6,
    boxerBScore: 7.9,
    predictedWinner: "Diego 'El Toro' Martinez",
    winProbability: 58.1,
    drawProbability: 7.5,
    weightClass: "Super Middleweight",
    status: "incorrect",
    actualWinner: "Takeshi Yamamoto",
    method: "SD",
    round: 12,
  },
  {
    id: "pred-004",
    date: "2026-02-18",
    boxerA: "Marcus 'The Storm' Rivera",
    boxerB: "Rafael Santos",
    boxerAScore: 8.2,
    boxerBScore: 7.9,
    predictedWinner: "Marcus 'The Storm' Rivera",
    winProbability: 51.3,
    drawProbability: 11.4,
    weightClass: "Middleweight",
    status: "correct",
    actualWinner: "Marcus 'The Storm' Rivera",
    method: "KO",
    round: 6,
  },
  {
    id: "pred-005",
    date: "2026-02-15",
    boxerA: "Viktor Petrov",
    boxerB: "James 'The Ghost' O'Brien",
    boxerAScore: 7.8,
    boxerBScore: 8.5,
    predictedWinner: "James 'The Ghost' O'Brien",
    winProbability: 64.2,
    drawProbability: 5.8,
    weightClass: "Light Heavyweight",
    status: "correct",
    actualWinner: "James 'The Ghost' O'Brien",
    method: "UD",
    round: 12,
  },
  {
    id: "pred-006",
    date: "2026-02-12",
    boxerA: "Diego 'El Toro' Martinez",
    boxerB: "Marcus 'The Storm' Rivera",
    boxerAScore: 7.9,
    boxerBScore: 8.2,
    predictedWinner: "Marcus 'The Storm' Rivera",
    winProbability: 53.6,
    drawProbability: 10.1,
    weightClass: "Super Middleweight",
    status: "draw",
    actualWinner: "Draw",
    method: "SD",
    round: 12,
  },
  {
    id: "pred-007",
    date: "2026-02-08",
    boxerA: "Rafael Santos",
    boxerB: "Takeshi Yamamoto",
    boxerAScore: 7.9,
    boxerBScore: 7.6,
    predictedWinner: "Rafael Santos",
    winProbability: 56.7,
    drawProbability: 8.3,
    weightClass: "Welterweight",
    status: "correct",
    actualWinner: "Rafael Santos",
    method: "TKO",
    round: 8,
  },
  {
    id: "pred-008",
    date: "2026-02-05",
    boxerA: "Viktor Petrov",
    boxerB: "Diego 'El Toro' Martinez",
    boxerAScore: 7.8,
    boxerBScore: 7.9,
    predictedWinner: "Diego 'El Toro' Martinez",
    winProbability: 50.8,
    drawProbability: 12.1,
    weightClass: "Heavyweight",
    status: "incorrect",
    actualWinner: "Viktor Petrov",
    method: "KO",
    round: 4,
  },
  {
    id: "pred-009",
    date: "2026-02-01",
    boxerA: "James 'The Ghost' O'Brien",
    boxerB: "Rafael Santos",
    boxerAScore: 8.5,
    boxerBScore: 7.9,
    predictedWinner: "James 'The Ghost' O'Brien",
    winProbability: 61.3,
    drawProbability: 6.4,
    weightClass: "Light Heavyweight",
    status: "correct",
    actualWinner: "James 'The Ghost' O'Brien",
    method: "UD",
    round: 12,
  },
  {
    id: "pred-010",
    date: "2026-01-28",
    boxerA: "Marcus 'The Storm' Rivera",
    boxerB: "Takeshi Yamamoto",
    boxerAScore: 8.2,
    boxerBScore: 7.6,
    predictedWinner: "Marcus 'The Storm' Rivera",
    winProbability: 67.1,
    drawProbability: 5.2,
    weightClass: "Heavyweight",
    status: "correct",
    actualWinner: "Marcus 'The Storm' Rivera",
    method: "TKO",
    round: 7,
  },
  {
    id: "pred-011",
    date: "2026-01-24",
    boxerA: "Takeshi Yamamoto",
    boxerB: "Viktor Petrov",
    boxerAScore: 7.6,
    boxerBScore: 7.8,
    predictedWinner: "Viktor Petrov",
    winProbability: 52.4,
    drawProbability: 10.8,
    weightClass: "Heavyweight",
    status: "correct",
    actualWinner: "Viktor Petrov",
    method: "UD",
    round: 12,
  },
  {
    id: "pred-012",
    date: "2026-01-20",
    boxerA: "Diego 'El Toro' Martinez",
    boxerB: "James 'The Ghost' O'Brien",
    boxerAScore: 7.9,
    boxerBScore: 8.5,
    predictedWinner: "James 'The Ghost' O'Brien",
    winProbability: 59.7,
    drawProbability: 7.1,
    weightClass: "Super Middleweight",
    status: "incorrect",
    actualWinner: "Diego 'El Toro' Martinez",
    method: "KO",
    round: 3,
  },
]

// === User Criteria / Preferences Input ===

export interface FightCriteria {
  id: string
  label: string
  description: string
  category: "physical" | "tactical" | "mental" | "environmental"
}

export const fightCriteria: FightCriteria[] = [
  { id: "weight_class", label: "Weight Class", description: "Preferred weight class to analyze", category: "physical" },
  { id: "min_fights", label: "Minimum Fights", description: "Minimum professional fights required", category: "physical" },
  { id: "stance", label: "Stance Preference", description: "Orthodox, Southpaw, or Switch", category: "physical" },
  { id: "age_range", label: "Age Range", description: "Preferred age bracket for fighters", category: "physical" },
  { id: "priority_attribute", label: "Priority Attribute", description: "Which attribute matters most to you", category: "tactical" },
  { id: "fight_style", label: "Fight Style", description: "Brawler, Out-boxer, Swarmer, or Slugger", category: "tactical" },
  { id: "ko_preference", label: "KO Preference", description: "Preference for KO power vs decision fighters", category: "tactical" },
  { id: "rounds_expected", label: "Expected Rounds", description: "How many rounds you expect the fight to last", category: "tactical" },
  { id: "pressure_handling", label: "Pressure Handling", description: "How well the fighter handles pressure", category: "mental" },
  { id: "comeback_ability", label: "Comeback Ability", description: "Ability to recover from early setbacks", category: "mental" },
  { id: "venue_type", label: "Venue Type", description: "Arena size preference (small, medium, large)", category: "environmental" },
  { id: "home_advantage", label: "Home Advantage", description: "Whether home crowd matters in your analysis", category: "environmental" },
]

export const weightClasses = [
  "Heavyweight",
  "Cruiserweight",
  "Light Heavyweight",
  "Super Middleweight",
  "Middleweight",
  "Super Welterweight",
  "Welterweight",
  "Super Lightweight",
  "Lightweight",
  "Super Featherweight",
  "Featherweight",
  "Super Bantamweight",
  "Bantamweight",
  "Super Flyweight",
  "Flyweight",
  "Light Flyweight",
  "Minimumweight",
]

export const fightStyles = ["Brawler", "Out-boxer", "Swarmer", "Slugger", "Counter-puncher", "Pressure Fighter"]
export const stanceOptions = ["Orthodox", "Southpaw", "Switch"]
