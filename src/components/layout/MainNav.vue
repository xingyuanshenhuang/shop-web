<template>
  <div class="main-nav">
    <div class="main-nav__inner">
      <div class="main-nav__logo" @click="$router.push('/')">
        <div class="main-nav__logo-icon">🛍️</div>
        <span class="main-nav__logo-text">XX商城</span>
      </div>
      <div class="main-nav__categories hide-on-mobile">
        <router-link
          v-for="cat in navCategories"
          :key="cat.path"
          :to="cat.path"
          class="main-nav__cat-link"
          :class="{ active: isActive(cat.path) }"
        >
          {{ cat.label }}
        </router-link>
        <el-dropdown trigger="hover" class="hide-on-tablet">
          <span class="main-nav__cat-link">
            更多 <el-icon :size="10"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>运动户外</el-dropdown-item>
              <el-dropdown-item>汽车用品</el-dropdown-item>
              <el-dropdown-item>图书文具</el-dropdown-item>
              <el-dropdown-item>医药健康</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="main-nav__right">
        <div class="main-nav__search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品/品牌"
            class="main-nav__search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <button class="main-nav__search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="main-nav__cart" @click="$router.push('/cart')">
          <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99">
            <el-icon :size="24" color="#666"><ShoppingCart /></el-icon>
          </el-badge>
        </div>
      </div>
      <div class="main-nav__mobile-icons show-on-mobile-only">
        <el-icon :size="22" @click="mobileSearchVisible = !mobileSearchVisible"><Search /></el-icon>
        <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99" style="margin-left: 16px">
          <el-icon :size="22" @click="$router.push('/cart')"><ShoppingCart /></el-icon>
        </el-badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, ShoppingCart, ArrowDown } from '@element-plus/icons-vue';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalCount);
const searchKeyword = ref('');
const mobileSearchVisible = ref(false);

const navCategories = [
  { label: '首页', path: '/' },
  { label: '居家', path: '/products?category=home' },
  { label: '美食', path: '/products?category=food' },
  { label: '服饰', path: '/products?category=fashion' },
  { label: '母婴', path: '/products?category=baby' },
  { label: '数码', path: '/products?category=digital' },
];

function isActive(path) {
  if (path === '/') return route.path === '/';
  return route.fullPath.startsWith(path.split('?')[0]);
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push(`/products?keyword=${encodeURIComponent(searchKeyword.value.trim())}`);
  }
}
</script>

<style scoped>
.main-nav {
  background: var(--color-bg-white);
  border-bottom: 1px solid var(--color-border);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
}

.main-nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.main-nav__logo-icon {
  font-size: 28px;
}

.main-nav__logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}

.main-nav__categories {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.main-nav__cat-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
  text-decoration: none;
}

.main-nav__cat-link:hover,
.main-nav__cat-link.active {
  color: var(--color-primary);
}

.main-nav__right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.main-nav__search {
  display: flex;
  align-items: center;
}

.main-nav__search-input {
  width: 280px;
}

.main-nav__search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-pill) 0 0 var(--radius-pill);
  background: var(--color-warm-bg);
  box-shadow: none;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
}

.main-nav__search-input :deep(.el-input__wrapper:focus-within) {
  border-color: var(--color-primary);
}

.main-nav__search-btn {
  height: 40px;
  padding: 0 20px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 var(--radius-pill) var(--radius-pill) 0;
  white-space: nowrap;
  transition: background var(--transition-fast);
}

.main-nav__search-btn:hover {
  background: var(--color-primary-hover);
}

.main-nav__cart {
  cursor: pointer;
  flex-shrink: 0;
}

.main-nav__mobile-icons {
  display: flex;
  align-items: center;
  margin-left: auto;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .main-nav__inner {
    padding: 0 32px;
  }
  .main-nav__search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .main-nav__inner {
    padding: 0 16px;
  }
  .main-nav__right {
    display: none;
  }
}
</style>
