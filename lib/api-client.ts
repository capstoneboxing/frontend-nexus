import { Configuration } from "@/generated-api/runtime"
import {
    AllTimeRankedBoxersApi,
    AuthenticationApi,
    CategoryWeightsApi,
    MatchPredictionApi,
    PerfectBoxersApi,
    PredictionHistoryApi,
    WeightClassesApi,
} from "@/generated-api/apis"
import { getToken } from "@/lib/auth"

const config = new Configuration({
    basePath: "/api/proxy",
    accessToken: async (_name?: string, _scopes?: string[]) => getToken() ?? "",
})

export const allTimeRankedBoxersApi = new AllTimeRankedBoxersApi(config)
export const authenticationApi = new AuthenticationApi(config)
export const categoryWeightsApi = new CategoryWeightsApi(config)
export const matchPredictionApi = new MatchPredictionApi(config)
export const perfectBoxersApi = new PerfectBoxersApi(config)
export const predictionHistoryApi = new PredictionHistoryApi(config)
export const weightClassesApi = new WeightClassesApi(config)