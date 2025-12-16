import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableRowActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export function TableRowActions({ onEdit, onDelete }: TableRowActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
