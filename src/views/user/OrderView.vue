<template>
  <div class="order-view">
    <div class="order-view__header">
      <h3>我的订单</h3>
      <a style="cursor: pointer; font-size: 12px; color: var(--color-text-light)">查看全部 &gt;</a>
    </div>
    <div class="order-view__status-bar">
      <div
        v-for="status in orderStatuses"
        :key="status.key"
        class="order-status-item"
        :class="{ active: currentStatus === status.key }"
        @click="handleStatusClick(status.key)"
      >
        <el-icon :size="24"><component :is="status.icon" /></el-icon>
        <span class="order-status-item__count">{{ status.count }}</span>
        <span class="order-status-item__label">{{ status.label }}</span>
      </div>
    </div>
    <div class="order-view__list">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        @click="expandedOrder = expandedOrder === order.id ? null : order.id"
      >
        <div class="order-card__header">
          <span class="order-card__id">订单编号：{{ order.id }}</span>
          <el-tag effect="plain" type="warning" size="small" round>{{ order.status }}</el-tag>
        </div>
        <div class="order-card__items">
          <div v-for="item in order.items" :key="item.productId" class="order-card__item">
            <img :src="item.image" class="order-card__item-img" />
            <div class="order-card__item-info">
              <span class="text-truncate">{{ item.name }}</span>
              <span style="font-size: 12px; color: var(--color-text-light)">{{ item.spec }}</span>
            </div>
            <span class="price price-sm">¥{{ item.price }}</span>
          </div>
        </div>
        <div class="order-card__footer">
          <span>共 {{ order.items.length }} 件商品</span>
          <span
            >实付款
            <span class="price" style="font-size: 16px">¥{{ order.total.toFixed(2) }}</span></span
          >
          <el-button v-if="order.statusType === 'shipped'" type="primary" size="small"
            >确认收货</el-button
          >
          <el-button v-if="order.statusType === 'review'" size="small">评价</el-button>
          <el-button v-if="order.statusType === 'completed'" size="small">再次购买</el-button>
        </div>

        <div v-if="expandedOrder === order.id" class="order-card__detail">
          <div v-if="order.logistics" class="order-detail__logistics">
            <h4>物流信息</h4>
            <p>
              <strong>{{ order.logistics.company }}</strong> {{ order.logistics.no }}
              <a style="color: var(--color-primary); cursor: pointer">查看物流 &gt;</a>
            </p>
            <div class="logistics-timeline">
              <div
                v-for="(node, idx) in order.logistics.timeline"
                :key="idx"
                class="logistics-node"
                :class="node.status"
              >
                <span class="logistics-node__dot"></span>
                <span class="logistics-node__time">{{ node.time }}</span>
                <span class="logistics-node__desc">{{ node.desc }}</span>
              </div>
            </div>
          </div>
          <div class="order-detail__info">
            <h4>收货信息</h4>
            <p>{{ order.address.name }} {{ order.address.phone }}</p>
            <p style="font-size: 12px; color: var(--color-text-mid)">{{ order.address.detail }}</p>
          </div>
          <div class="order-detail__summary">
            <span>商品总数：{{ order.items.length }}件</span>
            <span>运费：<span style="color: var(--color-success)">免运费</span></span>
            <span>优惠券：-¥{{ order.discount }}</span>
            <span
              >实付款：<span class="price" style="font-size: 20px"
                >¥{{ order.total.toFixed(2) }}</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Wallet, List, Van, ChatDotRound, RefreshLeft } from '@element-plus/icons-vue'
import { orders } from '@/mock/data'

const props = defineProps({
  activeTab: { type: String, default: 'orders' },
})

const emit = defineEmits(['change-tab'])

function handleStatusClick(key) {
  currentStatus.value = key
  emit('change-tab', key)
}

const currentStatus = ref('orders')
const expandedOrder = ref(null)

const orderStatuses = [
  { key: 'order-unpaid', label: '待付款', icon: Wallet, count: 0 },
  { key: 'order-unshipped', label: '待发货', icon: List, count: 1 },
  { key: 'order-shipped', label: '待收货', icon: Van, count: 1 },
  { key: 'order-review', label: '待评价', icon: ChatDotRound, count: 1 },
  { key: 'order-refund', label: '退换售后', icon: RefreshLeft, count: 0 },
]

const statusMap = {
  'order-unpaid': '待付款',
  'order-unshipped': '待发货',
  'order-shipped': '待收货',
  'order-review': '待评价',
  'order-refund': '退换售后',
}

const filteredOrders = computed(() => {
  if (currentStatus.value === 'orders') return orders
  const target = statusMap[currentStatus.value]
  return orders.filter((o) => o.status === target)
})
</script>

<style scoped>
.order-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.order-view__status-bar {
  display: flex;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.order-status-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-btn);
  transition: all var(--transition-fast);
  position: relative;
}

.order-status-item:hover {
  color: var(--color-primary);
}

.order-status-item.active {
  color: var(--color-primary);
}

.order-status-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.order-status-item__count {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-price);
}

.order-status-item__label {
  font-size: 12px;
  color: var(--color-text-mid);
}

.order-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 12px;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.order-card:hover {
  box-shadow: var(--shadow-card);
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-card__id {
  font-size: 12px;
  color: var(--color-text-light);
}

.order-card__items {
  margin-bottom: 12px;
}

.order-card__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.order-card__item-img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-btn);
  object-fit: cover;
}

.order-card__item-info {
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

.order-card__item-info span:first-child {
  display: block;
}

.order-card__footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: var(--color-text-mid);
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.order-card__footer span:last-child {
  margin-left: auto;
}

.order-card__detail {
  padding-top: 16px;
  margin-top: 12px;
  border-top: 1px solid var(--color-border);
}

.order-detail__logistics,
.order-detail__info {
  margin-bottom: 16px;
}

.order-detail__logistics h4,
.order-detail__info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.logistics-timeline {
  padding-left: 16px;
}

.logistics-node {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  position: relative;
}

.logistics-node__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-warm-border);
  flex-shrink: 0;
  margin-top: 4px;
}

.logistics-node.done .logistics-node__dot {
  background: var(--color-success);
}

.logistics-node.current .logistics-node__dot {
  background: var(--color-primary);
}

.logistics-node__time {
  color: var(--color-text-light);
  min-width: 120px;
}

.logistics-node__desc {
  color: var(--color-text-dark);
}

.order-detail__summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-mid);
  padding: 12px 0;
}
</style>
