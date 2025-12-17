/**
 * NocoDB базын өгөгдлийн структур ба type definitions
 */

// Base NocoDB Record Interface
export interface NocoDBColumn {
  id: string
  title: string
  column_name?: string | null
  uidt: string // UI Data Type
  dt?: string | null // Data Type
  pk?: boolean
  rqd?: boolean // Required
  unique?: boolean
  ai?: boolean // Auto Increment
  cdf?: string // Column Default Value
  dtxp?: string // Data Type Extra Params
  dtxs?: string // Data Type Extra Scale
  description?: string
  source_id?: string
  base_id?: string
  fk_model_id?: string // Foreign key model ID for relational fields
  np?: string | null
  ns?: string | null
  colOptions: {
    fk_related_model_id?: string
    fk_mm_model_id?: string
    fk_mm_child_column_id?: string
    fk_mm_parent_column_id?: string
    fk_parent_column_id?: string
    fk_child_column_id?: string
    type?: string // 'has_one' | 'has_many' | 'many_to_many'
    fk_label_column_id?: string // Column to use as display label
  }
}

export interface NocoDBRow {
  [key: string]: unknown
}

export interface NocoDBListResponse {
  list: NocoDBRow[]
  pageInfo: {
    totalRows?: number
    page?: number
    pageSize?: number
    isFirstPage?: boolean
    isLastPage?: boolean
  }
}

export interface NocoDBBase {
  id: string
  title: string
  prefix?: string
  status?: string
  description?: string
  meta?: unknown
  color?: string
  deleted?: boolean
  order?: number
  project_id?: string
  created_at?: string
  updated_at?: string
}

export interface NocoDBTable {
  id: string
  title: string
  table_name: string
  type?: string
  enabled?: boolean
  base_id?: string
  project_id?: string
  meta?: unknown
  schema?: unknown
  columns?: NocoDBColumn[]
}