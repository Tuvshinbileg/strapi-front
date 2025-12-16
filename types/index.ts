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
  [key: string]: any;
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

// UserTable Widget Props
export interface UserTableProps {
  data: {
    title: string;
    limit: number;
    [key: string]: any;
  };
}

// RevenueChart Widget Props
export interface RevenueChartProps {
  data: {
    title: string;
    currency: string;
    [key: string]: any;
  };
}

// Generic Block Component Props
export interface BlockComponentProps {
  data: Record<string, any>;
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
