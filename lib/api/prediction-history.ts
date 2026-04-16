import { predictionHistoryApi } from "@/lib/api-client"
import type {
    PredictionHistoryResponse,
    PredictionResultUpdateRequest,
} from "@/generated-api/models"

export async function fetchPredictionHistories(): Promise<PredictionHistoryResponse[]> {
    return await predictionHistoryApi.getPredictionHistories()
}

export async function fetchPredictionHistoryById(
    id: number
): Promise<PredictionHistoryResponse> {
    return await predictionHistoryApi.getPredictionHistoryById({ id })
}

export async function updatePredictionHistory(
    id: number,
    predictionResultUpdateRequest: PredictionResultUpdateRequest
): Promise<PredictionHistoryResponse> {
    return await predictionHistoryApi.updatePredictionHistory({
        id,
        predictionResultUpdateRequest,
    })
}

export async function deletePredictionHistory(id: number): Promise<void> {
    return await predictionHistoryApi.deletePredictionHistory({ id })
}