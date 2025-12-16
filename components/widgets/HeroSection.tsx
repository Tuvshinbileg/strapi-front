/**
 * components/widgets/HeroSection.tsx - Үндсэн зурвасын Widget
 * 
 * 📝 Үүрэг:
 * - Хуудасны оршин суухаа заримдаа гарлуу үзүүлэх
 * - Strapi-аас { title, subtitle, backgroundImage } config авна
 * - CTA (Call-to-Action) товч ашиглаж болно
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    [key: string]: any;
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  const {
    title = 'Добро пожаловать',
    subtitle = 'Динамик контент дээр суурилсан хуудас',
    backgroundImage,
    ctaText = 'Гүйлгээ эхлүүлэх',
    ctaLink = '#',
  } = data;

  return (
    <div
      className="relative w-full h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden flex items-center justify-center"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }
          : {}
      }
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100"
          onClick={() => window.location.href = ctaLink}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
