<template>
  <div class="user-center">
    <div class="user-center__sidebar hide-on-mobile">
      <div class="sidebar-nav">
        <div class="sidebar-nav__group">
          <div class="sidebar-nav__group-title">购物相关</div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'cart' }"
            @click="handleCartClick"
          >
            <span>我的购物车</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'orders' || activeTab.startsWith('order-') }"
            @click="activeTab = 'orders'"
          >
            <span>我的订单</span>
            <el-icon :size="12"><ArrowDown /></el-icon>
          </div>
          <div
            v-if="activeTab === 'orders' || activeTab.startsWith('order-')"
            class="sidebar-nav__sub"
          >
            <div
              v-for="sub in orderSubs"
              :key="sub.key"
              class="sidebar-nav__sub-item"
              :class="{ active: activeTab === sub.key }"
              @click="activeTab = sub.key"
            >
              {{ sub.label }}
            </div>
          </div>
        </div>
        <div class="sidebar-nav__group">
          <div class="sidebar-nav__group-title">优惠与收藏</div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'coupons' }"
            @click="activeTab = 'coupons'"
          >
            <span>优惠券</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <span>我的足迹</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            <span>评价管理</span>
          </div>
        </div>
        <div class="sidebar-nav__group">
          <div class="sidebar-nav__group-title">账户服务</div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'address' }"
            @click="activeTab = 'address'"
          >
            <span>收货地址</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'help' }"
            @click="activeTab = 'help'"
          >
            <span>帮助中心</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'settings' || activeTab.startsWith('settings-') }"
            @click="activeTab = 'settings'"
          >
            <span>账号设置</span>
            <el-icon :size="12"><ArrowDown /></el-icon>
          </div>
          <div
            v-if="activeTab === 'settings' || activeTab.startsWith('settings-')"
            class="sidebar-nav__sub"
          >
            <div
              v-for="sub in settingsSubs"
              :key="sub.key"
              class="sidebar-nav__sub-item"
              :class="{ active: activeTab === sub.key }"
              @click="activeTab = sub.key"
            >
              {{ sub.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-center__content">
      <div v-if="showDefaultView" class="user-default">
        <div class="user-info-card">
          <img :src="user.avatar" class="user-info-card__avatar" />
          <div class="user-info-card__info">
            <h3>{{ user.name }}</h3>
            <el-tag effect="plain" type="warning" size="small">{{ user.level }}</el-tag>
            <p class="user-info-card__address">收货地址：浙江省杭州市</p>
          </div>
        </div>
        <div class="user-assets">
          <div class="user-assets__item">
            <span class="price price-lg">{{ user.redPacket }}</span>
            <span>红包</span>
          </div>
          <div class="user-assets__item" @click="activeTab = 'coupons'" style="cursor: pointer">
            <span class="price price-lg">{{ user.couponCount }}</span>
            <span>优惠券</span>
          </div>
          <div class="user-assets__item">
            <span class="price price-lg">{{ user.points }}</span>
            <span>积分</span>
          </div>
        </div>
        <div class="user-orders-nav">
          <div class="user-orders-nav__header">
            <h3>我的订单</h3>
            <a
              @click="activeTab = 'orders'"
              style="cursor: pointer; font-size: 12px; color: var(--color-text-light)"
              >查看全部 &gt;</a
            >
          </div>
          <div class="user-orders-nav__items">
            <div
              v-for="status in orderStatuses"
              :key="status.key"
              class="user-orders-nav__item"
              @click="activeTab = status.key"
            >
              <el-icon :size="24"><component :is="status.icon" /></el-icon>
              <span class="price" style="font-size: 18px">{{ status.count }}</span>
              <span style="font-size: 12px; color: var(--color-text-mid)">{{ status.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <OrderView
        v-if="activeTab === 'orders' || activeTab.startsWith('order-')"
        :active-tab="activeTab"
        @change-tab="activeTab = $event"
      />
      <CouponView v-if="activeTab === 'coupons'" />
      <HistoryView v-if="activeTab === 'history'" />
      <AddressView v-if="activeTab === 'address' || activeTab === 'settings-address'" />
      <HelpView v-if="activeTab === 'help'" />
      <SettingsView
        v-if="
          activeTab === 'settings' ||
          (activeTab.startsWith('settings-') && activeTab !== 'settings-address')
        "
        :active-tab="activeTab"
        @change-tab="activeTab = $event"
      />
    </div>

    <div class="mobile-user show-on-mobile-only">
      <div class="mobile-user__header">
        <img :src="user.avatar" class="mobile-user__avatar" />
        <div>
          <h3>{{ user.name }}</h3>
          <el-tag effect="plain" type="warning" size="small">{{ user.level }}</el-tag>
        </div>
      </div>
      <div class="mobile-user__assets">
        <div class="mobile-user__asset-item">
          <span class="price">{{ user.redPacket }}</span>
          <span>红包</span>
        </div>
        <div class="mobile-user__asset-item">
          <span class="price">{{ user.couponCount }}</span>
          <span>优惠券</span>
        </div>
        <div class="mobile-user__asset-item">
          <span class="price">{{ user.points }}</span>
          <span>积分</span>
        </div>
      </div>
      <div class="mobile-user__menu">
        <div class="mobile-user__menu-item" @click="activeTab = 'orders'">
          <el-icon><List /></el-icon> 我的订单
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'coupons'">
          <el-icon><Ticket /></el-icon> 优惠券
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'history'">
          <el-icon><Clock /></el-icon> 我的足迹
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'address'">
          <el-icon><Location /></el-icon> 收货地址
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'help'">
          <el-icon><QuestionFilled /></el-icon> 帮助中心
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'settings'">
          <el-icon><Setting /></el-icon> 账号设置
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowDown,
  List,
  Ticket,
  Clock,
  Location,
  QuestionFilled,
  Setting,
  Wallet,
  Van,
  ChatDotRound,
  RefreshLeft,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import OrderView from '@/views/user/OrderView.vue'
import CouponView from '@/views/user/CouponView.vue'
import HistoryView from '@/views/user/HistoryView.vue'
import AddressView from '@/views/user/AddressView.vue'
import HelpView from '@/views/user/HelpView.vue'
import SettingsView from '@/views/user/SettingsView.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const user = ref(userStore.user)
const activeTab = ref('default')

const showDefaultView = computed(() => {
  const tab = activeTab.value
  if (tab === 'default') return true
  if (['orders', 'coupons', 'history', 'address', 'help', 'settings'].includes(tab)) return false
  if (tab.startsWith('order-') || tab.startsWith('settings-')) return false
  return true
})

function handleCartClick() {
  activeTab.value = 'cart'
  router.push('/cart')
}

const orderSubs = [
  { key: 'orders', label: '全部订单' },
  { key: 'order-unpaid', label: '待付款' },
  { key: 'order-unshipped', label: '待发货' },
  { key: 'order-shipped', label: '待收货' },
  { key: 'order-review', label: '待评价' },
  { key: 'order-refund', label: '退换售后' },
]

const settingsSubs = [
  { key: 'settings-profile', label: '个人资料' },
  { key: 'settings-security', label: '安全设置' },
  { key: 'settings-address', label: '收货地址' },
  { key: 'settings-about', label: '关于我们' },
]

const orderStatuses = [
  { key: 'order-unpaid', label: '待付款', icon: Wallet, count: 0 },
  { key: 'order-unshipped', label: '待发货', icon: List, count: 1 },
  { key: 'order-shipped', label: '待收货', icon: Van, count: 1 },
  { key: 'order-review', label: '待评价', icon: ChatDotRound, count: 1 },
  { key: 'order-refund', label: '退换售后', icon: RefreshLeft, count: 0 },
]

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
})
</script>

<style scoped>
.user-center {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.user-center__sidebar {
  width: 200px;
  background: var(--color-bg-white);
  border-right: 1px solid var(--color-border);
  padding: 16px 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-nav__group {
  margin-bottom: 16px;
}

.sidebar-nav__group-title {
  padding: 8px 20px;
  font-size: 12px;
  color: var(--color-text-light);
}

.sidebar-nav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 20px;
  font-size: 14px;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.sidebar-nav__item:hover {
  background: var(--color-warm-bg);
  color: var(--color-primary);
}

.sidebar-nav__item.active {
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-weight: 600;
}

.sidebar-nav__item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary);
}

.sidebar-nav__sub {
  padding-left: 20px;
}

.sidebar-nav__sub-item {
  height: 36px;
  padding: 0 20px;
  font-size: 13px;
  color: var(--color-text-mid);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sidebar-nav__sub-item:hover,
.sidebar-nav__sub-item.active {
  color: var(--color-primary);
}

.user-center__content {
  flex: 1;
  padding: 24px 32px;
  min-width: 0;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.user-info-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  object-fit: cover;
}

.user-info-card__info h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-info-card__address {
  font-size: 12px;
  color: var(--color-text-light);
  margin-top: 4px;
}

.user-assets {
  display: flex;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  box-shadow: var(--shadow-light);
  margin-bottom: 24px;
}

.user-assets__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-right: 1px solid var(--color-border);
}

.user-assets__item:last-child {
  border-right: none;
}

.user-assets__item span:last-child {
  font-size: 12px;
  color: var(--color-text-light);
}

.user-orders-nav {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
}

.user-orders-nav__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.user-orders-nav__header h3 {
  font-size: 14px;
  font-weight: 600;
}

.user-orders-nav__items {
  display: flex;
}

.user-orders-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-btn);
  transition: background var(--transition-fast);
}

.user-orders-nav__item:hover {
  background: var(--color-light-orange);
}

.mobile-user {
  display: none;
  flex-direction: column;
  padding: 16px;
  width: 100%;
}

.mobile-user__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mobile-user__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.mobile-user__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.mobile-user__assets {
  display: flex;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 12px;
  margin-bottom: 16px;
}

.mobile-user__asset-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: var(--color-text-light);
}

.mobile-user__menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mobile-user__menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.mobile-user__menu-item:hover {
  background: var(--color-light-orange);
}

@media (max-width: 768px) {
  .user-center__sidebar {
    display: none;
  }
  .user-center__content {
    display: none;
  }
  .mobile-user {
    display: flex;
  }
}
</style>
