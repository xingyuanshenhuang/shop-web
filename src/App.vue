<template>
  <div id="app">
    <router-view v-if="isBlankLayout" />
    <template v-else>
      <TopUtilityBar />
      <MainNav />
      <main class="main-content">
        <router-view />
      </main>
      <FooterBar />
      <FloatingToolbar />
      <FloatingBackTop />
      <MobileTabBar />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopUtilityBar from '@/components/layout/TopUtilityBar.vue'
import MainNav from '@/components/layout/MainNav.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
import FloatingToolbar from '@/components/common/FloatingToolbar.vue'
import FloatingBackTop from '@/components/common/FloatingBackTop.vue'
import MobileTabBar from '@/components/common/MobileTabBar.vue'

const route = useRoute()
const isBlankLayout = computed(() => route.meta.layout === 'blank')
</script>

<style>
.main-content {
  min-height: calc(100vh - 100px);
  padding: 0 clamp(0px, calc((100vw - 1524px) / 2), 80px);
}

/* 结构2: 三栏布局 */
.screen-outer {
  display: flex;
  gap: 24px;
  padding: 16px 0;
}

.screen-left {
  width: 240px;
  flex-shrink: 0;
}

.screen-center {
  flex: 1;
  min-width: 0;
}

.screen-right {
  width: 280px;
  flex-shrink: 0;
}

/* 结构3: 猜你喜欢 */
.layer {
  padding: 24px 0;
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 56px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .screen-outer {
    flex-direction: column;
  }

  .screen-left,
  .screen-right {
    width: 100%;
  }
}
</style>
