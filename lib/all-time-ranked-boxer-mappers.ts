import type {
    AllTimeRankedBoxerResponse,
    AllTimeRankedBoxerUpdateRequest,
} from "@/generated-api/models"
import type {
    AllTimeRankedBoxerFormValues,
    AllTimeRankedBoxerUI,
} from "@/lib/all-time-ranked-boxer-types"

function formatDateLabel(date: Date | null): string {
    if (!date) return "N/A"

    const month = date.toLocaleString("en-US", { month: "long" })
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month}, ${day}, ${year}`
}

function formatTimeLabel(date: Date | null): string {
    if (!date) return "N/A"

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })
}

export function mapAllTimeRankedBoxerToUI(
    item: AllTimeRankedBoxerResponse,
    weightClassName = "Unknown"
): AllTimeRankedBoxerUI {
    const generatedAt = item.generatedAt ?? null

    return {
        rankedBoxerId: item.rankedBoxerId ?? 0,
        batchId: item.batchId ?? null,
        weightClassId: item.weightClassId ?? null,
        weightClassName,
        boxerName: item.boxerName ?? "Unknown Boxer",
        rankingPosition: item.rankingPosition ?? null,

        heightCm: item.heightCm ?? 0,
        reachCm: item.reachCm ?? 0,

        weightClassAlignment: item.weightClassAlignment ?? 0,
        handSpeed: item.handSpeed ?? 0,
        footSpeed: item.footSpeed ?? 0,
        strength: item.strength ?? 0,
        endurance: item.endurance ?? 0,
        reactionTime: item.reactionTime ?? 0,
        punchAccuracy: item.punchAccuracy ?? 0,
        punchVariety: item.punchVariety ?? 0,
        defensiveGuardEfficiency: item.defensiveGuardEfficiency ?? 0,
        headMovement: item.headMovement ?? 0,
        footworkTechnique: item.footworkTechnique ?? 0,
        counterpunchingAbility: item.counterpunchingAbility ?? 0,
        combinationEfficiency: item.combinationEfficiency ?? 0,
        ringIq: item.ringIq ?? 0,
        adaptabilityMidFight: item.adaptabilityMidFight ?? 0,
        distanceControl: item.distanceControl ?? 0,
        tempoControl: item.tempoControl ?? 0,
        opponentPatternRecognition: item.opponentPatternRecognition ?? 0,
        fightPlanningDiscipline: item.fightPlanningDiscipline ?? 0,
        composureUnderPressure: item.composureUnderPressure ?? 0,
        aggressionControl: item.aggressionControl ?? 0,
        mentalToughness: item.mentalToughness ?? 0,
        focusConsistency: item.focusConsistency ?? 0,
        resilienceAfterKnockdown: item.resilienceAfterKnockdown ?? 0,

        winRatio: item.winRatio ?? 0,
        knockoutRatio: item.knockoutRatio ?? 0,

        titleFightExperience: item.titleFightExperience ?? 0,
        strengthOfOpposition: item.strengthOfOpposition ?? 0,
        recentFightActivity: item.recentFightActivity ?? 0,
        performanceConsistency: item.performanceConsistency ?? 0,

        sourceNote: item.sourceNote ?? "",
        generatedAt,
        generatedAtLabel: formatDateLabel(generatedAt),
        generatedTimeLabel: formatTimeLabel(generatedAt),
    }
}

export function mapAllTimeRankedBoxerToFormValues(
    item: AllTimeRankedBoxerResponse | AllTimeRankedBoxerUI
): AllTimeRankedBoxerFormValues {
    return {
        heightCm: item.heightCm ?? 0,
        reachCm: item.reachCm ?? 0,

        weightClassAlignment: item.weightClassAlignment ?? 0,
        handSpeed: item.handSpeed ?? 0,
        footSpeed: item.footSpeed ?? 0,
        strength: item.strength ?? 0,
        endurance: item.endurance ?? 0,
        reactionTime: item.reactionTime ?? 0,
        punchAccuracy: item.punchAccuracy ?? 0,
        punchVariety: item.punchVariety ?? 0,
        defensiveGuardEfficiency: item.defensiveGuardEfficiency ?? 0,
        headMovement: item.headMovement ?? 0,
        footworkTechnique: item.footworkTechnique ?? 0,
        counterpunchingAbility: item.counterpunchingAbility ?? 0,
        combinationEfficiency: item.combinationEfficiency ?? 0,
        ringIq: item.ringIq ?? 0,
        adaptabilityMidFight: item.adaptabilityMidFight ?? 0,
        distanceControl: item.distanceControl ?? 0,
        tempoControl: item.tempoControl ?? 0,
        opponentPatternRecognition: item.opponentPatternRecognition ?? 0,
        fightPlanningDiscipline: item.fightPlanningDiscipline ?? 0,
        composureUnderPressure: item.composureUnderPressure ?? 0,
        aggressionControl: item.aggressionControl ?? 0,
        mentalToughness: item.mentalToughness ?? 0,
        focusConsistency: item.focusConsistency ?? 0,
        resilienceAfterKnockdown: item.resilienceAfterKnockdown ?? 0,

        winRatio: item.winRatio ?? 0,
        knockoutRatio: item.knockoutRatio ?? 0,

        titleFightExperience: item.titleFightExperience ?? 0,
        strengthOfOpposition: item.strengthOfOpposition ?? 0,
        recentFightActivity: item.recentFightActivity ?? 0,
        performanceConsistency: item.performanceConsistency ?? 0,

        sourceNote: item.sourceNote ?? "",
    }
}

export function mapFormValuesToAllTimeRankedBoxerUpdateRequest(
    values: AllTimeRankedBoxerFormValues
): AllTimeRankedBoxerUpdateRequest {
    return {
        heightCm: values.heightCm,
        reachCm: values.reachCm,

        weightClassAlignment: values.weightClassAlignment,
        handSpeed: values.handSpeed,
        footSpeed: values.footSpeed,
        strength: values.strength,
        endurance: values.endurance,
        reactionTime: values.reactionTime,
        punchAccuracy: values.punchAccuracy,
        punchVariety: values.punchVariety,
        defensiveGuardEfficiency: values.defensiveGuardEfficiency,
        headMovement: values.headMovement,
        footworkTechnique: values.footworkTechnique,
        counterpunchingAbility: values.counterpunchingAbility,
        combinationEfficiency: values.combinationEfficiency,
        ringIq: values.ringIq,
        adaptabilityMidFight: values.adaptabilityMidFight,
        distanceControl: values.distanceControl,
        tempoControl: values.tempoControl,
        opponentPatternRecognition: values.opponentPatternRecognition,
        fightPlanningDiscipline: values.fightPlanningDiscipline,
        composureUnderPressure: values.composureUnderPressure,
        aggressionControl: values.aggressionControl,
        mentalToughness: values.mentalToughness,
        focusConsistency: values.focusConsistency,
        resilienceAfterKnockdown: values.resilienceAfterKnockdown,

        winRatio: values.winRatio,
        knockoutRatio: values.knockoutRatio,

        titleFightExperience: values.titleFightExperience,
        strengthOfOpposition: values.strengthOfOpposition,
        recentFightActivity: values.recentFightActivity,
        performanceConsistency: values.performanceConsistency,

        sourceNote: values.sourceNote,
    }
}