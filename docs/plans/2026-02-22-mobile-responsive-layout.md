# Plan: Mobile Responsive Layout

> Date: 2026-02-22
> Related issues: #63, ADR-012

## Context

beanies.family is a PWA-enabled app with desktop-only layout — a permanent 256px sidebar and a header packed with 7+ controls. On mobile viewports (<768px), the sidebar crushes content and header controls overflow. ADR-012 already documents the architectural decisions: hamburger menu, 4-tab bottom nav, controls in hamburger, shared nav constants, and breakpoint strategy.

## Approach

Mobile-first responsive implementation: add a breakpoint composable, two new mobile navigation components, and update App.vue/AppHeader.vue to conditionally render desktop vs mobile layouts. Then do a responsive pass on all pages for padding, grids, and touch targets.

## Files affected

### Created

- `src/composables/useBreakpoint.ts` — Reactive `isMobile` / `isTablet` / `isDesktop` using `matchMedia`
- `src/components/common/MobileBottomNav.vue` — Fixed bottom tab bar (4 tabs: Nook, Accounts, Goals, Pod)
- `src/components/common/MobileHamburgerMenu.vue` — Full-screen overlay with all nav, controls, branding

### Modified

- `src/constants/navigation.ts` — Add `MOBILE_TAB_ITEMS` constant
- `src/services/translation/uiStrings.ts` — Add i18n keys for mobile nav labels
- `src/App.vue` — Conditionally show sidebar (desktop) vs bottom nav (mobile)
- `src/components/common/AppHeader.vue` — Mobile: hamburger + greeting + bell; Desktop: unchanged
- `src/components/ui/BaseModal.vue` — Add `fullscreenMobile` prop
- `src/pages/TransactionsPage.vue` — Responsive form grids
- `src/pages/AssetsPage.vue` — Responsive card value grids
- `src/pages/GoalsPage.vue` — Responsive form grids
- `src/pages/ReportsPage.vue` — Responsive select widths
- `src/pages/FamilyPage.vue` — Responsive form grids
