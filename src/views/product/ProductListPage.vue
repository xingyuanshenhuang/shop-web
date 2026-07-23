<template>
  <div class="product-listing">
    <!-- 顶部搜索栏：复用首页搜索栏组件 -->
    <HomeSearchBar :show-bonus="false" />

    <div class="listing-content">
      <div class="listing-breadcrumb">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">家居</el-breadcrumb-item>
          <el-breadcrumb-item>家具</el-breadcrumb-item>
          <el-breadcrumb-item>沙发</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 上部筛选区：类目特定图文选项 -->
      <div v-if="matchedTopFilter" class="top-category-filter">
        <div class="top-category-filter__title">{{ matchedTopFilter.label }}</div>
        <div class="top-category-filter__list">
          <div
            v-for="option in matchedTopFilter.options"
            :key="option.id"
            class="top-category-filter__item"
            :class="{ active: selectedTopOption === option.id }"
            @click="selectTopOption(option.id)"
          >
            <img :src="option.image" :alt="option.name" loading="lazy" />
            <span>{{ option.name }}</span>
          </div>
        </div>
      </div>

      <!-- 下部筛选区：保持与当前筛选栏基本一致 -->
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

      <div class="listing-toolbar">
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
        <div class="listing-toolbar__right">
          <span class="listing-toolbar__view">
            <el-icon :size="16" :color="viewMode === 'grid' ? '#FF5000' : '#CCC'"><Grid /></el-icon>
            <el-icon
              :size="16"
              :color="viewMode === 'list' ? '#FF5000' : '#CCC'"
              style="margin-left: 4px"
              ><List
            /></el-icon>
          </span>
          <span class="listing-toolbar__filter-btn" @click="showFilter = !showFilter">
            <el-icon :size="14"><Filter /></el-icon>
            筛选
            <el-icon :size="10">
              <ArrowUp v-if="showFilter" />
              <ArrowDown v-else />
            </el-icon>
            <span v-if="selectedFilters.length" class="listing-toolbar__filter-badge">{{
              selectedFilters.length
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
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Grid, List, Close, Filter, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { products, listingCategories, brandLogos, categoryTopFilters } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'
import HomeSearchBar from '@/components/common/HomeSearchBar.vue'

const route = useRoute()
const router = useRouter()

const selectedCat = ref(null)
const activeTab = ref('全部')
const viewMode = ref('grid')
const activeFilterTab = ref('物流')
const selectedFilters = ref([])
const currentPage = ref(1)

// 筛选面板展开状态由固定导航栏写入路由查询，页面同步读取
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

// 顶部类目特定图文筛选
const selectedTopOption = ref(route.query.subCategory || null)

const matchedTopFilter = computed(() => {
  const keyword = String(route.query.keyword || '').trim()
  const category = String(route.query.category || '')
    .trim()
    .toLowerCase()

  return (
    categoryTopFilters.find((item) => {
      const matchKeyword = keyword && item.keywords.includes(keyword)
      const matchCategory =
        category && (item.key.toLowerCase() === category || item.queryCategories.includes(category))
      return matchKeyword || matchCategory
    }) || null
  )
})

function selectTopOption(optionId) {
  if (selectedTopOption.value === optionId) {
    selectedTopOption.value = null
  } else {
    selectedTopOption.value = optionId
  }

  const query = { ...route.query }
  if (selectedTopOption.value) {
    query.subCategory = selectedTopOption.value
  } else {
    delete query.subCategory
  }
  router.push({ path: '/products', query })
}

// 当搜索关键词或分类变化时，清空已选顶部子选项
watch(
  () => [route.query.keyword, route.query.category],
  (newVal, oldVal) => {
    if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
      selectedTopOption.value = null
    }
  },
)

const tabs = ['全部', '天猫', '淘宝', '旗舰店']
const filterTabs = ['物流', '优惠', '品牌', '热门分类']
const logisticsOptions = ['包邮', '退货宝', '7+天内退货', '24小时内发货', '48小时内发货']
const promoOptions = ['百亿补贴', '淘宝秒杀', '淘金币抵钱', '优惠券', '会员专享']
const brandOptions = ['源氏木语', '全友家居', '林氏木业', '顾家家居', '宜家']
const hotCategoryOptions = ['沙发', '床', '茶几', '书桌', '衣柜', '电视柜']
</script>

<style scoped>
.product-listing {
  background: var(--color-bg);
  min-height: 100vh;
}

.listing-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

.listing-breadcrumb {
  padding: 12px 0;
}

/* ===== 新增：顶部类目特定图文筛选区 ===== */
.top-category-filter {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0 16px;
  margin-bottom: 8px;
}

.top-category-filter__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 12px;
}

.top-category-filter__list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.top-category-filter__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-btn);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.15s ease;
}

.top-category-filter__item:hover,
.top-category-filter__item.active {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

.top-category-filter__item.active span {
  color: var(--color-primary);
  font-weight: 600;
}

.top-category-filter__item img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.top-category-filter__item span {
  font-size: 13px;
  color: var(--color-text-mid);
  white-space: nowrap;
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

.listing-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
}

.listing-tabs {
  display: flex;
  align-items: center;
  gap: 32px;
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

.listing-toolbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.listing-toolbar__view {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
}

.listing-toolbar__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-mid);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.listing-toolbar__filter-btn:hover {
  color: var(--color-primary);
  background: var(--color-light-orange);
}

.listing-toolbar__filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  border-radius: 8px;
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
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  flex: 1;
  transition: all var(--transition-normal);
}

.listing-grid.with-filter {
  grid-template-columns: repeat(5, 1fr);
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

@media (max-width: 1280px) {
  .listing-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  .listing-grid.with-filter {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .listing-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .listing-grid.with-filter {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .top-category-filter__list {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .top-category-filter__list::-webkit-scrollbar {
    display: none;
  }

  .listing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .listing-grid.with-filter {
    grid-template-columns: repeat(2, 1fr);
  }
  .listing-filter-sidebar {
    width: 100%;
    margin-left: 0;
  }
}
</style>
