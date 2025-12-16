import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableToolbarProps {
  onAdd: () => void
}

export function TableToolbar({ onAdd }: TableToolbarProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Records</h3>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
    </div>
  )
}
