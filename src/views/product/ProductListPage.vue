<template>
  <div class="product-listing">
    <div class="listing-search-bar">
      <div class="listing-search-bar__inner">
        <div class="listing-search-bar__logo" @click="$router.push('/')">
          <span>🛍️</span>
          <span class="listing-search-bar__logo-text">XX商城</span>
        </div>
        <div class="listing-search-bar__search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品/品牌"
            class="listing-search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <button class="listing-search-btn" @click="handleSearch">搜索</button>
          <button class="listing-same-btn">
            <el-icon :size="14"><Camera /></el-icon>
            搜同款
          </button>
        </div>
      </div>
    </div>

    <div class="listing-content">
      <div class="listing-breadcrumb">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">家居</el-breadcrumb-item>
          <el-breadcrumb-item>家具</el-breadcrumb-item>
          <el-breadcrumb-item>沙发</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="listing-categories">
        <div class="listing-categories__scroll">
          <div
            v-for="cat in listingCategories"
            :key="cat.id"
            class="listing-categories__item"
            :class="{ active: selectedCat === cat.id }"
            @click="selectedCat = cat.id"
          >
            <span class="listing-categories__item-icon">{{ cat.icon }}</span>
            <span class="listing-categories__item-name">{{ cat.name }}</span>
          </div>
          <div class="listing-categories__brands">
            <span v-for="brand in brandLogos" :key="brand" class="listing-categories__brand">{{
              brand
            }}</span>
          </div>
        </div>
      </div>

      <div class="listing-tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="listing-tabs__item"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </div>
      </div>

      <div class="listing-sort">
        <div class="listing-sort__left">
          <span
            v-for="sort in sortOptions"
            :key="sort.key"
            class="listing-sort__item"
            :class="{ active: activeSort === sort.key }"
            @click="activeSort = sort.key"
          >
            {{ sort.label }}
            <el-icon v-if="sort.hasArrow" :size="10"><ArrowDown /></el-icon>
          </span>
        </div>
        <div class="listing-sort__tags">
          <span
            v-for="tag in filterTags"
            :key="tag"
            class="listing-sort__tag"
            :class="{ active: activeTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <div class="listing-sort__right">
          <span class="listing-sort__location">
            <el-icon :size="12"><Location /></el-icon>
            发货地 <el-icon :size="10"><ArrowDown /></el-icon>
          </span>
          <span class="listing-sort__view">
            <el-icon :size="16" :color="viewMode === 'grid' ? '#FF5000' : '#CCC'"><Grid /></el-icon>
            <el-icon
              :size="16"
              :color="viewMode === 'list' ? '#FF5000' : '#CCC'"
              style="margin-left: 4px"
              ><List
            /></el-icon>
          </span>
          <span class="listing-sort__filter-btn" @click="showFilter = !showFilter">
            <el-icon :size="14"><Filter /></el-icon>
            筛选
            <el-icon :size="10">
              <ArrowUp v-if="showFilter" />
              <ArrowDown v-else />
            </el-icon>
            <span v-if="activeTags.length" class="listing-sort__filter-badge">{{
              activeTags.length
            }}</span>
          </span>
        </div>
      </div>

      <div class="listing-promo">
        <span class="listing-promo__icon">🔥</span>
        <span class="listing-promo__text">百亿补贴专场</span>
        <span class="listing-promo__sep">|</span>
        <span class="listing-promo__desc">限时满300减50</span>
        <span class="listing-promo__more">查看更多 &gt;</span>
      </div>

      <div class="listing-main">
        <div class="listing-grid" :class="{ 'with-filter': showFilter }">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :show-location="true"
            :show-shop="true"
          />
        </div>

        <transition name="slide-filter">
          <div v-if="showFilter" class="listing-filter-sidebar">
            <div class="filter-sidebar__header">
              <h3>全部筛选</h3>
              <el-icon :size="20" @click="showFilter = false"><Close /></el-icon>
            </div>
            <div class="filter-sidebar__tabs">
              <span
                v-for="ft in filterTabs"
                :key="ft"
                class="filter-sidebar__tab"
                :class="{ active: activeFilterTab === ft }"
                @click="activeFilterTab = ft"
                >{{ ft }}</span
              >
            </div>
            <div class="filter-sidebar__content">
              <div v-if="activeFilterTab === '物流'" class="filter-sidebar__group">
                <label v-for="opt in logisticsOptions" :key="opt" class="filter-sidebar__checkbox">
                  <input type="checkbox" :value="opt" v-model="selectedFilters" />
                  <span>{{ opt }}</span>
                </label>
              </div>
              <div v-if="activeFilterTab === '优惠'" class="filter-sidebar__group">
                <label v-for="opt in promoOptions" :key="opt" class="filter-sidebar__checkbox">
                  <input type="checkbox" :value="opt" v-model="selectedFilters" />
                  <span>{{ opt }}</span>
                </label>
              </div>
              <div v-if="activeFilterTab === '品牌'" class="filter-sidebar__group">
                <label v-for="opt in brandOptions" :key="opt" class="filter-sidebar__checkbox">
                  <input type="checkbox" :value="opt" v-model="selectedFilters" />
                  <span>{{ opt }}</span>
                </label>
              </div>
              <div v-if="activeFilterTab === '热门分类'" class="filter-sidebar__group">
                <label
                  v-for="opt in hotCategoryOptions"
                  :key="opt"
                  class="filter-sidebar__checkbox"
                >
                  <input type="checkbox" :value="opt" v-model="selectedFilters" />
                  <span>{{ opt }}</span>
                </label>
              </div>
            </div>
            <div class="filter-sidebar__footer">
              <el-button @click="selectedFilters = []">重置筛选</el-button>
              <el-button type="primary" @click="showFilter = false">确定</el-button>
            </div>
          </div>
        </transition>
      </div>

      <div class="listing-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :page-size="20"
          :current-page="currentPage"
          @current-change="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search,
  Camera,
  ArrowDown,
  ArrowUp,
  Location,
  Grid,
  List,
  Filter,
  Close,
} from '@element-plus/icons-vue'
import { products, listingCategories, brandLogos } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const searchKeyword = ref(route.query.keyword || '家具')
const selectedCat = ref(null)
const activeTab = ref('全部')
const activeSort = ref('综合')
const activeTags = ref([])
const viewMode = ref('grid')
const showFilter = ref(false)
const activeFilterTab = ref('物流')
const selectedFilters = ref([])
const currentPage = ref(1)

const tabs = ['全部', '天猫', '淘宝', '旗舰店']
const sortOptions = [
  { key: '综合', label: '综合', hasArrow: false },
  { key: '销量', label: '销量', hasArrow: false },
  { key: '价格', label: '价格', hasArrow: true },
  { key: '区间', label: '区间', hasArrow: true },
]
const filterTags = ['包邮', '新品', '百亿补贴', '淘宝秒杀', '淘金币抵钱', '退货宝']
const filterTabs = ['物流', '优惠', '品牌', '热门分类']
const logisticsOptions = ['包邮', '退货宝', '7+天内退货', '24小时内发货', '48小时内发货']
const promoOptions = ['百亿补贴', '淘宝秒杀', '淘金币抵钱', '优惠券', '会员专享']
const brandOptions = ['源氏木语', '全友家居', '林氏木业', '顾家家居', '宜家']
const hotCategoryOptions = ['沙发', '床', '茶几', '书桌', '衣柜', '电视柜']

function toggleTag(tag) {
  const idx = activeTags.value.indexOf(tag)
  if (idx > -1) activeTags.value.splice(idx, 1)
  else activeTags.value.push(tag)
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push(`/products?keyword=${encodeURIComponent(searchKeyword.value.trim())}`)
  }
}
</script>

<style scoped>
.product-listing {
  background: var(--color-bg);
  min-height: 100vh;
}

.listing-search-bar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.listing-search-bar__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 56px;
}

.listing-search-bar__logo {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 20px;
}

.listing-search-bar__logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.listing-search-bar__search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.listing-search-input {
  width: 480px;
}

.listing-search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-pill) 0 0 var(--radius-pill);
  border: 2px solid var(--color-primary);
  box-shadow: none;
}

.listing-search-btn {
  height: 40px;
  padding: 0 24px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 var(--radius-pill) var(--radius-pill) 0;
  transition: background var(--transition-fast);
}

.listing-search-btn:hover {
  background: var(--color-primary-hover);
}

.listing-same-btn {
  height: 40px;
  padding: 0 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background var(--transition-fast);
}

.listing-same-btn:hover {
  background: var(--color-light-orange);
}

.listing-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

.listing-breadcrumb {
  padding: 12px 0;
}

.listing-categories {
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 0;
}

.listing-categories::-webkit-scrollbar {
  display: none;
}

.listing-categories__scroll {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
}

.listing-categories__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-btn);
  transition: background var(--transition-fast);
}

.listing-categories__item:hover,
.listing-categories__item.active {
  background: var(--color-light-orange);
}

.listing-categories__item-icon {
  font-size: 24px;
}

.listing-categories__item-name {
  font-size: 12px;
  color: var(--color-text-mid);
}

.listing-categories__brands {
  display: flex;
  gap: 12px;
  margin-left: 24px;
  padding-left: 24px;
  border-left: 1px solid var(--color-border);
}

.listing-categories__brand {
  font-size: 12px;
  color: var(--color-text-light);
  padding: 4px 8px;
  background: var(--color-warm-bg);
  border-radius: var(--radius-sm);
}

.listing-tabs {
  display: flex;
  align-items: center;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  gap: 32px;
  padding: 0 24px;
}

.listing-tabs__item {
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  padding-bottom: 10px;
  position: relative;
  transition: color var(--transition-fast);
}

.listing-tabs__item:hover,
.listing-tabs__item.active {
  color: var(--color-primary);
}

.listing-tabs__item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.listing-sort {
  display: flex;
  align-items: center;
  height: 44px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
  gap: 24px;
}

.listing-sort__left {
  display: flex;
  gap: 24px;
}

.listing-sort__item {
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: color var(--transition-fast);
}

.listing-sort__item:hover,
.listing-sort__item.active {
  color: var(--color-primary);
}

.listing-sort__item.active {
  font-weight: 600;
}

.listing-sort__tags {
  display: flex;
  gap: 12px;
}

.listing-sort__tag {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.listing-sort__tag:hover,
.listing-sort__tag.active {
  color: var(--color-primary);
  background: var(--color-light-orange);
  border: 1px solid var(--color-primary);
}

.listing-sort__right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.listing-sort__location,
.listing-sort__view {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
}

.listing-sort__filter-btn {
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: color var(--transition-fast);
}

.listing-sort__filter-btn:hover {
  color: var(--color-primary);
}

.listing-sort__filter-badge {
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

.listing-promo {
  height: 40px;
  background: linear-gradient(90deg, #fff5f0, #fff1e8, #fff5f0);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 8px;
  font-size: 12px;
}

.listing-promo__icon {
  font-size: 16px;
}

.listing-promo__text {
  color: var(--color-primary);
  font-weight: 600;
}

.listing-promo__sep {
  color: var(--color-warm-border);
}

.listing-promo__desc {
  color: var(--color-text-mid);
}

.listing-promo__more {
  margin-left: auto;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.listing-promo__more:hover {
  color: var(--color-primary);
}

.listing-main {
  display: flex;
  gap: 0;
  margin-top: 16px;
}

.listing-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  flex: 1;
  transition: all var(--transition-normal);
}

.listing-grid.with-filter {
  grid-template-columns: repeat(4, 1fr);
}

.listing-filter-sidebar {
  width: 320px;
  flex-shrink: 0;
  background: var(--color-bg);
  border-left: 1px solid var(--color-border);
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  max-height: 800px;
}

.filter-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

.filter-sidebar__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.filter-sidebar__tabs {
  display: flex;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
}

.filter-sidebar__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.filter-sidebar__tab:hover,
.filter-sidebar__tab.active {
  color: var(--color-primary);
}

.filter-sidebar__tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.filter-sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.filter-sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-sidebar__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-dark);
}

.filter-sidebar__checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.filter-sidebar__footer {
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--color-border);
}

.filter-sidebar__footer .el-button {
  flex: 1;
}

.listing-pagination {
  padding: 32px 0;
  display: flex;
  justify-content: center;
}

.slide-filter-enter-active,
.slide-filter-leave-active {
  transition: all var(--transition-normal);
}

.slide-filter-enter-from,
.slide-filter-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 1024px) {
  .listing-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .listing-grid.with-filter {
    grid-template-columns: repeat(2, 1fr);
  }
  .listing-search-input {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .listing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .listing-grid.with-filter {
    grid-template-columns: repeat(2, 1fr);
  }
  .listing-search-input {
    width: 100%;
  }
  .listing-search-bar__logo {
    display: none;
  }
  .listing-same-btn {
    display: none;
  }
  .listing-sort__tags {
    display: none;
  }
  .listing-filter-sidebar {
    width: 100%;
    margin-left: 0;
  }
}
</style>
