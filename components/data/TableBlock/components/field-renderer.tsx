'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { NocoDBColumn } from '@/services/nocodb'
import { NocoDBService } from '@/services/nocodb'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface FieldRendererProps {
  column: NocoDBColumn
  value: string
  onChange: (value: string) => void
}

export function FieldRenderer({ column, value, onChange }: FieldRendererProps) {
  const { uidt, title, column_name } = column
  const commonProps = {
    id: `field-${column_name}`,
    placeholder: `Enter ${title}`,
  }

  // Safely convert value to string, handling objects and arrays
  const safeValue =
    typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '')

  // Map NocoDB UI Data Types to appropriate input components
  switch (uidt) {
    case 'LongText':
    case 'MultiLineText':
      return (
        <Textarea
          {...commonProps}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="resize-y"
        />
      )

    case 'Checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={commonProps.id}
            checked={value === 'true' || value === '1' || Boolean(value)}
            onCheckedChange={(checked) => onChange(String(checked))}
          />
          <Label htmlFor={commonProps.id} className="cursor-pointer font-normal">
            {title}
          </Label>
        </div>
      )

    case 'Date':
      return <DatePicker value={value} onChange={onChange} placeholder={`Select ${title}`} />

    case 'DateTime':
      return <DateTimePicker value={value} onChange={onChange} placeholder={`Select ${title}`} />

    case 'Time':
      return (
        <Input
          {...commonProps}
          type="time"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'Number':
    case 'Decimal':
    case 'Currency':
    case 'Percent':
      return (
        <Input
          {...commonProps}
          type="number"
          step={uidt === 'Decimal' || uidt === 'Currency' || uidt === 'Percent' ? '0.01' : '1'}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'Email':
      return (
        <Input
          {...commonProps}
          type="email"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'URL':
      return (
        <Input
          {...commonProps}
          type="url"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'PhoneNumber':
      return (
        <Input
          {...commonProps}
          type="tel"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'SingleSelect':
      return (
        <Input
          {...commonProps}
          type="text"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Select ${title}`}
        />
      )

    case 'Rating':
      return (
        <Input
          {...commonProps}
          type="number"
          min="0"
          max="5"
          step="1"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'Duration':
      return (
        <Input
          {...commonProps}
          type="number"
          placeholder="Duration in seconds"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'Attachment':
      return <AttachmentField {...commonProps} value={value} onChange={onChange} />

    case 'LinkToAnotherRecord':
      console.log(value)
      return (
        <RelationalSelectField
          column={column}
          value={safeValue}
          onChange={onChange}
          placeholder={`Select ${title}`}
        />
      )

    case 'SingleLineText':
    case 'Text':
    default:
      return (
        <Input
          {...commonProps}
          type="text"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}

// Attachment field component
function AttachmentField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  const [fileName, setFileName] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  // Parse existing attachment value
  const existingFile = value
    ? (() => {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
        } catch {
          return null
        }
      })()
    : null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setFileName(file.name)

    try {
      // Convert file to base64 for simple storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const attachmentData = {
          title: file.name,
          mimetype: file.type,
          size: file.size,
          data: base64String,
        }
        onChange(JSON.stringify([attachmentData]))
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
        setFileName('')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
      setFileName('')
    }
  }

  const handleRemove = () => {
    onChange('')
    setFileName('')
  }

  return (
    <div className="space-y-2">
      {existingFile || fileName ? (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
          <div className="flex-1 text-sm truncate">
            {existingFile?.title || fileName}
            {existingFile?.size && (
              <span className="text-xs text-muted-foreground ml-2">
                ({(existingFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      {isUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
    </div>
  )
}

// Relational select field component
function RelationalSelectField({
  column,
  value,
  onChange,
  placeholder,
}: {
  column: NocoDBColumn
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [relatedRows, setRelatedRows] = useState<Array<{ id: string; title: string }>>([])
  const [error, setError] = useState<string | null>(null)

  // Extract the actual ID value from the relational field
  // It could be an object or a string
  const getValueId = (val: unknown): string => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (typeof val === 'object' && val !== null) {
      // If it's an object, try to get the id property
      const obj = val as Record<string, unknown>
      return String(obj.id || Object.values(obj)[0] || '')
    }
    return String(val)
  }

  const valueId = getValueId(value)
  console.log(valueId)

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get relational model ID and base ID from column options
        const relatedModelId = column.colOptions.fk_related_model_id
        const baseId = column.base_id

        // Fetch related records
        const rows = await NocoDBService.getRelatedRecords(relatedModelId)

        // Transform rows to { id, title } format
        // Try to find a suitable display column (name, title, etc.)
        const transformedRows = rows.map((row) => {
          const id = row.id || row.Id || Object.values(row)[0]
          // Try common display column names
          const title =
            (row.note as string) ||
            (row.name as string) ||
            (row.title as string) ||
            (row.Name as string) ||
            (row.Title as string) ||
            String(id)

          return {
            id: String(id),
            title: String(title),
          }
        })

        setRelatedRows(transformedRows)
      } catch (err) {
        console.error('Error fetching related data:', err)
        setError('Failed to load related records')
      } finally {
        setIsLoading(false)
      }
    }

    if (column.uidt === 'LinkToAnotherRecord') {
      fetchRelatedData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.id])

  return (
    <div className="space-y-2">
      <Select value={valueId} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {relatedRows.length > 0 ? (
            relatedRows.map((row) => (
              <SelectItem key={row.id} value={String(row.id)} className="min-w-[150px]">
                {row.title}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground text-center">
              {isLoading ? 'Loading related records...' : 'No related records available'}
            </div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
