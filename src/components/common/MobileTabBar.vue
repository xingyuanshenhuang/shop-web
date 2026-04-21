<template>
  <div class="mobile-tabbar show-on-mobile-only">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      class="mobile-tabbar__item"
      :class="{ active: isActive(tab.path) }"
      @click="$router.push(tab.path)"
    >
      <el-badge :value="cartCount" :hidden="tab.path !== '/cart' || cartCount === 0" :max="99">
        <el-icon :size="24">
          <component :is="tab.icon" />
        </el-icon>
      </el-badge>
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { HomeFilled, Grid, ShoppingCart, User } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const route = useRoute()
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalCount)

const tabs = [
  { path: '/', label: '首页', icon: HomeFilled },
  { path: '/products', label: '分类', icon: Grid },
  { path: '/cart', label: '购物车', icon: ShoppingCart },
  { path: '/user', label: '我的', icon: User },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.mobile-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--color-bg-white);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.mobile-tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.mobile-tabbar__item.active {
  color: var(--color-primary);
}

.mobile-tabbar__item span {
  font-size: 10px;
  margin-top: 2px;
}
</style>
