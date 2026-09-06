<template>
  <div class="axi-tabs">
    <div class="axi-tab-nav" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        role="tab"
        :aria-selected="activeIndex === index"
        :class="['axi-tab-btn', { active: activeIndex === index }]"
        @click="selectTab(index)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="axi-tab-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const tabs = ref([])
const activeIndex = ref(0)

const registerTab = (tab) => {
  tabs.value.push(tab)
  if (tabs.value.length === 1) {
    tab.isActive.value = true
  }
}

const unregisterTab = (tab) => {
  const idx = tabs.value.indexOf(tab)
  if (idx !== -1) {
    tabs.value.splice(idx, 1)
  }
}

const selectTab = (index) => {
  activeIndex.value = index
  tabs.value.forEach((tab, i) => {
    tab.isActive.value = (i === index)
  })
}

provide('axiTabs', {
  registerTab,
  unregisterTab,
  activeIndex
})
</script>

<style scoped>
.axi-tabs {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.axi-tab-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 8px 0;
  background: #101010;
  border-bottom: 1px solid var(--vp-c-border);
}

.axi-tab-btn {
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  bottom: -1px;
}

.axi-tab-btn:hover {
  color: var(--vp-c-brand-1);
  background: rgba(255, 113, 0, 0.08);
}

.axi-tab-btn.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-bottom: 1px solid var(--vp-c-bg-soft);
  font-weight: 700;
}

.axi-tab-body {
  padding: 1.5rem;
}
</style>
