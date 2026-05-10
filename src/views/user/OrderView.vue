<template>
  <!-- 订单视图主容器 -->
  <div class="order-view">
    <!-- 头部区域：标题 + 查看全部链接 -->
    <div class="order-view__header">
      <h3>我的订单</h3>
    </div>

    <!-- 订单状态导航栏：横向排列5个状态项 -->
    <div class="order-view__status-bar">
      <div
        v-for="status in orderStatuses"
        :key="status.key"
        class="order-status-item"
        :class="{ active: currentStatus === status.key }"
        @click="handleStatusClick(status.key)"
      >
        <!-- 使用动态组件渲染图标 -->
        <el-icon :size="24"><component :is="status.icon" /></el-icon>
        <!-- 订单数量统计 -->
        <span class="order-status-item__count">{{ status.count }}</span>
        <!-- 状态标签名称 -->
        <span class="order-status-item__label">{{ status.label }}</span>
      </div>
    </div>

    <!-- 订单列表区域 -->
    <div class="order-view__list">
      <!-- 遍历过滤后的订单列表 -->
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        @click="expandedOrder = expandedOrder === order.id ? null : order.id"
      >
        <!-- 订单卡片头部：订单编号 + 状态标签 -->
        <div class="order-card__header">
          <span class="order-card__id">订单编号：{{ order.id }}</span>
          <el-tag effect="plain" type="warning" size="small" round>{{ order.status }}</el-tag>
        </div>

        <!-- 订单商品列表 -->
        <div class="order-card__items">
          <div v-for="item in order.items" :key="item.productId" class="order-card__item">
            <!-- 商品缩略图 -->
            <img :src="item.image" class="order-card__item-img" />
            <!-- 商品信息：名称 + 规格 -->
            <div class="order-card__item-info">
              <span class="text-truncate">{{ item.name }}</span>
              <span style="font-size: 12px; color: var(--color-text-light)">{{ item.spec }}</span>
            </div>
            <!-- 商品单价 -->
            <span class="price price-sm">¥{{ item.price }}</span>
          </div>
        </div>

        <!-- 订单卡片底部：统计信息 + 操作按钮 -->
        <div class="order-card__footer">
          <span>共 {{ order.items.length }} 件商品</span>
          <span
            >实付款
            <span class="price" style="font-size: 16px">¥{{ order.total.toFixed(2) }}</span></span
          >
          <!-- 根据订单状态显示不同操作按钮 -->
          <el-button v-if="order.statusType === 'shipped'" type="primary" size="small"
            >确认收货</el-button
          >
          <el-button v-if="order.statusType === 'review'" size="small">评价</el-button>
          <el-button v-if="order.statusType === 'completed'" size="small">再次购买</el-button>
        </div>

        <!-- 订单详情展开区域：点击卡片时显示 -->
        <div v-if="expandedOrder === order.id" class="order-card__detail">
          <!-- 物流信息区块 -->
          <div v-if="order.logistics" class="order-detail__logistics">
            <h4>物流信息</h4>
            <p>
              <strong>{{ order.logistics.company }}</strong> {{ order.logistics.no }}
              <a style="color: var(--color-primary); cursor: pointer">查看物流 &gt;</a>
            </p>
            <!-- 物流时间线 -->
            <div class="logistics-timeline">
              <div
                v-for="(node, idx) in order.logistics.timeline"
                :key="idx"
                class="logistics-node"
                :class="node.status"
              >
                <!-- 状态指示点 -->
                <span class="logistics-node__dot"></span>
                <!-- 时间节点 -->
                <span class="logistics-node__time">{{ node.time }}</span>
                <!-- 物流描述 -->
                <span class="logistics-node__desc">{{ node.desc }}</span>
              </div>
            </div>
          </div>

          <!-- 收货信息区块 -->
          <div class="order-detail__info">
            <h4>收货信息</h4>
            <p>{{ order.address.name }} {{ order.address.phone }}</p>
            <p style="font-size: 12px; color: var(--color-text-mid)">{{ order.address.detail }}</p>
          </div>

          <!-- 订单金额明细 -->
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
/**
 * OrderView - 订单管理视图组件
 *
 * 功能说明：
 * 1. 显示订单列表，支持按状态筛选（待付款/待发货/待收货/待评价/退换售后）
 * 2. 点击订单卡片可展开查看物流信息、收货地址、金额明细
 * 3. 根据订单状态显示对应操作按钮（确认收货/评价/再次购买）
 * 4. 与父组件 UserCenterPage 通过 Props/Events 双向通信
 */

import { ref, computed, watch } from 'vue'
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

const currentStatus = ref(props.activeTab)
const expandedOrder = ref(null)

watch(
  () => props.activeTab,
  (newVal) => {
    currentStatus.value = newVal
  },
)

// 订单状态配置
const orderStatuses = [
  { key: 'orders', label: '全部订单', icon: List, count: 0 },
  { key: 'order-unpaid', label: '待付款', icon: Wallet, count: 0 },
  { key: 'order-unshipped', label: '待发货', icon: List, count: 1 },
  { key: 'order-shipped', label: '待收货', icon: Van, count: 1 },
  { key: 'order-review', label: '待评价', icon: ChatDotRound, count: 1 },
  { key: 'order-refund', label: '退换售后', icon: RefreshLeft, count: 0 },
]

// 状态key → 中文映射（'orders'表示全部，不在表中）
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
/* ==================== 头部区域样式 ==================== */
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

/* ==================== 状态导航栏样式 ==================== */
.order-view__status-bar {
  display: flex;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

/* 单个状态项 */
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

/* 悬停效果 */
.order-status-item:hover {
  color: var(--color-primary);
}

/* 选中状态 */
.order-status-item.active {
  color: var(--color-primary);
}

/* 选中状态下的底部指示线 */
.order-status-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

/* 订单数量数字 */
.order-status-item__count {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-price);
}

/* 状态标签文字 */
.order-status-item__label {
  font-size: 12px;
  color: var(--color-text-mid);
}

/* ==================== 订单卡片样式 ==================== */
.order-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 12px;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

/* 卡片悬停阴影效果 */
.order-card:hover {
  box-shadow: var(--shadow-card);
}

/* 卡片头部 */
.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 订单编号 */
.order-card__id {
  font-size: 12px;
  color: var(--color-text-light);
}

/* 商品列表区域 */
.order-card__items {
  margin-bottom: 12px;
}

/* 单个商品项 */
.order-card__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

/* 商品图片 */
.order-card__item-img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-btn);
  object-fit: cover;
}

/* 商品信息区域 */
.order-card__item-info {
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

/* 商品名称强制单行显示 */
.order-card__item-info span:first-child {
  display: block;
}

/* 卡片底部 */
.order-card__footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: var(--color-text-mid);
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

/* 操作按钮右对齐 */
.order-card__footer span:last-child {
  margin-left: auto;
}

/* ==================== 订单详情展开区域 ==================== */
.order-card__detail {
  padding-top: 16px;
  margin-top: 12px;
  border-top: 1px solid var(--color-border);
}

/* 物流信息、收货信息区块 */
.order-detail__logistics,
.order-detail__info {
  margin-bottom: 16px;
}

/* 区块标题 */
.order-detail__logistics h4,
.order-detail__info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* ==================== 物流时间线样式 ==================== */
.logistics-timeline {
  padding-left: 16px;
}

/* 时间线节点 */
.logistics-node {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  position: relative;
}

/* 状态指示点 */
.logistics-node__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-warm-border);
  flex-shrink: 0;
  margin-top: 4px;
}

/* 已完成节点 - 绿色 */
.logistics-node.done .logistics-node__dot {
  background: var(--color-success);
}

/* 当前节点 - 橙色 */
.logistics-node.current .logistics-node__dot {
  background: var(--color-primary);
}

/* 时间节点 */
.logistics-node__time {
  color: var(--color-text-light);
  min-width: 120px;
}

/* 物流描述 */
.logistics-node__desc {
  color: var(--color-text-dark);
}

/* ==================== 订单金额明细 ==================== */
.order-detail__summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-mid);
  padding: 12px 0;
}
</style>
