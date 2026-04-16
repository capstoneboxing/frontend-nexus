import { authenticationApi } from "@/lib/api-client"
import type {
    AdminResponse,
    AuthRequest,
    AuthResponse,
} from "@/generated-api/models"

export async function login(authRequest: AuthRequest): Promise<AuthResponse> {
    return await authenticationApi.login({ authRequest })
}

export async function fetchCurrentAdmin(): Promise<AdminResponse> {
    return await authenticationApi.getCurrentAdmin()
}