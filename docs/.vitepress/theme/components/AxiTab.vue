<template>
  <div v-show="isActive" class="axi-tab-panel" role="tabpanel">
    <slot />
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const isActive = ref(false)
const axiTabs = inject('axiTabs', null)

const tab = {
  title: props.title,
  isActive
}

onMounted(() => {
  if (axiTabs) {
    axiTabs.registerTab(tab)
  }
})

onUnmounted(() => {
  if (axiTabs) {
    axiTabs.unregisterTab(tab)
  }
})
</script>

<style scoped>
.axi-tab-panel {
  width: 100%;
}
</style>
