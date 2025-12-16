'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { NocoDBColumn, NocoDBRow } from '@/services/nocodb'
import { FieldRenderer } from './components/field-renderer'

interface DynamicFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: NocoDBColumn[]
  mode: 'create' | 'edit'
  initialData?: NocoDBRow
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isSubmitting: boolean
}

export function DynamicForm({
  open,
  onOpenChange,
  columns,
  mode,
  initialData,
  onSubmit,
  isSubmitting,
}: DynamicFormProps) {
  const form = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: (initialData || {}) as any,
  })

  const handleSubmit = async (data: Record<string, unknown>) => {
    await onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  // Filter out primary key, auto-increment, and system columns
  // Keep relational fields (LinkToAnotherRecord) but exclude other computed types
  const systemColumns = ['nc_created_by', 'nc_updated_by', 'CreatedAt', 'UpdatedAt']
  const computedTypes = ['Lookup', 'Rollup', 'Formula', 'Links', 'Count']

  const editableColumns = columns.filter((col) => {
    // Exclude PK, AI, and system columns
    if (col.pk || col.ai) return false
    if (
      (col.column_name && systemColumns.includes(col.column_name)) ||
      (col.title && systemColumns.includes(col.title))
    )
      return false
    // Exclude computed columns but keep relational fields
    if (computedTypes.includes(col.uidt)) return false
    return true
  })

  const renderField = (column: NocoDBColumn) => {
    // For relational fields, use title as the name since column_name is null
    const fieldName = column.column_name || column.title

    // Skip rendering if we can't determine a field name
    if (!fieldName) {
      console.warn('Column missing both column_name and title:', column)
      return null
    }

    return (
      <FormField
        key={column.id}
        control={form.control}
        name={fieldName}
        rules={{
          required: column.rqd ? `${column.title} is required` : false,
        }}
        render={({ field }) => (
          <FormItem>
            {column.uidt !== 'Checkbox' && (
              <FormLabel>
                {column.title}
                {column.rqd && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FieldRenderer
              column={column}
              value={String(field.value ?? '')}
              onChange={(value) => field.onChange(value)}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Record' : 'Edit Record'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the form below to create a new record.'
              : 'Update the fields below to edit this record.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableColumns.map((column) => renderField(column))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
