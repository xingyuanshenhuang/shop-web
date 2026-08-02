<template>
  <div class="coupon-view">
    <div class="coupon-view__header">
      <h3>优惠券</h3>
    </div>
    <div class="coupon-overview">
      <div class="coupon-overview__item">
        <span class="price" style="font-size: 18px">{{ availableCount }}</span>
        <span style="font-size: 12px; color: var(--color-text-light)">可用</span>
      </div>
      <div class="coupon-overview__item">
        <span style="font-size: 18px; font-weight: 700; color: var(--color-deep-orange)">{{
          expiringCount
        }}</span>
        <span style="font-size: 12px; color: var(--color-text-light)">即将过期</span>
      </div>
    </div>
    <div class="coupon-tabs">
      <span
        class="coupon-tab"
        :class="{ active: activeTab === 'claimable' }"
        @click="activeTab = 'claimable'"
        >可领取</span
      >
      <span class="coupon-tab" :class="{ active: activeTab === 'my' }" @click="activeTab = 'my'"
        >我的优惠券</span
      >
    </div>
    <div class="coupon-list">
      <div
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        :class="{ expired: coupon.status === 'expired', used: coupon.status === 'used' }"
      >
        <div class="coupon-card__left">
          <span class="coupon-card__symbol">¥</span>
          <span class="coupon-card__amount">{{ coupon.amount }}</span>
          <span class="coupon-card__condition">{{ coupon.condition }}</span>
        </div>
        <div class="coupon-card__right">
          <div class="coupon-card__name">{{ coupon.name }}</div>
          <div class="coupon-card__valid">{{ coupon.validFrom }} - {{ coupon.validTo }}</div>
          <div class="coupon-card__scope">{{ coupon.scope }}</div>
          <div class="coupon-card__action">
            <el-button
              v-if="coupon.type === 'claimable'"
              type="primary"
              size="small"
              @click="claimCoupon(coupon)"
              >立即领取</el-button
            >
            <el-button
              v-else-if="coupon.status === 'available'"
              size="small"
              @click="$router.push('/products')"
              >去使用</el-button
            >
            <span v-else-if="coupon.status === 'used'" style="font-size: 12px; color: #ccc"
              >已使用</span
            >
            <span v-else style="font-size: 12px; color: #ccc; text-decoration: line-through"
              >已过期</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { coupons } from '@/mock/data'

const activeTab = ref('claimable')
const couponList = ref([...coupons])

const availableCount = computed(
  () => couponList.value.filter((c) => c.status === 'available').length,
)
const expiringCount = computed(() => 2)

const filteredCoupons = computed(() => {
  if (activeTab.value === 'claimable') return couponList.value.filter((c) => c.type === 'claimable')
  return couponList.value.filter((c) => c.type === 'my')
})

function claimCoupon(coupon) {
  coupon.type = 'my'
  coupon.status = 'available'
}
</script>

<style scoped>
.coupon-view__header {
  margin-bottom: 16px;
}

.coupon-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.coupon-overview {
  display: flex;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 12px 24px;
  box-shadow: var(--shadow-light);
  margin-bottom: 16px;
}

.coupon-overview__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-right: 1px solid var(--color-border);
}

.coupon-overview__item:last-child {
  border-right: none;
}

.coupon-tabs {
  display: flex;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.coupon-tab {
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.coupon-tab:hover,
.coupon-tab.active {
  color: var(--color-primary);
}

.coupon-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  display: flex;
  height: 100px;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
}

.coupon-card.expired,
.coupon-card.used {
  opacity: 0.5;
}

.coupon-card__left {
  width: 30%;
  background: linear-gradient(135deg, #ff5000, #ff8547);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 8px;
}

.expired .coupon-card__left,
.used .coupon-card__left {
  background: linear-gradient(135deg, #ccc, #e0e6de);
}

.coupon-card__symbol {
  font-size: 16px;
}

.coupon-card__amount {
  font-size: 32px;
  font-weight: 700;
  font-family: var(--font-price);
  line-height: 1;
}

.coupon-card__condition {
  font-size: 11px;
  opacity: 0.8;
  margin-top: 4px;
}

.coupon-card__right {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.coupon-card__name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.coupon-card__valid,
.coupon-card__scope {
  font-size: 12px;
  color: var(--color-text-light);
}

.coupon-card__action {
  position: absolute;
  right: 16px;
  bottom: 12px;
}
</style>
