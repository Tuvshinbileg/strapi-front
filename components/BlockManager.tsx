/**
 * components/BlockManager.tsx - Dynamic Block Router/Manager
 * 
 * 📝 Үүрэг:
 * - Strapi-аас ирсэн block.__component нэрийг (жишээ нь: 'dashboard.user-table') уншаад,
 *   түүнд тохирох React Component-ийг дуудах (Component Router pattern)
 * - Бүх динамик блокуудыг үүнийг ашиглан управлах
 * 
 * 🏗️ Архитектур:
 * - PageBlock interface ашиглан block структурыг хүлээн авна
 * - switch statement ашиглан __component нэрээр компонент сонгона
 * - Хэр зайлшгүй блок ирвэл fallback компонент буцаана
 * 
 * 💡 Санаа:
 * - Шинэ widget нэмэхдээ энд нэмнэ (import + case statement)
 * - Block data-г props болгон widget-т дамжүүлнэ
 */

import React from 'react';
import { PageBlock } from '@/types';

// Widgets-ийг импортлоно
import UserTable from './widgets/UserTable';
import RevenueChart from './widgets/RevenueChart';
import HeroSection from './widgets/HeroSection';
import TextBlock from './widgets/TextBlock';
import DataTable from './widgets/DataTable';

interface BlockManagerProps {
  blocks: PageBlock[];
}

/**
 * BlockManager - Component routing ба block management
 * 
 * 🔄 Flow:
 * 1. blocks array дээр loop хийнэ
 * 2. Элемент бүрийн __component property ашиглан компонент төрлийг сонгоно
 * 3. Хэрэв төрөл мэдэгдэхгүй бол fallback компонент буцаана
 * 4. Компонент-т block data дамжүүлнэ
 */
export default function BlockManager({ blocks }: BlockManagerProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => (
        <div key={block.id || index}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}

/**
 * renderBlock - Block-ийн төрлийн дагуу тохирох компонент буцаана
 * 
 * 📌 Strapi Dynamic Zone format:
 * - __component: "dashboard.user-table" буюу "dashboard.revenue-chart"
 * 
 * @param block - Strapi-аас ирсэн block object
 * @returns - Хэрэгтэй React Component
 */
function renderBlock(block: PageBlock) {
  const { __component } = block;

  // 🔀 Component routing - block type дээр үндэслэн компонент сонгоно
  switch (__component) {
    case 'dashboard.user-table':
      return <UserTable data={block} />;
    
    case 'dashboard.revenue-chart':
      return <RevenueChart data={block} />;
    
    case 'dashboard.hero-section':
      return <HeroSection data={block} />;
    
    case 'dashboard.text-block':
      return <TextBlock data={block} />;
    
    case 'blocks.table':
      return <DataTable data={block} />;
    
    // 🔔 Unknown component handler
    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold">
            ⚠️ Мэдэгдэхгүй компонент: <code>{__component}</code>
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            BlockManager.tsx дээр энэ компонентийг нэмээрэй.
          </p>
        </div>
      );
  }
}
