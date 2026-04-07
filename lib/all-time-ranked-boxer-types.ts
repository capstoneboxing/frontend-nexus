export type AllTimeRankedBoxerAttributeKey =
    | "heightCm"
    | "reachCm"
    | "weightClassAlignment"
    | "handSpeed"
    | "footSpeed"
    | "strength"
    | "endurance"
    | "reactionTime"
    | "punchAccuracy"
    | "punchVariety"
    | "defensiveGuardEfficiency"
    | "headMovement"
    | "footworkTechnique"
    | "counterpunchingAbility"
    | "combinationEfficiency"
    | "ringIq"
    | "adaptabilityMidFight"
    | "distanceControl"
    | "tempoControl"
    | "opponentPatternRecognition"
    | "fightPlanningDiscipline"
    | "composureUnderPressure"
    | "aggressionControl"
    | "mentalToughness"
    | "focusConsistency"
    | "resilienceAfterKnockdown"
    | "winRatio"
    | "knockoutRatio"
    | "titleFightExperience"
    | "strengthOfOpposition"
    | "recentFightActivity"
    | "performanceConsistency"
    | "sourceNote"

export interface AllTimeRankedBoxerUI {
    rankedBoxerId: number
    batchId: number | null
    weightClassId: number | null
    weightClassName: string
    boxerName: string
    rankingPosition: number | null

    heightCm: number
    reachCm: number

    weightClassAlignment: number
    handSpeed: number
    footSpeed: number
    strength: number
    endurance: number
    reactionTime: number
    punchAccuracy: number
    punchVariety: number
    defensiveGuardEfficiency: number
    headMovement: number
    footworkTechnique: number
    counterpunchingAbility: number
    combinationEfficiency: number
    ringIq: number
    adaptabilityMidFight: number
    distanceControl: number
    tempoControl: number
    opponentPatternRecognition: number
    fightPlanningDiscipline: number
    composureUnderPressure: number
    aggressionControl: number
    mentalToughness: number
    focusConsistency: number
    resilienceAfterKnockdown: number

    winRatio: number
    knockoutRatio: number

    titleFightExperience: number
    strengthOfOpposition: number
    recentFightActivity: number
    performanceConsistency: number

    sourceNote: string
    generatedAt: Date | null
    generatedAtLabel: string
    generatedTimeLabel: string
}

export interface AllTimeRankedBoxerFormValues {
    heightCm: number
    reachCm: number

    weightClassAlignment: number
    handSpeed: number
    footSpeed: number
    strength: number
    endurance: number
    reactionTime: number
    punchAccuracy: number
    punchVariety: number
    defensiveGuardEfficiency: number
    headMovement: number
    footworkTechnique: number
    counterpunchingAbility: number
    combinationEfficiency: number
    ringIq: number
    adaptabilityMidFight: number
    distanceControl: number
    tempoControl: number
    opponentPatternRecognition: number
    fightPlanningDiscipline: number
    composureUnderPressure: number
    aggressionControl: number
    mentalToughness: number
    focusConsistency: number
    resilienceAfterKnockdown: number

    winRatio: number
    knockoutRatio: number

    titleFightExperience: number
    strengthOfOpposition: number
    recentFightActivity: number
    performanceConsistency: number

    sourceNote: string
}