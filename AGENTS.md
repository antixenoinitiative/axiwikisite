# Agent Guidelines: Anti-Xeno Initiative Wiki (VitePress)

This document provides context, architecture details, and conventions for AI agents and developers working on this codebase.

---

## 🧭 Project Overview

This project is the modern static-site migration of the **Anti-Xeno Initiative (AXI) Wiki** from Wiki.js to **[VitePress](https://vitepress.dev/)**, configured for hosting on GitHub Pages.

- **Upstream Reference Repository**: [`antixenoinitiative/axiwiki`](https://github.com/antixenoinitiative/axiwiki)
- **Live Legacy Wiki**: [`wiki.antixenoinitiative.com`](https://wiki.antixenoinitiative.com/en/home)
- **Primary Framework**: VitePress 1.6+ with Vue 3

---

## 📂 Architecture & Directory Layout

```
axiwikisite/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Actions workflow deploying to GitHub Pages on main
│       └── pr-checks.yml       # GitHub Actions CI checks for pull requests
├── docs/                       # VitePress documentation root
│   ├── .vitepress/
│   │   ├── config.mts          # Navigation, sidebars, search, locales (i18n)
│   │   └── theme/
│   │       ├── components/
│   │       │   ├── AxiTabs.vue # Tabset container component
│   │       │   └── AxiTab.vue  # Individual tab panel component
│   │       ├── index.ts        # Theme extension & global component registration
│   │       └── style.css       # AXI dark theme (#ff7100 orange) & custom component styles
│   ├── public/                 # Static assets served at the root URL
│   │   ├── img/                # All diagrams, screenshots, ship graphics, interceptor art
│   │   ├── axi_logo_new2.png   # Main AXI logo
│   │   ├── favicon.ico         # Favicons
│   │   └── *.binds, *.ahk      # Downloadable flight binds and scripts
│   ├── index.md                # Homepage with hero, topic cards, and credits
│   ├── *.md                    # English documentation pages (~76 pages)
│   ├── de/                     # German localized pages
│   ├── fr/                     # French localized pages
│   ├── es/                     # Spanish localized pages
│   ├── it/                     # Italian localized pages
│   ├── ru/                     # Russian localized pages
│   └── tr/                     # Turkish localized pages
├── scripts/
│   ├── migrate.mjs             # Node script to sync, transform, and sanitize pages from axiwiki
│   └── verify-html.mjs         # Automated test suite checking HTML, assets, and raw HTML leaks
├── package.json                # Project dependencies & scripts
├── README.md                   # Human-facing project documentation
└── AGENTS.md                   # Agent reference guide (this file)
```

---

## 🛠️ Common Commands

- **Start Dev Server**: `npm run docs:dev` (runs on `http://localhost:5173`)
- **Build Static Site**: `npm run docs:build` (builds to `docs/.vitepress/dist`)
- **Run Automated Tests**: `npm test` (validates HTML tags, checks for raw HTML leaks, checks 404 assets)
- **Full Build & Test**: `npm run verify` (runs `docs:build` followed by `test`)
- **Preview Production Build**: `npm run docs:preview` (runs on `http://localhost:4173`)
- **Re-run Content Migration**: `npm run migrate`

---

## ⚠️ Important Conventions & Gotchas

### 1. Image Paths
- **Always use root-relative paths starting with `/`**:
  - Correct: `/img/alliance-chieftain.png` or `/axi_logo_new2.png`
  - Incorrect: `./img/foo.png` or `img/foo.png` (Vite will fail to resolve these).
- **Lowercase Extensions**: Ensure image file extensions are lowercase (e.g. `.png`, not `.PNG`), as Linux filesystems are case-sensitive.
- **Image Sizing**: VitePress does not support Wiki.js `=250x` markdown image sizing natively. Use HTML `<img src="/img/foo.png" width="250" alt="foo" />` instead.

### 2. Interactive Tabsets
- Wiki.js used `## Tabset {.tabset}`.
- In this repository, use the custom Vue components registered globally:
  ```html
  <AxiTabs>
    <AxiTab title="Alliance Chieftain">
      Content for Chieftain...
    </AxiTab>
    <AxiTab title="Krait Mk.II">
      Content for Krait...
    </AxiTab>
  </AxiTabs>
  ```

### 3. Internal Links & Routing
- Use **clean URLs** without `.html` and without the legacy `/en/` prefix for English pages:
  - Correct: `[Basic Combat Guide](/basic-combat-guide)`
  - Legacy Wiki.js: `[Basic Combat Guide](/en/basic-combat-guide)`
- For translated pages in sub-locales, prefix the locale:
  - Correct: `[Builds](/de/builds)`
- Home link: Use `/` (or `/<locale>/`), not `/home`.

### 4. Frontmatter YAML Syntax
- Strings containing colons (like `Elite: Dangerous`) **must be quoted** in frontmatter, or VitePress YAML parser will throw an error:
  - Correct: `description: "Elite: Dangerous Anti-Xeno Combat"`
  - Incorrect: `description: Elite: Dangerous Anti-Xeno Combat`

### 5. Callouts / Containers
- Use VitePress markdown containers rather than blockquotes with CSS classes:
  ```markdown
  ::: info
  This is an info callout.
  :::

  ::: warning
  This is a warning callout.
  :::

  ::: tip
  This is a helpful tip.
  :::
  ```

### 6. Responsive Video Embeds
- Wrap YouTube or video iframes in `.iframeContainer` for automatic 16:9 responsive scaling:
  ```html
  <div class="iframeContainer">
    <iframe src="https://www.youtube.com/embed/..." frameborder="0" allowfullscreen></iframe>
  </div>
  ```

### 7. GitHub Pages Base Path
- The base path is controlled by the `BASE_PATH` environment variable in `docs/.vitepress/config.mts` (`process.env.BASE_PATH || '/'`).
- If deploying to a GitHub Pages repository subpath (e.g. `https://<org>.github.io/<repo>/`), pass `BASE_PATH=/<repo>/ npm run docs:build`.
- For custom domains (e.g. `wiki.antixenoinitiative.com`), leave the default `/`.
