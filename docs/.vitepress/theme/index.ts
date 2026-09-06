import DefaultTheme from 'vitepress/theme'
import { withBase } from 'vitepress'
import AxiTabs from './components/AxiTabs.vue'
import AxiTab from './components/AxiTab.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.config.globalProperties.withBase = withBase
    app.config.globalProperties.$withBase = withBase
    app.component('AxiTabs', AxiTabs)
    app.component('AxiTab', AxiTab)
  }
}
