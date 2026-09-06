import fs from 'fs'
import path from 'path'

const DIST_DIR = path.resolve('docs/.vitepress/dist')

function walkDir(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath))
    } else if (file.endsWith('.html')) {
      results.push(fullPath)
    }
  }
  return results
}

function runTests() {
  console.log('🔍 Running Automated HTML & Static Build Validation...\n')

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Build directory not found at ${DIST_DIR}. Run "npm run docs:build" first.`)
    process.exit(1)
  }

  const htmlFiles = walkDir(DIST_DIR)
  if (htmlFiles.length === 0) {
    console.error(`❌ No HTML files found in ${DIST_DIR}.`)
    process.exit(1)
  }

  console.log(`📄 Discovered ${htmlFiles.length} generated HTML pages to validate across all locales.\n`)

  let errors = []
  let warnings = []
  let totalImagesChecked = 0
  let totalRawTagChecks = 0
  let totalTabsetsChecked = 0

  // Expected locales
  const expectedLocales = ['', 'de', 'fr', 'es', 'it', 'ru', 'tr']
  for (const loc of expectedLocales) {
    const indexToCheck = loc === '' 
      ? path.join(DIST_DIR, 'index.html') 
      : path.join(DIST_DIR, loc, 'index.html')
    if (!fs.existsSync(indexToCheck)) {
      errors.push(`Missing home page for locale '${loc || 'en'}': ${indexToCheck}`)
    }
  }

  let rawBase = process.env.BASE_PATH
  if (!rawBase) {
    // Auto-detect base path from built index.html assets
    const indexPath = path.join(DIST_DIR, 'index.html')
    if (fs.existsSync(indexPath)) {
      const indexHtml = fs.readFileSync(indexPath, 'utf-8')
      const assetMatch = indexHtml.match(/(?:href|src)=["']([^"']*?)\/assets\//)
      if (assetMatch && assetMatch[1]) {
        rawBase = assetMatch[1]
      }
    }
  }
  const basePath = (!rawBase || rawBase === '/')
    ? '/'
    : (rawBase.startsWith('/') ? rawBase : `/${rawBase}`).replace(/\/?$/, '/')

  for (const filePath of htmlFiles) {
    const relPath = path.relative(DIST_DIR, filePath)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 1. Basic HTML validity & non-empty check
    if (content.length < 100) {
      errors.push(`File too short or empty: ${relPath} (${content.length} bytes)`)
      continue
    }
    if (!content.includes('<!DOCTYPE html>') && !content.includes('<html')) {
      errors.push(`Malformed HTML document missing DOCTYPE/HTML tag: ${relPath}`)
    }
    if (!content.includes('</html>')) {
      errors.push(`HTML document missing closing </html> tag: ${relPath}`)
    }

    // 2. Unintended Escaped HTML in Code Blocks (CommonMark 4-space indent bug)
    // Intentional code blocks in VitePress have <pre class="shiki ...">
    // Accidental code blocks created from indented markdown have <pre><code>&lt;...
    const accidentalCodeMatches = content.matchAll(/<pre><code>\s*&lt;(?:div|span|p|a |table|tr|td|th|ul|ol|li|iframe|img|h[1-6]|button)/gi)
    for (const match of accidentalCodeMatches) {
      totalRawTagChecks++
      const snippet = content.slice(match.index, match.index + 120).replace(/\n/g, ' ')
      errors.push(`Accidental raw HTML in code block in ${relPath}: "${snippet}..."`)
    }

    // 3. Check for unrendered custom component tags (e.g. uncompiled <AxiTabs> or <AxiTab>)
    const uncompiledComponents = content.match(/<(?:AxiTabs|AxiTab)[\s>]/g)
    if (uncompiledComponents) {
      errors.push(`Uncompiled custom Vue component tag found in ${relPath}: ${uncompiledComponents.join(', ')}`)
    }

    // 3b. Verify that all tab navigation containers have rendered tab buttons (SSR validation)
    if (content.includes('class="axi-tab-nav"')) {
      const navMatches = content.matchAll(/<div class="axi-tab-nav"[^>]*>(.*?)<\/div>/gs)
      for (const match of navMatches) {
        totalTabsetsChecked++
        if (!match[1].includes('<button')) {
          errors.push(`Empty axi-tab-nav without rendered buttons in ${relPath}`)
        }
      }
    }

    // 4. Verify all local image assets referenced in <img> tags exist
    const imgMatches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)
    for (const match of imgMatches) {
      let src = match[1]
      // Strip base path prefix if VitePress prepended it
      if (basePath !== '/' && src.startsWith(basePath)) {
        src = '/' + src.slice(basePath.length)
      }
      // Check only local root-relative images (skip http, data URLs, etc.)
      if (src.startsWith('/') && !src.startsWith('//') && !src.startsWith('/assets/')) {
        totalImagesChecked++
        const cleanPath = src.split('?')[0].split('#')[0].replace(/^\//, '')
        const localImgPath = path.join(path.resolve('docs/public'), cleanPath)
        if (!fs.existsSync(localImgPath)) {
          errors.push(`Broken local image reference in ${relPath}: "${match[1]}" (File not found at ${cleanPath})`)
        }
      }
    }
  }

  console.log(`✅ Checked ${htmlFiles.length} pages for document structure.`)
  console.log(`✅ Checked ${totalTabsetsChecked} interactive tabsets for rendered SSR buttons.`)
  console.log(`✅ Checked ${totalImagesChecked} local image references for 404s.`)
  console.log(`✅ Checked all code blocks for accidental raw HTML leaks.`)
  console.log(`✅ Verified homepage presence for all 7 locales (en, de, fr, es, it, ru, tr).\n`)

  if (errors.length > 0) {
    console.error(`❌ Automated Validation Failed with ${errors.length} error(s):`)
    errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`))
    process.exit(1)
  }

  console.log('🎉 ALL TESTS PASSED: HTML generated cleanly and all assets validated!\n')
}

runTests()
