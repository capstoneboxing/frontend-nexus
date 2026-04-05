import type {
    BoxerInput,
    GeneratedBoxerProfileResponse,
    PredictionResponse,
} from "@/generated-api/models"
import type { BoxerAttributes } from "./predict-types"

export interface PredictionUIResult {
    boxerA: {
        name: string
        score: number
        winProbability: number
    }
    boxerB: {
        name: string
        score: number
        winProbability: number
    }
    predictedWinner: string
    explanation: string
}

export function mapGeneratedProfileToAttributes(
    profile: GeneratedBoxerProfileResponse
): BoxerAttributes {
    return {
        heightCm: profile.heightCm ?? 120,
        reachCm: profile.reachCm ?? 120,

        weightClassAlignment: profile.weightClassAlignment ?? 5,
        handSpeed: profile.handSpeed ?? 5,
        footSpeed: profile.footSpeed ?? 5,
        strength: profile.strength ?? 5,
        endurance: profile.endurance ?? 5,
        reactionTime: profile.reactionTime ?? 5,
        punchAccuracy: profile.punchAccuracy ?? 5,
        punchVariety: profile.punchVariety ?? 5,
        defensiveGuardEfficiency: profile.defensiveGuardEfficiency ?? 5,
        headMovement: profile.headMovement ?? 5,
        footworkTechnique: profile.footworkTechnique ?? 5,
        counterpunchingAbility: profile.counterpunchingAbility ?? 5,
        combinationEfficiency: profile.combinationEfficiency ?? 5,
        ringIq: profile.ringIq ?? 5,
        adaptabilityMidFight: profile.adaptabilityMidFight ?? 5,
        distanceControl: profile.distanceControl ?? 5,
        tempoControl: profile.tempoControl ?? 5,
        opponentPatternRecognition: profile.opponentPatternRecognition ?? 5,
        fightPlanningDiscipline: profile.fightPlanningDiscipline ?? 5,
        composureUnderPressure: profile.composureUnderPressure ?? 5,
        aggressionControl: profile.aggressionControl ?? 5,
        mentalToughness: profile.mentalToughness ?? 5,
        focusConsistency: profile.focusConsistency ?? 5,
        resilienceAfterKnockdown: profile.resilienceAfterKnockdown ?? 5,

        winRatio: profile.winRatio ?? 0,
        knockoutRatio: profile.knockoutRatio ?? 0,

        titleFightExperience: profile.titleFightExperience ?? 5,
        strengthOfOpposition: profile.strengthOfOpposition ?? 5,
        recentFightActivity: profile.recentFightActivity ?? 5,
        performanceConsistency: profile.performanceConsistency ?? 5,
    }
}

export function mapAttributesToBoxerInput(
    name: string,
    attrs: BoxerAttributes
): BoxerInput {
    return {
        boxerName: name,
        heightCm: attrs.heightCm,
        reachCm: attrs.reachCm,

        weightClassAlignment: attrs.weightClassAlignment,
        handSpeed: attrs.handSpeed,
        footSpeed: attrs.footSpeed,
        strength: attrs.strength,
        endurance: attrs.endurance,
        reactionTime: attrs.reactionTime,
        punchAccuracy: attrs.punchAccuracy,
        punchVariety: attrs.punchVariety,
        defensiveGuardEfficiency: attrs.defensiveGuardEfficiency,
        headMovement: attrs.headMovement,
        footworkTechnique: attrs.footworkTechnique,
        counterpunchingAbility: attrs.counterpunchingAbility,
        combinationEfficiency: attrs.combinationEfficiency,
        ringIq: attrs.ringIq,
        adaptabilityMidFight: attrs.adaptabilityMidFight,
        distanceControl: attrs.distanceControl,
        tempoControl: attrs.tempoControl,
        opponentPatternRecognition: attrs.opponentPatternRecognition,
        fightPlanningDiscipline: attrs.fightPlanningDiscipline,
        composureUnderPressure: attrs.composureUnderPressure,
        aggressionControl: attrs.aggressionControl,
        mentalToughness: attrs.mentalToughness,
        focusConsistency: attrs.focusConsistency,
        resilienceAfterKnockdown: attrs.resilienceAfterKnockdown,

        winRatio: attrs.winRatio,
        knockoutRatio: attrs.knockoutRatio,

        titleFightExperience: attrs.titleFightExperience,
        strengthOfOpposition: attrs.strengthOfOpposition,
        recentFightActivity: attrs.recentFightActivity,
        performanceConsistency: attrs.performanceConsistency,
    }
}

export function mapPredictionResponseToUI(
    response: PredictionResponse
): PredictionUIResult {
    return {
        boxerA: {
            name: response.boxerAName ?? "Boxer A",
            score: Number((response.closenessA ?? 0).toFixed(3)),
            winProbability: Number(((response.probabilityA ?? 0) * 100).toFixed(1)),
        },
        boxerB: {
            name: response.boxerBName ?? "Boxer B",
            score: Number((response.closenessB ?? 0).toFixed(3)),
            winProbability: Number(((response.probabilityB ?? 0) * 100).toFixed(1)),
        },
        predictedWinner: response.predictedWinner ?? "Unknown",
        explanation: response.explanation ?? "No explanation available.",
    }
}