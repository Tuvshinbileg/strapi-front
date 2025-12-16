# Strapi Dynamic Zone-д суурилсан Next.js Frontend (App Router)

## 📚 Үзүүлэлт

Энэ төслийн зорилго нь Strapi-ийн **Dynamic Zone**-ыг ашиглан "Config-Driven UI" хэвлэгдэл бүхий Next.js (App Router) аппликейшн хөгжүүлэх юм.

### 🎯 Архитектур

```
┌─────────────────────────────────────────────────┐
│           Next.js Frontend (App Router)         │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Server Component: app/[slug]/page.tsx       │
│     └─ Strapi API-аас хуудасны config татна      │
│                                                 │
│  2. BlockManager (Client Component)             │
│     └─ Block.__component нэрээр компонент сонгоно│
│                                                 │
│  3. Widgets (Client Components)                 │
│     ├─ UserTable.tsx                            │
│     ├─ RevenueChart.tsx                         │
│     ├─ HeroSection.tsx                          │
│     └─ TextBlock.tsx                            │
│                                                 │
│  4. API Routes                                  │
│     ├─ /api/mock-users                          │
│     └─ /api/mock-revenue                        │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ (HTTP Request)
┌─────────────────────────────────────────────────┐
│         Strapi CMS (Backend)                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Pages Collection:                              │
│  - slug (URL parameter)                         │
│  - title                                        │
│  - content                                      │
│  - Dynamic Zone: blocks []                      │
│    └─ dashboard.user-table                      │
│    └─ dashboard.revenue-chart                   │
│    └─ dashboard.hero-section                    │
│    └─ dashboard.text-block                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📁 Файлын Структур

```
strapi-front/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # 🎯 Динамик хуудасны үндсэн Server Component
│   ├── api/
│   │   ├── mock-users/
│   │   │   └── route.ts          # 📊 UserTable-д өгөгдөл үйлчлүүлэх API
│   │   └── mock-revenue/
│   │       └── route.ts          # 💹 RevenueChart-д өгөгдөл үйлчлүүлэх API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BlockManager.tsx          # 🔄 Component router (Dynamic Zone handler)
│   ├── widgets/
│   │   ├── UserTable.tsx         # 👥 Хэрэглэгчдийн хүснэгт
│   │   ├── RevenueChart.tsx      # 💹 Орлогын диаграмм
│   │   ├── HeroSection.tsx       # 🎨 Үндсэн зурвас
│   │   └── TextBlock.tsx         # 📝 Текстийн блок
│   ├── ui/                        # shadcn/ui Components
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── button.tsx
│   │   ├── skeleton.tsx
│   │   └── ... (бусад компонентүүд)
│   └── app-sidebar.tsx
├── types/
│   └── index.ts                  # TypeScript type definitions
├── lib/
│   └── utils.ts
├── .env.local                    # 🔌 Strapi URL тохировуулга
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Эхлүүлэх

### 1️⃣ **Зависимости суулгах**

```bash
npm install
```

### 2️⃣ **Environment Variables тохировуулах**

`.env.local` файлыг үүсгэ (эсвэл байгаа файлыг засна):

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

💡 Strapi server-ийн URL-г бодит URL сольж оруулна.

### 3️⃣ **Development Server эхлүүлэх**

```bash
npm run dev
```

Браузер дээр [http://localhost:3000](http://localhost:3000) руу орно.

### 4️⃣ **Динамик хуудасыг туршилта хийх**

Strapi дээр дараах structure-тай page үүсгэнэ:

```json
{
  "slug": "dashboard",
  "title": "Dashboard Хуудас",
  "content": "Энэ нь динамик контентоор дүүргэгдсэн хуудас",
  "blocks": [
    {
      "__component": "dashboard.hero-section",
      "title": "Добро пожаловать",
      "subtitle": "Config-Driven UI демо"
    },
    {
      "__component": "dashboard.user-table",
      "title": "Идэвхтэй хэрэглэгчид",
      "limit": 10
    },
    {
      "__component": "dashboard.revenue-chart",
      "title": "Сарын орлог",
      "currency": "MNT"
    },
    {
      "__component": "dashboard.text-block",
      "content": "<p>Энэ бол энгийн текстийн блок юм.</p>",
      "alignment": "center"
    }
  ]
}
```

Дараа нь браузер дээр [http://localhost:3000/dashboard](http://localhost:3000/dashboard) руу орноор компонентүүдийг үзэх болно.

---

## 📝 Файлуудын Тайлбар

### 1. `app/[slug]/page.tsx` - Server Component

**Үүрэг:**
- URL-ийн `slug` параметрийг ашиглан Strapi API-аас хуудасны config татах
- Dynamic Zone-ийн blocks array-ыг BlockManager-т дамжүүлэх
- ISR (Incremental Static Regeneration) ашиглан performance сайтруулах

**Flow:**
```
User visits /dashboard 
  ↓
Next.js gets slug="dashboard"
  ↓
getPage("dashboard") function fetches from Strapi API
  ↓
Returns PageResponse with blocks: [...]
  ↓
Renders <BlockManager blocks={page.blocks} />
```

### 2. `components/BlockManager.tsx` - Component Router

**Үүрэг:**
- Strapi-аас ирсэн `block.__component` нэрээр (жишээ: `"dashboard.user-table"`) компонент төрлийг сонгоно
- Hэрэгтэй React component-ийг дуудна
- Unknown component-ийн үед fallback UI үзүүлнэ

**Шинэ компонент нэмэх алхамууд:**
1. Widget компонент үүсгэ (`components/widgets/NewWidget.tsx`)
2. BlockManager дээр import нэмнэ
3. switch statement-д new case нэмнэ

### 3. `components/widgets/UserTable.tsx` - Client Component

**Үүрэг:**
- Хэрэглэгчдийн өгөгдлийн хүснэгтийг зурах
- Mock API (`/api/mock-users`)-аас өгөгдөл татах
- `limit` config параметрээр нь хэрэглэгчдийн тоог хянах

**Props Structure:**
```typescript
{
  title: "Идэвхтэй хэрэглэгчид",    // Гарчиг
  limit: 10                        // API-аас авах хэрэглэгчийн тоо
}
```

### 4. `app/api/mock-users/route.ts` - API Route

**Үүрэг:**
- GET `/api/mock-users?limit=X` request-г handling хийнэ
- Dummy user data буцаана
- Query параметр `limit`-г ашиглан хариултыг хязгаарлана

**Response:**
```json
{
  "success": true,
  "count": 10,
  "users": [
    {
      "id": 1,
      "name": "Батар Сүхбаатар",
      "email": "batar@example.com",
      "role": "Admin",
      "status": "Active",
      "joinDate": "2024-01-15"
    },
    ...
  ]
}
```

### 5. `components/widgets/RevenueChart.tsx` - Chart Widget

**Үүрэг:**
- Сарын орлогыг диаграммаар үзүүлэх
- `/api/mock-revenue` API-аас өгөгдөл татах
- Currency parameter ашиглан валютыг хөрвүүлэх

### 6. `types/index.ts` - TypeScript Definitions

Бүх компонент болон API-ийн type definitions байрлалаа.

---

## 🔗 Strapi Dynamic Zone Setup

Strapi дээр дараах model үүсгэх шаардлагатай:

### Pages Collection

```
📋 Pages
├── Fields:
│   ├── slug (Text, Required, Unique)
│   ├── title (Text, Required)
│   ├── content (RichText)
│   └── blocks (Dynamic Zone)
│       ├── dashboard.user-table
│       │   ├── title (Text)
│       │   └── limit (Number)
│       ├── dashboard.revenue-chart
│       │   ├── title (Text)
│       │   └── currency (Text)
│       ├── dashboard.hero-section
│       │   ├── title (Text)
│       │   ├── subtitle (Text)
│       │   └── ctaText (Text)
│       └── dashboard.text-block
│           ├── content (RichText)
│           └── alignment (Enumeration: left, center, right)
```

---

## 🛠️ Нэмэлт Заавар

### Шинэ Widget нэмэх

1. **Widget component үүсгэ:**

```typescript
// components/widgets/NewWidget.tsx
'use client';

export default function NewWidget({ data }) {
  const { title = "Default Title" } = data;
  return <div>{title}</div>;
}
```

2. **BlockManager-т нэмнэ:**

```typescript
// components/BlockManager.tsx
case 'dashboard.new-widget':
  return <NewWidget data={block} />;
```

3. **Strapi дээр Dynamic Zone type нэмнэ:**
   - `dashboard.new-widget` component үүсгэ
   - Шаардлагатай fields нэмнэ

### API Route нэмэх

```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Logic
    return NextResponse.json({ data: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
```

---

## 📊 Performance Optimization

### ISR (Incremental Static Regeneration)

`app/[slug]/page.tsx` дээр:

```typescript
const response = await fetch(url, {
  next: { revalidate: 60 } // 60 секунд болгоны дараа revalidate
});
```

### Client-side Caching

```typescript
const response = await fetch(url, {
  headers: { 'Cache-Control': 'no-store' }
});
```

---

## 🐛 Debugging

### Network Requests
Browser DevTools дээ → Network tab
- Strapi API requests
- API route requests

### Component State
React DevTools extension ашиглан component state шалгана.

### Logs
Terminal дээр `npm run dev`-ийн console logs харна.

---

## 📚 Нөөцүүд

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Dynamic Zone Guide](https://docs.strapi.io/dev-docs/backend-customization/collections)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ⚡ Сайжруулалтын санаа

- [ ] Recharts library ашиглан диаграмм сайжруулах
- [ ] Image optimization ашиглан hero section зурваснууд оруулах
- [ ] Dynamic form component нэмэх
- [ ] CMS integration test хийх
- [ ] E2E testing (Cypress/Playwright) нэмэх
- [ ] Dark mode support нэмэх
- [ ] Multi-language support нэмэх

---

**Амжилтай хөгжүүлэх!** 🚀
