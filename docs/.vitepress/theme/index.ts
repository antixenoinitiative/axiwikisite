import DefaultTheme from 'vitepress/theme'
import AxiTabs from './components/AxiTabs.vue'
import AxiTab from './components/AxiTab.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AxiTabs', AxiTabs)
    app.component('AxiTab', AxiTab)
  }
}
