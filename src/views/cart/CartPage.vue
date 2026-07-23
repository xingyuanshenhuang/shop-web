<template>
  <div class="cart-page">
    <!-- 购物车专用顶部栏 -->
    <div class="cart-topbar">
      <div class="cart-topbar__inner">
        <!-- 左侧：Logo + 购物车 -->
        <div class="cart-topbar__left">
          <router-link to="/" class="cart-logo">
            <span class="cart-logo__main">淘宝</span>
            <span class="cart-logo__sub">购物车</span>
          </router-link>
        </div>

        <!-- 右侧：简洁搜索框 -->
        <div class="cart-topbar__search">
          <div class="cart-search-mini">
            <el-input
              v-model="topSearchKeyword"
              placeholder="新款上衣"
              @keyup.enter="handleTopSearch"
            >
              <template #prefix>
                <el-icon class="cart-search-mini__icon"><Search /></el-icon>
              </template>
              <template #suffix>
                <el-icon class="cart-search-mini__camera" @click="handleTopSearchSimilar"
                  ><Camera
                /></el-icon>
              </template>
            </el-input>
            <button class="cart-search-mini__btn" @click="handleTopSearch">搜淘宝</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-page__inner">
      <!-- 标签行 -->
      <div class="cart-tabs">
        <div class="cart-tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          <el-icon><Grid /></el-icon>
          <span>全部商品</span>
          <span class="cart-tab__count">({{ cartStore.items.length }})</span>
        </div>
        <div
          class="cart-tab"
          :class="{ active: activeTab === 'discount' }"
          @click="activeTab = 'discount'"
        >
          <el-icon><Lightning /></el-icon>
          <span>降价</span>
        </div>
      </div>

      <div v-if="cartStore.items.length" class="cart-page__content">
        <!-- 左侧：筛选 + 商品列表 + 猜你喜欢 -->
        <div class="cart-left">
          <!-- 筛选工具栏 -->
          <div class="cart-toolbar">
            <div class="cart-toolbar__left">
              <el-checkbox v-model="allChecked" @change="cartStore.toggleAll($event)">
                全选
              </el-checkbox>
              <button
                class="toolbar-btn"
                :disabled="!cartStore.checkedCount"
                @click="handleMoveToFav"
              >
                移入收藏
              </button>
              <button
                class="toolbar-btn toolbar-btn--danger"
                :disabled="!cartStore.checkedCount"
                @click="handleBatchDelete"
              >
                删除
              </button>
            </div>
            <div class="cart-toolbar__right">
              <el-select
                v-model="filterCategory"
                placeholder="分类"
                size="small"
                clearable
                class="toolbar-select"
              >
                <el-option label="全部" value="" />
                <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
              </el-select>
              <el-select
                v-model="filterStatus"
                placeholder="状态"
                size="small"
                clearable
                class="toolbar-select"
              >
                <el-option label="全部" value="" />
                <el-option label="现货" value="stock" />
                <el-option label="降价" value="discount" />
              </el-select>
              <div class="toolbar-search">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索购物车商品"
                  size="small"
                  clearable
                  @keyup.enter="handleSearch"
                >
                  <template #suffix>
                    <el-icon class="toolbar-search__icon" @click="handleSearch"><Search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>
          </div>

          <!-- 全选与商品列表之间的分隔线 -->
          <div class="cart-toolbar-divider" />

          <!-- 商品列表 -->
          <div class="cart-list">
            <div v-for="item in filteredItems" :key="item.id" class="cart-item">
              <div class="cart-item__shop">
                <el-checkbox :model-value="item.checked" @change="cartStore.toggleCheck(item.id)" />
                <span class="shop-tag">{{ item.tag || '淘宝' }}</span>
                <span class="shop-name">{{ item.shop || '官方店铺' }}</span>
                <el-icon class="shop-arrow"><ArrowRight /></el-icon>
              </div>
              <div class="cart-item__body">
                <img
                  :src="item.image"
                  class="cart-item__image"
                  @click="$router.push(`/product/${item.productId}`)"
                />
                <div class="cart-item__info">
                  <h3 class="cart-item__name" @click="$router.push(`/product/${item.productId}`)">
                    {{ item.name }}
                  </h3>
                  <p class="cart-item__spec">{{ item.spec }}</p>
                  <div class="cart-item__promos">
                    <span
                      v-for="(promo, pIdx) in item.promoTags || []"
                      :key="pIdx"
                      class="promo-tag"
                    >
                      {{ promo }}
                    </span>
                  </div>
                </div>
                <div class="cart-item__price-wrap">
                  <div class="cart-item__price">
                    <span class="price-symbol">¥</span>
                    <span>{{ item.price }}</span>
                  </div>
                  <div v-if="item.originalPrice" class="cart-item__original">
                    ¥{{ item.originalPrice }}
                  </div>
                </div>
                <div class="cart-item__quantity">
                  <el-input-number
                    v-model="item.quantity"
                    :min="1"
                    :max="99"
                    size="small"
                    @change="cartStore.updateQuantity(item.id, $event)"
                  />
                </div>
                <div class="cart-item__subtotal">
                  <span class="price-symbol">¥</span>
                  <span>{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="cart-item__actions">
                  <button class="action-link" @click="handleMoveSingleToFav(item)">移入收藏</button>
                  <button
                    class="action-link action-link--delete"
                    @click="cartStore.removeItem(item.id)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 猜你喜欢 -->
          <div class="cart-recommend">
            <div class="recommend-header">
              <h2>猜你喜欢</h2>
              <router-link to="/products" class="recommend-header__more">查看全部 &gt;</router-link>
            </div>
            <div class="recommend-grid">
              <ProductCard
                v-for="product in recommendProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>

        <!-- 右侧结算明细（大屏显示） -->
        <div class="cart-summary">
          <div class="cart-summary__inner">
            <h3 class="cart-summary__title">结算明细</h3>
            <p class="cart-summary__tip">实际优惠金额以下单页为准</p>

            <div class="cart-summary__row">
              <span>商品总价</span>
              <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="cart-summary__row">
              <span>平台优惠</span>
              <span class="price price-sm">-¥{{ discountAmount.toFixed(2) }}</span>
            </div>
            <div class="cart-summary__row">
              <span>官方限时补贴</span>
              <span class="price price-sm">-¥{{ subsidyAmount.toFixed(2) }}</span>
            </div>
            <div class="cart-summary__row">
              <span>红包</span>
              <span class="price price-sm">-¥{{ redPacketAmount.toFixed(2) }}</span>
            </div>
            <el-divider />
            <div class="cart-summary__discount">
              <span>优惠共减</span>
              <span class="price price-sm">-¥{{ totalDiscount.toFixed(2) }}</span>
            </div>
            <div class="cart-summary__total">
              <div class="total-label">
                <span>合计：</span>
                <span class="price price-xl">¥{{ finalPrice.toFixed(2) }}</span>
              </div>
              <div class="total-discount">共减 ¥{{ totalDiscount.toFixed(2) }}</div>
            </div>
            <el-button
              type="primary"
              size="large"
              class="cart-summary__btn"
              :disabled="!cartStore.checkedCount"
              @click="$router.push('/checkout')"
            >
              结算({{ cartStore.checkedCount }})
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右下角固定结算框（小屏显示） -->
      <div class="cart-float-summary">
        <div class="cart-float-summary__main">
          <div class="cart-float-summary__left">
            <div class="cart-float-summary__total">
              <span class="total-text">合计：</span>
              <span class="price price-xl">¥{{ finalPrice.toFixed(2) }}</span>
            </div>
            <button class="cart-float-summary__toggle" @click="showDetail = !showDetail">
              <span>优惠明细</span>
              <el-icon :class="{ 'is-open': showDetail }"><ArrowUp /></el-icon>
            </button>
          </div>
          <el-button
            type="primary"
            size="large"
            class="cart-float-summary__btn"
            :disabled="!cartStore.checkedCount"
            @click="$router.push('/checkout')"
          >
            结算({{ cartStore.checkedCount }})
          </el-button>
        </div>

        <transition name="detail-slide">
          <div v-if="showDetail" class="cart-float-summary__detail">
            <div class="detail-row">
              <span>商品总价</span>
              <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>平台优惠</span>
              <span class="price price-sm">-¥{{ discountAmount.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>官方限时补贴</span>
              <span class="price price-sm">-¥{{ subsidyAmount.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>红包</span>
              <span class="price price-sm">-¥{{ redPacketAmount.toFixed(2) }}</span>
            </div>
            <div class="detail-row detail-row--total">
              <span>优惠共减</span>
              <span class="price price-sm">-¥{{ totalDiscount.toFixed(2) }}</span>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="!cartStore.items.length" class="cart-empty">
        <el-icon :size="64" color="#E0D6CE"><ShoppingCart /></el-icon>
        <p>购物车还是空的</p>
        <el-button type="primary" @click="$router.push('/products')">去逛逛</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  ShoppingCart,
  Search,
  Camera,
  Grid,
  Lightning,
  ArrowRight,
  ArrowUp,
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { products } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'

const router = useRouter()
const cartStore = useCartStore()
const activeTab = ref('all')
const filterCategory = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')
const topSearchKeyword = ref('')
const showDetail = ref(false)

function handleTopSearch() {
  const kw = topSearchKeyword.value.trim()
  if (kw) {
    router.push(`/products?keyword=${encodeURIComponent(kw)}`)
  }
}

function handleTopSearchSimilar() {
  router.push('/products?feature=image-search')
}

const allChecked = computed({
  get: () => cartStore.items.length > 0 && cartStore.items.every((i) => i.checked),
  set: () => {},
})

// 补充商品信息（店铺、标签、原价等）
const enrichedItems = computed(() => {
  return cartStore.items.map((item) => {
    const product = products.find((p) => p.id === item.productId) || {}
    return {
      ...item,
      tag: product.tag || '淘宝',
      shop: product.shop || '官方店铺',
      promoTags: product.promoTags || [],
      originalPrice: product.originalPrice,
    }
  })
})

const categoryOptions = computed(() => {
  const set = new Set(enrichedItems.value.map((i) => i.tag).filter(Boolean))
  return Array.from(set)
})

const filteredItems = computed(() => {
  let list = enrichedItems.value
  if (filterCategory.value) {
    list = list.filter((i) => i.tag === filterCategory.value)
  }
  if (filterStatus.value === 'discount') {
    list = list.filter((i) => i.originalPrice && i.originalPrice > i.price)
  }
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter((i) => i.name.toLowerCase().includes(kw))
  }
  return list
})

const recommendProducts = computed(() => products.slice(0, 12))

const discountAmount = ref(20)
const subsidyAmount = ref(100)
const redPacketAmount = ref(0)

const totalDiscount = computed(
  () => discountAmount.value + subsidyAmount.value + redPacketAmount.value,
)
const finalPrice = computed(() => Math.max(0, cartStore.totalPrice - totalDiscount.value))

function handleSearch() {
  // 已使用计算属性过滤，无需跳转
}

async function handleBatchDelete() {
  if (!cartStore.checkedCount) return
  try {
    await ElMessageBox.confirm('确定删除选中的商品吗？', '提示', { type: 'warning' })
    cartStore.batchRemove()
    ElMessage.success('已删除选中商品')
  } catch {
    // 取消
  }
}

async function handleMoveToFav() {
  if (!cartStore.checkedCount) return
  cartStore.moveToFavorites()
  ElMessage.success('已移入收藏夹')
}

function handleMoveSingleToFav(item) {
  cartStore.moveToFavorites([item.id])
  ElMessage.success('已移入收藏夹')
}
</script>

<style scoped>
.cart-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding-bottom: 40px;
}

.cart-topbar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.cart-topbar__inner {
  max-width: 1524px;
  min-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px 12px 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.cart-topbar__left {
  flex-shrink: 0;
}

.cart-logo {
  display: flex;
  align-items: baseline;
  gap: 8px;
  text-decoration: none;
}

.cart-logo__main {
  font-size: 36px;
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: 4px;
  line-height: 1;
}

.cart-logo__sub {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.cart-topbar__search {
  width: 320px;
  flex-shrink: 0;
}

.cart-search-mini {
  display: flex;
  align-items: center;
  height: 36px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-card);
  overflow: hidden;
  background: #fff;
}

.cart-search-mini :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none;
  border-radius: 0;
  background: #fff;
  padding: 0 8px;
}

.cart-search-mini :deep(.el-input__inner) {
  font-size: 13px;
  color: var(--color-text-dark);
}

.cart-search-mini__icon {
  color: var(--color-text-light);
  font-size: 14px;
}

.cart-search-mini__camera {
  color: var(--color-text-light);
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.cart-search-mini__camera:hover {
  color: var(--color-primary);
}

.cart-search-mini__btn {
  width: 72px;
  height: 100%;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.cart-search-mini__btn:hover {
  background: var(--color-primary-hover);
}

.cart-page__inner {
  max-width: 1524px;
  min-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px 24px 35px;
}

.cart-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.cart-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color 0.2s ease;
}

.cart-tab:hover {
  color: var(--color-primary);
}

.cart-tab.active {
  color: var(--color-primary);
  font-weight: 600;
}

.cart-tab .el-icon {
  font-size: 16px;
}

.cart-page__content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.cart-left {
  flex: 1;
  min-width: 0;
}

/* 工具栏 */
.cart-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  margin-bottom: 12px;
}

.cart-toolbar__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-btn {
  font-size: 13px;
  color: var(--color-text-dark);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  color: var(--color-primary);
}

.toolbar-btn:disabled {
  color: var(--color-text-light);
  cursor: not-allowed;
}

.toolbar-btn--danger:hover:not(:disabled) {
  color: var(--color-danger);
}

.cart-toolbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-select {
  width: 100px;
}

.toolbar-search {
  width: 200px;
}

.toolbar-search__icon {
  color: var(--color-text-light);
  cursor: pointer;
}

/* 全选与商品列表之间的分隔线 */
.cart-toolbar-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0;
}

/* 商品列表 */
.cart-list {
  background: #fff;
  border-radius: var(--radius-card);
  padding: 16px 16px 16px 0;
  margin-bottom: 16px;
}

.cart-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item:first-child {
  padding-top: 0;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cart-item__shop {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.shop-tag {
  font-size: 12px;
  color: var(--color-primary);
  background: #fff0e8;
  padding: 1px 4px;
  border-radius: 4px;
}

.shop-name {
  font-size: 13px;
  color: var(--color-text-dark);
  font-weight: 500;
}

.shop-arrow {
  font-size: 12px;
  color: var(--color-text-light);
}

.cart-item__body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-item__image {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
}

.cart-item__info {
  flex: 1;
  min-width: 0;
}

.cart-item__name {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-dark);
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item__name:hover {
  color: var(--color-primary);
}

.cart-item__spec {
  font-size: 12px;
  color: var(--color-text-light);
  margin-top: 6px;
}

.cart-item__promos {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.promo-tag {
  font-size: 11px;
  color: #ff0036;
  border: 1px solid rgba(255, 0, 54, 0.2);
  border-radius: 2px;
  padding: 0 4px;
}

.cart-item__price-wrap {
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.cart-item__price {
  font-size: 14px;
  color: var(--color-text-dark);
}

.cart-item__price .price-symbol {
  font-size: 11px;
}

.cart-item__original {
  font-size: 12px;
  color: var(--color-text-light);
  text-decoration: line-through;
  margin-top: 2px;
}

.cart-item__quantity {
  width: 120px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.cart-item__subtotal {
  width: 100px;
  text-align: center;
  font-size: 16px;
  color: var(--color-primary);
  font-weight: 600;
  flex-shrink: 0;
}

.cart-item__subtotal .price-symbol {
  font-size: 12px;
}

.cart-item__actions {
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-link {
  font-size: 13px;
  color: var(--color-text-mid);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.action-link:hover {
  color: var(--color-primary);
}

.action-link--delete:hover {
  color: var(--color-danger);
}

/* 右侧结算明细（大屏显示） */
.cart-summary {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 16px;
}

.cart-summary__inner {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px;
}

.cart-summary__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.cart-summary__tip {
  font-size: 11px;
  color: var(--color-text-light);
  margin-bottom: 16px;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-text-mid);
  margin-bottom: 10px;
}

.cart-summary__discount {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-mid);
  margin-bottom: 12px;
}

.cart-summary__total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 16px;
}

.total-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-dark);
}

.total-discount {
  font-size: 12px;
  color: var(--color-primary);
  margin-top: 2px;
}

.cart-summary__btn {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-card);
  font-size: 16px;
  font-weight: 700;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.cart-summary__btn:disabled {
  background: #ccc;
  border-color: #ccc;
}

/* 右下角固定结算框（小屏显示） */
.cart-float-summary {
  display: none;
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  min-width: 320px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 16px 20px;
  box-sizing: border-box;
}

.cart-float-summary__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cart-float-summary__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-float-summary__total {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 16px;
  color: var(--color-text-dark);
}

.cart-float-summary__total .price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.cart-float-summary__total .price-symbol {
  font-size: 16px;
}

.cart-float-summary__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.cart-float-summary__toggle:hover {
  color: var(--color-primary-hover);
}

.cart-float-summary__toggle .el-icon {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.cart-float-summary__toggle .el-icon.is-open {
  transform: rotate(180deg);
}

.cart-float-summary__btn {
  height: 44px;
  padding: 0 28px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 700;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.cart-float-summary__btn:disabled {
  background: #ccc;
  border-color: #ccc;
}

.cart-float-summary__detail {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-border);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-text-mid);
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row--total {
  font-weight: 600;
  color: var(--color-text-dark);
  margin-top: 4px;
}

/* 优惠明细展开动画 */
.detail-slide-enter-active,
.detail-slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.detail-slide-enter-from,
.detail-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

/* 猜你喜欢 */
.cart-recommend {
  margin-top: 24px;
}

.recommend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.recommend-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.recommend-header__more {
  font-size: 13px;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.recommend-header__more:hover {
  color: var(--color-primary);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

/* 空状态 */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  background: #fff;
  border-radius: var(--radius-card);
}

.cart-empty p {
  font-size: 16px;
  color: var(--color-text-light);
}

/* 响应式 */
@media (max-width: 1280px) {
  .cart-topbar__inner {
    min-width: auto;
    padding: 16px 12px 12px;
  }

  .cart-page__inner {
    padding: 16px 12px 24px;
  }

  .recommend-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .cart-topbar__inner {
    min-width: auto;
  }

  .cart-page__inner {
    min-width: auto;
    padding: 16px 12px 120px;
  }

  .cart-page__content {
    flex-direction: column;
  }

  .cart-summary {
    display: none;
  }

  .cart-float-summary {
    display: block;
  }

  .recommend-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .cart-topbar__inner {
    padding: 12px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .cart-logo__main {
    font-size: 28px;
  }

  .cart-logo__sub {
    font-size: 18px;
  }

  .cart-topbar__search {
    width: 100%;
  }

  .cart-page__inner {
    padding: 16px 12px 100px;
  }

  .cart-float-summary {
    left: 12px;
    right: 12px;
    bottom: 12px;
    min-width: auto;
    border-radius: 20px;
    padding: 12px 16px;
  }

  .cart-float-summary__total .price {
    font-size: 20px;
  }

  .cart-float-summary__btn {
    padding: 0 20px;
    height: 40px;
    border-radius: 20px;
  }

  .cart-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .cart-toolbar__right {
    width: 100%;
    flex-wrap: wrap;
  }

  .toolbar-search {
    flex: 1;
    min-width: 160px;
  }

  .cart-item__body {
    flex-wrap: wrap;
  }

  .cart-item__price-wrap,
  .cart-item__quantity,
  .cart-item__subtotal,
  .cart-item__actions {
    width: auto;
  }

  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
