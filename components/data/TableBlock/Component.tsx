import React from 'react';
import { nocoDbApiService } from '@/lib/noco_api';

import { DataTable } from './DataTable';
import { getVisibleColumns } from './utils/formatters';
import { Card, CardContent } from '@/components/ui/card';

export const TableBlock: React.FC<{ source: string }> = async ({ source }) => {
  // Validate source
  if (!source) {
    return (
      <div className='bg-card rounded border-border border p-6'>
        <p className='text-destructive'>Error: No data source specified</p>
        <p className='text-sm text-muted-foreground mt-2'>
          Please provide a table name (e.g., &ldquo;tasks&rdquo; or
          &ldquo;customers&rdquo;)
        </p>
      </div>
    );
  }

  try {
    // Find table by name across all bases
    const tableInfo = await nocoDbApiService.findTableByName(source);

    if (!tableInfo) {
      return (
        <div className='bg-card rounded border-border border p-6'>
          <p className='text-destructive'>
            Error: Table &ldquo;{source}&rdquo; not found
          </p>
          <p className='text-sm text-muted-foreground mt-2'>
            Make sure the table name is correct and exists in your NocoDB
            instance.
          </p>
        </div>
      );
    }

    const { table, baseId } = tableInfo;
    const tableId = table.id;

    // Fetch columns and rows in parallel
    const [tableMetaData, rowsData] = await Promise.all([
      nocoDbApiService.getTableMetadata(tableId),
      nocoDbApiService.getRows(baseId, tableId, { limit: 100 }),
    ]);

    const columns = tableMetaData?.columns;

    if (!columns || columns.length === 0) {
      return (
        <div className='bg-card rounded border-border border p-6'>
          <p className='text-destructive'>
            Error: No columns found for table &ldquo;{table.title}&rdquo;
          </p>
        </div>
      );
    }

    // Pass tableId and baseId as part of source for API calls
    const dataSource = `${baseId}.${tableId}`;

    return (
      <Card className='mb-8'>
        <CardContent className='rounded'>
          <div className='mb-4'>
            <h2 className='text-2xl font-bold'>{table.title}</h2>
            {table.table_name && (
              <p className='text-sm text-muted-foreground'>
                Table: {table.table_name}
              </p>
            )}
          </div>
          <DataTable
            source={dataSource}
            columns={getVisibleColumns(columns)}
            initialRows={rowsData.list || []}
          />
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error loading TableBlock:', error);
    return (
      <Card>
        <CardContent>
          <div className='container py-8'>
            <div className='bg-card rounded border-border border p-6'>
              <p className='text-destructive'>Error loading table data</p>
              <p className='text-sm text-muted-foreground mt-2'>
                {error instanceof Error
                  ? error.message
                  : 'An unknown error occurred'}
              </p>
              <p className='text-sm text-muted-foreground mt-2'>
                Make sure NOCODB_URL and NOCODB_API_TOKEN are configured
                correctly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};
