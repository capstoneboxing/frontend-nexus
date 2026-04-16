import { perfectBoxersApi } from "@/lib/api-client"
import type {
    PerfectBoxerResponse,
    PerfectBoxerGenerationRequest,
    PerfectBoxerGenerationStartedResponse,
    PerfectBoxerBatchStatusResponse,
} from "@/generated-api/models"

export async function generatePerfectBoxer(
    perfectBoxerGenerationRequest: PerfectBoxerGenerationRequest
): Promise<PerfectBoxerGenerationStartedResponse> {
    return await perfectBoxersApi.generate({ perfectBoxerGenerationRequest })
}

export async function fetchActivePerfectBoxerByWeightClassId(
    weightClassId: number
): Promise<PerfectBoxerResponse> {
    return await perfectBoxersApi.getActiveByWeightClassId({ weightClassId })
}

export async function fetchAllActivePerfectBoxers(): Promise<PerfectBoxerResponse[]> {
    return await perfectBoxersApi.getAllActivePerfectBoxers()
}

export async function fetchPerfectBoxerById(
    id: number
): Promise<PerfectBoxerResponse> {
    return await perfectBoxersApi.getById1({ id })
}

export async function fetchPerfectBoxerBatchStatus(
    batchId: number
): Promise<PerfectBoxerBatchStatusResponse> {
    return await perfectBoxersApi.getBatchStatus({ batchId })
}

export async function recalculatePerfectBoxerByWeightClass(
    weightClassId: number
): Promise<PerfectBoxerResponse> {
    return await perfectBoxersApi.recalculateByWeightClass({ weightClassId })
}