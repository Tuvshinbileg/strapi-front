/**
 * Strapi Dynamic Zone-ийн type definitions
 *
 * Strapi дээрээс ирсэн API response-уудын структурыг тодорхойлдог.
 */

export interface SidebarProps {
  pages: PageResponse[];
}

export interface PageBlock {
  __component: string;
  id: string;
}

export interface PageResponse {
  id: string;
  title: string;
  slug: string;
  content?: PageBlock[];
  blocks?: PageBlock[];
  createdAt?: string;
  updatedAt?: string;
}


// Mock User Data Type
export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

// Mock Revenue Data Type
export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface NcPage {
  Id: string;
  title: string;
  slug: string;
  enabled: boolean;
}

export interface NcMenu {
  Id: string;
  id: string;
  title: string;
  slug: string;
  content?: PageBlock[];
  blocks?: PageBlock[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NcBlock {
  Id: string;
  id: string;
  title: string;
  source: string;
  page: string;
  type: string;
}

// Re-export NocoDB types
export type {
  NocoDBColumn,
  NocoDBRow,
  NocoDBListResponse,
  NocoDBBase,
  NocoDBTable,
} from './nocodb_data';
