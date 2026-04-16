import type { PredictionHistoryResponse } from "@/generated-api/models"
import type {
    BreakdownSnapshot,
    HistoryStatus,
    PredictionHistoryUI,
    WinnerToken,
} from "@/lib/history-types"

function resolveWinnerLabel(
    winner: WinnerToken | null | undefined,
    boxerAName: string,
    boxerBName: string
): string | null {
    if (!winner) return null
    if (winner === "BOXER_A") return boxerAName
    if (winner === "BOXER_B") return boxerBName
    if (winner === "DRAW") return "Draw"
    return winner
}

function determineStatus(
    predictedWinner: WinnerToken | null | undefined,
    matchWinner: string | null | undefined,
    boxerAName: string,
    boxerBName: string
): HistoryStatus {
    if (!matchWinner) return "pending"

    const predictedLabel = resolveWinnerLabel(predictedWinner, boxerAName, boxerBName)
    const actualLabel = resolveWinnerLabel(matchWinner, boxerAName, boxerBName)

    if (actualLabel === "Draw") return "draw"
    if (predictedLabel && actualLabel && predictedLabel === actualLabel) return "correct"
    return "incorrect"
}

function formatPredictionDate(date: Date | null): string {
    if (!date) return "N/A"

    const month = date.toLocaleString("en-US", { month: "long" })
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month}, ${day}, ${year}`
}

export function mapPredictionHistoryToUI(
    item: PredictionHistoryResponse
): PredictionHistoryUI {
    const boxerAName = item.boxerAName ?? "Boxer A"
    const boxerBName = item.boxerBName ?? "Boxer B"
    const predictionDate = item.predictionDate ?? null
    const breakdownSnapshot =
        (item.breakdownSnapshot as BreakdownSnapshot | undefined) ?? null

    return {
        id: item.predictionId ?? 0,
        boxerAName,
        boxerBName,

        predictedWinnerRaw: item.predictedWinner ?? "",
        predictedWinnerLabel:
            resolveWinnerLabel(item.predictedWinner, boxerAName, boxerBName) ?? "Unknown",

        matchWinnerRaw: item.matchWinner ?? null,
        matchWinnerLabel:
            resolveWinnerLabel(item.matchWinner, boxerAName, boxerBName) ?? null,
        matchWinMethod: item.matchWinMethod ?? null,

        weightClassId: item.weightClassId ?? null,
        weightClassName: "Unknown",

        boxerAClosenessScore: item.boxerAClosenessScore ?? 0,
        boxerBClosenessScore: item.boxerBClosenessScore ?? 0,
        probabilityA: item.probabilityA ?? 0,
        probabilityB: item.probabilityB ?? 0,

        predictionDate,
        predictionDateLabel: formatPredictionDate(predictionDate),
        predictionTimeLabel: predictionDate
            ? predictionDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
            })
            : "N/A",

        breakdownSnapshot,
        aiExplanation:
            breakdownSnapshot?.aiExplanation ??
            "No explanation available.",

        status: determineStatus(
            item.predictedWinner,
            item.matchWinner,
            boxerAName,
            boxerBName
        ),
    }
}