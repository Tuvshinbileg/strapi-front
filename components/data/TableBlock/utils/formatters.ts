import { NocoDBColumn } from '@/services/nocodb'

/**
 * Format cell value for display based on column type
 */
export function formatCellValue(value: unknown, column: NocoDBColumn): string {
  if (value === null || value === undefined) return '-'

  const uidt = column.uidt?.toLowerCase() || ''

  if (uidt.includes('checkbox')) {
    return value ? '✓' : '✗'
  }

  if (uidt.includes('date') && !uidt.includes('datetime')) {
    return new Date(value as string).toLocaleDateString()
  }

  if (uidt.includes('datetime')) {
    return new Date(value as string).toLocaleString()
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

/**
 * Get visible columns (exclude system columns and nc-prefixed columns)
 */
export function getVisibleColumns(columns: NocoDBColumn[]): NocoDBColumn[] {
  const systemColumns = ['created_at', 'updated_at', 'nc_created_by', 'nc_updated_by', 'nc_order']

  return columns.filter((col) => {
    const columnName = col.column_name?.toLowerCase()

    if (systemColumns.includes(columnName)) {
      return false
    }

    return true
  })
}
