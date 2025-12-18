// app/api/superset/guest-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SUPERSET_URL = process.env.NEXT_PUBLIC_SUPERSET_URL || 'https://your-superset.railway.app';
const SUPERSET_USERNAME = process.env.SUPERSET_USERNAME || 'admin';
const SUPERSET_PASSWORD = process.env.SUPERSET_PASSWORD || 'your-password';

export async function POST(request: NextRequest) {
  try {
    const { dashboardId } = await request.json();

    // 1. Superset руу нэвтрэх
    const loginResponse = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: SUPERSET_USERNAME,
        password: SUPERSET_PASSWORD,
        provider: 'db',
        refresh: true,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    // 2. Guest token үүсгэх
    const guestTokenResponse = await fetch(
      `${SUPERSET_URL}/api/v1/security/guest_token/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: 'guest',
            first_name: 'Guest',
            last_name: 'User',
          },
          resources: [
            {
              type: 'dashboard',
              id: dashboardId,
            },
          ],
          rls: [], // Row Level Security (сонголттой)
        }),
      }
    );

    if (!guestTokenResponse.ok) {
      throw new Error('Failed to create guest token');
    }

    const guestTokenData = await guestTokenResponse.json();

    return NextResponse.json({ 
      token: guestTokenData.token,
      expiresAt: Date.now() + 300000 // 5 минут
    });
  } catch (error) {
    console.error('Error getting guest token:', error);
    return NextResponse.json(
      { error: 'Failed to get guest token' },
      { status: 500 }
    );
  }
}
