import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NocoDBColumn, NocoDBRow } from '@/services/nocodb'
import { TableRowActions } from './TableRowActions'
import { formatCellValue } from '../utils/formatters'

interface DataTableViewProps {
  columns: NocoDBColumn[]
  rows: NocoDBRow[]
  onEdit: (row: NocoDBRow) => void
  onDelete: (row: NocoDBRow) => void
}

export function DataTableView({ columns, rows, onEdit, onDelete }: DataTableViewProps) {
  // Filter out ID and system columns from display
  const hiddenColumns = ['Id', 'id', 'nc_created_by', 'nc_updated_by', 'CreatedAt', 'UpdatedAt']
  const visibleColumns = columns.filter((col) => {
    return !col.pk && !hiddenColumns.includes(col.column_name) && !hiddenColumns.includes(col.title)
  })

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.id}>{column.title}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow key="no-records">
              <TableCell colSpan={visibleColumns.length + 1} className="text-center text-muted-foreground">
                No records found. Click &ldquo;Add Record&rdquo; to create one.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index}>
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {formatCellValue(row[column.column_name], column)}
                  </TableCell>
                ))}
                <TableCell>
                  <TableRowActions
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
