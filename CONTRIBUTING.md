# 🤝 Contributing to Servicewala

Thank you for your interest in contributing to **Servicewala**! This guide details our coding standards, branch conventions, and testing requirements to help you get started quickly.

---

## 🛠️ Tech Stack Overview

- **Framework:** React Native + Expo SDK + Expo Router
- **Platform:** Universal (Web, Android, iOS)
- **Language:** TypeScript (Strict Mode)
- **Global State:** Zustand (`src/store/useEcosystemStore.ts`)
- **Styling:** Pure React Native `StyleSheet.create` (No Tailwind CSS)

---

## 🚀 Getting Started

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/saiff99/servicewala.git
   cd servicewala
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run web      # Starts web development server on http://localhost:8081
   npm run start    # Starts Expo with interactive terminal & QR code
   ```

---

## 📐 Architecture & Key Rules

Before writing code, please review:
- **[`AGENTS.md`](./AGENTS.md):** Rules, design tokens, directory maps, and AI agent guidelines.
- **[`ARCHITECTURE.md`](./ARCHITECTURE.md):** Complete technical system design, data flow diagrams, and two-factor OTP protocol.

### Core Development Rules:
1. **Zero External Backend for Phase 1:** All state must remain reactive inside the central Zustand store (`src/store/useEcosystemStore.ts`). Do not introduce ad-hoc REST/GraphQL calls or separate stores.
2. **Styling Convention:** Always use React Native `StyleSheet.create`. Do **NOT** use Tailwind CSS or arbitrary utility strings.
3. **Cross-Platform Compatibility:** Write clean React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, `TextInput`). Never use web-only HTML tags (`div`, `span`, `button`).

---

## 🧪 Pre-Commit Verification

Before submitting any Pull Request, ensure all checks pass with **0 errors**:

```bash
# 1. TypeScript Strict Typecheck
npx tsc --noEmit

# 2. ESLint Code Quality Verification
npx eslint .
```

---

## 🌿 Branch & Commit Guidelines

- **Branch Naming:**
  - `feat/feature-name` (e.g. `feat/customer-wallet`)
  - `fix/bug-description` (e.g. `fix/hover-layout-shift`)
  - `docs/documentation-update` (e.g. `docs/update-readme`)
- **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
  - `feat: add printer repair service category`
  - `fix: resolve mobile bottom navigation tab bar overlap`
  - `style: refine hero search input focus glow`

---

## 📬 Submitting a Pull Request (PR)

1. Ensure your branch is rebased on `main`.
2. Provide a clear PR title and detailed summary of changes.
3. Include screenshots or screen recordings for any UI/UX changes.
4. Confirm that both `npx tsc --noEmit` and `npx eslint .` pass cleanly.

