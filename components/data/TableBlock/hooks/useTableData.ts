import { useState } from 'react'
import { toast } from 'sonner'
import { NocoDBRow } from '@/services/nocodb'

interface UseTableDataProps {
  source: string
  initialRows: NocoDBRow[]
}

export function useTableData({ source, initialRows }: UseTableDataProps) {
  const [rows, setRows] = useState<NocoDBRow[]>(initialRows)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Refresh data from server
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/nocodb/rows?source=${encodeURIComponent(source)}`)
      if (!response.ok) throw new Error('Failed to fetch rows')

      const data = await response.json()
      setRows(data.list || [])
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error('Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle create
  const handleCreate = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/nocodb/rows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, data }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create record')
      }

      toast.success('Record created successfully')
      await refreshData()
      return true
    } catch (error) {
      console.error('Error creating record:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create record')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle update
  const handleUpdate = async (rowId: unknown, data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/nocodb/rows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, rowId, data }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update record')
      }

      toast.success('Record updated successfully')
      await refreshData()
      return true
    } catch (error) {
      console.error('Error updating record:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update record')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (rowId: unknown) => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/nocodb/rows', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, rowId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete record')
      }

      toast.success('Record deleted successfully')
      await refreshData()
      return true
    } catch (error) {
      console.error('Error deleting record:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete record')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    rows,
    isLoading,
    isSubmitting,
    isDeleting,
    refreshData,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
