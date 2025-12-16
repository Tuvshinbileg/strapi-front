/**
 * app/page.tsx - Нүүр хуудас
 * 
 * 📝 Үүрэг:
 * - Strapi-аас бүх pages-ыг fetch хийнэ
 * - Sidebar дээр menu болгож harуулна
 * - Эхнийхээс хамгийн анхны page-ыг default-аар харуулна
 */

import { PageResponse } from '@/types';
import Page from './layout/page';

import Sidebar from '@/components/Sidebar';
// import { AppSidebar } from "@/components/app-sidebar"
import BlockManager from '@/components/BlockManager';

/**
 * getPages - Strapi-аас бүх pages авна
 */

/**
 * Home Page Component
 */
export default async function Home() {
  return (
    <Page />
    // <div className="flex min-h-screen bg-background">
    //   {/* Sidebar */}
    //   <Sidebar pages={pages} />

    //   {/* Main Content */}
    //   <div className="flex-1">
    //     {defaultPage ? (
    //       <div className="p-8">
    //         {/* Гарчиг */}
    //         <div className="mb-8 border-b pb-6">
    //           <h1 className="text-4xl font-bold mb-2">{defaultPage.title}</h1>
    //           {defaultPage.content && (
    //             <p className="text-gray-600 text-lg">{defaultPage.content}</p>
    //           )}
    //         </div>

    //         {/* Динамик блокүүд */}
    //         {defaultPage.blocks && defaultPage.blocks.length > 0 ? (
    //           <BlockManager blocks={defaultPage.blocks} />
    //         ) : (
    //           <div className="text-center py-12">
    //             <p className="text-gray-500 text-lg">
    //               Энэ хуудасд блок нэмэгдээгүй байна.
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //     ) : (
    //       <div className="flex items-center justify-center min-h-screen">
    //         <div className="text-center">
    //           <h2 className="text-2xl font-bold mb-4">Хуудас олдсонгүй</h2>
    //           <p className="text-gray-600">
    //             Strapi дээр хуудас үүсгэнэ үү.
    //           </p>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}
