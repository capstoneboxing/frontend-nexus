import { categoryWeightsApi } from "@/lib/api-client"
import type {
    CategoryWeightResponse,
    CategoryWeightUpdateRequest,
} from "@/generated-api/models"

export async function fetchCategoryWeights(): Promise<CategoryWeightResponse[]> {
    return await categoryWeightsApi.getAll()
}

export async function fetchCategoryWeightByWeightClassId(
    weightClassId: number
): Promise<CategoryWeightResponse> {
    return await categoryWeightsApi.getByWeightClassId({ weightClassId })
}

export async function updateCategoryWeightByWeightClassId(
    weightClassId: number,
    categoryWeightUpdateRequest: CategoryWeightUpdateRequest
): Promise<CategoryWeightResponse> {
    return await categoryWeightsApi.updateByWeightClassId({
        weightClassId,
        categoryWeightUpdateRequest,
    })
}