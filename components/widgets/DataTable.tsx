/**
 * components/widgets/DataTable.tsx - Өгөгдлийн хүснэгт Widget
 * 
 * 📝 Үүрэг:
 * - Strapi blocks.table component-ийг render хийнэ
 * - source болон display property-г ашиглана
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DataTableProps {
  data: {
    id?: string;
    source?: string;
    display?: string;
    [key: string]: any;
  };
}

export default function DataTable({ data }: DataTableProps) {
  const { source = 'N/A', display = 'Table' } = data;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{display}</h3>
        <Badge variant="outline">{source}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Source: <code className="bg-gray-100 px-2 py-1 rounded">{source}</code></p>
      </div>
    </div>
  );
}
