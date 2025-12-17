import axios from 'axios';
import { NcPage, NcMenu, NcBlock } from '@/types';
import { Api } from 'nocodb-sdk';
import {
  NocoDBColumn,
  NocoDBTable,
  NocoDBBase,
  NocoDBRow,
  NocoDBListResponse,
} from '@/types/index';

const MENU_PATH = process.env.NEXT_PUBLIC_NOCODB_MENU_API_PATH || '';
const PAGE_PATH = process.env.NEXT_PUBLIC_NOCODB_PAGE_API_PATH || '';
const BLOCK_PATH = process.env.NEXT_PUBLIC_NOCODB_BLOCK_API_PATH || '';

const ncApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOCODB_URL || 'http://localhost:8080',
  headers: {
    'xc-token': process.env.NEXT_PUBLIC_NOCODB_API_TOKEN,
  },
});

const nocodbApi = new Api({
  baseURL: process.env.NEXT_PUBLIC_NOCODB_URL,
  headers: {
    'xc-token': process.env.NEXT_PUBLIC_NOCODB_API_TOKEN,
  },
});

export const nocoDbApiService = {
  async getMenus(): Promise<NcMenu[]> {
    try {
      const {
        data: { list },
      } = await ncApi.get(MENU_PATH);

      return list;
    } catch (error) {
      console.error('Error fetching menus from Strapi:', error);
      return [];
    }
  },

  async getPages(): Promise<NcPage[]> {
    try {
      const {
        data: { list },
      } = await ncApi.get(PAGE_PATH);
      return list;
    } catch (error) {
      console.error('Error fetching pages from Strapi:', error);
      return [];
    }
  },

  async getPageBlocks(pageId: string): Promise<NcBlock[]> {
    try {
      const {
        data: { list },
      } = await ncApi.get(`${BLOCK_PATH}&where=(page,eq,${pageId})`);
      return list;
    } catch (error) {
      console.error('Error fetching page blocks from NocoDB:', error);
      return [];
    }
  },

  /**
   * Fetch all bases/projects
   */
  async getBases(): Promise<NocoDBBase[]> {
    try {
      const response = await nocodbApi.base.list();
      return (response.list || []) as NocoDBBase[];
    } catch (error) {
      console.error('Error fetching bases:', error);
      throw new Error('Failed to fetch NocoDB bases');
    }
  },

  /**
   * Fetch all tables in a base
   */
  async getTables(baseId: string): Promise<NocoDBTable[]> {
    try {
      const response = await nocodbApi.dbTable.list(baseId);
      return (response.list || []) as NocoDBTable[];
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw new Error(`Failed to fetch tables for base ${baseId}`);
    }
  },

  /**
   * Find table by name across all bases
   * Returns the first matching table found
   */
  async findTableByName(
    tableName: string
  ): Promise<{ table: NocoDBTable; baseId: string } | null> {
    try {
      const bases = await this.getBases();

      for (const base of bases) {
        const tables = await this.getTables(base.id);
        const matchedTable = tables.find(
          (table) =>
            table.title.toLowerCase() === tableName.toLowerCase() ||
            table.table_name.toLowerCase() === tableName.toLowerCase()
        );

        if (matchedTable) {
          return {
            table: matchedTable,
            baseId: base.id,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding table:', error);
      throw new Error(`Failed to find table "${tableName}"`);
    }
  },

  /**
   * Parse source string into baseId and tableId
   * Format: "baseId.tableId" (e.g., "p123.t456")
   * Used internally by API routes after findTableByName
   */
  parseSource(source: string): { baseId: string; tableId: string } {
    const parts = source.split('.');
    if (parts.length !== 2) {
      throw new Error(
        'Invalid source format. Expected format: "baseId.tableId"'
      );
    }
    return {
      baseId: parts[0],
      tableId: parts[1],
    };
  },

  // Get table metadata
  async getTableMetadata(tableId: string): Promise<NocoDBTable | null> {
    try {
      const response = await nocodbApi.dbTable.read(tableId);
      return response as NocoDBTable;
    } catch (error) {
      console.error('Error fetching table metadata:', error);
      return null;
    }
  },

  /**
   * Fetch table rows
   */
  async getRows(
    baseId: string,
    tableId: string,
    options?: {
      limit?: number;
      offset?: number;
      where?: string;
      sort?: string;
    }
  ): Promise<NocoDBListResponse> {
    try {
      const response = await nocodbApi.dbTableRow.list(
        'noco',
        baseId,
        tableId,
        options
      );
      return response as NocoDBListResponse;
    } catch (error) {
      console.error('Error fetching rows:', error);
      throw new Error(`Failed to fetch rows for table ${tableId}`);
    }
  },

  /**
   * Create a new row
   */
  async createRow(
    baseId: string,
    tableId: string,
    data: Record<string, unknown>
  ): Promise<NocoDBRow> {
    try {
      const response = await nocodbApi.dbTableRow.create(
        'noco',
        baseId,
        tableId,
        data
      );
      return response as NocoDBRow;
    } catch (error) {
      console.error('Error creating row:', error);
      throw new Error(`Failed to create row in table ${tableId}`);
    }
  },

  /**
   * Update an existing row
   */
  async updateRow(
    baseId: string,
    tableId: string,
    rowId: string,
    data: Record<string, unknown>
  ): Promise<NocoDBRow> {
    try {
      const response = await nocodbApi.dbTableRow.update(
        'noco',
        baseId,
        tableId,
        rowId,
        data
      );
      return response as NocoDBRow;
    } catch (error) {
      console.error('Error updating row:', error);
      throw new Error(`Failed to update row ${rowId} in table ${tableId}`);
    }
  },

  /**
   * Delete a row
   */
  async deleteRow(
    baseId: string,
    tableId: string,
    rowId: string
  ): Promise<void> {
    try {
      await nocodbApi.dbTableRow.delete('noco', baseId, tableId, rowId);
    } catch (error) {
      console.error('Error deleting row:', error);
      throw new Error(`Failed to delete row ${rowId} from table ${tableId}`);
    }
  },

  /**
   * Get primary key column
   */
  getPrimaryKeyColumn(columns: NocoDBColumn[]): NocoDBColumn | undefined {
    return columns.find((col) => col.pk === true);
  },

  /**
   * Get visible columns (exclude system columns)
   */
  getVisibleColumns(columns: NocoDBColumn[]): NocoDBColumn[] {
    // Filter out common system columns like CreatedAt, UpdatedAt, etc.
    const systemColumns = [
      'created_at',
      'updated_at',
      'created_by',
      'updated_by',
    ];
    return columns.filter(
      (col) =>
        !col.column_name ||
        !systemColumns.includes(col.column_name.toLowerCase())
    );
  },

  /**
   * Determine input type based on column metadata
   */
  getInputType(column: NocoDBColumn): string {
    const uidt = column.uidt?.toLowerCase() || '';

    // Map NocoDB UI Data Types to HTML input types
    if (uidt.includes('singlelinetext') || uidt.includes('longtext')) {
      return 'text';
    }
    if (uidt.includes('email')) {
      return 'email';
    }
    if (uidt.includes('url')) {
      return 'url';
    }
    if (uidt.includes('phonenumber')) {
      return 'tel';
    }
    if (
      uidt.includes('number') ||
      uidt.includes('decimal') ||
      uidt.includes('currency')
    ) {
      return 'number';
    }
    if (uidt.includes('checkbox')) {
      return 'checkbox';
    }
    if (uidt.includes('date')) {
      return 'date';
    }
    if (uidt.includes('datetime')) {
      return 'datetime-local';
    }
    if (uidt.includes('time')) {
      return 'time';
    }

    // Default to text
    return 'text';
  },

  /**
   * Check if column is editable
   */
  isColumnEditable(column: NocoDBColumn): boolean {
    // Don't allow editing primary key or auto-increment columns
    if (column.pk || column.ai) {
      return false;
    }
    return true;
  },

  /**
   * Fetch related records for a relational field
   */
  async getRelatedRecords(
    relatedTableId?: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<NocoDBRow[]> {
    try {
      const _options = {
        offset: options?.offset || 0,
        limit: options?.limit || 100,
      };

      const response = await ncApi.get(
        `/api/v2/tables/${relatedTableId}/records?offset=${_options.offset}&limit=${_options.limit}`
      );

      return (response.data.list || []) as NocoDBRow[];
    } catch (error) {
      console.error('Error fetching related records:', error);
      throw new Error(
        `Failed to fetch related records from table ${relatedTableId}`
      );
    }
  },
};
