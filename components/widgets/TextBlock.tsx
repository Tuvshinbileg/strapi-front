/**
 * components/widgets/TextBlock.tsx - Текстийн блок Widget
 * 
 * 📝 Үүрэг:
 * - Энгийн текстийн контентийг үзүүлэх
 * - Markdown эсвэл обогдоосон HTML гаажүүлэж болно
 * - Strapi-аас { content, alignment } config авна
 */

'use client';

import React from 'react';

interface TextBlockProps {
  data: {
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    [key: string]: any;
  };
}

export default function TextBlock({ data }: TextBlockProps) {
  const { content = '', alignment = 'left' } = data;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`prose max-w-none ${alignmentClasses[alignment]}`}>
      <div
        className="leading-7 text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
