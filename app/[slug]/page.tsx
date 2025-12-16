/**
 * app/[slug]/page.tsx - Динамик хуудасны үндсэн Server Component
 * 
 * 📝 Үүрэг:
 * - URL-ийн `slug` параметрийг ашиглан Strapi API дээрээс тухайн хуудасны мэдээлэл, 
 *   Dynamic Zone (widgets)-ийн бүтэц (config)-ийг татах
 * - BlockManager компонент-ийг ашиглан бүх блокуудыг динамикаар render хийх
 * 
 * 🏗️ Архитектур:
 * 1. Server Component дээр Strapi API-аас өгөгдөл татагдана
 * 2. BlockManager-д `blocks` array дамжүүлнэ
 * 3. BlockManager нь block.__component нэрээр тохирох React component дуудна
 */

import { PageResponse } from '@/types';
import BlockManager from '@/components/BlockManager';
import Sidebar from '@/components/Sidebar';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * getPage - Strapi API-аас хуудасны мэдээлэл авах
 */
async function getPage(slug: string): Promise<PageResponse> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    const response = await fetch(
      `${strapiUrl}/api/pages?filters[slug][$eq]=${slug}&populate[blocks][on][dashboard][populate]=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null as any;
    }

    const page = data.data[0];
    
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: '',
      blocks: Array.isArray(page.content) ? page.content : 
              Array.isArray(page.blocks) ? page.blocks : [],
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return null as any;
  }
}

/**
 * getPages - Бүх pages авна (sidebar-т ашиглахын тулд)
 */
async function getPages(): Promise<PageResponse[]> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    const response = await fetch(
      `${strapiUrl}/api/pages?populate[blocks][on][dashboard][populate]=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pages');
    }

    const data = await response.json();
    
    return (data.data || []).map((page: Record<string, any>) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: '',
      blocks: Array.isArray(page.content) ? page.content : 
              Array.isArray(page.blocks) ? page.blocks : [],
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Page Component - Next.js App Router dynamic route handler
 */
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Strapi-аас хуудасны мэдээлэл болон бүх pages авна
  const [page, pages] = await Promise.all([
    getPage(slug),
    getPages()
  ]);

  if (!page) {
    return (
      <div className="flex min-h-screen">
        <Sidebar pages={pages} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600">
              "{slug}" хуудас олдсонгүй.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar pages={pages} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Хуудасны гарчиг */}
        <div className="border-b">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
            {page.content && (
              <p className="text-gray-600 text-lg">{page.content}</p>
            )}
          </div>
        </div>

        {/* Динамик блокуудыг render хийнэ */}
        <div className="p-8">
          {page.blocks && page.blocks.length > 0 ? (
            <BlockManager blocks={page.blocks} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Энэ хуудасд блок нэмэгдээгүй байна.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * generateMetadata - SEO metadata үүсгэх
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  return {
    title: page?.title || 'Page',
    description: page?.content || 'Dynamic page from Strapi',
  };
}
