import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'

const TEMP_DIR = path.resolve('.axiwiki_temp')
const DOCS_DIR = path.resolve('docs')
const PUBLIC_DIR = path.join(DOCS_DIR, 'public')

const LOCALES = ['de', 'fr', 'es', 'it', 'ru', 'tr']

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function transformTabsets(text) {
  const tabsetHeadingRegex = /^(\s*)(#{1,4})\s+(?:Tabset|Tabs)?\s*\{\.tabset\}/gm
  let match
  let result = text
  const matches = []
  while ((match = tabsetHeadingRegex.exec(text)) !== null) {
    matches.push({ index: match.index, full: match[0], level: match[2].length })
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const { index, full, level } = matches[i]
    const afterIndex = index + full.length

    const rest = result.slice(afterIndex)
    const endMatch = new RegExp('^\\s*#{1,' + level + '}\\s+', 'm').exec(rest)
    const tabsetContent = endMatch ? rest.slice(0, endMatch.index) : rest
    const remaining = endMatch ? rest.slice(endMatch.index) : ''

    const tabHeadingLevel = level + 1
    const tabRegex = new RegExp('^\\s*#{' + tabHeadingLevel + '}\\s+(.+)$', 'gm')
    const subIndices = []
    let subMatch
    while ((subMatch = tabRegex.exec(tabsetContent)) !== null) {
      subIndices.push({ index: subMatch.index, title: subMatch[1].trim(), length: subMatch[0].length })
    }

    if (subIndices.length > 0) {
      let transformedTabs = '\n\n<AxiTabs>\n'
      for (let j = 0; j < subIndices.length; j++) {
        const title = subIndices[j].title
        const start = subIndices[j].index + subIndices[j].length
        const end = (j < subIndices.length - 1) ? subIndices[j + 1].index : tabsetContent.length
        const tabBody = tabsetContent.slice(start, end).trim()
        transformedTabs += `<AxiTab title="${title.replace(/"/g, '&quot;')}">\n\n${tabBody}\n\n</AxiTab>\n`
      }
      transformedTabs += '</AxiTabs>\n\n'

      result = result.slice(0, index) + transformedTabs + remaining
    }
  }

  return result
}

function transformImages(text) {
  let t = text

  // 0. Handle angle-bracket image URLs e.g. ![](<url>)
  t = t.replace(/!\[(.*?)\]\(<([^>]+)>\)/g, '<img src="$2" alt="$1" />')

  // 1. Normalize all markdown image and html img paths to start with / if not http
  t = t.replace(/!\[(.*?)\]\((?!https?:\/\/)(?:\.\/)?([^)\s]+)(.*?)\)/g, (match, alt, src, rest) => {
    const cleanSrc = src.startsWith('/') ? src : `/${src}`
    return `![${alt}](${cleanSrc}${rest})`
  })

  t = t.replace(/<img([^>]+)src=["'](?!https?:\/\/)(?:\.\/)?([^"']+)["']/g, (match, prefix, src) => {
    const cleanSrc = src.startsWith('/') ? src : `/${src}`
    return `<img${prefix}src="${cleanSrc}"`
  })

  // 2. Sized images with align-right: ![alt](url =250x){.align-right}
  t = t.replace(/!\[(.*?)\]\((.*?)\s+=(\d+)x(\d*)\)\s*\{\.align-right\}/g, '<img src="$2" alt="$1" width="$3" style="float: right; margin: 0 0 1rem 1rem;" />')

  // 3. Sized images with width and height: ![alt](url =400x300)
  t = t.replace(/!\[(.*?)\]\((.*?)\s+=(\d+)x(\d+)\)/g, '<img src="$2" alt="$1" width="$3" height="$4" />')

  // 4. Sized images with width only: ![alt](url =250x)
  t = t.replace(/!\[(.*?)\]\((.*?)\s+=(\d+)x\)/g, '<img src="$2" alt="$1" width="$3" />')

  // 5. Plain align-right: ![alt](url){.align-right}
  t = t.replace(/!\[(.*?)\]\((.*?)\)\s*\{\.align-right\}/g, '<img src="$2" alt="$1" style="float: right; margin: 0 0 1rem 1rem;" />')

  // 6. Fix any remaining spaces in image paths inside markdown e.g. /elite_ring_swarms.png =440x600
  t = t.replace(/!\[(.*?)\]\((.*?)\s+=[^)]+\)/g, '![$1]($2)')

  // 7. Normalize uppercase image extensions (.PNG -> .png)
  t = t.replace(/(\/img\/[^)\s"']+)\.PNG/g, '$1.png')

  return t
}

function transformAlerts(text) {
  return text.replace(/((?:>[^\n]*\n)+)\{\.is-(info|warning|danger|success)\}/g, (match, content, type) => {
    const vType = { info: 'info', warning: 'warning', danger: 'danger', success: 'tip' }[type] || 'info'
    const cleaned = content.trim().split('\n').map(l => l.replace(/^>\s?/, '')).join('\n')
    return `::: ${vType}\n${cleaned}\n:::\n`
  })
}

function transformLinks(text, currentLocale = null) {
  let t = text

  const ALIASES = {
    '/home': '/',
    '/Thargoids': '/thargoids',
    '/Engineering': '/engineering',
    '/flight': '/Flight',
    '/streaming_input_overlays': '/input_overlays'
  }

  if (!currentLocale) {
    // English pages: [Title](/en/slug) -> [Title](/slug)
    t = t.replace(/\]\(\/en\/([^)#?]+)([#?][^)]*)?\)/g, (m, slug, extra = '') => {
      let cleanSlug = slug.replace(/\.html$/, '')
      let fullPath = `/${cleanSlug}`
      if (ALIASES[fullPath]) {
        fullPath = ALIASES[fullPath]
      }
      return `](${fullPath}${extra})`
    })

    // Also check direct links without /en/
    for (const [badLink, goodLink] of Object.entries(ALIASES)) {
      t = t.replaceAll(`](${badLink})`, `](${goodLink})`)
    }
  } else {
    // Localized pages: [Title](/en/slug) or [Title](/de/slug) -> [Title](/de/slug)
    t = t.replace(/\]\(\/(?:en|[a-z]{2})\/([^)#?]+)([#?][^)]*)?\)/g, (m, slug, extra = '') => {
      let cleanSlug = slug.replace(/\.html$/, '')
      let fullPath = `/${cleanSlug}`
      if (ALIASES[fullPath]) {
        fullPath = ALIASES[fullPath]
      }
      if (fullPath === '/') {
        return `](/${currentLocale}/${extra})`
      }
      return `](/${currentLocale}${fullPath}${extra})`
    })

    for (const [badLink, goodLink] of Object.entries(ALIASES)) {
      const localizedGood = goodLink === '/' ? `/${currentLocale}/` : `/${currentLocale}${goodLink}`
      t = t.replaceAll(`](${badLink})`, `](${localizedGood})`)
    }
  }

  return t
}

function transformFrontmatter(rawContent) {
  let content = rawContent

  const cleanLines = (lines) => {
    const kept = []
    for (const line of lines) {
      const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
      if (m) {
        const key = m[1]
        let val = m[2].trim()
        if (['editor', 'published', 'dateCreated'].includes(key)) continue
        if ((key === 'title' || key === 'description') && val && !val.startsWith('"') && !val.startsWith("'")) {
          val = JSON.stringify(val)
          kept.push(`${key}: ${val}`)
          continue
        }
      }
      kept.push(line)
    }
    return kept
  }

  // If HTML comments are used for metadata <!--\ntitle: ...\n-->
  if (content.startsWith('<!--')) {
    const endComment = content.indexOf('-->')
    if (endComment !== -1) {
      const comment = content.slice(4, endComment).trim()
      const body = content.slice(endComment + 3).trim()
      const kept = cleanLines(comment.split('\n'))
      return `---\n${kept.join('\n')}\n---\n\n${body}`
    }
  }

  // If standard YAML frontmatter --- ... ---
  if (content.startsWith('---')) {
    const endFm = content.indexOf('---', 3)
    if (endFm !== -1) {
      const fm = content.slice(3, endFm)
      const body = content.slice(endFm + 3)
      const kept = cleanLines(fm.split('\n'))
      return `---\n${kept.join('\n').trim()}\n---\n${body}`
    }
  }

  return content
}

function sanitizeHtml(text) {
  let t = text

  // Fix duplicate or malformed th/td/tr tags in tables
  t = t.replace(/<\/th><\/th>/gi, '</th>')
  t = t.replace(/<th([^>]*)><strong>/gi, '<th$1><strong>')
  t = t.replace(/<th([^>]*)><\/strong>/gi, '<th$1><strong>')
  t = t.replace(/<th\s+scope=["']row["']>((?:(?!<\/?th\b|\/?td\b).)*?)<\/td>/gi, '<th scope="row">$1</th>')
  t = t.replace(/<\/style><\/th>/gi, '</strong></th>')
  t = t.replace(/<link\s+rel=["']stylesheet["']\s+href=["'][^"']+["']\s*\/?>/gi, '')

  // Fix p wrapping ul/ol and stray closing tags
  t = t.replace(/<p>\s*<ul>/gi, '<ul>')
  t = t.replace(/<\/ul>\s*<\/p>/gi, '</ul>')
  t = t.replace(/<\/strong><\/p>/gi, '</strong>')

  return t
}

function autoCloseTags(text) {
  const tagRegex = /(<\/?[a-zA-Z0-9_-]+(?:\s+[^>]*)?>)/g
  const parts = text.split(tagRegex)
  const voidTags = new Set(['img', 'br', 'hr', 'input', 'link', 'meta', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'])
  const blockTags = new Set(['p', 'div', 'ol', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'blockquote', 'figure', 'section'])

  let inP = false
  const result = []

  for (let part of parts) {
    const m = /^<(\/?)([a-zA-Z0-9_-]+)/.exec(part)
    if (m) {
      const isClosing = m[1] === '/'
      const tagName = m[2].toLowerCase()

      if (!voidTags.has(tagName) && !tagName.startsWith('axi')) {
        if (inP) {
          if (!isClosing && blockTags.has(tagName)) {
            result.push('</p>\n')
            inP = false
          } else if (isClosing && tagName === 'p') {
            inP = false
          }
        }

        if (!isClosing && tagName === 'p') {
          inP = true
        }
      }
    }
    result.push(part)
  }

  if (inP) {
    result.push('</p>')
  }

  return result.join('')
}

function processPageContent(rawContent, currentLocale = null) {
  let c = transformFrontmatter(rawContent)
  c = transformTabsets(c)
  c = transformImages(c)
  c = transformAlerts(c)
  c = transformLinks(c, currentLocale)
  c = sanitizeHtml(c)
  c = autoCloseTags(c)
  return c
}

async function copyAssets() {
  console.log('\n--- Syncing Static Assets ---')
  await ensureDir(PUBLIC_DIR)

  // Copy img directory
  const tempImg = path.join(TEMP_DIR, 'img')
  const destImg = path.join(PUBLIC_DIR, 'img')
  if (fsSync.existsSync(tempImg)) {
    await fs.cp(tempImg, destImg, { recursive: true })
    // Ensure all extensions in destImg are lowercase .png
    const imgFiles = await fs.readdir(destImg)
    for (const f of imgFiles) {
      if (f.endsWith('.PNG')) {
        await fs.rename(path.join(destImg, f), path.join(destImg, f.replace(/\.PNG$/, '.png')))
      }
    }
    console.log('[OK] Copied img/ -> docs/public/img/')
  }

  // Copy root media and downloadable files
  const files = await fs.readdir(TEMP_DIR)
  const mediaExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.svg', '.pdf', '.ahk', '.binds', '.xml', '.pdn']
  let count = 0
  for (const f of files) {
    const ext = path.extname(f).toLowerCase()
    if (mediaExtensions.includes(ext)) {
      await fs.copyFile(path.join(TEMP_DIR, f), path.join(PUBLIC_DIR, f))
      count++
    }
  }
  console.log(`[OK] Copied ${count} root media/downloadable files to docs/public/`)
}

async function migrateEnglishPages() {
  console.log('\n--- Migrating English Pages ---')
  await ensureDir(DOCS_DIR)

  const files = await fs.readdir(TEMP_DIR)
  const mdFiles = new Set(files.filter(f => f.endsWith('.md') && f !== 'README.md'))
  const htmlFiles = files.filter(f => f.endsWith('.html'))

  let count = 0

  // First process .md files
  for (const f of mdFiles) {
    if (f === 'home.md') continue // Homepage is customized separately
    const raw = await fs.readFile(path.join(TEMP_DIR, f), 'utf-8')
    const transformed = processPageContent(raw, null)
    await fs.writeFile(path.join(DOCS_DIR, f), transformed, 'utf-8')
    count++
  }

  // Then process .html files where no .md counterpart exists
  for (const f of htmlFiles) {
    if (f === 'home.html') continue
    const baseName = f.slice(0, -5)
    if (!mdFiles.has(`${baseName}.md`)) {
      const raw = await fs.readFile(path.join(TEMP_DIR, f), 'utf-8')
      const transformed = processPageContent(raw, null)
      await fs.writeFile(path.join(DOCS_DIR, `${baseName}.md`), transformed, 'utf-8')
      count++
    }
  }

  console.log(`[OK] Migrated ${count} English pages`)
}

async function migrateLocalizedPages() {
  console.log('\n--- Migrating Localized Pages ---')

  for (const locale of LOCALES) {
    const localeSrc = path.join(TEMP_DIR, locale)
    if (!fsSync.existsSync(localeSrc)) continue

    const localeDest = path.join(DOCS_DIR, locale)
    await ensureDir(localeDest)

    const files = await fs.readdir(localeSrc)
    const mdFiles = new Set(files.filter(f => f.endsWith('.md') && f !== 'README.md'))
    const htmlFiles = files.filter(f => f.endsWith('.html'))

    let count = 0

    // Process .md files
    for (const f of mdFiles) {
      const targetName = (f === 'home.md') ? 'index.md' : f
      const raw = await fs.readFile(path.join(localeSrc, f), 'utf-8')
      const transformed = processPageContent(raw, locale)
      await fs.writeFile(path.join(localeDest, targetName), transformed, 'utf-8')
      count++
    }

    // Process .html files where no .md counterpart exists
    for (const f of htmlFiles) {
      const baseName = f.slice(0, -5)
      const targetName = (baseName === 'home') ? 'index.md' : `${baseName}.md`
      if (!mdFiles.has(`${baseName}.md`)) {
        const raw = await fs.readFile(path.join(localeSrc, f), 'utf-8')
        const transformed = processPageContent(raw, locale)
        await fs.writeFile(path.join(localeDest, targetName), transformed, 'utf-8')
        count++
      }
    }

    console.log(`[OK] Migrated ${count} pages for locale '${locale}'`)
  }
}

async function createHomepage() {
  const homeContent = `---
layout: home

title: Anti-Xeno Initiative Wiki
titleTemplate: Anti-Xeno Initiative Wiki

hero:
  name: Anti-Xeno Wiki
  text: Defense of Humanity
  tagline: "The primary repository for Anti-Xeno combat tutorials, ship outfitting guides, flight tactics, and scientific research in Elite: Dangerous."
  image:
    src: /axi_logo_new2.png
    alt: Anti-Xeno Initiative Logo
  actions:
    - theme: brand
      text: 🚀 Recommended Builds
      link: /builds
    - theme: alt
      text: ⭐ Combat Guide
      link: /basic-combat-guide
    - theme: alt
      text: 🧭 Quick Start
      link: /quick-start-guide
    - theme: alt
      text: 💬 Join Discord
      link: https://antixenoinitiative.com/discord
---

<div class="axi-home-container">

<div class="axi-intro-card">
  <div class="axi-intro-badge">PILOT BRIEFING // SYSTEM ARCHIVE</div>
  <div class="axi-intro-body">
    <p><strong>Welcome to the Anti-Xeno Initiative Wiki</strong> — the primary knowledge base for Anti-Xeno (AX) combat in <em>Elite: Dangerous</em>. Curated and maintained by experienced pilots, mentors, and researchers of the AXI community, these guides take you from your first Scout kill to soloing a Hydra.</p>
    <p>New to Thargoid combat? Start with our step-by-step <a href="/quick-start-guide">Wiki Quick Start Guide</a> or connect directly with thousands of active AX pilots in the official <a href="https://antixenoinitiative.com/discord" target="_blank" rel="noopener">AXI Discord Server</a> for live mentoring and wing callouts.</p>
  </div>
</div>

<div class="axi-section-header">
  <h2 id="popular-topics">Popular Topics</h2>
  <span class="axi-section-sub">Direct access to essential combat manuals, ship outfitting, and research papers</span>
</div>

<div class="topics-grid">
  <div class="topic-card">
    <div class="topic-card-header">
      <span class="topic-icon">🚀</span>
      <span class="topic-title">Ship Builds</span>
    </div>
    <div class="topic-card-desc">Optimized combat loadouts, shieldless engineering theory, and specialized community builds.</div>
    <div class="topic-card-links">
      <a href="/builds" class="topic-card-link"><span>Recommended Builds</span><span class="link-arrow">→</span></a>
      <a href="/shipbuildtheory" class="topic-card-link"><span>Ship Build Theory</span><span class="link-arrow">→</span></a>
      <a href="/buildrepository" class="topic-card-link"><span>Build Repository</span><span class="link-arrow">→</span></a>
      <a href="/speedrunbuilds" class="topic-card-link"><span>Speedrun Builds</span><span class="link-arrow">→</span></a>
    </div>
  </div>

  <div class="topic-card">
    <div class="topic-card-header">
      <span class="topic-icon">⭐</span>
      <span class="topic-title">Combat Guides</span>
    </div>
    <div class="topic-card-desc">Master cold orbiting, exert hearts efficiently, and learn advanced wing and solo tactics.</div>
    <div class="topic-card-links">
      <a href="/basic-combat-guide" class="topic-card-link"><span>Basic Combat Guide</span><span class="link-arrow">→</span></a>
      <a href="/advanced-combat-guide" class="topic-card-link"><span>Advanced Combat Guide</span><span class="link-arrow">→</span></a>
      <a href="/cold-orbiting" class="topic-card-link"><span>Cold Orbiting Tactics</span><span class="link-arrow">→</span></a>
      <a href="/combat-speedrunning" class="topic-card-link"><span>Speedrunning Guide</span><span class="link-arrow">→</span></a>
    </div>
  </div>

  <div class="topic-card">
    <div class="topic-card-header">
      <span class="topic-icon">🛸</span>
      <span class="topic-title">Thargoid Intel</span>
    </div>
    <div class="topic-card-desc">Intel on Interceptor classes, hearts, attack sequences, and finding active combat zones.</div>
    <div class="topic-card-links">
      <a href="/finding-thargoids" class="topic-card-link"><span>Finding Thargoids</span><span class="link-arrow">→</span></a>
      <a href="/interceptors" class="topic-card-link"><span>Thargoid Interceptors</span><span class="link-arrow">→</span></a>
      <a href="/special-attacks" class="topic-card-link"><span>Special Attacks</span><span class="link-arrow">→</span></a>
      <a href="/thargon-swarms" class="topic-card-link"><span>Thargon Swarms</span><span class="link-arrow">→</span></a>
    </div>
  </div>
</div>

<div class="axi-section-header">
  <h2 id="community-credits">Community Credits</h2>
  <span class="axi-section-sub">A big thanks to our content creators, contributors, and development team! ❤️</span>
</div>

<div class="credits-grid">
  <div class="credits-col">
    <div class="credits-col-header">
      <span class="credits-col-title">Contributors</span>
      <span class="axi-badge">30+ CMDRs</span>
    </div>
    <ul>
      <li>CMDR alterNERDtive</li>
      <li>CMDR BADRACINGDRIVER</li>
      <li>CMDR Mackenheimer</li>
      <li>CMDR vini500300</li>
      <li>CMDR Trex63</li>
      <li>CMDR Xarionn</li>
      <li>CMDR Painbeaver</li>
      <li>CMDR St4n2012</li>
      <li>CMDR Trebiscotti</li>
      <li>CMDR ckhrix</li>
      <li>CMDR Domtron</li>
      <li>CMDR Grincake</li>
      <li>CMDR Batro</li>
      <li>CDMR Blaston</li>
      <li>CMDR Aileen Leith</li>
      <li>CMDR Westboyrke</li>
      <li>CMDR Habba-nero</li>
      <li>CMDR Talixe</li>
      <li>CMDR Jugom</li>
      <li>CMDR Ghosti</li>
      <li>CMDR Nauva</li>
      <li>CMDR panther_neo</li>
      <li>CMDR SGUDestiny</li>
      <li>CMDR Archiebeales</li>
      <li>CMDR Konstantine Novakov</li>
      <li>CMDR Eckee</li>
      <li>CMDR Sadeena</li>
      <li>CMDR vorsipellis</li>
      <li>CMDR Squirg</li>
      <li>CMDR Jabba66</li>
      <li>CMDR error13376</li>
      <li>and many other lovely commanders</li>
    </ul>
  </div>

  <div class="credits-col">
    <div class="credits-col-header">
      <span class="credits-col-title">Content Creators</span>
      <span class="axi-badge">10 CMDRs</span>
    </div>
    <ul>
      <li>CMDR Aranionros Stormrage</li>
      <li>CMDR Mechan</li>
      <li>CMDR Aterius</li>
      <li>CMDR EuanAB</li>
      <li>CMDR Avasa Siuu</li>
      <li>CMDR Maligno</li>
      <li>CMDR Airom</li>
      <li>CMDR AlexMG1</li>
      <li>CMDR Naddesh</li>
      <li>CMDR Toscany</li>
    </ul>
  </div>

  <div class="credits-col">
    <div class="credits-col-header">
      <span class="credits-col-title">Developers</span>
      <span class="axi-badge">Core Team</span>
    </div>
    <ul>
      <li>CMDR Mgram</li>
      <li>CMDR Sanctified (Willhof)</li>
    </ul>
  </div>
</div>

</div>
`
  await fs.writeFile(path.join(DOCS_DIR, 'index.md'), homeContent, 'utf-8')
  console.log('[OK] Generated docs/index.md')
}

async function main() {
  console.log('=== Running Complete AXI Wiki Migration ===')
  await copyAssets()
  await createHomepage()
  await migrateEnglishPages()
  await migrateLocalizedPages()
  console.log('\n=== All Content Migrated Successfully ===')
}

main().catch(console.error)
