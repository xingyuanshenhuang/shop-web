<template>
  <div class="floating-toolbar hide-on-mobile">
    <div class="floating-toolbar__item" @click="scrollToTop" v-show="showBackTop">
      <el-icon :size="20"><Top /></el-icon>
      <span>顶部</span>
    </div>
    <div class="floating-toolbar__item" @click="$router.push('/cart')">
      <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99">
        <el-icon :size="20"><ShoppingCart /></el-icon>
      </el-badge>
      <span>购物车</span>
    </div>
    <div class="floating-toolbar__item" @click="userStore.toggleCollect()">
      <el-icon :size="20" :color="userStore.isCollected ? '#FF5000' : ''">
        <StarFilled v-if="userStore.isCollected" />
        <Star v-else />
      </el-icon>
      <span>{{ userStore.isCollected ? '已收藏' : '收藏' }}</span>
    </div>
    <div class="floating-toolbar__item">
      <el-icon :size="20"><Service /></el-icon>
      <span>客服</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Top, ShoppingCart, Star, StarFilled, Service } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const cartStore = useCartStore()
const userStore = useUserStore()
const cartCount = ref(cartStore.totalCount)
const showBackTop = ref(false)

function handleScroll() {
  showBackTop.value = window.scrollY > window.innerHeight
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: var(--radius-btn) 0 0 var(--radius-btn);
  overflow: hidden;
}

.floating-toolbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 44px;
  padding: 4px;
  cursor: pointer;
  color: var(--color-text-mid);
  transition: all var(--transition-fast);
  border-bottom: 1px solid var(--color-border);
}

.floating-toolbar__item:last-child {
  border-bottom: none;
}

.floating-toolbar__item:hover {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.floating-toolbar__item span {
  font-size: 10px;
  margin-top: 2px;
}
</style>
