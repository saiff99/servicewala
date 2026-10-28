# CLAUDE.md — Servicewala Project Guide for Claude Code

Refer to **[AGENTS.md](./AGENTS.md)** for full project architecture, triple-portal routing, and state definitions.

## ⚡ Token-Saving Guidelines for Claude
1. **Never read `package-lock.json`**: It is huge (~15k lines) and will exhaust your context window.
2. **Never crawl the whole repo**: Use targeted grep or refer to Section 2 of `AGENTS.md` for screen locations.
3. **Surgical edits only**: Edit only the specific lines needing changes. Do NOT rewrite entire screens.
4. **Pure React Native `StyleSheet.create`**: Do NOT use Tailwind CSS.
5. **Single Store Rule**: Maintain all state inside `src/store/useEcosystemStore.ts`. No ad-hoc API calls or extra stores.
6. **Commands to run**:
   - `npx tsc --noEmit` (Must pass with 0 errors)
   - `npx eslint .` (Must pass with 0 errors)

