import { weightClassesApi } from "@/lib/api-client"
import type { WeightClassResponse } from "@/generated-api/models"

export async function fetchWeightClasses(): Promise<WeightClassResponse[]> {
    return await weightClassesApi.getWeightClasses()
}

export async function fetchWeightClassById(id: number): Promise<WeightClassResponse> {
    return await weightClassesApi.getWeightClassById({ id })
}

export async function fetchWeightClassByName(className: string): Promise<WeightClassResponse> {
    return await weightClassesApi.getWeightClassByName({ className })
}