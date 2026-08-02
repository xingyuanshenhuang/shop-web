<template>
  <div class="product-detail">
    <div class="product-detail__inner">
      <div class="product-detail__left">
        <div class="product-detail__gallery">
          <div class="gallery-thumbs">
            <div
              v-for="(img, idx) in detail.images"
              :key="idx"
              class="gallery-thumbs__item"
              :class="{ active: currentImage === idx }"
              @mouseenter="currentImage = idx"
            >
              <img :src="img" :alt="`缩略图${idx + 1}`" />
            </div>
          </div>
          <div
            class="gallery-main"
            @mouseenter="showMagnifier = true"
            @mouseleave="showMagnifier = false"
            @mousemove="handleMouseMove"
          >
            <img
              :src="detail.images[currentImage]"
              alt="商品主图"
              class="gallery-main__img"
              ref="mainImg"
            />
            <div v-if="showMagnifier" class="gallery-magnifier__mask" :style="maskStyle"></div>
          </div>
        </div>
        <div class="gallery-actions">
          <el-icon :size="16"><Star /></el-icon>
          <span>收藏</span>
          <el-divider direction="vertical" />
          <el-icon :size="16"><Share /></el-icon>
          <span>分享</span>
          <span style="margin-left: auto; font-size: 12px; color: var(--color-text-light)"
            >{{ currentImage + 1 }}/{{ detail.images.length }}</span
          >
        </div>

        <div class="product-detail__shop-bar">
          <span class="shop-bar__name">{{ detail.shop.name }}</span>
          <span class="shop-bar__divider">|</span>
          <span class="shop-bar__rating">评分 {{ detail.shop.rating }}</span>
          <span class="shop-bar__divider">|</span>
          <span class="shop-bar__good-rate" style="color: var(--color-success)"
            >好评率 {{ detail.shop.goodRate }}</span
          >
          <span class="shop-bar__divider">|</span>
          <span class="shop-bar__ship">平均发货 {{ detail.shop.shipTime }}</span>
        </div>

        <div class="product-detail__tabs">
          <div
            v-for="tab in detailTabs"
            :key="tab"
            class="detail-tab"
            :class="{ active: activeDetailTab === tab }"
            @click="activeDetailTab = tab"
          >
            {{ tab }}
          </div>
        </div>

        <div class="product-detail__tab-content">
          <div v-if="activeDetailTab === '用户评价'" class="review-section">
            <div class="review-header">
              <h3>用户评价 {{ detail.reviewCount }}+</h3>
              <span style="color: var(--color-success); font-size: 12px"
                >近3个月好评率 {{ detail.goodRate }}</span
              >
              <a
                style="
                  margin-left: auto;
                  font-size: 12px;
                  color: var(--color-text-light);
                  cursor: pointer;
                "
                >查看全部评价 &gt;</a
              >
            </div>
            <div class="review-tags">
              <span
                v-for="tag in reviewTags"
                :key="tag.label"
                class="review-tag"
                :class="{ active: activeReviewTag === tag.label }"
                @click="activeReviewTag = tag.label"
              >
                {{ tag.label }}（{{ tag.count }}+）
              </span>
            </div>
            <div v-for="review in detail.reviews" :key="review.id" class="review-card">
              <div class="review-card__user">
                <img :src="review.avatar" class="review-card__avatar" />
                <span class="review-card__name">{{ review.user }}</span>
                <span class="review-card__date">{{ review.date }}</span>
              </div>
              <div class="review-card__rating">
                <el-rate
                  v-model="review.rating"
                  disabled
                  :colors="['#FF8547', '#FF8547', '#FF8547']"
                  size="small"
                />
              </div>
              <p class="review-card__content">{{ review.content }}</p>
              <div v-if="review.images.length" class="review-card__images">
                <img
                  v-for="(img, idx) in review.images"
                  :key="idx"
                  :src="img"
                  class="review-card__img"
                />
              </div>
            </div>
            <div style="text-align: center; padding: 16px">
              <el-button>查看全部评价</el-button>
            </div>
          </div>

          <div v-if="activeDetailTab === '参数信息'" class="params-section">
            <div class="params-grid">
              <div v-for="param in detail.params" :key="param.label" class="params-item">
                <span class="params-item__label">{{ param.label }}</span>
                <span class="params-item__value">{{ param.value }}</span>
              </div>
            </div>
          </div>

          <div v-if="activeDetailTab === '图文详情'" class="detail-images-section">
            <div class="detail-images-section__block">
              <h3>品牌故事</h3>
              <p>源氏木语 — 只做纯实木家具，让每一个家庭都能享受自然之美。</p>
              <img
                src="https://picsum.photos/seed/brand/800/400"
                style="width: 100%; border-radius: 8px; margin-top: 12px"
              />
            </div>
            <div class="detail-images-section__block">
              <h3>产品卖点</h3>
              <img
                src="https://picsum.photos/seed/features/800/600"
                style="width: 100%; border-radius: 8px"
              />
            </div>
            <div class="detail-images-section__block">
              <h3>资质认证</h3>
              <img
                src="https://picsum.photos/seed/cert/800/300"
                style="width: 100%; border-radius: 8px"
              />
            </div>
          </div>

          <div v-if="activeDetailTab === '本店推荐'" class="recommend-section">
            <div class="recommend-grid">
              <ProductCard
                v-for="product in recommendProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="product-detail__right" ref="rightColRef">
        <div class="right-sticky" :style="stickyStyle">
          <div
            v-if="showMagnifier"
            ref="zoomEl"
            class="gallery-zoom"
            :style="{ backgroundImage: `url(${detail.images[currentImage]})`, ...zoomBgStyle }"
          ></div>
          <div class="promo-tip">
            <span>您有 50 元消费券待使用</span>
            <span style="color: var(--color-text-light)">距结束 3天12小时</span>
          </div>

          <div class="product-info">
            <el-tag type="danger" effect="plain" size="small" style="margin-bottom: 8px">{{
              detail.brand
            }}</el-tag>
            <h2 class="product-info__name text-clamp-2">{{ detail.name }}</h2>
            <div class="product-info__meta">
              <span class="product-info__sold">已售 {{ detail.sold }}+</span>
              <span class="product-info__review-hint">多人评价"隔音效果很好"</span>
            </div>
            <div class="product-info__rating">
              <el-rate
                v-model="detail.rating"
                disabled
                :colors="['#FF8547', '#FF8547', '#FF8547']"
                size="small"
              />
            </div>
            <div class="product-info__price-row">
              <span class="product-info__price price price-xl">¥{{ detail.price }}</span>
              <span class="product-info__original">¥{{ detail.originalPrice }}</span>
              <el-tag type="danger" size="small" effect="dark" style="margin-left: 8px">{{
                detail.discount
              }}</el-tag>
            </div>
            <el-tag effect="plain" type="warning" size="small">限时活动 4月19日 24点结束</el-tag>
          </div>

          <div class="service-bar">
            <span v-for="(svc, idx) in detail.services" :key="svc" class="service-bar__item">
              {{ svc }}
              <span v-if="idx < detail.services.length - 1" class="service-bar__divider">|</span>
            </span>
          </div>

          <div class="spec-selector">
            <div class="spec-row">
              <span class="spec-row__label">颜色分类</span>
              <div class="spec-row__options">
                <div
                  v-for="color in detail.colors"
                  :key="color.name"
                  class="spec-color"
                  :class="{ active: selectedColor === color.name, hot: color.hot }"
                  @click="selectedColor = color.name"
                >
                  <img :src="color.image" class="spec-color__img" />
                  <span>{{ color.name }}</span>
                  <span v-if="color.hot" class="spec-color__hot">热销</span>
                </div>
              </div>
            </div>
            <div class="spec-row">
              <span class="spec-row__label">尺码</span>
              <div class="spec-row__options">
                <span
                  v-for="size in detail.sizes"
                  :key="size"
                  class="spec-size"
                  :class="{ active: selectedSize === size }"
                  @click="selectedSize = size"
                  >{{ size }}</span
                >
              </div>
            </div>
            <div class="spec-row">
              <span class="spec-row__label">数量</span>
              <div class="spec-quantity">
                <el-input-number v-model="quantity" :min="1" :max="99" size="small" />
                <span style="font-size: 12px; color: var(--color-success); margin-left: 8px"
                  >有货</span
                >
              </div>
            </div>
          </div>

          <div class="cta-area">
            <button class="cta-cart" @click="handleAddCart">
              <el-icon :size="20" color="#fff"><ShoppingCart /></el-icon>
            </button>
            <button class="cta-buy">立即购买</button>
            <button class="cta-fav" @click="handleToggleFavorite">
              <el-icon :size="20" :color="favoritesStore.isFavorite(detail.id) ? '#FF5000' : '#666'">
                <StarFilled v-if="favoritesStore.isFavorite(detail.id)" />
                <Star v-else />
              </el-icon>
              <span>{{ favoritesStore.isFavorite(detail.id) ? '已收藏' : '收藏' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-cta show-on-mobile-only">
      <button class="mobile-cta__cart" @click="handleAddCart">加入购物车</button>
      <button class="mobile-cta__buy">立即购买</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Star, StarFilled, ShoppingCart, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { productDetail, products as allProducts } from '@/mock/data'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import ProductCard from '@/components/common/ProductCard.vue'

const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const detail = reactive({ ...productDetail })
const currentImage = ref(0)
const showMagnifier = ref(false)
const selectedColor = ref('原木色')
const selectedSize = ref('1.3m')
const quantity = ref(1)
const activeDetailTab = ref('用户评价')
const activeReviewTag = ref('全部')
const maskPos = reactive({ x: 0, y: 0 })
const mainImg = ref(null)
const zoomEl = ref(null)
const zoomSize = reactive({ w: 450, h: 450 })

// ===== 右侧栏固定定位 =====
// 使用 position: fixed 让右侧商品信息栏始终固定在视口顶部附近
// 宽度与 right 通过 JS 动态计算，以对齐右侧栏在 flex 布局中的位置
// top 动态调整：页面顶部时让出 TopUtilityBar（36px）的高度，滚动后贴近视口顶部
const rightColRef = ref(null)
const stickyStyle = reactive({ width: '', right: '', top: '60px' })
let resizeObserver = null

function updateStickyPosition() {
  if (!rightColRef.value) return
  const rect = rightColRef.value.getBoundingClientRect()
  stickyStyle.width = rect.width + 'px'
  stickyStyle.right = window.innerWidth - rect.right + 'px'
  // TopUtilityBar 高 36px、static 定位（会随滚动消失）；
  // 在页面顶部 top=60（36+24 间距）避免遮挡；滚动 36px 后贴顶 24px
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  stickyStyle.top = Math.max(24, 60 - scrollTop) + 'px'
}

const detailTabs = ['用户评价', '参数信息', '图文详情', '本店推荐', '看了又看']
const reviewTags = [
  { label: '全部', count: 300 },
  { label: '有图', count: 200 },
  { label: '隔音效果好', count: 150 },
  { label: '舒适', count: 80 },
]
const recommendProducts = allProducts.slice(4, 8)

const maskStyle = computed(() => ({
  left: maskPos.x + 'px',
  top: maskPos.y + 'px',
  width: '180px',
  height: '180px',
}))

const zoomBgStyle = computed(() => {
  const scaleX = zoomSize.w / 180
  const scaleY = zoomSize.h / 180
  return {
    backgroundPosition: `${-maskPos.x * scaleX}px ${-maskPos.y * scaleY}px`,
    backgroundSize: `${450 * scaleX}px ${450 * scaleY}px`,
  }
})

function updateZoomSize() {
  if (zoomEl.value) {
    zoomSize.w = zoomEl.value.clientWidth || 450
    zoomSize.h = zoomEl.value.clientHeight || 450
  }
}

function handleMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  let x = e.clientX - rect.left - 90
  let y = e.clientY - rect.top - 90
  x = Math.max(0, Math.min(x, rect.width - 180))
  y = Math.max(0, Math.min(y, rect.height - 180))
  maskPos.x = x
  maskPos.y = y
}

watch(showMagnifier, (val) => {
  if (val) {
    nextTick(updateZoomSize)
  }
})

onMounted(() => {
  window.addEventListener('resize', updateZoomSize)
  // 初始化右侧栏固定定位，并监听 scroll/resize/容器尺寸变化
  updateStickyPosition()
  window.addEventListener('resize', updateStickyPosition)
  window.addEventListener('scroll', updateStickyPosition, { passive: true })
  if (rightColRef.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(updateStickyPosition)
    resizeObserver.observe(rightColRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateZoomSize)
  window.removeEventListener('resize', updateStickyPosition)
  window.removeEventListener('scroll', updateStickyPosition)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

function handleAddCart() {
  ElMessage.success('已加入购物车')
}

function handleToggleFavorite() {
  if (favoritesStore.isFavorite(detail.id)) {
    favoritesStore.removeFavorite(detail.id)
    ElMessage.success('已取消收藏')
  } else {
    favoritesStore.addFavorite({
      id: detail.id,
      name: detail.name,
      price: detail.price,
      image: detail.images[0],
    })
    ElMessage.success('已添加到收藏夹')
  }
}
</script>

<style scoped>
.product-detail {
  background: var(--color-bg);
  min-height: 100vh;
  padding-bottom: 32px;
}

.product-detail__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 128px;
  display: flex;
  gap: 32px;
}

.product-detail__left {
  flex: 0 0 60%;
}

.product-detail__right {
  flex: 0 0 calc(40% - 32px);
}

.right-sticky {
  position: fixed;
  top: 24px;
  z-index: 20;
}

.product-detail__gallery {
  display: flex;
  gap: 12px;
}

.gallery-thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-thumbs__item {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: var(--radius-btn);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.gallery-thumbs__item.active {
  border-color: var(--color-primary);
}

.gallery-thumbs__item:hover {
  border-color: var(--color-primary);
}

.gallery-thumbs__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-main {
  width: 450px;
  height: 450px;
  border-radius: var(--radius-card);
  overflow: hidden;
  position: relative;
  cursor: crosshair;
}

.gallery-main__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-magnifier__mask {
  position: absolute;
  background: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.gallery-zoom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  background-repeat: no-repeat;
  background-color: #fff;
  z-index: 30;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  pointer-events: none;
}

.gallery-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 12px;
  color: var(--color-text-light);
  cursor: pointer;
}

.product-detail__shop-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 12px;
  color: var(--color-text-mid);
  border-bottom: 1px solid var(--color-border);
}

.shop-bar__name {
  font-weight: 600;
  color: var(--color-text-dark);
}

.shop-bar__divider {
  color: var(--color-border);
}

.product-detail__tabs {
  display: flex;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
}

.detail-tab {
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.detail-tab:hover,
.detail-tab.active {
  color: var(--color-primary);
}

.detail-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.product-detail__tab-content {
  padding: 24px 0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.review-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.review-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.review-tag {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.review-tag:hover,
.review-tag.active {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.review-card {
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.review-card__user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.review-card__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.review-card__name {
  font-size: 14px;
  color: var(--color-text-dark);
}

.review-card__date {
  font-size: 12px;
  color: var(--color-text-light);
  margin-left: auto;
}

.review-card__content {
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-dark);
  margin-bottom: 8px;
}

.review-card__images {
  display: flex;
  gap: 8px;
}

.review-card__img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-btn);
  object-fit: cover;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.params-item {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.params-item__label {
  color: var(--color-text-light);
  min-width: 60px;
}

.params-item__value {
  color: var(--color-text-dark);
}

.detail-images-section__block {
  margin-bottom: 32px;
}

.detail-images-section__block h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.promo-tip {
  background: var(--color-light-yellow);
  border-radius: var(--radius-btn);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.product-info {
  background: var(--color-bg);
  padding: 16px;
  border-radius: var(--radius-card);
  margin-bottom: 16px;
}

.product-info__name {
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  margin-bottom: 8px;
}

.product-info__meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.product-info__price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 12px 0;
}

.product-info__original {
  font-size: 16px;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.service-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-light);
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.service-bar__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-bar__divider {
  color: var(--color-border);
  margin: 0 8px;
}

.spec-selector {
  padding: 16px 0;
}

.spec-row {
  margin-bottom: 16px;
}

.spec-row__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  display: block;
  margin-bottom: 8px;
}

.spec-row__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spec-color {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-fast);
  font-size: 12px;
  color: var(--color-text-mid);
}

.spec-color:hover,
.spec-color.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-light-orange);
}

.spec-color__img {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.spec-color__hot {
  position: absolute;
  top: -6px;
  right: -4px;
  background: var(--color-primary);
  color: #fff;
  font-size: 10px;
  padding: 0 4px;
  border-radius: var(--radius-pill);
}

.spec-size {
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  font-size: 12px;
  transition: all var(--transition-fast);
}

.spec-size:hover,
.spec-size.active {
  background: var(--color-primary);
  color: #fff;
}

.spec-quantity {
  display: flex;
  align-items: center;
}

.cta-area {
  display: flex;
  height: 48px;
  border-radius: var(--radius-card);
  overflow: hidden;
  margin-top: 16px;
}

.cta-cart {
  width: 25%;
  background: linear-gradient(135deg, #ffb800, #ff9500);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter var(--transition-fast);
}

.cta-cart:hover {
  filter: brightness(0.9);
}

.cta-buy {
  width: 55%;
  background: linear-gradient(135deg, #ff5000, #e04800);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: filter var(--transition-fast);
}

.cta-buy:hover {
  filter: brightness(0.9);
}

.cta-fav {
  width: 20%;
  background: var(--color-bg);
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  font-size: 11px;
  color: var(--color-text-mid);
  transition: color var(--transition-fast);
}

.cta-fav:hover {
  color: var(--color-primary);
}

.mobile-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  background: var(--color-bg);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.mobile-cta__cart,
.mobile-cta__buy {
  flex: 1;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.mobile-cta__cart {
  background: linear-gradient(135deg, #ffb800, #ff9500);
  color: #fff;
}

.mobile-cta__buy {
  background: linear-gradient(135deg, #ff5000, #e04800);
  color: #fff;
}

@media (max-width: 1024px) {
  .product-detail__inner {
    padding: 24px 32px;
  }
  .gallery-main {
    width: 350px;
    height: 350px;
  }
  .gallery-zoom {
    display: none;
  }
  .params-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-detail__inner {
    flex-direction: column;
    padding: 16px;
  }
  .product-detail__left,
  .product-detail__right {
    flex: 1 1 auto;
  }
  .gallery-thumbs {
    display: none;
  }
  .gallery-main {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
  .gallery-zoom {
    display: none;
  }
  .product-info__name {
    font-size: 18px;
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .params-grid {
    grid-template-columns: 1fr;
  }
}
</style>
