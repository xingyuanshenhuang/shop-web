<template>
  <div class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="product-card__image-wrap">
      <img :src="product.image" :alt="product.name" class="product-card__image" />
      <div class="product-card__fav" @click.stop="toggleFav">
        <el-icon :size="16"><Star /></el-icon>
      </div>
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name text-clamp-2">{{ product.name }}</h3>
      <div class="product-card__promo">
        <template v-if="hasPromoTags">
          <span
            v-for="(label, idx) in promoTags"
            :key="idx"
            class="product-card__promo-tag"
          >
            {{ label }}
          </span>
        </template>
      </div>
      <div class="product-card__meta">
        <div class="product-card__meta-left">
          <span
            class="product-card__price price"
            :class="{ 'price-sm': String(product.price).length > 4 }"
          >
            ¥{{ product.price }}
          </span>
          <span class="product-card__sold">{{ formatSold(product.sold) }}人购买</span>
        </div>
        <span class="product-card__same">同款</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star } from '@element-plus/icons-vue'

const props = defineProps({
  product: { type: Object, required: true },
})

const isFav = ref(false)

function toggleFav() {
  isFav.value = !isFav.value
}

const promoTags = computed(() => {
  const raw = props.product.promoTags
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()]
  return []
})

const hasPromoTags = computed(() => promoTags.value.length > 0)

function formatSold(num) {
  if (num >= 100000) return '10万+'
  if (num >= 10000) return Math.floor(num / 10000) + '万+'
  return num
}
</script>

<style scoped>
.product-card {
  width: 100%;
  background: var(--color-bg);
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
  padding-top: 100%;
  overflow: hidden;
  border-radius: 12px;
  margin: 8px auto 0;
  width: calc(100% - 16px);
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
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
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-card__name {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-dark);
  line-height: 18px;
  height: 36px;
  text-align: center;
}

.product-card__promo {
  min-height: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.product-card__promo-tag {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  line-height: 14px;
  color: #ff0036;
  border: 1px solid rgba(255, 0, 54, 0.2);
  border-radius: 2px;
  padding: 0 3px;
  white-space: nowrap;
}

.product-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.product-card__meta-left {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.product-card__price {
  font-size: 18px;
  white-space: nowrap;
}

.product-card__price.price-sm {
  font-size: 14px;
}

.product-card__sold {
  font-size: 11px;
  color: var(--color-text-light);
  white-space: nowrap;
}

.product-card__same {
  font-size: 11px;
  color: var(--color-text-light);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
