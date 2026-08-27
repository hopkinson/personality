import type { HealthResponse } from '@personality/shared'

export interface ApiClientOptions {
  baseUrl: string
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export function createApiClient({ baseUrl }: ApiClientOptions) {
  return {
    async health(): Promise<HealthResponse> {
      const response = await globalThis.fetch(joinUrl(baseUrl, '/health'))

      if (!response.ok) {
        throw new Error(`PERSONALITY API request failed: ${response.status}`)
      }

      return (await response.json()) as HealthResponse
    },
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
