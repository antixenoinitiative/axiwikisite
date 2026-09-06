import { defineConfig } from 'vitepress'

// Shared sidebar for English
const enSidebar = [
  {
    text: 'General',
    collapsed: false,
    items: [
      { text: 'Home', link: '/' },
      { text: 'Wiki Quick Start', link: '/quick-start-guide' },
      { text: 'Contributing & Dev Guide', link: '/editing-guide' },
      { text: 'Wiki Changes & Updates', link: '/updates' }
    ]
  },
  {
    text: 'Guides',
    collapsed: false,
    items: [
      { text: 'Basic Combat Guide', link: '/basic-combat-guide' },
      { text: 'Advanced Combat Guide', link: '/advanced-combat-guide' },
      { text: 'Flight Maneuvers & Strats', link: '/Flight' },
      { text: 'Cold Orbiting', link: '/cold-orbiting' },
      { text: 'Special Attack Avoidance', link: '/mechanic-bypass' },
      { text: 'Swarm Management', link: '/dealing-with-swarm' },
      { text: 'Wing Combat', link: '/wing-combat' },
      { text: 'Multi-Goid Combat', link: '/multi-goid-guide' },
      { text: 'Conflict Zones', link: '/conflict-zones' },
      { text: 'Gibbing', link: '/gibbing' },
      { text: 'Large Ships', link: '/large-ship-guide' },
      { text: 'Speedrunning', link: '/combat-speedrunning' }
    ]
  },
  {
    text: 'Flight Controls',
    collapsed: false,
    items: [
      { text: 'Recommended Controls', link: '/recommended-controls' },
      { text: 'Pip Management', link: '/pip-management' },
      { text: 'Staggering Gauss', link: '/staggering-gauss' },
      { text: 'Input Overlays', link: '/input_overlays' }
    ]
  },
  {
    text: 'Thargoids',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/thargoids' },
      { text: 'Interceptors', link: '/interceptors' },
      { text: 'Scouts', link: '/scouts' },
      { text: 'Hearts', link: '/hearts' },
      { text: 'Shields', link: '/shields' },
      { text: 'Special Attacks', link: '/special-attacks' },
      { text: 'Thargon Swarms', link: '/thargon-swarms' },
      { text: 'Thargoid Specs', link: '/thargoid-specs' }
    ]
  },
  {
    text: 'Thargoid Locations',
    collapsed: false,
    items: [
      { text: 'Finding Thargoids', link: '/finding-thargoids' },
      { text: 'Non-Human Signal Sources', link: '/nhss' },
      { text: 'Static Signal Sources', link: '/static-signals' },
      { text: 'Hyperdictions', link: '/hyperdictions' }
    ]
  },
  {
    text: 'Builds and Outfitting',
    collapsed: false,
    items: [
      { text: 'Recommended Builds', link: '/builds' },
      { text: 'Ship Build Theory', link: '/shipbuildtheory' },
      { text: 'Build Repository', link: '/buildrepository' },
      { text: 'Speedrun Builds', link: '/speedrunbuilds' },
      { text: 'Weapons', link: '/weapons' },
      { text: 'Lasers', link: '/lasers' },
      { text: 'Optionals & Utility', link: '/optionals' },
      { text: 'Synthesis', link: '/synthesis' },
      { text: 'Convergence', link: '/convergence' },
      { text: 'AX Engineers Unlock & Route', link: '/Unlocking-Engineers' },
      { text: 'Engineering Materials', link: '/engineering-materials' },
      { text: 'Unlocking Guardian Modules', link: '/guardianunlocks' },
      { text: 'Common Mistakes', link: '/commonmistakes' },
      { text: 'Odyssey Engineering', link: '/engineering-odyssey' }
    ]
  },
  {
    text: 'Tools and Science',
    collapsed: false,
    items: [
      { text: 'Archive', link: '/Archive' },
      { text: 'Port Forwarding', link: '/port_fwd_guide' },
      { text: 'Predict NHSS via FSS', link: '/nhssviafss' },
      { text: 'Min. Theo. ToT Calculator', link: '/min-tot-calculator' },
      { text: 'Gauss Shots Calculator', link: 'https://docs.google.com/spreadsheets/d/1Nxs_6YMpmABMDjtdf39NK-4K_M0tIBtZNBkknXgN7HM/copy' },
      { text: 'Known Bugs', link: '/known-bugs' },
      { text: 'Ship Stats', link: 'https://docs.google.com/spreadsheets/d/1OEXMlVUqxn58mLchf4UMmGj7gkDhYTk3lHMwi32OV5I/edit?usp=sharing' },
      { text: 'Synth Calculator', link: '/synthesiscalculator' },
      { text: 'Rate Your Own Fight', link: '/rate-your-own-fight' }
    ]
  },
  {
    text: 'Studies',
    collapsed: false,
    items: [
      { text: 'Balance Research', link: 'https://docs.google.com/spreadsheets/d/1kNZwBn16nYcrqpaua08VQb_ea3PF9SYcO-1IWivPZsA/edit' },
      { text: 'Caustic Resistance Analysis', link: '/caustic-resistance-study' },
      { text: 'Distress Call Analysis', link: '/distress-call-analysis' },
      { text: 'Thargoid Hull Analysis', link: '/thargoids-hull-analysis' },
      { text: 'Thargoid Regeneration', link: '/regeneration' },
      { text: 'Thargoid Shield Analysis', link: 'https://drive.google.com/file/d/1e6L3svuPIJ1dxeZcMn3FOuAnDBt2dWY8/view' },
      { text: 'Thargoid Attack History', link: 'https://docs.google.com/spreadsheets/d/1hnJTNAwAu0fY9Asu8SgXsfpjyTFxRhW_4oPCJS5Ydv4/edit#gid=2074276015' }
    ]
  },
  {
    text: 'Miscellaneous',
    collapsed: false,
    items: [
      { text: "Mechan's List of Cursed Builds", link: '/Mechan-List-Of-Cursed-Builds' },
      { text: "Mechan's Near-Impossible Kills", link: '/Mechan-List-Of-Near-Impossible-Kills' }
    ]
  }
]

// Helper for localized sidebars
function createLocaleSidebar(prefix: string) {
  return [
    {
      text: 'Navigation',
      collapsed: false,
      items: [
        { text: 'Home', link: `${prefix}/` },
        { text: 'Basic Combat Guide', link: `${prefix}/basic-combat-guide` },
        { text: 'Recommended Builds', link: `${prefix}/builds` },
        { text: 'Interceptors', link: `${prefix}/interceptors` },
        { text: 'Finding Thargoids', link: `${prefix}/finding-thargoids` }
      ]
    }
  ]
}

const getBasePath = () => {
  const p = process.env.BASE_PATH
  if (!p || p === '/') return '/'
  const withLeading = p.startsWith('/') ? p : `/${p}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig({
  title: 'Anti-Xeno Initiative Wiki',
  description: 'Your complete repository for Anti-Xeno Combat in Elite: Dangerous.',
  base: getBasePath(),
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#ff7100' }],
    ['meta', { property: 'og:site_name', content: 'Anti-Xeno Initiative Wiki' }]
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          {
            text: 'Guides',
            items: [
              { text: 'Basic Combat Guide', link: '/basic-combat-guide' },
              { text: 'Advanced Combat Guide', link: '/advanced-combat-guide' },
              { text: 'Flight Maneuvers & Strats', link: '/Flight' },
              { text: 'Cold Orbiting', link: '/cold-orbiting' },
              { text: 'Swarm Management', link: '/dealing-with-swarm' },
              { text: 'Wing Combat', link: '/wing-combat' },
              { text: 'Multi-Goid Combat', link: '/multi-goid-guide' },
              { text: 'Speedrunning', link: '/combat-speedrunning' }
            ]
          },
          {
            text: 'Ship Builds',
            items: [
              { text: 'Recommended Builds', link: '/builds' },
              { text: 'Ship Build Theory', link: '/shipbuildtheory' },
              { text: 'Build Repository', link: '/buildrepository' },
              { text: 'Speedrun Builds', link: '/speedrunbuilds' }
            ]
          },
          {
            text: 'Thargoids',
            items: [
              { text: 'Overview', link: '/thargoids' },
              { text: 'Interceptors', link: '/interceptors' },
              { text: 'Scouts', link: '/scouts' },
              { text: 'Hearts', link: '/hearts' },
              { text: 'Special Attacks', link: '/special-attacks' },
              { text: 'Finding Thargoids', link: '/finding-thargoids' }
            ]
          },
          {
            text: 'Community',
            items: [
              { text: 'Contributing & Dev Guide', link: '/editing-guide' },
              { text: 'AXI Website', link: 'https://www.antixenoinitiative.com/' },
              { text: 'Discord Server', link: 'https://antixenoinitiative.com/discord' },
              { text: 'Thargoid Watch', link: 'https://antixenoinitiative.com/watch' }
            ]
          }
        ],
        sidebar: enSidebar
      }
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      link: '/de/',
      themeConfig: {
        nav: [
          { text: 'Startseite', link: '/de/' },
          { text: 'Guides', link: '/de/basic-combat-guide' },
          { text: 'Builds', link: '/de/builds' },
          { text: 'Interceptoren', link: '/de/interceptors' }
        ],
        sidebar: createLocaleSidebar('/de')
      }
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Guides', link: '/fr/basic-combat-guide' },
          { text: 'Équipements', link: '/fr/builds' },
          { text: 'Intercepteurs', link: '/fr/interceptors' }
        ],
        sidebar: createLocaleSidebar('/fr')
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Guías', link: '/es/basic-combat-guide' },
          { text: 'Construcciones', link: '/es/builds' },
          { text: 'Interceptores', link: '/es/interceptors' }
        ],
        sidebar: createLocaleSidebar('/es')
      }
    },
    it: {
      label: 'Italiano',
      lang: 'it',
      link: '/it/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/it/' },
          { text: 'Guide', link: '/it/basic-combat-guide' },
          { text: 'Builds', link: '/it/builds' },
          { text: 'Intercettori', link: '/it/interceptors' }
        ],
        sidebar: createLocaleSidebar('/it')
      }
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      link: '/ru/',
      themeConfig: {
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'Руководства', link: '/ru/basic-combat-guide' },
          { text: 'Сборки', link: '/ru/builds' },
          { text: 'Перехватчики', link: '/ru/interceptors' }
        ],
        sidebar: createLocaleSidebar('/ru')
      }
    },
    tr: {
      label: 'Türkçe',
      lang: 'tr',
      link: '/tr/',
      themeConfig: {
        nav: [
          { text: 'Ana Sayfa', link: '/tr/' },
          { text: 'Rehberler', link: '/tr/basic-combat-guide' },
          { text: 'Gemiler', link: '/tr/builds' },
          { text: 'Thargoidlar', link: '/tr/interceptors' }
        ],
        sidebar: createLocaleSidebar('/tr')
      }
    }
  },

  themeConfig: {
    logo: '/axi_logo_new2.png',
    siteTitle: 'AXI Wiki',

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'discord', link: 'https://antixenoinitiative.com/discord' },
      { icon: 'github', link: 'https://github.com/antixenoinitiative/axiwiki' }
    ],

    footer: {
      message: 'Anti-Xeno Initiative • Dedicated to defending humanity',
      copyright: 'Content is available under Public Domain / CC0.'
    }
  }
})
