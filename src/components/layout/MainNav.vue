<template>
  <div
    v-if="isTargetRoute"
    class="main-nav"
    :class="{ 'is-visible': showFixedBar, 'main-nav--with-filter': isProductsPage }"
  >
    <div class="main-nav__inner">
      <!-- Logo -->
      <router-link to="/" class="main-nav__logo">
        <span class="main-nav__logo-main">淘宝</span>
        <span class="main-nav__logo-sub">Taobao.com</span>
      </router-link>

      <!-- 搜索功能区 -->
      <div ref="searchCenterRef" class="main-nav__search-center">
        <div class="main-nav__search-row">
          <div class="main-nav__search-combo" :class="{ 'is-focused': dropdownVisible }">
            <div class="main-nav__search-input-wrapper">
              <el-input
                ref="searchInputRef"
                v-model="searchKeyword"
                class="main-nav__search-input"
                @focus="handleFocus"
                @blur="handleBlur"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <span
                v-if="!searchKeyword && !dropdownVisible"
                class="main-nav__search-placeholder"
                @click="focusInput"
              >
                请输入搜索文字
              </span>
            </div>
            <button class="main-nav__search-btn" @click="handleSearch">搜索</button>
          </div>
          <button class="main-nav__search-similar" @click="handleSearchSimilar">
            <el-icon :size="16"><Camera /></el-icon>
            <span>搜同款</span>
          </button>
        </div>

        <!-- 搜索下拉面板 -->
        <transition name="dropdown-fade">
          <div
            v-show="dropdownVisible"
            class="main-nav__search-dropdown"
            @mousedown.prevent
            @mouseenter="isMouseInDropdown = true"
            @mouseleave="isMouseInDropdown = false"
          >
            <div v-if="searchHistory.length > 0" class="search-dropdown__section">
              <div class="search-dropdown__header">
                <span class="search-dropdown__title">历史搜索</span>
                <button class="search-dropdown__action" @click="clearHistory">清除</button>
              </div>
              <div class="search-dropdown__tags">
                <span
                  v-for="(item, idx) in searchHistory"
                  :key="idx"
                  class="search-dropdown__tag"
                  @click="searchFromHistory(item)"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <div class="search-dropdown__section">
              <div class="search-dropdown__header">
                <span class="search-dropdown__title">猜你想搜</span>
                <button class="search-dropdown__action" @click="refreshGuess">换一换</button>
              </div>
              <div class="search-dropdown__guess-grid">
                <span
                  v-for="(item, idx) in displayedGuessList"
                  :key="idx"
                  class="search-dropdown__guess-item"
                  @click="searchFromGuess(item)"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 购物车 -->
      <div class="main-nav__cart" @click="$router.push('/cart')">
        <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99">
          <el-icon :size="24" color="#666"><ShoppingCart /></el-icon>
        </el-badge>
      </div>

      <!-- 移动端图标 -->
      <div class="main-nav__mobile-icons show-on-mobile-only">
        <el-icon :size="22" @click="mobileSearchVisible = !mobileSearchVisible">
          <Search />
        </el-icon>
        <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99" style="margin-left: 16px">
          <el-icon :size="22" @click="$router.push('/cart')"><ShoppingCart /></el-icon>
        </el-badge>
      </div>
    </div>

    <!-- Products 页面固定筛选栏 -->
    <div v-if="isProductsPage" class="main-nav__filter-bar">
      <div class="filter-bar__inner">
        <div class="filter-bar__left">
          <span
            v-for="sort in sortOptions"
            :key="sort.key"
            class="filter-bar__sort-item"
            :class="{ active: activeSort === sort.key }"
            @click="setSort(sort.key)"
          >
            {{ sort.label }}
            <el-icon v-if="sort.hasArrow" :size="10"><ArrowDown /></el-icon>
          </span>
        </div>

        <div class="filter-bar__tags">
          <span
            v-for="tag in filterTags"
            :key="tag"
            class="filter-bar__tag"
            :class="{ active: activeTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>

        <div class="filter-bar__right">
          <span class="filter-bar__location">
            <el-icon :size="12"><Location /></el-icon>
            发货地
            <el-icon :size="10"><ArrowDown /></el-icon>
          </span>
          <span class="filter-bar__filter-btn" @click="toggleFilter">
            <el-icon :size="14"><Filter /></el-icon>
            筛选
            <el-icon :size="10">
              <ArrowUp v-if="showFilter" />
              <ArrowDown v-else />
            </el-icon>
            <span v-if="activeTags.length" class="filter-bar__filter-badge">{{
              activeTags.length
            }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search,
  ShoppingCart,
  Camera,
  ArrowDown,
  ArrowUp,
  Location,
  Filter,
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const cartCount = computed(() => cartStore.totalCount)
const isProductsPage = computed(() => route.path === '/products')
// 固定栏仅在首页与详情列表页出现
const isTargetRoute = computed(() => route.path === '/' || route.path === '/products')

// ===== 固定栏滚动显隐 =====
// 当页内搜索框可见时隐藏固定栏；搜索框滚出视口后显示固定栏
const showFixedBar = ref(false)
let observer = null

function teardownObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function setupObserver() {
  teardownObserver()
  showFixedBar.value = false
  if (!isTargetRoute.value) return
  // 等待目标页内的搜索栏 DOM 渲染完成
  nextTick(() => {
    const target = document.querySelector('.page-search-bar')
    if (!target) return
    observer = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0].intersectionRatio
        // 加入滞回：已显示时需搜索框较可见才隐藏；已隐藏时需搜索框较不可见才显示
        if (showFixedBar.value) {
          if (ratio > 0.3) showFixedBar.value = false
        } else {
          if (ratio < 0.1) showFixedBar.value = true
        }
      },
      { threshold: [0, 0.1, 0.3, 0.5, 1] },
    )
    observer.observe(target)
  })
}

watch(
  () => route.path,
  () => {
    setupObserver()
  },
)

// ===== 搜索相关 =====
const searchKeyword = ref(route.query.keyword ? String(route.query.keyword) : '')

// 路由关键词变化时同步固定栏搜索框内容
watch(
  () => route.query.keyword,
  (kw) => {
    searchKeyword.value = kw ? String(kw) : ''
  },
)
const dropdownVisible = ref(false)
const isMouseInDropdown = ref(false)
const searchCenterRef = ref(null)
const searchInputRef = ref(null)
const mobileSearchVisible = ref(false)
let blurTimer = null

const STORAGE_KEY = 'taobao_search_history'
const searchHistory = ref([])

const guessWords = [
  '电脑游戏本怎么选',
  '电脑台式',
  '一体电脑台式套餐',
  'computer',
  '联想新平板电脑',
  '电脑国补显卡',
  'ddr5电脑内存条',
  'u盘',
  '移动固态硬盘1tb',
  '机械键盘无线',
]
const displayedGuessList = ref([...guessWords])

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, 10)
}

function refreshGuess() {
  displayedGuessList.value = shuffleArray(guessWords)
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) searchHistory.value = JSON.parse(raw)
  } catch {
    searchHistory.value = []
  }
}

function saveHistory(keyword) {
  const kw = keyword.trim()
  if (!kw) return
  searchHistory.value = searchHistory.value.filter((item) => item !== kw)
  searchHistory.value.unshift(kw)
  if (searchHistory.value.length > 10) searchHistory.value = searchHistory.value.slice(0, 10)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value))
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem(STORAGE_KEY)
}

function handleFocus() {
  clearTimeout(blurTimer)
  dropdownVisible.value = true
}

function handleBlur() {
  blurTimer = setTimeout(() => {
    if (!isMouseInDropdown.value) dropdownVisible.value = false
  }, 150)
}

function focusInput() {
  searchInputRef.value?.focus()
}

function handleSearch() {
  const kw = searchKeyword.value.trim()
  if (kw) {
    saveHistory(kw)
    dropdownVisible.value = false
    router.push(`/products?keyword=${encodeURIComponent(kw)}`)
  }
}

function searchFromHistory(keyword) {
  searchKeyword.value = keyword
  saveHistory(keyword)
  dropdownVisible.value = false
  router.push(`/products?keyword=${encodeURIComponent(keyword)}`)
}

function searchFromGuess(keyword) {
  searchKeyword.value = keyword
  saveHistory(keyword)
  dropdownVisible.value = false
  router.push(`/products?keyword=${encodeURIComponent(keyword)}`)
}

function handleSearchSimilar() {
  router.push('/products?feature=image-search')
}

function handleClickOutside(e) {
  if (searchCenterRef.value && !searchCenterRef.value.contains(e.target)) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  loadHistory()
  document.addEventListener('click', handleClickOutside)
  setupObserver()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  teardownObserver()
})

// ===== Products 页面筛选栏 =====
const sortOptions = [
  { key: '综合', label: '综合', hasArrow: false },
  { key: '销量', label: '销量', hasArrow: false },
  { key: '价格', label: '价格', hasArrow: true },
  { key: '区间', label: '区间', hasArrow: true },
]
const filterTags = ['包邮', '新品', '百亿补贴', '淘宝秒杀', '淘金币抵钱', '退货宝']

const activeSort = computed({
  get() {
    return route.query.sort || '综合'
  },
  set(value) {
    router.replace({ query: { ...route.query, sort: value } })
  },
})

const activeTags = computed({
  get() {
    const tags = route.query.tags
    return tags ? String(tags).split(',').filter(Boolean) : []
  },
  set(value) {
    const tags = value.length ? value.join(',') : undefined
    const query = { ...route.query, tags }
    if (!tags) delete query.tags
    router.replace({ query })
  },
})

const showFilter = computed({
  get() {
    return route.query.filter === '1'
  },
  set(value) {
    const query = { ...route.query, filter: value ? '1' : undefined }
    if (!value) delete query.filter
    router.replace({ query })
  },
})

function setSort(key) {
  activeSort.value = key
}

function toggleTag(tag) {
  const idx = activeTags.value.indexOf(tag)
  const next = [...activeTags.value]
  if (idx > -1) next.splice(idx, 1)
  else next.push(tag)
  activeTags.value = next
}

function toggleFilter() {
  showFilter.value = !showFilter.value
}
</script>

<style scoped>
.main-nav {
  background: var(--color-bg);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--color-border);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  pointer-events: none;
}

.main-nav.is-visible {
  transform: translateY(0);
  pointer-events: auto;
}

.main-nav__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Logo */
.main-nav__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  line-height: 1.15;
  flex-shrink: 0;
  padding: 2px 0;
}

.main-nav__logo-main {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: 4px;
}

.main-nav__logo-sub {
  font-size: 11px;
  color: var(--color-text-light);
  letter-spacing: 1px;
}

/* 搜索功能区 */
.main-nav__search-center {
  flex: 1;
  min-width: 0;
  max-width: 760px;
  position: relative;
}

.main-nav__search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
}

.main-nav__search-combo {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  position: relative;
}

.main-nav__search-input-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
}

.main-nav__search-input {
  width: 100%;
}

.main-nav__search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-card) 0 0 var(--radius-card);
  border: 2px solid var(--color-primary);
  box-shadow: none;
  height: 40px;
  padding: 0 12px;
  background: var(--color-bg);
  transition: box-shadow 0.2s ease;
}

.main-nav__search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.15);
}

.main-nav__search-input :deep(.el-input__inner) {
  font-size: 14px;
  color: var(--color-text-dark);
}

.main-nav__search-input :deep(.el-input__inner::placeholder) {
  color: transparent;
}

.main-nav__search-placeholder {
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--color-text-light);
  pointer-events: none;
  user-select: none;
}

.main-nav__search-btn {
  width: 72px;
  height: 40px;
  flex-shrink: 0;
  background: var(--color-primary);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  cursor: pointer;
  transition: background 0.15s ease;
}

.main-nav__search-btn:hover {
  background: var(--color-primary-hover);
}

.main-nav__search-similar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 88px;
  height: 40px;
  flex-shrink: 0;
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: background 0.15s ease;
  padding: 0;
}

.main-nav__search-similar:hover {
  background: rgb(255, 220, 200);
}

/* 搜索下拉面板 */
.main-nav__search-dropdown {
  position: absolute;
  top: 46px;
  left: 0;
  right: 100px;
  background: var(--color-bg);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-modal);
  padding: 14px 18px;
  z-index: 200;
}

.search-dropdown__section {
  margin-bottom: 16px;
}

.search-dropdown__section:last-child {
  margin-bottom: 0;
}

.search-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-dropdown__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.search-dropdown__action {
  font-size: 12px;
  color: var(--color-text-light);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.search-dropdown__action:hover {
  color: var(--color-primary);
}

.search-dropdown__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-dropdown__tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: var(--color-bg-promo);
  border-radius: var(--radius-card);
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.search-dropdown__tag:hover {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.search-dropdown__guess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
}

.search-dropdown__guess-item {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  padding: 3px 0;
  transition: color 0.15s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-dropdown__guess-item:hover {
  color: var(--color-primary);
  background: rgba(255, 80, 0, 0.04);
}

.dropdown-fade-enter-active {
  transition: all 0.25s ease;
}

.dropdown-fade-leave-active {
  transition: all 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 购物车 */
.main-nav__cart {
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;
}

.main-nav__mobile-icons {
  display: none;
  align-items: center;
  margin-left: auto;
  cursor: pointer;
}

/* Products 页面筛选栏 */
.main-nav__filter-bar {
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.filter-bar__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.filter-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.filter-bar__sort-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.filter-bar__sort-item:hover {
  color: var(--color-primary);
}

.filter-bar__sort-item.active {
  color: #fff;
  background: var(--color-primary);
  font-weight: 600;
}

.filter-bar__tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.filter-bar__tag {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.filter-bar__tag:hover {
  color: var(--color-primary);
  background: var(--color-light-orange);
}

.filter-bar__tag.active {
  color: var(--color-primary);
  background: var(--color-light-orange);
  border: 1px solid var(--color-primary);
}

.filter-bar__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
}

.filter-bar__location,
.filter-bar__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.filter-bar__location:hover,
.filter-bar__filter-btn:hover {
  color: var(--color-primary);
}

.filter-bar__filter-btn {
  position: relative;
}

.filter-bar__filter-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  color: #fff;
  font-size: 10px;
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .main-nav__inner,
  .filter-bar__inner {
    padding: 0 32px;
  }

  .main-nav__search-center {
    max-width: none;
  }

  .filter-bar__tags {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-nav__inner,
  .filter-bar__inner {
    padding: 0 16px;
  }

  .main-nav__logo-sub,
  .main-nav__search-similar,
  .main-nav__search-dropdown,
  .main-nav__filter-bar {
    display: none;
  }

  .main-nav__cart {
    display: none;
  }

  .main-nav__mobile-icons {
    display: flex;
  }

  .main-nav__search-center {
    flex: 1;
    max-width: none;
  }
}
</style>
