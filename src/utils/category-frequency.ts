import { recordApi, type RecordData } from '../api/record'

const DAYS = 30
const TOP_N = 4

export interface CategoryFrequency {
  typeId: number
  count: number
  lastUsedAt: string
}

export async function getFrequentCategoryIds(type: 'income' | 'expense'): Promise<CategoryFrequency[]> {
  try {
    const res = await recordApi.getAllRecords()
    if (!res.success || !res.data) return []

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - DAYS)
    const cutoffStr = cutoff.toISOString().split('T')[0]

    const freqMap = new Map<number, { count: number; lastUsedAt: string }>()

    for (const record of res.data) {
      if (record.date < cutoffStr) continue
      if (record.type !== type) continue

      const existing = freqMap.get(record.typeId)
      if (existing) {
        existing.count++
        if (record.date > existing.lastUsedAt) {
          existing.lastUsedAt = record.date
        }
      } else {
        freqMap.set(record.typeId, { count: 1, lastUsedAt: record.date })
      }
    }

    const sorted = Array.from(freqMap.entries())
      .map(([typeId, data]) => ({
        typeId,
        count: data.count,
        lastUsedAt: data.lastUsedAt
      }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return b.lastUsedAt.localeCompare(a.lastUsedAt)
      })

    return sorted.slice(0, TOP_N)
  } catch {
    return []
  }
}
