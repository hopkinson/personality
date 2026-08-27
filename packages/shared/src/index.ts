export const APP_NAME = 'PERSONALITY' as const

export const RECORD_TYPES = [
  'note',
  'caffeine',
  'drink',
  'stretch',
  'custom',
] as const

export type RecordType = (typeof RECORD_TYPES)[number]

export interface PersonalityRecord {
  id: string
  userId: string
  type: RecordType
  content: string
  occurredAt: string
  structuredData?: Record<string, unknown>
  createdAt: string
}

export interface HealthResponse {
  status: 'ok'
  service: string
  app: typeof APP_NAME
}
