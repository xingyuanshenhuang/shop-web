<template>
  <div class="search-bar-outer page-search-bar">
    <div class="search-bar-inner">
      <!-- 左侧: Logo -->
      <div class="search-bar-left">
        <router-link to="/" class="search-logo">
          <span class="search-logo__main">淘宝</span>
          <span class="search-logo__sub">Taobao.com</span>
        </router-link>
      </div>

      <!-- 中间: 搜索功能主体 -->
      <div class="search-bar-center" ref="searchCenterRef">
        <!-- 搜索行: 输入框 + 搜索按钮 + 搜同款 -->
        <div class="search-row">
          <div class="search-combo" :class="{ 'is-focused': dropdownVisible }">
            <div class="search-input-wrapper">
              <el-input
                ref="searchInputRef"
                v-model="searchKeyword"
                class="search-input"
                @focus="handleFocus"
                @blur="handleBlur"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon class="search-input__icon"><Search /></el-icon>
                </template>
              </el-input>
              <!-- 底纹词：独立标签，有输入时隐藏 -->
              <span
                v-if="!searchKeyword && !dropdownVisible"
                class="search-placeholder"
                @click="focusInput"
              >
                请输入搜索文字
              </span>
            </div>
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>
          <button class="search-similar-btn" @click="handleSearchSimilar">
            <el-icon :size="16"><Camera /></el-icon>
            <span>搜同款</span>
          </button>
        </div>

        <!-- 下拉面板 -->
        <transition name="dropdown-fade">
          <div
            v-show="dropdownVisible"
            class="search-dropdown"
            @mousedown.prevent
            @mouseenter="isMouseInDropdown = true"
            @mouseleave="isMouseInDropdown = false"
          >
            <!-- 历史搜索 -->
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

            <!-- 猜你想搜 -->
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

        <!-- 快捷导航 -->
        <div class="quick-nav">
          <a
            v-for="(link, idx) in quickNavLinks"
            :key="idx"
            class="quick-nav__link"
            :class="{ 'quick-nav__link--hot': link.hot }"
            @click.prevent="$router.push('/products')"
          >
            {{ link.label }}
            <span v-if="link.hot" class="quick-nav__hot-badge">HOT</span>
          </a>
        </div>
      </div>

      <!-- 右侧: 天天领红包 -->
      <div v-if="showBonus" class="search-bar-right">
        <div class="bonus-entry">
          <div class="bonus-entry__icon">
            <img
              src="https://images.pexels.com/photos/5942521/pexels-photo-5942521.jpeg?auto=compress&cs=tinysrgb&w=56&h=56&fit=crop"
              alt=""
              class="bonus-entry__avatar"
            />
          </div>
          <div class="bonus-entry__text">
            <span class="bonus-entry__title">天天领红包</span>
            <span class="bonus-entry__desc">签到领金币</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Camera } from '@element-plus/icons-vue'

defineProps({
  showBonus: { type: Boolean, default: true },
})

const route = useRoute()
const router = useRouter()

// ===== 搜索相关 =====
const searchKeyword = ref(route.query.keyword ? String(route.query.keyword) : '')

// 路由关键词变化时同步搜索框内容（如从其他页面搜索跳转过来）
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
let blurTimer = null

// 猜你想搜词库
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

// 历史搜索 (localStorage)
const STORAGE_KEY = 'taobao_search_history'
const searchHistory = ref([])

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      searchHistory.value = JSON.parse(raw)
    }
  } catch {
    searchHistory.value = []
  }
}

function saveHistory(keyword) {
  const kw = keyword.trim()
  if (!kw) return
  searchHistory.value = searchHistory.value.filter((item) => item !== kw)
  searchHistory.value.unshift(kw)
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
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
  // 延迟关闭：若鼠标仍在面板内（悬停或点击），则保持展开
  blurTimer = setTimeout(() => {
    if (!isMouseInDropdown.value) {
      dropdownVisible.value = false
    }
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

// 点击外部关闭下拉
function handleClickOutside(e) {
  if (searchCenterRef.value && !searchCenterRef.value.contains(e.target)) {
    dropdownVisible.value = false
  }
}

// 快捷导航
const quickNavLinks = [
  { label: '券后低7.3折起', hot: false },
  { label: '新款莫商棉券', hot: false },
  { label: '补贴官配补贴', hot: false },
  { label: '世界杯心动满边', hot: true },
  { label: '多国官方', hot: false },
  { label: '法拉利法', hot: false },
  { label: '多国国言', hot: false },
  { label: '多国国花优品', hot: false },
  { label: 'douplus', hot: false },
  { label: '升旗月卡', hot: false },
]

onMounted(() => {
  loadHistory()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-bar-outer {
  width: 100%;
  max-width: 1524px;
  min-width: 0;
  height: 96px;
  margin: 0 auto;
  container-type: inline-size;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-bar-inner {
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
  height: 100%;
  gap: clamp(24px, 3cqi, 36px);
}

/* ===== 左侧 Logo ===== */
.search-bar-left {
  width: clamp(200px, 16cqi, 240px);
  height: clamp(60px, 5cqi, 72px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.search-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  line-height: 1.2;
}

.search-logo__main {
  font-size: clamp(28px, 2.8cqi, 36px);
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: clamp(4px, 0.6cqi, 8px);
}

.search-logo__sub {
  font-size: clamp(11px, 1cqi, 13px);
  color: var(--color-text-light);
  letter-spacing: 2px;
  margin-top: 2px;
}

/* ===== 中间搜索区域 ===== */
.search-bar-center {
  flex: 1;
  min-width: 0;
  position: relative;
  max-width: clamp(600px, 60cqi, 980px);
}

.search-row {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1cqi, 12px);
  height: clamp(40px, 3.5cqi, 44px);
}

/* 搜索输入框 + 搜索按钮组合 */
.search-combo {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  position: relative;
}

/* 输入框包装器：用于底纹词定位 */
.search-input-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-card) 0 0 var(--radius-card);
  border: 2px solid var(--color-primary);
  box-shadow: none;
  height: clamp(40px, 3.5cqi, 44px);
  padding: 0 clamp(12px, 1.5cqi, 16px);
  transition: all 0.25s ease;
  background: var(--color-bg);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.15);
}

.search-input :deep(.el-input__inner) {
  font-size: clamp(13px, 1.2cqi, 14px);
  color: var(--color-text-dark);
}

/* 移除原生 placeholder，使用独立底纹词 */
.search-input :deep(.el-input__inner::placeholder) {
  color: transparent;
}

.search-input__icon {
  color: var(--color-text-light);
  font-size: clamp(14px, 1.4cqi, 16px);
}

/* 底纹词：独立标签实现 */
.search-placeholder {
  position: absolute;
  left: clamp(32px, 3.5cqi, 40px);
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(13px, 1.2cqi, 14px);
  color: var(--color-text-light);
  pointer-events: none;
  user-select: none;
  transition: opacity 0.2s ease;
}

.search-placeholder:hover {
  cursor: text;
}

/* 搜索按钮 */
.search-btn {
  width: clamp(64px, 5.5cqi, 72px);
  height: clamp(40px, 3.5cqi, 44px);
  flex-shrink: 0;
  background: var(--color-primary);
  color: var(--color-bg);
  font-size: clamp(14px, 1.4cqi, 16px);
  font-weight: 700;
  border: none;
  border-radius: 0 var(--radius-card) var(--radius-card) 0;
  cursor: pointer;
  transition: background 0.15s ease;
  line-height: clamp(40px, 3.5cqi, 44px);
  padding: 0;
  text-align: center;
}

.search-btn:hover {
  background: var(--color-primary-hover);
}

/* 搜同款按钮 */
.search-similar-btn {
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.6cqi, 6px);
  width: clamp(88px, 8.5cqi, 100px);
  height: clamp(40px, 3.5cqi, 44px);
  flex-shrink: 0;
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: clamp(13px, 1.2cqi, 14px);
  font-weight: 500;
  border: none;
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: background 0.15s ease;
  justify-content: center;
  padding: 0;
}

.search-similar-btn:hover {
  background: rgb(255, 220, 200);
}

/* ===== 下拉面板 ===== */
.search-dropdown {
  position: absolute;
  top: clamp(44px, 4cqi, 48px);
  left: 0;
  right: clamp(96px, 9cqi, 112px);
  background: var(--color-bg);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-modal);
  padding: clamp(12px, 1.5cqi, 16px) clamp(16px, 1.8cqi, 20px);
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
  margin-bottom: 12px;
}

.search-dropdown__title {
  font-size: clamp(13px, 1.2cqi, 14px);
  font-weight: 600;
  color: var(--color-text-dark);
}

.search-dropdown__action {
  font-size: clamp(11px, 1cqi, 12px);
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

/* 历史搜索标签 */
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
  font-size: clamp(12px, 1.1cqi, 13px);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.search-dropdown__tag:hover {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

/* PC端 hover 效果 */
@media (hover: hover) {
  .search-dropdown__tag:hover {
    background: var(--color-light-orange);
    color: var(--color-primary);
  }
}

/* 猜你想搜 双栏网格 */
.search-dropdown__guess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
}

.search-dropdown__guess-item {
  font-size: clamp(12px, 1.1cqi, 13px);
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

/* PC端 hover 效果 */
@media (hover: hover) {
  .search-dropdown__guess-item:hover {
    color: var(--color-primary);
    background: rgba(255, 80, 0, 0.04);
  }
}

/* 下拉动画 */
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

/* ===== 快捷导航 ===== */
.quick-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px clamp(12px, 1.5cqi, 16px);
  padding-top: 6px;
}

.quick-nav__link {
  font-size: clamp(11px, 1cqi, 12px);
  color: var(--color-text-light);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.quick-nav__link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.quick-nav__link--hot {
  color: var(--color-primary);
}

.quick-nav__hot-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-light-orange);
  border-radius: 3px;
  padding: 1px 3px;
  line-height: 1;
  letter-spacing: 0.5px;
}

/* ===== 右侧 天天领红包 ===== */
.search-bar-right {
  width: clamp(180px, 16cqi, 240px);
  height: clamp(60px, 5cqi, 72px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.bonus-entry {
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.8cqi, 10px);
  cursor: pointer;
  border: 1px solid #ffdfd3;
  border-radius: var(--radius-card);
  padding: clamp(6px, 0.7cqi, 8px) clamp(10px, 1.2cqi, 14px);
  background: linear-gradient(135deg, #fff7f3, var(--color-bg));
  transition: box-shadow 0.15s ease;
}

.bonus-entry:hover {
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.12);
}

.bonus-entry__icon {
  width: clamp(44px, 4cqi, 56px);
  height: clamp(44px, 4cqi, 56px);
  flex-shrink: 0;
}

.bonus-entry__avatar {
  width: clamp(44px, 4cqi, 56px);
  height: clamp(44px, 4cqi, 56px);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffdfd3;
}

.bonus-entry__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bonus-entry__title {
  font-size: clamp(13px, 1.4cqi, 16px);
  font-weight: 700;
  color: var(--color-primary);
}

.bonus-entry__desc {
  font-size: clamp(11px, 1cqi, 12px);
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .search-bar-outer {
    min-width: auto;
    height: auto;
    padding: 0 12px;
  }

  .search-bar-inner {
    flex-wrap: nowrap;
    gap: 16px;
    padding: 8px 0;
    height: auto;
    justify-content: center;
  }

  .search-bar-left {
    width: auto;
    height: auto;
    flex-shrink: 0;
  }

  .search-logo__main {
    font-size: 24px;
  }

  .search-logo__sub {
    display: none;
  }

  .search-bar-center {
    flex: 1;
    max-width: 400px;
    order: unset;
  }

  .search-bar-right {
    display: none;
  }

  .search-row {
    height: 40px;
  }

  .search-similar-btn {
    display: none;
  }

  .quick-nav {
    display: none;
  }

  .search-dropdown {
    right: 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .search-bar-outer {
    height: auto;
    padding: 0 16px;
  }

  .search-bar-inner {
    flex-wrap: nowrap;
    padding: 12px 0;
    gap: clamp(16px, 2.5cqi, 24px);
  }

  .search-bar-left {
    width: clamp(120px, 15cqi, 180px);
    height: auto;
  }

  .search-logo__main {
    font-size: clamp(20px, 2.5cqi, 28px);
  }

  .search-logo__sub {
    font-size: clamp(9px, 1.2cqi, 11px);
    letter-spacing: 1px;
  }

  .search-bar-center {
    max-width: 100%;
  }

  .search-similar-btn {
    display: none;
  }

  .search-bar-right {
    width: clamp(100px, 12cqi, 160px);
    height: auto;
  }

  .bonus-entry {
    padding: clamp(4px, 0.5cqi, 8px) clamp(6px, 0.8cqi, 10px);
    gap: clamp(4px, 0.5cqi, 8px);
  }

  .bonus-entry__icon,
  .bonus-entry__avatar {
    width: clamp(32px, 4cqi, 44px);
    height: clamp(32px, 4cqi, 44px);
  }

  .bonus-entry__title {
    font-size: clamp(11px, 1.4cqi, 13px);
  }

  .bonus-entry__desc {
    font-size: clamp(9px, 1.1cqi, 11px);
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .search-bar-outer {
    min-width: auto;
    height: auto;
    padding: 0 24px;
  }

  .search-bar-inner {
    padding: 12px 0;
  }
}
</style>
