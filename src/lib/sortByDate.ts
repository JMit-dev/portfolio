export function parseLooseDate(d?: string): number {
  if (!d) return 0
  // ISO / standard dates (2025-11-01, Nov 1 2025, etc.)
  const direct = new Date(d)
  if (!isNaN(direct.getTime())) return direct.getTime()
  // "Nov 2025" or "November 2025"
  const monthYear = d.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (monthYear) {
    const parsed = new Date(`${monthYear[1]} 1, ${monthYear[2]}`)
    if (!isNaN(parsed.getTime())) return parsed.getTime()
  }
  // "2025" bare year
  const yearOnly = d.match(/^(\d{4})$/)
  if (yearOnly) return new Date(`Jan 1, ${yearOnly[1]}`).getTime()
  return 0
}

export function sortByDateDesc<T extends { date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => parseLooseDate(b.date) - parseLooseDate(a.date))
}
