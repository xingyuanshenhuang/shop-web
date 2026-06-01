<template>
  <div id="app">
    <TopUtilityBar />
    <MainNav />
    <main class="main-content">
      <router-view />
    </main>
    <FooterBar />
    <FloatingToolbar />
    <FloatingBackTop />
    <MobileTabBar />
  </div>
</template>

<script setup>
import TopUtilityBar from '@/components/layout/TopUtilityBar.vue'
import MainNav from '@/components/layout/MainNav.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
import FloatingToolbar from '@/components/common/FloatingToolbar.vue'
import FloatingBackTop from '@/components/common/FloatingBackTop.vue'
import MobileTabBar from '@/components/common/MobileTabBar.vue'
</script>

<style>
.main-content {
  min-height: calc(100vh - 100px);
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 56px;
  }
}
</style>
