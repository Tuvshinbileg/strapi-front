/**
 * app/api/mock-revenue/route.ts - Mock Revenue API Route Handler
 * 
 * 📝 Үүрэг:
 * - RevenueChart component-д орлогын өгөгдөл үйлчлүүлэх
 * - Query параметр "currency"-г ашиглан валютыг удирдах
 * - GET request-т JSON response буцаана
 */

import { NextRequest, NextResponse } from 'next/server';
import { RevenueDataPoint } from '@/types';

/**
 * Dummy Revenue Data
 * 
 * 💡 Бодит өгөгдлийн эх байхгүй тул dummy data ашиглана.
 * Бодит Strapi дээр sales/transaction database холбоносон үеэр сольно.
 */
const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: '2024-01', revenue: 45000000 },
  { month: '2024-02', revenue: 52000000 },
  { month: '2024-03', revenue: 48000000 },
  { month: '2024-04', revenue: 61000000 },
  { month: '2024-05', revenue: 55000000 },
  { month: '2024-06', revenue: 73000000 },
  { month: '2024-07', revenue: 68000000 },
  { month: '2024-08', revenue: 71000000 },
  { month: '2024-09', revenue: 62000000 },
  { month: '2024-10', revenue: 58000000 },
  { month: '2024-11', revenue: 79000000 },
  { month: '2024-12', revenue: 85000000 },
];

/**
 * GET handler - Mock revenue data буцаана
 * 
 * 📌 Query Parameters:
 * - currency: Валютын төрөл (default: "MNT")
 * 
 * 📤 Response:
 * {
 *   "success": true,
 *   "currency": "MNT",
 *   "data": [ ... ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Query параметрээс currency авна
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get('currency') || 'MNT';

    // Валютаар хөрвүүлэх коэффициент (mock)
    const currencyMultiplier: Record<string, number> = {
      'MNT': 1,
      'USD': 0.00035, // 1 MNT ≈ 0.00035 USD
      'CNY': 0.0024,  // 1 MNT ≈ 0.0024 CNY
      'KRW': 0.46,    // 1 MNT ≈ 0.46 KRW
    };

    const multiplier = currencyMultiplier[currency] || 1;

    // Валютаар хөрвүүлэн, орлогын өгөгдлийг бэлтгэнэ
    const data = MOCK_REVENUE_DATA.map(item => ({
      month: item.month,
      revenue: Math.round(item.revenue * multiplier),
    }));

    // 📡 JSON response буцаана
    return NextResponse.json(
      {
        success: true,
        currency,
        data,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error in mock-revenue API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
