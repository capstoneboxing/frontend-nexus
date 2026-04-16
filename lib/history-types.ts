export type WinnerToken = "BOXER_A" | "BOXER_B" | "DRAW" | string

export type CategoryScoreBreakdown = {
    physical?: number
    tactical?: number
    technical?: number
    experience?: number
    psychological?: number
}

export type ClosenessBreakdown = {
    base?: number
    adjusted?: number
}

export type BreakdownSnapshot = {
    closeness?: {
        boxerA?: ClosenessBreakdown
        boxerB?: ClosenessBreakdown
    }
    aiExplanation?: string
    overallScores?: {
        boxerA?: number
        boxerB?: number
        perfectBoxer?: number
    }
    probabilities?: {
        boxerA?: number
        boxerB?: number
    }
    categoryScores?: {
        boxerA?: CategoryScoreBreakdown
        boxerB?: CategoryScoreBreakdown
        perfectBoxer?: CategoryScoreBreakdown
    }
    attributeConfidence?: {
        boxerA?: number
        boxerB?: number
    }
    predictedWinner?: WinnerToken
}

export type HistoryStatus = "pending" | "correct" | "incorrect" | "draw"

export type PredictionHistoryUI = {
    id: number
    boxerAName: string
    boxerBName: string

    predictedWinnerRaw: WinnerToken
    predictedWinnerLabel: string

    matchWinnerRaw: string | null
    matchWinnerLabel: string | null
    matchWinMethod: string | null

    weightClassId: number | null
    weightClassName: string

    boxerAClosenessScore: number
    boxerBClosenessScore: number
    probabilityA: number
    probabilityB: number

    predictionDate: Date | null
    predictionDateLabel: string
    predictionTimeLabel: string

    breakdownSnapshot: BreakdownSnapshot | null
    aiExplanation: string

    status: HistoryStatus
}