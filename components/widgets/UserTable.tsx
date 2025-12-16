/**
 * components/widgets/UserTable.tsx - Хэрэглэгчдийн хүснэгт Widget
 * 
 * 📝 Үүрэг:
 * - Strapi-аас ирсэн тохиргоо (props)-г ашиглан хэрэглэгчдийн хүснэгтийг үзүүлэх
 * - Mock API-аас өгөгдөл татаж, тохиргооны "limit" параметрийг ашиглана
 * 
 * 🔧 Функцион:
 * 1. Strapi-аас ирсэн { title, limit, ... } config-г ашиглана
 * 2. useEffect hook дээр /api/mock-users API дуудана
 * 3. limit параметрийг query параметр болгон дамжүүлнэ
 * 4. Өгөгдлүүдийг хүснэгтээр зурна
 * 
 * 💡 Tailwind CSS + shadcn/ui ашигласан
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MockUser } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface UserTableProps {
  data: {
    title?: string;
    limit?: number;
    [key: string]: any;
  };
}

/**
 * UserTable Component
 * 
 * Props:
 * - data.title: Хүснэгтийн гарчиг (жишээ: "Идэвхтэй хэрэглэгчид")
 * - data.limit: API-аас авах хэрэглэгчийн тоо (жишээ: 10, 20, 50)
 */
export default function UserTable({ data }: UserTableProps) {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { title = 'Хэрэглэгчид', limit = 10 } = data;

  /**
   * useEffect - Component mount дээр API дуудна
   * 
   * 🔗 API Call Flow:
   * 1. /api/mock-users?limit=X endpoint-д fetch request явуулна
   * 2. Response-ийг JSON болгон хариулна
   * 3. Өгөгдлүүдийг state-д хадгална
   * 4. Error бол error message үзүүлнэ
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔌 API-аас хэрэглэгчдийн өгөгдөл татагдана
        const response = await fetch(`/api/mock-users?limit=${limit}`);

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limit]);

  /**
   * Status badge өнгөл
   */
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  /**
   * Role badge өнгөл
   */
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Гарчиг */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Нийт {users.length} хэрэглэгч ({limit} сөрөг дээр харуулагдав)
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
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
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Өгөгдөл олдсонгүй</p>
        </div>
      )}

      {/* Хүснэгт */}
      {!loading && !error && users.length > 0 && (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">Нэр</TableHead>
                <TableHead className="font-semibold">И-мейл</TableHead>
                <TableHead className="font-semibold">Үүрэг</TableHead>
                <TableHead className="font-semibold">Статус</TableHead>
                <TableHead className="font-semibold">Нэгдсэн өдөр</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)} variant="secondary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)} variant="secondary">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString('mn-MN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
