/**
 * app/api/mock-users/route.ts - Mock API Route Handler
 * 
 * 📝 Үүрэг:
 * - UserTable component-д өгөгдөл үйлчлүүлэх
 * - Query параметр "limit"-г ашиглан хэрэглэгчдийн тоог удирдах
 * - GET request-т JSON response буцаана
 * 
 * 🔗 Дуудах үеэ:
 * - GET /api/mock-users?limit=10
 * - GET /api/mock-users?limit=20
 * 
 * 💾 Өгөгдлийн источник:
 * - Бодит өгөгдөл байхгүй тул dummy data ашиглана
 * - Бодит API баллуулахдаа өгөгдлийн источникийг сольх
 */

import { NextRequest, NextResponse } from 'next/server';
import { MockUser } from '@/types';

/**
 * Dummy User Data
 * 
 * 💡 Бодит Strapi дээр хэрэглэгчдийн өгөгдлийг store хийх болно.
 * Энд хэрэглэгчдийн database асаах хэрэгтэй болсон үеэр сольно.
 */
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: 'Батар Сүхбаатар',
    email: 'batar.sukhbaatar@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Өнөө Чулуун',
    email: 'onoo.chuluun@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-02-10',
  },
  {
    id: 3,
    name: 'Сүлд Энхжаргал',
    email: 'suld.enkhzargal@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-03-05',
  },
  {
    id: 4,
    name: 'Ариа Бүжидмаа',
    email: 'aria.buzhidmaa@example.com',
    role: 'Editor',
    status: 'Inactive',
    joinDate: '2023-12-20',
  },
  {
    id: 5,
    name: 'Ганга Анхаа',
    email: 'ganga.anhaa@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-04-02',
  },
  {
    id: 6,
    name: 'Даян Баясгалан',
    email: 'dayan.bayasgalan@example.com',
    role: 'Admin',
    status: 'Suspended',
    joinDate: '2024-01-08',
  },
  {
    id: 7,
    name: 'Эрдэнэ Түмэн',
    email: 'erdene.tumen@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-02-25',
  },
  {
    id: 8,
    name: 'Жүжи Баттөө',
    email: 'juji.battoo@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-03-30',
  },
  {
    id: 9,
    name: 'Магнай Хулан',
    email: 'magnai.hulan@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-04-15',
  },
  {
    id: 10,
    name: 'Цахиур Отгон',
    email: 'tsahiur.otgon@example.com',
    role: 'User',
    status: 'Inactive',
    joinDate: '2024-05-10',
  },
  {
    id: 11,
    name: 'Арвай Гэрэл',
    email: 'arvai.gerel@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-05-20',
  },
  {
    id: 12,
    name: 'Гүнсүх Сарай',
    email: 'gunsuh.saray@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2024-06-01',
  },
];

/**
 * GET handler - Mock users өгөгдлөл буцаана
 * 
 * 📌 Query Parameters:
 * - limit: Буцаах хэрэглэгчдийн тоо (default: 10)
 * 
 * 📤 Response:
 * {
 *   "success": true,
 *   "count": 10,
 *   "users": [ ... ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Query параметрээс limit авна
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    // Limit-г number болгон задалж авна (default: 10)
    let limit = 10;
    if (limitParam && !isNaN(Number(limitParam))) {
      limit = Math.min(Number(limitParam), MOCK_USERS.length);
    }

    // Limit-аар хязгаарлаж, хэрэглэгчдийг сонгона
    const users = MOCK_USERS.slice(0, limit);

    // 📡 JSON response буцаана
    return NextResponse.json(
      {
        success: true,
        count: users.length,
        users,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store', // CSR компонент дээр кэш хийхгүй
        },
      }
    );
  } catch (error) {
    console.error('Error in mock-users API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler (optional) - Шинэ хэрэглэгч нэмэх (mock)
 * 
 * 📌 Request Body:
 * {
 *   "name": "Шинэ хэрэглэгч",
 *   "email": "new@example.com",
 *   "role": "User"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, role = 'User' } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and email are required',
        },
        { status: 400 }
      );
    }

    // Шинэ хэрэглэгч үүсгэнэ (mock data)
    const newUser: MockUser = {
      id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
      name,
      email,
      role,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    };

    // 📡 Created response буцаана
    return NextResponse.json(
      {
        success: true,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in mock-users POST:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
      },
      { status: 400 }
    );
  }
}
