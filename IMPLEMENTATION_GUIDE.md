# Strapi Dynamic Zone Frontend - Implementation Guide (Монгол)

## 📋 Үүсгэгдсэн Файлуудын Жагсаалт

### ✅ Core Files

| Файл | Үүрэг | Төрөл |
|------|------|------|
| `app/[slug]/page.tsx` | Динамик хуудасны Server Component | Next.js Page |
| `components/BlockManager.tsx` | Component Router (Dynamic Zone handler) | React Component |
| `types/index.ts` | TypeScript type definitions | TypeScript |
| `.env.local` | Environment variables | Config |

### ✅ Widgets (Client Components)

| Widget | Үүрэг | Төрөл |
|--------|------|------|
| `components/widgets/UserTable.tsx` | Хэрэглэгчдийн хүснэгт | Client Component |
| `components/widgets/RevenueChart.tsx` | Орлогын диаграмм | Client Component |
| `components/widgets/HeroSection.tsx` | Үндсэн зурвас | Client Component |
| `components/widgets/TextBlock.tsx` | Текстийн блок | Client Component |

### ✅ API Routes

| API | Үүрэг | Method |
|-----|------|--------|
| `app/api/mock-users/route.ts` | Mock хэрэглэгчдийн өгөгдөл | GET, POST |
| `app/api/mock-revenue/route.ts` | Mock орлогын өгөгдөл | GET |

### ✅ UI Components (shadcn/ui)

| Component | Үүрэг |
|-----------|------|
| `components/ui/badge.tsx` | Small label/tag |
| `components/ui/table.tsx` | Data table |
| `components/ui/button.tsx` | Button (байгаа) |
| `components/ui/skeleton.tsx` | Loading placeholder |

---

## 🎯 Data Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│ Browser: http://localhost:3000/dashboard             │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│ app/[slug]/page.tsx (Server Component)               │
│ - slug = "dashboard"                                 │
│ - getPage("dashboard") дуудна                         │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼ (HTTP)
┌──────────────────────────────────────────────────────┐
│ Strapi API: /api/pages?filters[slug][dashboard]      │
│ Response:                                            │
│ {                                                    │
│   data: [{                                           │
│     title: "Dashboard",                              │
│     blocks: [                                        │
│       { __component: "dashboard.user-table", ... },  │
│       { __component: "dashboard.revenue-chart", ...} │
│     ]                                                │
│   }]                                                 │
│ }                                                    │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│ <BlockManager blocks={page.blocks} />                │
└─────────────────────┬────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────────────┐  ┌──────────────────────┐
│ <UserTable data={..}│  │ <RevenueChart        │
│   - /api/mock-users │  │   - /api/mock-revenue│
│   limit=10          │  │   currency=MNT       │
│                     │  │                      │
│   User Table HTML   │  │   Revenue Chart HTML │
└─────────────────────┘  └──────────────────────┘

        ▼ (Render)

┌──────────────────────────────────────────────────────┐
│ Final HTML → Browser displays components             │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Component Rendering Flow

```typescript
// 1. Server Component: app/[slug]/page.tsx
export default async function Page({ params }) {
  const page = await getPage(params.slug);  // Strapi API call
  return <BlockManager blocks={page.blocks} />;
}

// 2. Client Router: BlockManager.tsx
function renderBlock(block) {
  switch (block.__component) {
    case 'dashboard.user-table':
      return <UserTable data={block} />;  // Render component
    case 'dashboard.revenue-chart':
      return <RevenueChart data={block} />;
    // ... more cases
  }
}

// 3. Widget (Client Component): UserTable.tsx
export default function UserTable({ data }) {
  // Client-side logic
  useEffect(() => {
    fetch(`/api/mock-users?limit=${data.limit}`)  // Fetch data
      .then(res => res.json())
      .then(users => setUsers(users));  // Update state
  }, [data.limit]);

  return (
    <Table>
      {/* Render user data */}
    </Table>
  );
}

// 4. API Route: app/api/mock-users/route.ts
export async function GET(request) {
  const limit = request.nextUrl.searchParams.get('limit');
  const users = MOCK_USERS.slice(0, limit);  // Filter data
  return NextResponse.json({ users });  // Send response
}
```

---

## 📝 Strapi Dynamic Zone Setup Instructions

### Step 1: Create Pages Collection

```
Strapi Admin → Content-Types Builder → Create collection → "page"
```

### Step 2: Add Fields

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| slug | Text | ✅ | Unique URL identifier |
| title | Text | ✅ | Page title |
| content | RichText | ❌ | Page description |
| blocks | Dynamic Zone | ❌ | Components container |

### Step 3: Configure Dynamic Zone

```
blocks (Dynamic Zone) → Add component:
  1. dashboard.user-table
     - title: Text (title)
     - limit: Number (default: 10)

  2. dashboard.revenue-chart
     - title: Text (title)
     - currency: Text (default: "MNT")

  3. dashboard.hero-section
     - title: Text (title)
     - subtitle: Text (subtitle)
     - ctaText: Text (button text)
     - ctaLink: Text (button link)

  4. dashboard.text-block
     - content: RichText (HTML content)
     - alignment: Enumeration (left, center, right)
```

### Step 4: Create Sample Page in Strapi

```json
{
  "slug": "dashboard",
  "title": "Dashboard Page",
  "content": "My awesome dashboard",
  "blocks": [
    {
      "__component": "dashboard.hero-section",
      "title": "Welcome to Dashboard",
      "subtitle": "Config-Driven UI Demo",
      "ctaText": "Get Started",
      "ctaLink": "/about"
    },
    {
      "__component": "dashboard.user-table",
      "title": "Active Users",
      "limit": 10
    },
    {
      "__component": "dashboard.revenue-chart",
      "title": "Monthly Revenue",
      "currency": "MNT"
    }
  ]
}
```

### Step 5: Enable API Access

```
Strapi Admin → Settings → Users & Permissions → Public role
→ Content-Types → page → Check "find" and "findone"
```

---

## 🧪 Testing Checklist

- [ ] Dev server ажиллаж байна: `npm run dev`
- [ ] Strapi API connection ажиллаж байна
- [ ] Динамик хуудас load хийгдэж байна: `/dashboard`
- [ ] UserTable компонент render хийгдэж байна
- [ ] UserTable API call (`/api/mock-users`) ажиллаж байна
- [ ] RevenueChart компонент render хийгдэж байна
- [ ] RevenueChart API call (`/api/mock-revenue`) ажиллаж байна
- [ ] HeroSection компонент render хийгдэж байна
- [ ] TextBlock компонент render хийгдэж байна
- [ ] Unknown component error UI харуулагдаж байна

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
git push origin main
# Vercel automatically deploys
```

Set environment variable in Vercel:
```
NEXT_PUBLIC_STRAPI_URL = https://your-strapi-domain.com
```

### Self-hosted

```bash
npm run build
npm start
```

---

## 📚 Key Concepts

### 1. Dynamic Zone Pattern
- Strapi CMS дээр flexible block system
- Admin users-ын хүссэн тоотой блок нэмж болно
- Frontend нь автоматаар render хийнэ

### 2. Server vs Client Components
- **Server**: `app/[slug]/page.tsx` - Strapi API call
- **Client**: Widget components - useEffect, useState ашиглана

### 3. Component Routing
- `block.__component` property ашиглан компонент төрлийг сонгоно
- `switch` statement эсвэл `map` ашигланий компонент selector

### 4. Props Passing
```typescript
// Block object contains all data
<UserTable data={block} />

// Widget receives and uses it
export default function UserTable({ data: { title, limit } }) { ... }
```

---

## 🐛 Common Issues

### Issue: "Cannot find module"
```
Solution: Check import paths - use @/components, @/types aliases
```

### Issue: API returns 404
```
Solution: Check Strapi API URL in .env.local
```

### Issue: "Unknown component" warning
```
Solution: Add the component case in BlockManager.tsx
```

---

## 📖 Further Reading

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Strapi Collections Docs](https://docs.strapi.io/dev-docs/backend-customization/collections)
- [shadcn/ui Getting Started](https://ui.shadcn.com/docs/installation)

---

**Code Generation Date:** December 2024  
**Next.js Version:** 15+  
**Strapi Version:** 4.x+
