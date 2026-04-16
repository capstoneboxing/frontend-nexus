import { allTimeRankedBoxersApi } from "@/lib/api-client"
import type {
    AllTimeRankedBoxerResponse,
    AllTimeRankedBoxerUpdateRequest,
    AllTimeRankedBoxerWithBatchStatusResponse,
    GenerateBoxerRequest,
    GeneratedBoxerResponse,
} from "@/generated-api/models"

export async function generateBoxer(
    generateBoxerRequest: GenerateBoxerRequest,
    initOverrides?: RequestInit
): Promise<GeneratedBoxerResponse> {
    return await allTimeRankedBoxersApi.generateBoxer(
        { generateBoxerRequest },
        initOverrides
    )
}

export async function fetchAllActiveRankedBoxers(): Promise<AllTimeRankedBoxerResponse[]> {
    return await allTimeRankedBoxersApi.getAllActive()
}

export async function fetchAllRankedBoxersWithBatchStatus(): Promise<
    AllTimeRankedBoxerWithBatchStatusResponse[]
> {
    return await allTimeRankedBoxersApi.getAllWithBatchStatus()
}

export async function fetchRankedBoxerById(
    id: number
): Promise<AllTimeRankedBoxerResponse> {
    return await allTimeRankedBoxersApi.getById({ id })
}

export async function fetchRankedBoxersByBatchId(
    batchId: number
): Promise<AllTimeRankedBoxerResponse[]> {
    return await allTimeRankedBoxersApi.getByBatchId({ batchId })
}

export async function fetchRankedBoxersByWeightClassId(
    weightClassId: number
): Promise<AllTimeRankedBoxerResponse[]> {
    return await allTimeRankedBoxersApi.getByWeightClassId1({ weightClassId })
}

export async function fetchActiveRankedBoxersByWeightClassId(
    weightClassId: number
): Promise<AllTimeRankedBoxerResponse[]> {
    return await allTimeRankedBoxersApi.getActiveByWeightClassId1({ weightClassId })
}

export async function updateRankedBoxer(
    id: number,
    allTimeRankedBoxerUpdateRequest: AllTimeRankedBoxerUpdateRequest
): Promise<AllTimeRankedBoxerResponse> {
    return await allTimeRankedBoxersApi.update({
        id,
        allTimeRankedBoxerUpdateRequest,
    })
}