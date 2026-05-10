<template>
  <div class="footprint-view">
    <div class="footprint-view__header">
      <h3>足迹收藏</h3>
      <div class="footprint-view__actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索"
          class="footprint-view__search"
          :prefix-icon="Search"
          clearable
        />
        <template v-if="!isBatchMode">
          <button class="ghost-btn ghost-btn--primary" @click="enterBatchMode">批量管理</button>
        </template>
        <template v-else>
          <button
            class="ghost-btn ghost-btn--danger"
            :disabled="selectedItems.length === 0"
            @click="showDeleteDialog = true"
          >
            删除
          </button>
          <button class="ghost-btn ghost-btn--gray" @click="exitBatchMode">退出管理</button>
        </template>
      </div>
    </div>

    <div class="footprint-view__tabs">
      <span
        v-for="tab in tabs"
        :key="tab.key"
        class="footprint-tab"
        :class="{ active: currentTab === tab.key }"
        @click="switchTab(tab.key)"
        >{{ tab.label }}</span
      >
    </div>

    <div v-if="currentTab === 'favorites'" class="footprint-view__filters">
      <span class="filter-label">筛选条件</span>
      <span
        v-for="f in productFilters"
        :key="f.key"
        class="filter-tag"
        :class="{ active: activeFilter === f.key }"
        @click="setFilter(f.key)"
        >{{ f.label }}</span
      >
      <span class="filter-dropdown">宝贝分类 ▼</span>
      <span class="filter-dropdown">收藏时间 ▼</span>
    </div>

    <div v-if="currentTab === 'shops'" class="footprint-view__filters">
      <span
        v-for="f in shopFilters"
        :key="f.key"
        class="filter-tag"
        :class="{ active: activeShopFilter === f.key }"
        @click="setShopFilter(f.key)"
        >{{ f.label }}</span
      >
    </div>

    <div v-if="isBatchMode" class="batch-bar">
      <label class="batch-bar__select-all" @click.prevent="toggleSelectAll">
        <span class="batch-checkbox" :class="{ checked: isAllSelected }"></span>
        <span>全选</span>
      </label>
      <span class="batch-bar__count"
        >已选中 <em>{{ selectedItems.length }}</em> 件</span
      >
    </div>

    <div v-if="currentTab === 'history'" class="view-content">
      <div v-if="filteredHistoryGroups.length" class="history-groups">
        <div v-for="group in filteredHistoryGroups" :key="group.date" class="history-group">
          <div class="history-group__header">
            <span class="history-group__date">{{ group.date }}</span>
            <span class="history-group__count">（{{ group.products.length }}件宝贝）</span>
          </div>
          <div class="product-grid">
            <div
              v-for="item in group.products"
              :key="'h-' + item.id"
              class="product-card"
              :class="{
                'product-card--selected': isBatchMode && selectedItems.includes(item.id),
                'product-card--batch': isBatchMode,
              }"
              @click="goToProduct(item.id)"
            >
              <div class="product-card__img-wrap">
                <img :src="item.image" class="product-card__img" />
                <div v-if="isBatchMode" class="product-card__checkbox">
                  <span
                    class="batch-checkbox"
                    :class="{ checked: selectedItems.includes(item.id) }"
                  ></span>
                </div>
                <span
                  v-if="!isBatchMode"
                  class="product-card__delete"
                  @click.stop="removeHistoryItem(group.date, item.id)"
                >
                  <el-icon><DeleteFilled /></el-icon>
                </span>
                <div v-if="!isBatchMode" class="product-card__action-bar">
                  <button class="action-btn" @click.stop>进入店铺</button>
                  <button class="action-btn" @click.stop>按图找相似</button>
                </div>
              </div>
              <span class="product-card__name text-truncate">{{ item.name }}</span>
              <span class="price price-sm">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-icon :size="80" color="#E0D6CE"><Clock /></el-icon>
        <span>{{ emptyStateText }}</span>
        <button class="secondary-btn" @click="resetFilter">清除筛选</button>
      </div>
    </div>

    <div v-else-if="currentTab === 'favorites'" class="view-content">
      <div v-if="filteredFavoriteItems.length" class="product-grid">
        <div
          v-for="item in filteredFavoriteItems"
          :key="'f-' + item.id"
          class="product-card"
          :class="{
            'product-card--selected': isBatchMode && selectedItems.includes(item.id),
            'product-card--batch': isBatchMode,
          }"
          @click="goToProduct(item.id)"
        >
          <div class="product-card__img-wrap">
            <img :src="item.image" class="product-card__img" />
            <div v-if="isBatchMode" class="product-card__checkbox">
              <span
                class="batch-checkbox"
                :class="{ checked: selectedItems.includes(item.id) }"
              ></span>
            </div>
            <span
              v-if="!isBatchMode"
              class="product-card__delete"
              @click.stop="removeFavoriteItem(item.id)"
            >
              <el-icon><DeleteFilled /></el-icon>
            </span>
            <div v-if="!isBatchMode" class="product-card__action-bar">
              <button class="action-btn" @click.stop>进入店铺</button>
              <button class="action-btn" @click.stop>按图找相似</button>
            </div>
          </div>
          <span class="product-card__name product-card__name--2line">{{ item.name }}</span>
          <span class="product-card__collect">{{ item.collectCount }}人收藏</span>
          <span class="price price-sm">¥{{ item.price }}</span>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-icon :size="80" color="#E0D6CE"><Star /></el-icon>
        <span>{{ emptyStateText }}</span>
        <button class="secondary-btn" @click="resetFilter">清除筛选</button>
      </div>
    </div>

    <div v-else-if="currentTab === 'shops'" class="view-content">
      <div v-if="filteredShops.length" class="shop-list">
        <div v-for="shop in filteredShops" :key="shop.id" class="shop-card">
          <img :src="shop.logo" class="shop-card__logo" />
          <span class="shop-card__name">{{ shop.name }}</span>
          <span v-if="shop.tag" class="shop-card__tag">{{ shop.tag }}</span>
          <div class="shop-card__actions">
            <button class="secondary-btn">进入店铺</button>
            <button class="ghost-btn ghost-btn--gray" @click="unfollowShop(shop.id)">
              取消关注
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-icon :size="80" color="#E0D6CE"><Shop /></el-icon>
        <span>{{ emptyStateText }}</span>
        <button class="secondary-btn" @click="resetFilter">清除筛选</button>
      </div>
    </div>

    <div v-if="hasMore" class="load-more">
      <span v-if="loading" class="load-more__text">加载中...</span>
      <span v-else class="load-more__text load-more__link" @click="loadMore">加载更多</span>
    </div>
    <div v-else-if="currentItemCount > 0" class="load-more">
      <span class="load-more__text">没有更多了</span>
    </div>

    <el-dialog v-model="showDeleteDialog" title="" width="360px" :close-on-click-modal="false">
      <p style="text-align: center; font-size: 14px">
        确定删除选中的 {{ selectedItems.length }} 件商品吗？
      </p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">删除</el-button>
      </template>
    </el-dialog>

    <div v-if="isBatchMode" class="mobile-batch-bar show-on-mobile-only">
      <label class="batch-bar__select-all" @click.prevent="toggleSelectAll">
        <span class="batch-checkbox" :class="{ checked: isAllSelected }"></span>
        <span>全选</span>
      </label>
      <button
        class="mobile-batch-bar__delete"
        :disabled="selectedItems.length === 0"
        @click="showDeleteDialog = true"
      >
        删除
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * 足迹收藏组件
 * 功能：展示我的足迹、商品收藏、店铺关注三个Tab，支持搜索、筛选、批量管理
 */
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Clock, Star, Shop, DeleteFilled } from '@element-plus/icons-vue'
import { browsingHistory, favoriteProducts, followedShops } from '@/mock/data'

// Props & Emits
const props = defineProps({
  activeTab: { type: String, default: 'history' },
})
const emit = defineEmits(['update:activeTab'])

const router = useRouter()

// 基础状态
const currentTab = ref('history') // 当前Tab
const searchQuery = ref('') // 搜索关键词
const isBatchMode = ref(false) // 批量管理模式
const selectedItems = ref([]) // 已选中的商品ID
const showDeleteDialog = ref(false) // 删除确认弹窗
const loading = ref(false) // 加载状态

// Tab状态管理（筛选条件、分页）
const tabState = ref({
  history: { filter: 'all', page: 1 },
  favorites: { filter: 'all', page: 1 },
  shops: { filter: 'all', page: 1 },
})

// 当前激活的筛选条件
const activeFilter = computed({
  get: () => tabState.value[currentTab.value]?.filter || 'all',
  set: (val) => {
    tabState.value[currentTab.value].filter = val
  },
})
const activeShopFilter = computed({
  get: () => tabState.value.shops?.filter || 'all',
  set: (val) => {
    tabState.value.shops.filter = val
  },
})

// 监听父组件传入的activeTab，同步当前Tab
watch(
  () => props.activeTab,
  (val) => {
    if (val === 'history') currentTab.value = 'history'
    else if (val === 'history-favorites') currentTab.value = 'favorites'
    else if (val === 'history-shops') currentTab.value = 'shops'
  },
  { immediate: true },
)

// Tab配置
const tabs = [
  { key: 'history', label: '我的足迹' },
  { key: 'favorites', label: '商品收藏' },
  { key: 'shops', label: '店铺关注' },
]

// 切换Tab
function switchTab(tabKey) {
  if (currentTab.value === tabKey) return
  currentTab.value = tabKey
  isBatchMode.value = false
  selectedItems.value = []
  const tabMap = { history: 'history', favorites: 'history-favorites', shops: 'history-shops' }
  emit('update:activeTab', tabMap[tabKey])
}

// 设置筛选条件
function setFilter(key) {
  activeFilter.value = key
}
function setShopFilter(key) {
  activeShopFilter.value = key
}
function resetFilter() {
  if (currentTab.value === 'shops') activeShopFilter.value = 'all'
  else activeFilter.value = 'all'
}

// 筛选标签配置（根据数据动态计算数量）
const productFilters = computed(() => {
  const items = currentTab.value === 'history' ? historyItems.value : favoriteItems.value
  const priceDownCount = items.filter((i) => i.status === 'price-down').length
  const offShelfCount = items.filter((i) => i.status === 'off-shelf').length
  return [
    { key: 'all', label: '不限' },
    { key: 'price-down', label: `有降价(${priceDownCount})` },
    { key: 'off-shelf', label: `失效(${offShelfCount})` },
  ]
})
const shopFilters = computed(() => {
  const newCount = shops.value.filter((s) => s.hasNew).length
  const couponCount = shops.value.filter((s) => s.hasCoupon).length
  const selfCount = shops.value.filter((s) => s.isSelf).length
  return [
    { key: 'all', label: '全部店铺' },
    { key: 'new', label: `上新(${newCount})` },
    { key: 'coupon', label: `有优惠券(${couponCount})` },
    { key: 'self', label: `自营(${selfCount})` },
  ]
})

// 数据源
const historyItems = ref([])
browsingHistory.forEach((group) => {
  group.products.forEach((p) => historyItems.value.push({ ...p, status: 'normal' }))
})
const historyGroups = ref(
  JSON.parse(JSON.stringify(browsingHistory)).map((group) => ({
    ...group,
    products: group.products.map((p) => ({ ...p, status: 'normal' })),
  })),
)
const favoriteItems = ref([...favoriteProducts])
const shops = ref([...followedShops])

// 筛选后的数据
const filteredHistoryGroups = computed(() => {
  let filtered = historyGroups.value
  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered
      .map((group) => ({
        ...group,
        products: group.products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ),
      }))
      .filter((g) => g.products.length > 0)
  }
  // 状态筛选
  if (activeFilter.value !== 'all') {
    filtered = filtered
      .map((group) => ({
        ...group,
        products: group.products.filter((i) => i.status === activeFilter.value),
      }))
      .filter((g) => g.products.length > 0)
  }
  return filtered
})
const filteredFavoriteItems = computed(() => {
  if (activeFilter.value === 'all') return favoriteItems.value
  return favoriteItems.value.filter((i) => i.status === activeFilter.value)
})
const filteredShops = computed(() => {
  if (activeShopFilter.value === 'all') return shops.value
  if (activeShopFilter.value === 'new') return shops.value.filter((s) => s.hasNew)
  if (activeShopFilter.value === 'coupon') return shops.value.filter((s) => s.hasCoupon)
  if (activeShopFilter.value === 'self') return shops.value.filter((s) => s.isSelf)
  return shops.value
})

// 统计数据
const currentItemCount = computed(() => {
  if (currentTab.value === 'history')
    return filteredHistoryGroups.value.reduce((sum, g) => sum + g.products.length, 0)
  if (currentTab.value === 'favorites') return filteredFavoriteItems.value.length
  return filteredShops.value.length
})
const hasMore = ref(false)

// 全选状态
const isAllSelected = computed(() => {
  if (currentTab.value === 'history') {
    const allIds = filteredHistoryGroups.value.flatMap((g) => g.products.map((p) => p.id))
    return allIds.length > 0 && selectedItems.value.length === allIds.length
  }
  const items = currentTab.value === 'favorites' ? filteredFavoriteItems.value : []
  return items.length > 0 && selectedItems.value.length === items.length
})

// 空状态文案
const emptyStateText = computed(() => {
  const map = {
    history: '暂无浏览记录',
    favorites: '您还没有收藏过任何商品哦',
    shops: '您还没有关注过任何店铺哦',
  }
  return map[currentTab.value] || '暂无数据'
})

// 批量操作
function toggleSelectAll() {
  if (currentTab.value === 'history') {
    const allIds = filteredHistoryGroups.value.flatMap((g) => g.products.map((p) => p.id))
    selectedItems.value = isAllSelected.value ? [] : [...allIds]
  } else {
    const items = filteredFavoriteItems.value
    selectedItems.value = isAllSelected.value ? [] : items.map((i) => i.id)
  }
}
function enterBatchMode() {
  isBatchMode.value = true
  selectedItems.value = []
}
function exitBatchMode() {
  isBatchMode.value = false
  selectedItems.value = []
}

// 删除操作
function removeHistoryItem(date, id) {
  const group = historyGroups.value.find((g) => g.date === date)
  if (group) {
    const idx = group.products.findIndex((p) => p.id === id)
    if (idx > -1) group.products.splice(idx, 1)
  }
}
function removeFavoriteItem(id) {
  const idx = favoriteItems.value.findIndex((i) => i.id === id)
  if (idx > -1) favoriteItems.value.splice(idx, 1)
}
function confirmDelete() {
  if (currentTab.value === 'history') {
    historyGroups.value.forEach((group) => {
      group.products = group.products.filter((i) => !selectedItems.value.includes(i.id))
    })
  } else if (currentTab.value === 'favorites') {
    favoriteItems.value = favoriteItems.value.filter((i) => !selectedItems.value.includes(i.id))
  }
  selectedItems.value = []
  showDeleteDialog.value = false
  ElMessage({ message: '删除成功', type: 'success', duration: 2000 })
}

// 跳转与操作
function goToProduct(id) {
  router.push(`/product/${id}`)
}
function unfollowShop(id) {
  const idx = shops.value.findIndex((s) => s.id === id)
  if (idx > -1) shops.value.splice(idx, 1)
  ElMessage({ message: '已取消关注', type: 'success', duration: 2000 })
}
function loadMore() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    hasMore.value = false
  }, 1000)
}
</script>

<style scoped>
.footprint-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.footprint-view__header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.footprint-view__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footprint-view__search {
  width: 200px;
}

.footprint-view__search :deep(.el-input__wrapper) {
  border-radius: 16px;
  height: 32px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
}

.footprint-view__search :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.ghost-btn {
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 13px;
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.ghost-btn--primary {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.ghost-btn--primary:hover {
  background: var(--color-light-orange);
}

.ghost-btn--danger {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.ghost-btn--danger:hover:not(:disabled) {
  background: #fff1f0;
}

.ghost-btn--danger:disabled {
  border-color: var(--color-border);
  color: #cccccc;
  cursor: not-allowed;
}

.ghost-btn--gray {
  border-color: var(--color-border);
  color: var(--color-text-mid);
}

.ghost-btn--gray:hover {
  border-color: var(--color-text-mid);
}

.footprint-view__tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 0;
}

.footprint-tab {
  padding: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-fast);
}

.footprint-tab:first-child {
  padding-left: 0;
}

.footprint-tab:first-child.active::after {
  left: 0;
  right: 20%;
}

.footprint-tab:hover {
  color: var(--color-primary);
}

.footprint-tab.active {
  color: var(--color-primary);
  font-weight: 600;
}

.footprint-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.footprint-view__filters {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 12px;
  color: var(--color-text-light);
}

.filter-tag {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;
  transition: all var(--transition-fast);
}

.filter-tag:hover {
  color: var(--color-primary);
}

.filter-tag.active {
  color: var(--color-primary);
}

.filter-tag.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-primary);
}

.filter-dropdown {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  margin-left: auto;
  transition: color var(--transition-fast);
}

.filter-dropdown:hover {
  color: var(--color-primary);
}

.filter-dropdown + .filter-dropdown {
  margin-left: 16px;
}

.batch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  margin-bottom: 8px;
}

.batch-bar__select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-dark);
}

.batch-checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #cccccc;
  position: relative;
  transition: all var(--transition-fast);
}

.batch-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.batch-checkbox.checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.batch-bar__count {
  font-size: 12px;
  color: var(--color-text-light);
}

.batch-bar__count em {
  font-style: normal;
  color: var(--color-primary);
}

.view-content {
  min-height: 200px;
}

.history-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.history-group {
  display: flex;
  flex-direction: column;
}

.history-group__header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.history-group__date {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.history-group__count {
  font-size: 12px;
  color: var(--color-text-light);
}

.history-dropdown {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.history-dropdown:hover {
  color: var(--color-primary);
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.product-card {
  width: calc(20% - 10px);
  background: var(--color-bg-white);
  border-radius: var(--radius-btn);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.product-card--selected {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

.product-card--batch {
  cursor: pointer;
}

.product-card__img-wrap {
  position: relative;
  overflow: hidden;
}

.product-card__img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.product-card__checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.product-card__delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 2;
}

.product-card:hover .product-card__delete {
  opacity: 1;
}

.product-card__action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: rgba(128, 128, 128, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 0;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.product-card:hover .product-card__action-bar {
  opacity: 1;
}

.action-btn {
  height: 22px;
  padding: 0 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
}

.action-btn:hover {
  color: #fff;
}

.product-card__name {
  display: block;
  font-size: 12px;
  color: var(--color-text-dark);
  padding: 4px 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card__name--2line {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 18px;
  height: 36px;
}

.product-card__collect {
  display: block;
  font-size: 12px;
  color: var(--color-text-light);
  padding: 2px 8px 0;
}

.product-card .price {
  display: block;
  padding: 2px 8px 8px;
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shop-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-bg-white);
  border-radius: 12px;
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.shop-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.shop-card__logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.shop-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  flex: 1;
  min-width: 0;
}

.shop-card__tag {
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: 12px;
  border-radius: 4px;
  padding: 2px 8px;
  flex-shrink: 0;
}

.shop-card__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.secondary-btn {
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 13px;
  background: var(--color-bg-white);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.secondary-btn:hover {
  background: var(--color-light-orange);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  width: 100%;
}

.empty-state span {
  font-size: 14px;
  color: var(--color-text-light);
}

.load-more {
  text-align: center;
  padding: 24px 0;
}

.load-more__text {
  font-size: 12px;
  color: #cccccc;
}

.load-more__link {
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 4px 12px;
  border-radius: 4px;
}

.load-more__link:hover {
  color: var(--color-primary);
  background: var(--color-light-orange);
}

.mobile-batch-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--color-bg-white);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
}

.mobile-batch-bar__delete {
  height: 36px;
  border-radius: 6px;
  padding: 0 24px;
  font-size: 14px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-batch-bar__delete:hover:not(:disabled) {
  background: #ff7875;
}

.mobile-batch-bar__delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-card {
    width: calc(33.333% - 8px);
  }

  .product-card__action-bar {
    height: 28px;
  }

  .action-btn {
    font-size: 11px;
    height: 20px;
    padding: 0 4px;
  }

  .product-card__name {
    font-size: 11px;
    padding: 4px 4px 0;
  }

  .product-card__name--2line {
    line-height: 16px;
    height: 32px;
    font-size: 11px;
  }

  .product-card__collect {
    font-size: 11px;
    padding: 2px 4px 0;
  }

  .product-card .price {
    padding: 2px 4px 6px;
  }

  .product-card__delete {
    width: 24px;
    height: 24px;
  }

  .footprint-view__actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .footprint-view__search {
    width: 100%;
    order: 3;
  }

  .footprint-tab {
    padding: 0 16px;
    font-size: 13px;
  }

  .footprint-view__filters {
    gap: 12px;
  }

  .filter-dropdown {
    margin-left: 0;
  }

  .mobile-batch-bar {
    display: flex;
  }

  .shop-card {
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .shop-card__actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .product-card {
    width: calc(50% - 6px);
  }

  .product-card__action-bar {
    height: 26px;
  }

  .action-btn {
    font-size: 10px;
    height: 18px;
    padding: 0 2px;
  }

  .product-card__name {
    font-size: 11px;
    padding: 3px 4px 0;
  }

  .product-card__name--2line {
    line-height: 15px;
    height: 30px;
    font-size: 11px;
  }

  .product-card__collect {
    font-size: 10px;
    padding: 1px 4px 0;
  }

  .product-card__delete {
    width: 22px;
    height: 22px;
  }

  .footprint-view__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .footprint-view__actions {
    width: 100%;
  }

  .ghost-btn {
    flex: 1;
  }
}
</style>
