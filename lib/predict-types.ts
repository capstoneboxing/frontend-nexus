export type BoxerAttributes = {
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
}

export const defaultAttributes: BoxerAttributes = {
    heightCm: 120,
    reachCm: 120,

    weightClassAlignment: 5,
    handSpeed: 5,
    footSpeed: 5,
    strength: 5,
    endurance: 5,
    reactionTime: 5,
    punchAccuracy: 5,
    punchVariety: 5,
    defensiveGuardEfficiency: 5,
    headMovement: 5,
    footworkTechnique: 5,
    counterpunchingAbility: 5,
    combinationEfficiency: 5,
    ringIq: 5,
    adaptabilityMidFight: 5,
    distanceControl: 5,
    tempoControl: 5,
    opponentPatternRecognition: 5,
    fightPlanningDiscipline: 5,
    composureUnderPressure: 5,
    aggressionControl: 5,
    mentalToughness: 5,
    focusConsistency: 5,
    resilienceAfterKnockdown: 5,

    winRatio: 0,
    knockoutRatio: 0,

    titleFightExperience: 5,
    strengthOfOpposition: 5,
    recentFightActivity: 5,
    performanceConsistency: 5,
}

export const attributeLabels: Record<keyof BoxerAttributes, string> = {
    heightCm: "Height (cm)",
    reachCm: "Reach (cm)",

    weightClassAlignment: "Weight Class Alignment",
    handSpeed: "Hand Speed",
    footSpeed: "Foot Speed",
    strength: "Strength",
    endurance: "Endurance",
    reactionTime: "Reaction Time",
    punchAccuracy: "Punch Accuracy",
    punchVariety: "Punch Variety",
    defensiveGuardEfficiency: "Defensive Guard Efficiency",
    headMovement: "Head Movement",
    footworkTechnique: "Footwork Technique",
    counterpunchingAbility: "Counterpunching Ability",
    combinationEfficiency: "Combination Efficiency",
    ringIq: "Ring IQ",
    adaptabilityMidFight: "Adaptability Mid-Fight",
    distanceControl: "Distance Control",
    tempoControl: "Tempo Control",
    opponentPatternRecognition: "Opponent Pattern Recognition",
    fightPlanningDiscipline: "Fight Planning Discipline",
    composureUnderPressure: "Composure Under Pressure",
    aggressionControl: "Aggression Control",
    mentalToughness: "Mental Toughness",
    focusConsistency: "Focus Consistency",
    resilienceAfterKnockdown: "Resilience After Knockdown",

    winRatio: "Win Ratio",
    knockoutRatio: "Knockout Ratio",

    titleFightExperience: "Title Fight Experience",
    strengthOfOpposition: "Strength of Opposition",
    recentFightActivity: "Recent Fight Activity",
    performanceConsistency: "Performance Consistency",
}

export const attributeDescriptions: Record<keyof BoxerAttributes, string> = {
    heightCm: "Boxer height in centimeters.",
    reachCm: "Boxer reach in centimeters.",

    weightClassAlignment: "How naturally aligned the boxer is with the selected weight class.",
    handSpeed: "Speed of hand strikes and combinations.",
    footSpeed: "Speed and quickness of movement around the ring.",
    strength: "Overall physical force and power.",
    endurance: "Ability to sustain performance over a fight.",
    reactionTime: "How quickly the boxer reacts.",
    punchAccuracy: "How consistently punches land cleanly.",
    punchVariety: "Variety of punches available and used effectively.",
    defensiveGuardEfficiency: "Effectiveness of guard in preventing clean shots.",
    headMovement: "Effectiveness of slipping and moving the head defensively.",
    footworkTechnique: "Quality of foot placement and movement technique.",
    counterpunchingAbility: "Ability to punish openings with counters.",
    combinationEfficiency: "How effective and fluid punch combinations are.",
    ringIq: "Fight intelligence and decision-making.",
    adaptabilityMidFight: "Ability to adjust strategy during the fight.",
    distanceControl: "Ability to manage range.",
    tempoControl: "Ability to control the pace of the fight.",
    opponentPatternRecognition: "Ability to read patterns in the opponent.",
    fightPlanningDiscipline: "How well the boxer sticks to a sound game plan.",
    composureUnderPressure: "Ability to stay calm under stress.",
    aggressionControl: "Ability to attack without becoming reckless.",
    mentalToughness: "Psychological resilience and toughness.",
    focusConsistency: "Ability to remain mentally locked in.",
    resilienceAfterKnockdown: "Ability to recover well after adversity.",

    winRatio: "Career win ratio as a decimal from 0.00 to 1.00.",
    knockoutRatio: "Career knockout ratio as a decimal from 0.00 to 1.00.",

    titleFightExperience: "Experience in title-level bouts.",
    strengthOfOpposition: "Quality of opponents faced.",
    recentFightActivity: "How active the boxer has been recently.",
    performanceConsistency: "How consistently the boxer performs well.",
}

export const attributeCategories = [
    {
        key: "physical",
        label: "Physical",
        attributes: [
            "heightCm",
            "reachCm",
            "weightClassAlignment",
            "handSpeed",
            "footSpeed",
            "strength",
            "endurance",
            "reactionTime",
        ] as const,
    },
    {
        key: "technical",
        label: "Technical",
        attributes: [
            "punchAccuracy",
            "punchVariety",
            "defensiveGuardEfficiency",
            "headMovement",
            "footworkTechnique",
            "counterpunchingAbility",
            "combinationEfficiency",
        ] as const,
    },
    {
        key: "tactical",
        label: "Tactical",
        attributes: [
            "ringIq",
            "adaptabilityMidFight",
            "distanceControl",
            "tempoControl",
            "opponentPatternRecognition",
            "fightPlanningDiscipline",
        ] as const,
    },
    {
        key: "psychological",
        label: "Psychological",
        attributes: [
            "composureUnderPressure",
            "aggressionControl",
            "mentalToughness",
            "focusConsistency",
            "resilienceAfterKnockdown",
        ] as const,
    },
    {
        key: "performance",
        label: "Performance",
        attributes: [
            "winRatio",
            "knockoutRatio",
            "titleFightExperience",
            "strengthOfOpposition",
            "recentFightActivity",
            "performanceConsistency",
        ] as const,
    },
] as const