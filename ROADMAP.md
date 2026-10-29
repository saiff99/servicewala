# 🗺️ Servicewala Product Roadmap

This document outlines the strategic development phases for the **Servicewala Multi-Portal Home Services Platform**, from initial prototype simulation to full-scale enterprise production.

---

## 📍 Phase 1: Interactive Frontend Simulation Engine *(Current — 100% Complete)*

- [x] **Triple-Portal Architecture:**
  - [x] **Customer Portal:** Marketplace hero, 10 specialized categories, live search, cart, checkout, and bookings.
  - [x] **Technician Portal:** Live job alerts radar, active job card, Start/End OTP verification, and earnings ledger.
  - [x] **Admin Operations Center:** Real-time revenue & GMV KPIs, live order dispatch board, dynamic catalog manager, and technician KYC approval.
- [x] **High-Conversion Trust & Quality Engines (Customer Home):**
  - [x] **22+ Multi-Brand Infinite Marquee:** Continuous CSS-animated loop displaying genuine OEM authorized repair support for Samsung, Apple, LG, Voltas, HP, Dell, etc.
  - [x] **₹10,000 Home Protection Promise Shield:** Zero-liability property damage coverage, 48-hour claim processing, and 4 trust pillars.
  - [x] **Floating Quick Help & Diagnostic Capsule:** Sticky flyout capsule offering 1-tap issue diagnostics, immediate cost estimates, WhatsApp chat, and 2-min callback requests.
  - [x] **Enterprise Mega Footer & FAQ:** Comprehensive interactive accordion and multi-column luxury footer with trust ribbon and integrated mobile app badges.
- [x] **Modular Component Architecture:** Decomposed customer home into 14 self-contained modules in `src/components/home/` with a clean ~115-line master orchestrator.
- [x] **Universal Cross-Platform Codebase:** Single codebase running on Web (Desktop & Laptop) and ready for Mobile (Android & iOS).
- [x] **Single-Source-of-Truth Reactive State:** Synchronous Zustand store (`src/store/useEcosystemStore.ts`) enabling instant cross-portal simulation without external database setup.
- [x] **Two-Factor Doorstep Security Protocol:** Dynamic 4-digit `startOtp` and `endOtp` verification cycle.
- [x] **Design System:** Urban Company / HomeAdvisor luxury minimalist styling ("ছিমছাম প্রিমিয়াম") with pure React Native `StyleSheet.create`.

---

## 📍 Phase 2: Cloud Backend & Realtime Database *(Next Milestone)*

- [ ] **Database & Persistence:**
  - [ ] Implement **PostgreSQL / Supabase** schema mapped directly from `src/data/mockEcosystemData.ts`.
  - [ ] Replace local mock state with Supabase client queries.
- [ ] **Realtime Event Dispatch:**
  - [ ] Implement **Supabase Realtime WebSockets** for instant dispatch notifications to Technicians and Customers.
- [ ] **Authentication & Security:**
  - [ ] Role-Based Access Control (RBAC): Customer, Partner/Technician, and Admin authentication.
  - [ ] Phone OTP Login (Twilio / Firebase Phone Auth).
  - [ ] Secure credential storage using `expo-secure-store` (iOS Keychain & Android Keystore).
- [ ] **Payment Gateway Integration:**
  - [ ] Integrate **Razorpay / Stripe** for upfront card, UPI, and netbanking payments alongside Cash on Delivery (COD).
- [ ] **Cloud Storage:**
  - [ ] AWS S3 or Supabase Storage for technician KYC ID uploads and service banner assets.

---

## 📍 Phase 3: Native Mobile Apps & Store Deployment

- [ ] **App Assets & Branding:**
  - [ ] High-resolution app icons (`assets/icon.png`) and adaptive icons for Android.
  - [ ] Branded splash screen (`assets/splash.png`).
- [ ] **Push Notifications:**
  - [ ] Implement Expo Push Notifications / Firebase Cloud Messaging (FCM) for real-time order alerts even when the app is closed.
- [ ] **EAS Build & Store Releases:**
  - [ ] Android App Bundle (`.aab`) generation for Google Play Store.
  - [ ] iOS App Archive (`.ipa`) generation for Apple App Store.
  - [ ] OTA (Over-The-Air) runtime updates via EAS Update.

