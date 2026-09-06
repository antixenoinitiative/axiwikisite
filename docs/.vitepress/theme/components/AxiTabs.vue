<script>
import { defineComponent, ref, provide, h } from 'vue'

export default defineComponent({
  name: 'AxiTabs',
  setup(props, { slots }) {
    const activeTab = ref('')
    provide('activeAxiTab', activeTab)

    return () => {
      const children = slots.default ? slots.default() : []
      const tabs = []
      function collect(nodes) {
        for (const n of nodes) {
          if (!n) continue
          if (n.props && n.props.title) {
            tabs.push(n.props.title)
          } else if (Array.isArray(n.children)) {
            collect(n.children)
          }
        }
      }
      collect(children)

      if (!activeTab.value && tabs.length > 0) {
        activeTab.value = tabs[0]
      }

      return h('div', { class: 'axi-tabs' }, [
        h('div', { class: 'axi-tab-nav', role: 'tablist' },
          tabs.map(title =>
            h('button', {
              role: 'tab',
              type: 'button',
              'aria-selected': activeTab.value === title,
              class: ['axi-tab-btn', activeTab.value === title ? 'active' : ''],
              onClick: () => { activeTab.value = title }
            }, title)
          )
        ),
        h('div', { class: 'axi-tab-body' }, children)
      ])
    }
  }
})
</script>
