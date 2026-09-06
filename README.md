# Anti-Xeno Initiative (AXI) Wiki

[![VitePress](https://img.shields.io/badge/VitePress-1.6+-ff7100?style=flat&logo=vite&logoColor=white)](https://vitepress.dev/)
[![Discord](https://img.shields.io/discord/591914197219016707.svg?label=AXI%20Discord&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://antixenoinitiative.com/discord)
[![Website](https://img.shields.io/badge/Website-antixenoinitiative.com-ff7100)](https://www.antixenoinitiative.com/)

The official VitePress static site repository for the [Anti-Xeno Initiative Wiki](https://wiki.antixenoinitiative.com/).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 22+
- npm

### Installation

```bash
npm install
```

### Development Server

Start the local VitePress development server with live reload:

```bash
npm run docs:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Preview

Compile the static website:

```bash
npm run docs:build
```

Preview the production build locally:

```bash
npm run docs:preview
```

### Automated Testing & Validation

Run the automated test suite to validate generated HTML documents, detect accidental raw HTML code leaks, and check all local image assets for 404s across all 427+ pages:

```bash
# Run tests against the static build
npm test

# Run a full build and validation test in one step
npm run verify
```

---

## 📂 Project Structure

```
axiwikisite/
├── .github/
│   └── workflows/
│       ├── deploy.yml        # Automated GitHub Pages deployment on push to main
│       └── pr-checks.yml     # Automated build & validation checks on Pull Requests
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts        # VitePress configuration (nav, sidebar, search, i18n)
│   │   └── theme/
│   │       ├── components/
│   │       │   ├── AxiTabs.vue   # Custom interactive tabset container
│   │       │   └── AxiTab.vue    # Individual tab panel
│   │       ├── index.ts      # Theme setup & component registration
│   │       └── style.css     # AXI theme styling (#ff7100 orange & dark sci-fi)
│   ├── public/
│   │   ├── axi_logo_new2.png # Logo & favicons
│   │   └── img/              # Artwork, diagrams, and screenshots
│   ├── index.md              # Homepage with hero, topic cards, credits
│   ├── basic-combat-guide.md # Guides and articles
│   ├── builds.md             # Recommended ship builds with interactive tabs
│   ├── interceptors.md       # Thargoid bestiary
│   ├── de/                   # German translations
│   ├── fr/                   # French translations
│   ├── es/                   # Spanish translations
│   ├── it/                   # Italian translations
│   ├── ru/                   # Russian translations
│   └── tr/                   # Turkish translations
├── scripts/
│   ├── migrate.mjs           # Migration utility to sync/transform axiwiki content
│   └── verify-html.mjs       # Automated test suite checking HTML integrity & assets
├── package.json
└── README.md
```

---

## 🌐 Internationalization (i18n)

The wiki supports full multi-language localization across 7 languages:
- **English** (`/`) - Primary
- **Deutsch** (`/de/`)
- **Français** (`/fr/`)
- **Español** (`/es/`)
- **Italiano** (`/it/`)
- **Русский** (`/ru/`)
- **Türkçe** (`/tr/`)

VitePress automatically generates the top navigation language switcher dropdown to navigate seamlessly between language versions.

---

## 🚢 Deployment & CI/CD Pipeline

The project includes two GitHub Actions workflows configured in `.github/workflows/`:

### 1. Pull Request Checks (`.github/workflows/pr-checks.yml`)
Runs automatically on every Pull Request targeting the `main` branch (and can also be manually dispatched):
1. **Static Build**: Executes `npm run docs:build` to compile all Markdown pages, frontmatter metadata, and Vue components.
2. **Automated Validation**: Runs `npm test` (`scripts/verify-html.mjs`) to verify HTML structure across all 7 locales, check for raw HTML leaks into code blocks, and ensure 100% of referenced image assets exist without 404s.

### 2. GitHub Pages Deployment (`.github/workflows/deploy.yml`)
When changes are merged or pushed to the `main` branch:
1. **Static Build & Verification**: Compiles the site with VitePress and runs `npm test` validation. If validation fails, deployment is automatically halted.
2. **Deploy**: Deploys the verified static artifact directly to GitHub Pages.

If using a repository subpath (e.g. `https://<org>.github.io/axiwikisite/`), set the `BASE_PATH` environment variable:
```bash
BASE_PATH=/axiwikisite/ npm run docs:build
```
For custom domains (e.g. `wiki.antixenoinitiative.com`), the default `BASE_PATH=/` is used.
