/**
 * components/widgets/RevenueChart.tsx - Орлогын диаграмм Widget
 * 
 * 📝 Үүрэг:
 * - Strapi-аас ирсэн { title, currency, ... } config-г ашиглан орлогын графикийг үзүүлэх
 * - Mock API-аас орлогын өгөгдөл татаж, сарын мэдээллийг диаграммаар дүрслэх
 * 
 * 🔧 Функцион:
 * 1. Strapi-аас ирсэн { title, currency } config-г ашиглана
 * 2. useEffect hook дээр /api/mock-revenue API дуудана
 * 3. Өгөгдлүүдийг bar chart болгон зурна (shadcn/ui комплекстүүд ашиглана)
 * 4. Валют, сумма мэдээлэлээ үзүүлнэ
 * 
 * 💡 Энгийн диаграмм харуулах (Recharts нэмэх хүрэлцээ зайлшгүй)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { RevenueDataPoint } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueChartProps {
  data: {
    title?: string;
    currency?: string;
    [key: string]: any;
  };
}

/**
 * RevenueChart Component
 * 
 * Props:
 * - data.title: Диаграммын гарчиг (жишээ: "Сарын орлог")
 * - data.currency: Валютын төрөл (жишээ: "MNT", "USD")
 */
export default function RevenueChart({ data }: RevenueChartProps) {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { title = 'Сарын Орлог', currency = 'MNT' } = data;

  /**
   * useEffect - Component mount дээр API дуудна
   */
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔌 API-аас орлогын өгөгдөл татагдана
        const response = await fetch(`/api/mock-revenue?currency=${currency}`);

        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }

        const responseData = await response.json();
        setRevenueData(responseData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching revenue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [currency]);

  /**
   * Форматлаж авсан өгөгдлүүдийн нийт дүн
   */
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue =
    revenueData.length > 0 ? Math.round(totalRevenue / revenueData.length) : 0;

  /**
   * Санаа: Recharts library ашиглан илүү сайн диаграмм үүсгэж болно.
   * npm install recharts гаажүүлэнэ.
   * Энд бага энгийн HTML/CSS диаграмм үүсгэлээ.
   */
  const maxRevenue = Math.max(...revenueData.map(item => item.revenue), 1);

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Гарчиг */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Валют: <span className="font-semibold">{currency}</span>
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <p className="font-semibold">⚠️ Алдаа</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Өгөгдөл байхгүй */}
      {!loading && !error && revenueData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Өгөгдөл олдсонгүй</p>
        </div>
      )}

      {/* Диаграмм */}
      {!loading && !error && revenueData.length > 0 && (
        <>
          {/* Статистик */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-muted-foreground">Нийт орлог</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {totalRevenue.toLocaleString('mn-MN')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{currency}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-muted-foreground">Дундаж орлог</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {averageRevenue.toLocaleString('mn-MN')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{currency}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-muted-foreground">Сар</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {revenueData.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">сар</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-4">Сарын орлогын тренд</h3>
              <div className="space-y-2">
                {revenueData.map((item) => {
                  const percentage = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={item.month} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground font-semibold">
                          {item.revenue.toLocaleString('mn-MN')} {currency}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Зөвлөл */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          💡 Үүнийг улам сайн болгохын тулд{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">recharts</code> library ашиглаж болно.
        </p>
      </div>
    </div>
  );
}
