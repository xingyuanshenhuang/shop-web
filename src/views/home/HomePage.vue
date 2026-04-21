<template>
  <div class="homepage">
    <section class="banner-section">
      <el-carousel height="400px" :interval="4000" arrow="hover" indicator-position="outside">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-slide" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-overlay"></div>
            <div class="banner-content">
              <h1 class="banner-title">{{ banner.title }}</h1>
              <p class="banner-subtitle">{{ banner.subtitle }}</p>
              <el-button type="primary" size="large" round @click="$router.push(banner.link)">
                立即查看
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="category-section">
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          @click="$router.push('/products?category=' + cat.name)"
        >
          <div class="category-item__icon" :style="{ background: cat.color + '15' }">
            <span>{{ cat.icon }}</span>
          </div>
          <span class="category-item__name">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <section class="flash-sale-section">
      <div class="flash-sale">
        <div class="flash-sale__header">
          <div class="flash-sale__title">
            <span class="flash-sale__icon">⚡</span>
            <h2>限时秒杀</h2>
          </div>
          <div class="flash-sale__countdown">
            <span class="flash-sale__countdown-label">距结束</span>
            <span class="flash-sale__countdown-block">{{ countdown.hours }}</span>
            <span class="flash-sale__countdown-sep">:</span>
            <span class="flash-sale__countdown-block">{{ countdown.minutes }}</span>
            <span class="flash-sale__countdown-sep">:</span>
            <span class="flash-sale__countdown-block">{{ countdown.seconds }}</span>
          </div>
        </div>
        <div class="flash-sale__products">
          <div v-for="product in flashSaleProducts" :key="product.id" class="flash-sale__product">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <section class="recommend-section">
      <div class="recommend-header">
        <h2>为你推荐</h2>
        <router-link to="/products" class="recommend-header__more">查看全部 &gt;</router-link>
      </div>
      <div class="recommend-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { banners, categories, flashSaleProducts, products } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'

const countdown = ref({ hours: '03', minutes: '12', seconds: '45' })
let timer = null

function startCountdown() {
  let totalSeconds = 3 * 3600 + 12 * 60 + 45
  timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer)
      return
    }
    totalSeconds--
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    countdown.value = {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.homepage {
  padding-bottom: 32px;
}

.banner-section {
  max-width: 1440px;
  margin: 0 auto;
}

.banner-slide {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  padding-left: 128px;
  color: #fff;
}

.banner-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 24px;
}

:deep(.el-carousel__indicator.is-active button) {
  background-color: var(--color-primary);
}

:deep(.el-carousel__button) {
  width: 24px;
  height: 4px;
  border-radius: 2px;
}

.category-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 128px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 80px;
  transition: transform var(--transition-fast);
}

.category-item:hover {
  transform: translateY(-2px);
}

.category-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.category-item__name {
  font-size: 12px;
  color: var(--color-text-mid);
  white-space: nowrap;
}

.flash-sale-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
}

.flash-sale {
  background: var(--color-light-yellow);
  border-radius: var(--radius-modal);
  padding: 16px 24px;
}

.flash-sale__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.flash-sale__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flash-sale__title h2 {
  font-size: 18px;
  color: var(--color-primary);
  font-weight: 700;
}

.flash-sale__icon {
  font-size: 20px;
}

.flash-sale__countdown {
  display: flex;
  align-items: center;
  gap: 4px;
}

.flash-sale__countdown-label {
  font-size: 12px;
  color: var(--color-text-mid);
  margin-right: 4px;
}

.flash-sale__countdown-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-price);
}

.flash-sale__countdown-sep {
  font-weight: 700;
  color: var(--color-primary);
}

.flash-sale__products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.recommend-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 128px 0;
}

.recommend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.recommend-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.recommend-header__more {
  font-size: 14px;
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.recommend-header__more:hover {
  color: var(--color-primary);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .banner-content {
    padding-left: 32px;
  }
  .category-section {
    padding: 24px 32px;
  }
  .flash-sale-section {
    padding: 0 32px;
  }
  .recommend-section {
    padding: 32px 32px 0;
  }
  .flash-sale__products {
    grid-template-columns: repeat(2, 1fr);
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .banner-slide {
    height: 240px;
  }
  .banner-content {
    padding-left: 16px;
  }
  .banner-title {
    font-size: 24px;
  }
  .banner-subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }
  .category-section {
    padding: 16px;
  }
  .category-grid {
    gap: 12px;
  }
  .category-item {
    width: 60px;
  }
  .category-item__icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .flash-sale-section {
    padding: 0 16px;
  }
  .flash-sale__products {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .recommend-section {
    padding: 24px 16px 0;
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
