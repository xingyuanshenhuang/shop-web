<template>
  <div class="cart-page">
    <div class="cart-page__inner">
      <h1 class="cart-page__title">购物车</h1>

      <div class="cart-page__content" v-if="cartStore.items.length">
        <div class="cart-list">
          <div class="cart-list__header">
            <el-checkbox v-model="allChecked" @change="cartStore.toggleAll($event)"
              >全选</el-checkbox
            >
            <span class="cart-list__col">商品信息</span>
            <span class="cart-list__col-price">单价</span>
            <span class="cart-list__col-qty">数量</span>
            <span class="cart-list__col-total">小计</span>
            <span class="cart-list__col-action">操作</span>
          </div>

          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <el-checkbox :model-value="item.checked" @change="cartStore.toggleCheck(item.id)" />
            <div class="cart-item__product">
              <img
                :src="item.image"
                class="cart-item__image"
                @click="$router.push(`/product/${item.productId}`)"
              />
              <div class="cart-item__info">
                <h3
                  class="cart-item__name text-truncate"
                  @click="$router.push(`/product/${item.productId}`)"
                >
                  {{ item.name }}
                </h3>
                <p class="cart-item__spec">{{ item.spec }}</p>
              </div>
            </div>
            <span class="cart-item__price price price-sm">¥{{ item.price }}</span>
            <div class="cart-item__quantity">
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="cartStore.updateQuantity(item.id, $event)"
              />
            </div>
            <span class="cart-item__total price"
              >¥{{ (item.price * item.quantity).toFixed(2) }}</span
            >
            <el-icon class="cart-item__delete" :size="18" @click="cartStore.removeItem(item.id)"
              ><Delete
            /></el-icon>
          </div>
        </div>

        <div class="cart-summary">
          <h3 class="cart-summary__title">价格明细</h3>
          <div class="cart-summary__row">
            <span>商品小计</span>
            <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="cart-summary__row">
            <span>运费</span>
            <span style="color: var(--color-success)">免运费</span>
          </div>
          <div class="cart-summary__row">
            <span>优惠券</span>
            <span class="price price-sm">-¥20.00</span>
          </div>
          <el-divider />
          <div class="cart-summary__total">
            <span>合计</span>
            <span class="price price-xl"
              >¥{{ Math.max(0, cartStore.totalPrice - 20).toFixed(2) }}</span
            >
          </div>
          <el-button
            type="primary"
            size="large"
            class="cart-summary__btn"
            @click="$router.push('/checkout')"
          >
            去结算（{{ cartStore.checkedCount }} 件）
          </el-button>
        </div>
      </div>

      <div v-else class="cart-empty">
        <el-icon :size="64" color="#E0D6CE"><ShoppingCart /></el-icon>
        <p>购物车还是空的</p>
        <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Delete, ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const allChecked = computed({
  get: () => cartStore.items.length > 0 && cartStore.items.every((i) => i.checked),
  set: () => {},
})
</script>

<style scoped>
.cart-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: 24px 0;
}

.cart-page__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
}

.cart-page__title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
}

.cart-page__content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.cart-list {
  flex: 1;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.cart-list__header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--color-bg);
  font-size: 14px;
  color: var(--color-text-mid);
  gap: 16px;
}

.cart-list__col {
  flex: 1;
}
.cart-list__col-price {
  width: 100px;
  text-align: center;
}
.cart-list__col-qty {
  width: 120px;
  text-align: center;
}
.cart-list__col-total {
  width: 100px;
  text-align: center;
}
.cart-list__col-action {
  width: 60px;
  text-align: center;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__product {
  flex: 1;
  display: flex;
  gap: 12px;
  min-width: 0;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
}

.cart-item__info {
  min-width: 0;
}

.cart-item__name {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.cart-item__name:hover {
  color: var(--color-primary);
}

.cart-item__spec {
  font-size: 12px;
  color: var(--color-text-light);
  margin-top: 4px;
}

.cart-item__price {
  width: 100px;
  text-align: center;
}

.cart-item__quantity {
  width: 120px;
  display: flex;
  justify-content: center;
}

.cart-item__total {
  width: 100px;
  text-align: center;
  font-size: 16px;
}

.cart-item__delete {
  width: 60px;
  display: flex;
  justify-content: center;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.cart-item__delete:hover {
  color: var(--color-danger);
}

.cart-summary {
  width: 320px;
  flex-shrink: 0;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  padding: 24px;
  position: sticky;
  top: 88px;
}

.cart-summary__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-mid);
  margin-bottom: 12px;
}

.cart-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 16px;
  font-weight: 600;
}

.cart-summary__btn {
  width: 100%;
  margin-top: 16px;
  height: 48px;
  border-radius: var(--radius-card);
  font-size: 16px;
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
}

.cart-empty p {
  font-size: 16px;
  color: var(--color-text-light);
}

@media (max-width: 1024px) {
  .cart-page__inner {
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .cart-page__inner {
    padding: 0 16px;
  }
  .cart-page__content {
    flex-direction: column;
  }
  .cart-summary {
    width: 100%;
    position: static;
  }
  .cart-list__header {
    display: none;
  }
  .cart-item {
    flex-wrap: wrap;
  }
  .cart-item__price,
  .cart-item__quantity,
  .cart-item__total,
  .cart-item__delete {
    width: auto;
  }
}
</style>
