'use client'

import React, { useState } from 'react'
import { NocoDBColumn, NocoDBRow } from '@/services/nocodb'
import { DynamicForm } from './DynamicForm'
import { TableToolbar } from './components/TableToolbar'
import { DataTableView } from './components/DataTableView'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { useTableData } from './hooks/useTableData'

interface DataTableProps {
  source: string
  columns: NocoDBColumn[]
  initialRows: NocoDBRow[]
}

export function DataTable({ source, columns, initialRows }: DataTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState<NocoDBRow | null>(null)
  const [deleteRow, setDeleteRow] = useState<NocoDBRow | null>(null)

  // Get primary key column
  const pkColumn = columns.find((col) => col.pk)

  // Helper to extract row ID - tries both column_name and title
  const getRowId = (row: NocoDBRow) => {
    if (!pkColumn) return row['id'] || row['Id']
    return row[pkColumn.column_name] ?? row[pkColumn.title] ?? row['id'] ?? row['Id']
  }
  // Use custom hook for data operations
  const {
    rows,
    isSubmitting,
    isDeleting,
    handleCreate: createRecord,
    handleUpdate: updateRecord,
    handleDelete: deleteRecord,
  } = useTableData({ source, initialRows })

  // Handle create with dialog close
  const handleCreate = async (data: Record<string, unknown>) => {
    await createRecord(data)
    setIsCreateOpen(false)
  }

  // Handle update with dialog close
  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editRow) return
    const rowId = getRowId(editRow)

    // Remove ID and timestamp fields from data (they shouldn't be updated)
    const { id: _id, Id: _Id, CreatedAt: _ca, UpdatedAt: _ua, ...updateData } = data

    await updateRecord(rowId, updateData)
    setEditRow(null)
  }

  // Handle delete with dialog close
  const handleDelete = async () => {
    if (!deleteRow) return
    const rowId = getRowId(deleteRow)
    const success = await deleteRecord(rowId)
    if (success) {
      setDeleteRow(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <TableToolbar onAdd={() => setIsCreateOpen(true)} />

      {/* Table */}
      <DataTableView columns={columns} rows={rows} onEdit={setEditRow} onDelete={setDeleteRow} />

      {/* Create Dialog */}
      <DynamicForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        columns={columns}
        mode="create"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Edit Dialog */}
      {editRow && (
        <DynamicForm
          open={!!editRow}
          onOpenChange={(open) => !open && setEditRow(null)}
          columns={columns}
          mode="edit"
          initialData={editRow}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteRow}
        onOpenChange={(open) => !open && setDeleteRow(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
