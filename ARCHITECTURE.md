# 🏛️ Servicewala — Technical Architecture & System Design

This document details the architectural design, state synchronization patterns, and security workflows powering the **Servicewala Multi-Portal Platform**.

---

## 1. High-Level Architectural Overview

Servicewala is engineered around a **Unified Multi-Platform Client Model**:

```
+---------------------------------------------------------------------------------+
|                                 Servicewala                                     |
|              (React Native + Expo Router + TypeScript + Zustand)                 |
+---------------------------------------------------------------------------------+
           |                                     |                                |
           v                                     v                                v
+----------------------+              +----------------------+         +----------------------+
|   Customer Portal    |              |  Technician Portal   |         |     Admin Center     |
|   `app/(customer)`   |              |    `app/(partner)`   |         |     `app/(admin)`    |
|                      |              |                      |         |                      |
| • Marketplace Hero   |              | • Job Dispatch Radar |         | • GMV Analytics      |
| • 11-Cat Icon Strip  |              | • Start/End OTP Auth |         | • Live Dispatch Map  |
| • Cart & Checkout    |              | • Earnings Ledger    |         | • Dynamic Catalog    |
| • Live OTP Display   |              | • KYC Profile        |         | • Fleet KYC Control  |
+----------------------+              +----------------------+         +----------------------+
           \                                     |                                /
            \                                    |                               /
             v                                   v                              v
       +-------------------------------------------------------------------------------+
       |                         Unified Ecosystem Store                               |
       |                      (`src/store/useEcosystemStore.ts`)                       |
       |                                                                               |
       | • Reactive Orders Queue   • Fleet Roster (Technicians)  • Active Cart         |
       | • Service Catalog         • Category Metadata           • Global Alerts       |
       +-------------------------------------------------------------------------------+
                                         |
                                         v
       +-------------------------------------------------------------------------------+
       |                       Client-Side Persistence & Mock Data                     |
       |                         (`src/data/mockEcosystemData.ts`)                     |
       +-------------------------------------------------------------------------------+
```

---

## 2. State Management & Data Flow

All portals bind to a centralized reactive store built with **Zustand** (`src/store/useEcosystemStore.ts`).

### State Hub Breakdown:
| State Entity | Description | Mutated By | Consumed By |
| :--- | :--- | :--- | :--- |
| `categories` | Service taxonomies & icon metadata | Admin Catalog Manager | Customer Homepage & Catalog |
| `services` | Comprehensive list of available services | Admin Services Editor | Customer Search & Marketplace |
| `technicians` | Registered partners, status, ratings, KYC | Partner Profile & Admin Fleet | Admin Dispatch & Job Radar |
| `orders` | Complete ledger of booking requests | Customer Checkout & Partner OTP | All 3 Portals simultaneously |
| `cart` | Current customer shopping cart | Customer Marketplace | Customer Checkout |
| `activePartnerId` | Currently active simulated technician | Portal Switcher Bar | Partner Job Screen |
| `notification` | Floating real-time toast alert | All store actions | Global Notification Banner |

---

## 3. Two-Factor Doorstep OTP Authentication Protocol

To prevent fraudulent service claims and ensure transparent execution, Servicewala enforces a dual-OTP security verification cycle:

```
[Customer Checkout]
       |
       v
 Order Created: Generates random 4-digit `startOtp` (e.g. 4821) and `endOtp` (e.g. 7392)
       |
       v
[Partner Accepts Job] -> Partner arrives at customer location
       |
       v
 Customer reveals `startOtp` to Technician
       |
       v
 Technician enters OTP into Partner Portal (`verifyStartOtp(orderId, otp)`)
       |
       +--> If Invalid: Rejection toast displayed; job cannot start.
       +--> If Valid: Order status transitions to `in_progress`.
       |
       v
 Technician finishes service & requests `endOtp` from Customer
       |
       v
 Technician enters OTP into Partner Portal (`verifyEndOtp(orderId, otp)`)
       |
       +--> If Valid:
            1. Order status transitions to `completed`.
            2. Platform commission (15%) deducted.
            3. Net payout credited directly to Technician's `walletBalance`.
            4. Revenue recorded in Admin GMV Analytics.
```

---

## 4. Commission & Earnings Calculation

When a service is marked as completed:
$$\text{Platform Commission} = \text{Final Amount} \times 0.15$$
$$\text{Technician Payout} = \text{Final Amount} - \text{Platform Commission}$$

This calculation automatically updates:
1. `technician.walletBalance` (+ Technician Payout)
2. `technician.totalEarnings` (+ Technician Payout)
3. `technician.completedJobs` (+ 1)
4. Admin Dashboard Total Revenue (+ Platform Commission)

---

## 5. Screen & Routing Directory Map

### Customer Portal (`app/(customer)`)
- `_layout.tsx`: Desktop navbar with Urban Company style header + Mobile bottom navigation.
- `index.tsx`: Clean orchestrator landing page (~140 lines) assembling isolated home components from `src/components/home/`.
- `category/[id].tsx`: Category services list with price filter, ratings, and one-tap cart addition.
- `checkout.tsx`: Complete multi-step checkout with coupon codes, address input, and cash/online choice.
- `bookings.tsx`: Real-time order timeline with customer-facing OTP cards and service details.

### Customer Home Modular Components (`src/components/home/`)
- `HeroSection.tsx`: HomeAdvisor luxury hero banner, fade animation, and search capsule.
- `QuickCategoryStrip.tsx`: Horizontal interactive icon strip with active filters.
- `LiveImpactBar.tsx`: Real-time active status beacon, 4 trust metrics (ratings, speed, volume, OEM parts).
- `CategoriesGridSection.tsx`: 8-category primary grid with rating stats and service counts.
- `SpotlightOffersStrip.tsx`: Horizontal seasonal deal cards with one-tap promo application.
- `PopularServicesSection.tsx`: Search and category-filtered services grid with add-to-cart controls.
- `QualityShowcaseSection.tsx`: Before & after quality comparison with thermal/airflow deltas.
- `WhyChooseSection.tsx`: 4 trust pillars + integration of the Home Protection Promise card.
- `HomeProtectionCard.tsx`: Dedicated ₹10,000 property damage coverage shield guarantee.
- `HowItWorksSection.tsx`: 3-step effortless booking process visualization.
- `TestimonialsSection.tsx`: 4.9★ verified customer reviews with service badges and recency tags.
- `BrandMarqueeSection.tsx`: Continuous CSS-animated infinite multi-brand marquee for 22+ OEM brands.
- `FaqSection.tsx`: Interactive accordion covering arrival timing, technician verification, pricing, and warranty.
- `AppDownloadBanner.tsx`: Mobile app showcase with smartphone mockup, live tracking frame, and QR code.
- `PartnerBanner.tsx`: Fleet recruitment banner with high earnings highlight and one-tap join CTA.
- `HomeMegaFooter.tsx`: Multi-column enterprise footer with trust ribbon, portal navigation, and legal links.
- `FloatingHelpCapsule.tsx`: Sticky quick-help diagnostic assistant with smart problem diagnosis and instant WhatsApp/callback.

### Partner Portal (`app/(partner)`)
- `_layout.tsx`: Header with technician online/busy/offline status switch and wallet snapshot.
- `index.tsx`: Incoming job alerts modal, active job card, and OTP entry inputs.
- `earnings.tsx`: Historical transaction breakdown, platform fee deductions, and weekly earnings chart.
- `profile.tsx`: Technician verification badge, KYC submission status, rating stars, and contact info.

### Operations Admin (`app/(admin)`)
- `_layout.tsx`: Dark slate sidebar/header navigation with quick metrics and active alert counter.
- `index.tsx`: Real-time dashboard with GMV graphs, service counts, and dispatch health.
- `bookings.tsx`: Live dispatch board allowing status changes, technician reassignments, and cancellation.
- `services.tsx`: Dynamic service manager allowing live pricing edits, new service creation, and category updates.
- `technicians.tsx`: Fleet management dashboard with KYC review (Approve/Reject) and commission slider.

---

## 6. Migration Path to Phase 2 (Backend Integration)

When transitioning from Phase 1 (Frontend Simulation) to Phase 2 (Production Cloud):
1. **Database:** Map `src/data/mockEcosystemData.ts` schemas directly to **PostgreSQL / Supabase** tables.
2. **Real-time Sync:** Replace synchronous Zustand mutations with **Supabase Realtime WebSockets** or **Firebase Firestore** listeners.
3. **Authentication:** Implement Supabase Auth (JWT) with Role-Based Access Control (RBAC):
   - `role: 'customer'` -> `app/(customer)`
   - `role: 'technician'` -> `app/(partner)`
   - `role: 'admin'` -> `app/(admin)`
4. **Native Compilation:** Build release APKs and IPAs using **Expo Application Services (EAS)**:
   ```bash
   eas build --platform all --profile production
   ```
