interface CachedToken {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, CachedToken>();

export async function getCachedGuestToken(dashboardId: string): Promise<string> {
  const cached = tokenCache.get(dashboardId);
  
  // Cache байгаа бөгөөд хугацаа дуусаагүй бол cache ашиглах
  if (cached && cached.expiresAt > Date.now() + 30000) { // 30 секунд buffer
    return cached.token;
  }

  // Шинэ token авах
  const response = await fetch('/api/superset/guest-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dashboardId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch guest token');
  }

  const data = await response.json();
  
  // Cache хадгалах
  tokenCache.set(dashboardId, {
    token: data.token,
    expiresAt: data.expiresAt,
  });

  return data.token;
}