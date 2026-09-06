---
title: "Contributing & Developer Guide"
description: "A comprehensive guide on editing pages, running the site locally, and contributing translations to the Anti-Xeno Initiative Wiki."
tags: dev, editing, contributing, translation, vitepress, github
---

# Contributing & Developer Guide

Welcome to the contributor and developer guide for the **Anti-Xeno Initiative (AXI) Wiki**!

The wiki is powered by **[VitePress](https://vitepress.dev/)**, a modern Vue-powered static site generator. All content is stored as plain Markdown files in a Git repository and automatically built and deployed to **GitHub Pages** via GitHub Actions.

Whether you want to fix a simple typo, submit an updated ship build, or help translate the wiki into new languages, this guide provides everything you need.

---

## 🚀 Quick Editing via GitHub (No Setup Required)

For small updates, typo fixes, or simple additions, you can edit pages directly in your web browser:

1. **Navigate to the file** you want to edit on the [axiwiki GitHub Repository](https://github.com/antixenoinitiative/axiwiki) (inside the `docs/` folder).
2. Click the **pencil icon** (✏️ *Edit this file*) in the upper right.
3. Make your edits in Markdown. You can use the **Preview** tab to check your formatting.
4. Scroll to the bottom, enter a concise commit message (e.g., `Fix shield booster engineering recommendation`), select **Create a new branch for this commit and start a pull request**, and click **Propose changes**.
5. Once your Pull Request is submitted, an AXI wiki maintainer will review and merge it. The site will automatically rebuild and deploy!

---

## 💻 Local Development Workflow

If you are adding new pages, updating complex layouts, or working with custom components, running the site locally lets you preview your changes in real-time with instant hot-reloading.

### Prerequisites

- **Node.js**: Version 18.0 or newer (Node 20+ or 22+ recommended). Check with `node -v`.
- **Git**: Installed and configured.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/antixenoinitiative/axiwiki.git
cd axiwiki

# Install dependencies
npm install
```

### 2. Start the Local Dev Server

```bash
npm run docs:dev
```

This starts a local development server at `http://localhost:5173`. Any changes you save in Markdown or CSS files will immediately update in your browser.

### 3. Build & Run Automated Verification

Before submitting changes or opening a pull request, always run the automated verification suite:

```bash
# Compile the static site and run the test suite in one command
npm run verify

# Or run them independently:
npm run docs:build  # Compiles static HTML/CSS/JS to docs/.vitepress/dist
npm test            # Runs scripts/verify-html.mjs test suite

# Preview the built production site locally at http://localhost:4173
npm run docs:preview
```

#### What the Verification Suite Checks:
- **Accidental Raw HTML Leaks**: In Markdown, indenting HTML tags by 4 or more spaces after a blank line triggers CommonMark indented code blocks (`<pre><code>&lt;div...`). The validator scans all 427+ generated pages and flags any un-highlighted code block containing escaped HTML tags.
- **Local Media 404 Prevention**: Asserts that every `<img src="/img/...">` or asset path referenced in the markup actually exists in `docs/public/`.
- **Custom Component Compilation**: Confirms that custom Vue components (`<AxiTabs>`, `<AxiTab>`) compiled cleanly to HTML rather than remaining as raw unrendered custom tags.
- **Document Structure**: Validates that all pages contain complete DOCTYPE, `<html>`, `<head>`, and `<body>` tags without truncation.
- **Locale Coverage**: Ensures all 7 locales (`en`, `de`, `fr`, `es`, `it`, `ru`, `tr`) generated valid root index pages.

---

## 📂 Repository Layout

```
axiwikisite/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Actions workflow deploying to GitHub Pages on main
│       └── pr-checks.yml       # GitHub Actions CI checks for pull requests
├── docs/                       # VitePress documentation root
│   ├── .vitepress/
│   │   ├── config.mts          # Site configuration (nav, sidebar, search, locales)
│   │   └── theme/
│   │       ├── components/
│   │       │   ├── AxiTabs.vue # Custom tab container component
│   │       │   └── AxiTab.vue  # Individual tab panel component
│   │       ├── index.ts        # Theme extension & global component registration
│   │       └── style.css       # AXI theme styling (colors, cockpit orange, layouts)
│   ├── public/                 # Static assets served at the root URL
│   │   ├── img/                # All screenshots, diagrams, ship art, and icons
│   │   ├── axi_logo_new2.png   # Main AXI logo
│   │   ├── favicon.ico         # Browser favicons
│   │   └── *.binds, *.ahk      # Downloadable flight binds and scripts
│   ├── index.md                # Homepage
│   ├── editing-guide.md        # This guide
│   ├── *.md                    # English documentation pages (~76 pages)
│   ├── de/                     # German localized pages
│   ├── fr/                     # French localized pages
│   ├── es/                     # Spanish localized pages
│   ├── it/                     # Italian localized pages
│   ├── ru/                     # Russian localized pages
│   └── tr/                     # Turkish localized pages
├── scripts/
│   ├── migrate.mjs             # Content migration & transformation script
│   └── verify-html.mjs         # Automated test suite (HTML integrity, 404s, raw HTML)
├── package.json                # Project scripts and dependencies
└── README.md                   # Project overview and setup instructions
```

---

## ✍️ Content & Markdown Conventions

VitePress compiles Markdown into Vue components, which allows rich features but requires clean formatting:

### 1. Frontmatter

Every page should start with YAML frontmatter containing at least `title`:

```markdown
---
title: "Alliance Chieftain Combat Guide"
description: "Comprehensive guide to piloting the Alliance Chieftain against Thargoid Interceptors."
tags: chieftain, combat, outfitting
---
```

::: warning Colons in Frontmatter
If any frontmatter value contains a colon (e.g. `title: "Elite: Dangerous Anti-Xeno Tactics"`), you **must wrap the string in quotation marks**. Unquoted colons will break YAML parsing and fail the build.
:::

### 2. Internal Links & Routing

- Always use **root-relative clean URLs** without `.html` and without the legacy `/en/` prefix:
  - ✅ `[Recommended Builds](/builds)`
  - ✅ `[Basic Combat Guide](/basic-combat-guide)`
  - ❌ `[Recommended Builds](/en/builds)` *(legacy Wiki.js route)*
  - ❌ `[Basic Combat Guide](./basic-combat-guide.html)`
- Linking to the homepage: use `/` (or `/<locale>/` for translations), not `/home`.

### 3. Images & Media

- **Store images locally**: All images should be committed to `docs/public/img/`. Never link to ephemeral third-party image hosts.
- **Root-relative paths**: Always reference images with a leading slash:
  - ✅ `![Chieftain](/img/alliance-chieftain.png)`
  - ❌ `![Chieftain](./img/alliance-chieftain.png)`
- **Lowercase file extensions**: Linux environments (and GitHub Pages) are case-sensitive. Always name image files with lowercase extensions (`.png`, `.jpg`, `.svg`).
- **Image sizing**: Standard Markdown does not support custom width. Use standard HTML tags:
  ```html
  <img src="/img/interceptor-scan.png" alt="Interceptor Scan" width="400" />
  ```

### 4. Interactive Tabsets (`<AxiTabs>`)

To present ship builds, weapon comparisons, or variant loadouts in tabbed interfaces, use the custom `<AxiTabs>` and `<AxiTab>` components:

```html
<AxiTabs>
  <AxiTab title="Alliance Chieftain">
    The Chieftain offers high maneuverability and excellent hardpoint placement.
  </AxiTab>
  <AxiTab title="Krait Mk.II">
    The Krait provides superior firepower with four Medium Gauss Cannons.
  </AxiTab>
</AxiTabs>
```

### 5. Callouts & Containers

Use VitePress callout containers to draw attention to important flight tips, warnings, or mechanics:

```markdown
::: info
Guardian Gauss Cannons remain the gold standard weapon for exerting Interceptor hearts.
:::

::: tip
Pre-firing your heatsink 2 seconds before exerting a heart keeps your thermal signature below 20%.
:::

::: warning
Caustic damage will persist until burned off at >120% heat or cleansed with Decontamination Limpets.
:::

::: danger
Do not deploy SLFs (Ship Launched Fighters) in multi-pilot combat zones; they cause severe instancing lag.
:::
```

### 6. Responsive Video Embeds

Wrap YouTube or video embeds in `.iframeContainer` to ensure they maintain a 16:9 aspect ratio across all screen sizes:

```html
<div class="iframeContainer">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
</div>
```

---

## 🌐 Translation & Localization Guide

The AXI community is global, and the wiki provides native localization across 7 languages.

### Supported Locales

| Locale Code | Language | Directory | Base URL |
|---|---|---|---|
| `en` | English (Master) | `docs/` | `/` |
| `de` | German (*Deutsch*) | `docs/de/` | `/de/` |
| `fr` | French (*Français*) | `docs/fr/` | `/fr/` |
| `es` | Spanish (*Español*) | `docs/es/` | `/es/` |
| `it` | Italian (*Italiano*) | `docs/it/` | `/it/` |
| `ru` | Russian (*Русский*) | `docs/ru/` | `/ru/` |
| `tr` | Turkish (*Türkçe*) | `docs/tr/` | `/tr/` |

### How Translation Routing Works

1. The English version is located at the root of `docs/` (e.g. `docs/builds.md`).
2. Each translation lives in a subdirectory named after its locale code (e.g. `docs/de/builds.md`).
3. File names must match the English master file names so that VitePress's language switcher can seamlessly toggle between languages on the current page.

### Translating Links

When translating a page, all internal links should point to the translated page in that locale:
- In English (`docs/basic-combat-guide.md`): `[Recommended Builds](/builds)`
- In German (`docs/de/basic-combat-guide.md`): `[Empfohlene Builds](/de/builds)`
- In French (`docs/fr/basic-combat-guide.md`): `[Builds Recommandés](/fr/builds)`

If a particular page has not yet been translated, you may link to the English root URL as a fallback.

### Adding a Translation for an Existing Page

1. Locate the master English document in `docs/<page-name>.md`.
2. Check if `docs/<locale>/<page-name>.md` already exists.
3. If it does not exist, copy the English file into `docs/<locale>/<page-name>.md`.
4. Translate the content, headings, and frontmatter `title` / `description`.
5. Update internal links to include the `/<locale>/` prefix.
6. Verify with `npm run docs:build` that the build succeeds.

### Adding a New Language

If you would like to contribute a completely new language (e.g. Portuguese `pt` or Polish `pl`):
1. Create the new locale directory `docs/<locale>/`.
2. Add the locale configuration to `docs/.vitepress/config.mts` under the `locales` object:
   ```typescript
   pt: {
     label: 'Português',
     lang: 'pt',
     link: '/pt/',
     themeConfig: {
       nav: [ ... ],
       sidebar: [ ... ]
     }
   }
   ```
3. Copy and translate the essential pages (`index.md`, `quick-start-guide.md`, `basic-combat-guide.md`, `builds.md`).
4. Submit a Pull Request on GitHub.

---

## 🚢 Submitting Your Changes

1. **Commit your changes**: Write clear, descriptive commit messages.
2. **Push to your fork/branch**: `git push origin my-feature-branch`.
3. **Open a Pull Request**: On GitHub, open a PR against the `main` branch.
4. **Automated CI Checks**: GitHub Actions runs `.github/workflows/pr-checks.yml` (`npm run docs:build` + `npm test`) to ensure the VitePress static build passes, HTML documents are well-formed, no raw HTML leaks into code blocks, and all media assets resolve without 404s.
5. **Review & Merge**: Wiki staff review your PR, and once approved and merged, `.github/workflows/deploy.yml` automatically builds and deploys the update to GitHub Pages!

Thank you for helping keep the Anti-Xeno Initiative Wiki accurate, modern, and accessible to pilots across the galaxy! o7
