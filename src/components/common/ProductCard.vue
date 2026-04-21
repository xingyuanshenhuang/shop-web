<template>
  <div class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="product-card__image-wrap">
      <img :src="product.image" :alt="product.name" class="product-card__image" />
      <div v-if="product.tag" class="product-card__tag" :class="product.tag === '天猫' ? 'tmall' : 'taobao'">
        {{ product.tag }}
      </div>
      <div class="product-card__fav" @click.stop="toggleFav">
        <el-icon :size="16"><Star /></el-icon>
      </div>
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name text-clamp-2">{{ product.name }}</h3>
      <div class="product-card__price-row">
        <span class="product-card__price price" :class="{ 'price-sm': String(product.price).length > 4 }">
          ¥{{ product.price }}
        </span>
        <span class="product-card__original">¥{{ product.originalPrice }}</span>
        <span class="product-card__sold">{{ formatSold(product.sold) }}人付款</span>
      </div>
      <div v-if="showLocation && product.location" class="product-card__location">
        {{ product.location }}
      </div>
      <div v-if="showShop && product.shop" class="product-card__shop">
        {{ product.shop }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Star } from '@element-plus/icons-vue'

defineProps({
  product: { type: Object, required: true },
  showLocation: { type: Boolean, default: false },
  showShop: { type: Boolean, default: false }
})

const isFav = ref(false)

function toggleFav() {
  isFav.value = !isFav.value
}

function formatSold(num) {
  if (num >= 100000) return '10万+'
  if (num >= 10000) return Math.floor(num / 10000) + '万+'
  return num
}
</script>

<style scoped>
.product-card {
  width: 100%;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.product-card:hover {
  box-shadow: var(--shadow-card);
}

.product-card__image-wrap {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  color: #fff;
  font-weight: 500;
}

.product-card__tag.tmall {
  background: #FF0036;
}

.product-card__tag.taobao {
  background: #999;
}

.product-card__fav {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  color: var(--color-text-light);
  transition: all var(--transition-fast);
}

.product-card__fav:hover {
  color: var(--color-primary);
}

.product-card__info {
  padding: 12px;
}

.product-card__name {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-dark);
  line-height: 20px;
  height: 40px;
  margin-bottom: 8px;
}

.product-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: nowrap;
}

.product-card__price {
  font-size: 20px;
  white-space: nowrap;
}

.product-card__price.price-sm {
  font-size: 16px;
}

.product-card__original {
  font-size: 12px;
  color: var(--color-text-light);
  text-decoration: line-through;
  white-space: nowrap;
}

.product-card__sold {
  font-size: 12px;
  color: var(--color-text-light);
  margin-left: auto;
  white-space: nowrap;
}

.product-card__location,
.product-card__shop {
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
