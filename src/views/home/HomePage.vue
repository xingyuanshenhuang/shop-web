<template>
  <div class="homepage">
    <!-- ===== 结构1: 搜索栏 ===== -->
    <div class="search-bar-outer">
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
        <div class="search-bar-right">
          <div class="bonus-entry">
            <div class="bonus-entry__icon">
              <img
                src="https://picsum.photos/seed/bonus/56/56"
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

    <!-- 结构2: 左筛选栏、中轮播图、右个人中心 -->
    <div class="screen-outer clearfix">
      <div class="screen-left">左筛选栏</div>
      <div class="screen-center">中轮播图</div>
      <div class="screen-right">右个人中心</div>
    </div>

    <!-- 结构3: 猜你喜欢 -->
    <div class="layer">
      <div class="recommend-header">
        <h2>为你推荐</h2>
        <router-link to="/products" class="recommend-header__more">查看全部 &gt;</router-link>
      </div>
      <div class="recommend-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Camera } from '@element-plus/icons-vue'
import { products } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'

const router = useRouter()

// ===== 搜索相关 =====
const searchKeyword = ref('')
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
    searchKeyword.value = ''
  }
}

function searchFromHistory(keyword) {
  searchKeyword.value = keyword
  saveHistory(keyword)
  dropdownVisible.value = false
  router.push(`/products?keyword=${encodeURIComponent(keyword)}`)
  searchKeyword.value = ''
}

function searchFromGuess(keyword) {
  searchKeyword.value = keyword
  saveHistory(keyword)
  dropdownVisible.value = false
  router.push(`/products?keyword=${encodeURIComponent(keyword)}`)
  searchKeyword.value = ''
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
  displayedGuessList.value = shuffleArray(guessWords)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  clearTimeout(blurTimer)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== 搜索栏外层 ===== */
.search-bar-outer {
  width: 100%;
  max-width: 1524px;
  height: 96px;
  margin: 0 auto;
}

.search-bar-inner {
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
  height: 100%;
  gap: 24px;
}

/* ===== 左侧 Logo ===== */
.search-bar-left {
  width: 240px;
  height: 72px;
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
  font-size: 36px;
  font-weight: 900;
  color: #ff5000;
  letter-spacing: 8px;
}

.search-logo__sub {
  font-size: 13px;
  color: #999;
  letter-spacing: 2px;
  margin-top: 2px;
}

/* ===== 中间搜索区域 ===== */
.search-bar-center {
  flex: 1;
  min-width: 0;
  position: relative;
  max-width: 980px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
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
  border-radius: 12px 0 0 12px;
  border: 2px solid #ff5000;
  box-shadow: none;
  height: 44px;
  padding: 0 16px;
  transition: all 0.25s ease;
  background: #fff;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.15);
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #333;
}

/* 移除原生 placeholder，使用独立底纹词 */
.search-input :deep(.el-input__inner::placeholder) {
  color: transparent;
}

.search-input__icon {
  color: #999;
  font-size: 16px;
}

/* 底纹词：独立标签实现 */
.search-placeholder {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #bbb;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.2s ease;
}

.search-placeholder:hover {
  cursor: text;
}

/* 搜索按钮 */
.search-btn {
  width: 72px;
  height: 44px;
  flex-shrink: 0;
  background: #ff5000;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  transition: background 0.15s ease;
  line-height: 44px;
  padding: 0;
  text-align: center;
}

.search-btn:hover {
  background: #e64500;
}

/* 搜同款按钮 */
.search-similar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100px;
  height: 44px;
  flex-shrink: 0;
  background: rgb(255, 241, 235);
  color: rgb(255, 80, 0);
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
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
  top: 48px;
  left: 0;
  right: 112px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 16px 20px;
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
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.search-dropdown__action {
  font-size: 12px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.search-dropdown__action:hover {
  color: #ff5000;
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
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.search-dropdown__tag:hover {
  background: #ffefe7;
  color: #ff5000;
}

/* PC端 hover 效果 */
@media (hover: hover) {
  .search-dropdown__tag:hover {
    background: #ffefe7;
    color: #ff5000;
  }
}

/* 猜你想搜 双栏网格 */
.search-dropdown__guess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
}

.search-dropdown__guess-item {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 3px 0;
  transition: color 0.15s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-dropdown__guess-item:hover {
  color: #ff5000;
  background: rgba(255, 80, 0, 0.04);
}

/* PC端 hover 效果 */
@media (hover: hover) {
  .search-dropdown__guess-item:hover {
    color: #ff5000;
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
  gap: 4px 16px;
  padding-top: 6px;
}

.quick-nav__link {
  font-size: 12px;
  color: #999;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.quick-nav__link:hover {
  color: #ff5000;
  text-decoration: underline;
}

.quick-nav__link--hot {
  color: #ff5000;
}

.quick-nav__hot-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ff5000;
  background: #ffefe7;
  border-radius: 3px;
  padding: 1px 3px;
  line-height: 1;
  letter-spacing: 0.5px;
}

/* ===== 右侧 天天领红包 ===== */
.search-bar-right {
  width: 240px;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.bonus-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: 1px solid #ffdfd3;
  border-radius: 12px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #fff7f3, #fff);
  transition: box-shadow 0.15s ease;
}

.bonus-entry:hover {
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.12);
}

.bonus-entry__icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.bonus-entry__avatar {
  width: 56px;
  height: 56px;
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
  font-size: 16px;
  font-weight: 700;
  color: #ff5000;
}

.bonus-entry__desc {
  font-size: 12px;
  color: #999;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .search-bar-left {
    width: 160px;
  }

  .search-bar-right {
    display: none;
  }

  .search-dropdown {
    right: 0;
  }

  .search-logo__main {
    font-size: 28px;
    letter-spacing: 4px;
  }

  .search-logo__sub {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .search-bar-outer {
    height: auto;
  }

  .search-bar-inner {
    flex-wrap: wrap;
    gap: 8px;
  }

  .search-bar-left {
    width: 100%;
    height: auto;
    justify-content: center;
    padding: 8px 0;
  }

  .search-bar-center {
    width: 100%;
    max-width: 100%;
  }

  .search-row {
    height: 40px;
    gap: 8px;
  }

  .search-combo .search-input :deep(.el-input__wrapper) {
    height: 40px;
  }

  .search-btn {
    width: 56px;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
  }

  .search-similar-btn {
    width: 80px;
    height: 40px;
    font-size: 12px;
    gap: 4px;
  }

  .search-dropdown {
    right: 0;
  }

  .search-dropdown__guess-grid {
    grid-template-columns: 1fr;
  }

  .quick-nav {
    gap: 4px 10px;
  }

  .quick-nav__link {
    font-size: 11px;
  }
}
</style>
