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

import { NcPage } from '@/types';
import { nocoDbApiService } from '@/lib/noco_api';
import { TableBlock } from '@/components/data/TableBlock/Component';
import { ConfigBlock } from '@/components/data/ConfigBlock/Component';

/**
 * Page Component - Next.js App Router dynamic route handler
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pages = await nocoDbApiService.getPages();

  const page = pages.find((p: NcPage) => p.slug === slug);

  if (!page || !page.enabled) {
    return <div>Page not found</div>;
  }

  const blocks = await nocoDbApiService.getPageBlocks(page.Id);

  return (
    <>
      <div className='flex w-full min-w-0 flex-col gap-y-3'>
        {blocks && blocks.length > 0 ? (
          blocks.map((element) => (
            <TableBlock key={element.Id} source={element.source} />
          ))
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              Энэ хуудасд блок нэмэгдээгүй байна.
            </p>
          </div>
        )}
      </div>

      <div className='flex w-full flex-col gap-y-3 xl:mt-0'>
        <ConfigBlock source={page.Id} />

      </div>
    </>
  );
}

/**
 * generateMetadata - SEO metadata үүсгэх
 */
