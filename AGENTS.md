# AGENTS.md — Servicewala Project Specification & AI Agent Guidelines

> **CRITICAL FOR AI AGENTS (Antigravity, Cursor, Claude, Copilot):**  
> Read this file first. Do NOT crawl the entire codebase or scan irrelevant files. All key architecture, state patterns, file maps, and coding conventions are defined below to maximize efficiency and minimize token consumption.

---

## 1. Project Overview & Mission

**Servicewala** is an Urban Company / Angi style **Multi-Portal On-Demand Home Services Ecosystem** built with:
- **Framework:** React Native + Expo SDK 52+ + Expo Router + React Native Web
- **Language:** TypeScript
- **Global State:** Zustand (`src/store/useEcosystemStore.ts`)
- **Styling:** Pure React Native `StyleSheet.create` (No Tailwind CSS)
- **Architecture:** 100% Interactive Frontend Simulation (Phase 1 — No external backend or DB required; all live state persists reactively across portals via Zustand).

---

## 2. Triple-Portal Directory Map

The application consists of three independent portals powered by a single shared store and unified codebase:

```
app/
├── (customer)/                  # Customer Portal (Web & Mobile)
│   ├── _layout.tsx              # Urban Company-style desktop header + mobile bottom tabs
│   ├── index.tsx                # Home Screen (HomeAdvisor hero, 11-category icon strip, deals)
│   ├── category/[id].tsx        # Category services catalog & add-to-cart
│   ├── checkout.tsx             # Interactive cart, address input, coupon discount, booking creation
│   └── bookings.tsx             # Order history, live status tracking, OTP display
│
├── (partner)/                   # Technician / Partner Mobile-First Portal
│   ├── _layout.tsx              # Partner header, online/offline toggle, quick wallet badge
│   ├── index.tsx                # Job feed, incoming job modal, Start OTP & End OTP verification
│   ├── earnings.tsx             # Earnings ledger, commission breakdown, payout wallet
│   └── profile.tsx              # KYC verification status, ratings, skills, working city
│
├── (admin)/                     # Operations Admin Control Center (Desktop First)
│   ├── _layout.tsx              # Admin dashboard header & navigation
│   ├── index.tsx                # Real-time analytics dashboard & revenue KPIs
│   ├── bookings.tsx             # Live order dispatch control center (filter, assign, cancel)
│   ├── services.tsx             # Dynamic service catalog manager (CRUD, pricing, categories)
│   └── technicians.tsx          # Fleet management (KYC approval/rejection, commission rates)
│
├── _layout.tsx                  # Root layout (SafeAreaProvider, PortalSwitcherBar, NotificationBanner)
└── index.tsx                    # Entry router (Redirects to /(customer))
```

---

## 3. Global State Architecture (`src/store/useEcosystemStore.ts`)

All three portals communicate through `useEcosystemStore.ts`. **Do not create separate stores or API calls.**

### Key Entities & Interfaces (`src/data/mockEcosystemData.ts`):
- `ServiceCategory`: Category metadata (`id`, `name`, `icon`, `tagColor`, `serviceCount`).
- `ServiceItem`: Service definition (`id`, `categoryId`, `name`, `price`, `originalPrice`, `duration`, `rating`).
- `Technician`: Service provider profile (`id`, `name`, `status`, `kycStatus`, `commissionRate`, `walletBalance`).
- `BookingOrder`: Complete booking lifecycle (`id`, `bookingNumber`, `customerName`, `status`, `startOtp`, `endOtp`, `paymentStatus`).
- `SpotlightOffer`: Discount coupons (`code`, `discount`, `targetCategory`).

### Essential Store Actions:
- **Cart & Checkout:** `addToCart(serviceId)`, `removeFromCart(serviceId)`, `clearCart()`, `applyPromo(code)`, `createBooking(details)`.
- **Technician Actions:** `acceptJob(orderId, techId)`, `verifyStartOtp(orderId, otp)`, `verifyEndOtp(orderId, otp)`, `toggleTechnicianStatus(techId, status)`.
- **Admin Actions:** `updateOrderStatus(orderId, status)`, `assignTechnicianToOrder(orderId, techId)`, `updateService(service)`, `addService(service)`, `updateTechnicianKyc(techId, status)`.
- **Notifications:** `showNotification(title, message, type)`.

---

## 4. UI/UX Design System & Conventions

- **Design Philosophy:** "ছিমছাম প্রিমিয়াম" — Ultra-clean, modern luxury inspired by **Urban Company** and **HomeAdvisor**.
- **Typography:** Bold crisp headlines (`#0F172A` / `#111827`), subtle muted subtitles (`#64748B` / `#475569`).
- **Color Accents:** 
  - Primary Dark Maroon/Crimson: `#991B1B` / `#7F1D1D`
  - Emerald Green (Success & Verified): `#059669` / `#10B981`
  - Slate Gray (Borders & Icons): `#E2E8F0` / `#475569`
  - Clean Background: `#FFFFFF` (surfaces) and `#F8FAFC` (app background)
- **Rule on Styling:** Always use React Native `StyleSheet.create`. Do **NOT** use Tailwind CSS classes or raw arbitrary utility strings.
- **Responsive Layout:**
  - `useWindowDimensions()` hook
  - `isDesktop = width >= THEME.breakpoints.desktopMin` (`768px`)
  - Mobile-first adaptive layout with desktop container max-width `1200px` to `1280px`.

---

## 5. Development Commands & Workflow

Before concluding any code changes, always run:
```bash
npx tsc --noEmit   # Typecheck codebase (MUST pass with 0 errors)
npx expo lint      # ESLint check (MUST pass with 0 errors/warnings)
```

Dev Server:
```bash
npm run web        # Runs on http://localhost:8081
```

Package Installation:
```bash
npx expo install <package-name>   # Resolves compatible versions with Expo SDK 52
```

---

## 6. How AI Models Should Execute Tasks in this Repo (Token Efficiency)

1. **Do NOT crawl all files:** Refer to Section 2 for routing and Section 3 for store methods.
2. **Keep edits surgical:** Use `replace_file_content` targeting specific components instead of rewriting whole files.
3. **Preserve existing state & comments:** Never delete types or mock data unless explicitly requested.
4. **Zero Backend Rule:** Maintain all interactivity inside Zustand (`useEcosystemStore.ts`).
5. **Context Architecture Vault Guardian:** Whenever any structural, schema, portal routing, or business rule changes are made, proactively alert the user and offer to update the Context Architecture Vault (`ARCHITECTURE.md`, `AGENTS.md`, `ROADMAP.md`). Never let architectural changes go undocumented.
