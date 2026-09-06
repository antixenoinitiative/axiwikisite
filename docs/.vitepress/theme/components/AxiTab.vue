<script>
import { defineComponent, inject, computed, h } from 'vue'

export default defineComponent({
  name: 'AxiTab',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    const activeAxiTab = inject('activeAxiTab', null)
    const isActive = computed(() => {
      if (!activeAxiTab || !activeAxiTab.value) return true
      return activeAxiTab.value === props.title
    })

    return () => h('div', {
      class: 'axi-tab-panel',
      role: 'tabpanel',
      style: isActive.value ? null : { display: 'none' }
    }, slots.default ? slots.default() : [])
  }
})
</script>
