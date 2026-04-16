import { matchPredictionApi } from "@/lib/api-client"
import type {
    PredictMatchRequest,
    PredictionResponse,
} from "@/generated-api/models"

export async function predictMatch(
    predictMatchRequest: PredictMatchRequest
): Promise<PredictionResponse> {
    return await matchPredictionApi.predict({ predictMatchRequest })
}