<template>
  <div class="user-center">
    <div class="user-center__sidebar hide-on-mobile">
      <div class="sidebar-nav">
        <div class="sidebar-nav__group">
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'default' }"
            @click="activeTab = 'default'"
          >
            <span>我的主页</span>
          </div>
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
            @click="toggleSub('orders')"
          >
            <span>我的订单</span>
            <el-icon
              :size="12"
              class="sidebar-nav__arrow"
              :class="{ expanded: expandedMenus.orders }"
              ><ArrowDown
            /></el-icon>
          </div>
          <div v-if="expandedMenus.orders" class="sidebar-nav__sub">
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
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'coupons' }"
            @click="activeTab = 'coupons'"
          >
            <span>优惠券</span>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'history' || activeTab.startsWith('history-') }"
            @click="toggleSub('history')"
          >
            <span>足迹收藏</span>
            <el-icon
              :size="12"
              class="sidebar-nav__arrow"
              :class="{ expanded: expandedMenus.history }"
              ><ArrowDown
            /></el-icon>
          </div>
          <div v-if="expandedMenus.history" class="sidebar-nav__sub">
            <div
              v-for="sub in historySubs"
              :key="sub.key"
              class="sidebar-nav__sub-item"
              :class="{ active: activeTab === sub.key }"
              @click="activeTab = sub.key"
            >
              {{ sub.label }}
            </div>
          </div>
          <div
            class="sidebar-nav__item"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            <span>评价管理</span>
          </div>
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
            @click="toggleSub('settings')"
          >
            <span>账号设置</span>
            <el-icon
              :size="12"
              class="sidebar-nav__arrow"
              :class="{ expanded: expandedMenus.settings }"
              ><ArrowDown
            /></el-icon>
          </div>
          <div v-if="expandedMenus.settings" class="sidebar-nav__sub">
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
        <div class="user-profile-card">
          <div class="user-profile-card__left">
            <div class="user-profile-card__top">
              <img :src="user.avatar" class="user-profile-card__avatar" />
              <div class="user-profile-card__name-area">
                <h3 class="user-profile-card__name">{{ user.name }}</h3>
                <span class="user-profile-card__level-tag">{{ user.level }}</span>
              </div>
            </div>
            <div class="user-profile-card__address-row">
              <span class="user-profile-card__address-text">收货地址：{{ user.address }}</span>
              <a class="user-profile-card__address-link" @click="activeTab = 'address'"
                >收货地址 &gt;</a
              >
            </div>
            <div class="user-profile-card__coin-bar">
              <el-icon :size="20" color="#FF5000"><Coin /></el-icon>
              <span class="user-profile-card__coin-text"
                >淘金币 领金币购物抵钱花，100金币抵1元</span
              >
            </div>
          </div>
          <div class="user-profile-card__right">
            <div class="user-profile-card__asset-row">
              <div class="user-profile-card__asset-item">
                <el-icon :size="20" color="#FF5000"><Present /></el-icon>
                <span class="user-profile-card__asset-label">红包</span>
                <span class="user-profile-card__asset-value">¥{{ user.redPacket }}</span>
              </div>
            </div>
            <div class="user-profile-card__asset-row">
              <div class="user-profile-card__asset-item">
                <el-icon :size="20" color="#FF5000"><Ticket /></el-icon>
                <span class="user-profile-card__asset-label">优惠券</span>
                <span class="user-profile-card__asset-value">{{ user.couponCount }}</span>
              </div>
            </div>
            <div class="user-profile-card__asset-row">
              <div class="user-profile-card__asset-item">
                <el-icon :size="20" color="#FF5000"><Star /></el-icon>
                <span class="user-profile-card__asset-label">积分</span>
                <span class="user-profile-card__asset-value">{{ user.points }}</span>
              </div>
            </div>
          </div>
          <div class="user-profile-card__cta-bar">
            <div class="user-profile-card__cta-left">
              <span class="user-profile-card__cta-icon-wrap">
                <el-icon :size="16" color="#FF5000"><Present /></el-icon>
              </span>
              <span class="user-profile-card__cta-title">领券中心</span>
              <span class="user-profile-card__cta-desc">发现官方补贴找优惠</span>
            </div>
            <button class="user-profile-card__cta-btn">去领取</button>
          </div>
        </div>

        <div class="order-dashboard">
          <div class="order-dashboard__header">
            <span class="order-dashboard__title">我的订单</span>
            <a class="order-dashboard__link" @click="activeTab = 'orders'">查看全部 &gt;</a>
          </div>
          <div class="order-dashboard__status-row">
            <div
              v-for="status in orderStatuses"
              :key="status.key"
              class="order-dashboard__status-item"
              :class="{ 'has-pending': status.count > 0 }"
              @click="activeTab = status.key"
            >
              <el-icon :size="24"><component :is="status.icon" /></el-icon>
              <span class="order-dashboard__status-count">{{ status.count }}</span>
              <span class="order-dashboard__status-label">{{ status.label }}</span>
            </div>
          </div>
          <div class="order-dashboard__footer">
            <span class="order-dashboard__footer-text">当前暂无物流信息更新</span>
            <a class="order-dashboard__footer-link" @click="activeTab = 'orders'"
              >查看全部订单 &gt;</a
            >
          </div>
        </div>

        <div class="quick-access-grid">
          <div class="quick-access-card" @click="activeTab = 'favorites'">
            <div class="quick-access-card__header">
              <el-icon :size="20" color="#FF5000"><Star /></el-icon>
              <span class="quick-access-card__title">我的收藏</span>
              <span class="quick-access-card__arrow">&gt;</span>
            </div>
            <div v-if="favoriteItems.length" class="quick-access-card__content">
              <div
                v-for="item in favoriteItems.slice(0, 2)"
                :key="item.id"
                class="quick-access-card__product"
              >
                <img :src="item.image" class="quick-access-card__product-img" />
                <div class="quick-access-card__product-info">
                  <span class="quick-access-card__product-name text-truncate">{{ item.name }}</span>
                  <span class="price price-sm">¥{{ item.price }}</span>
                </div>
              </div>
            </div>
            <div v-else class="quick-access-card__empty">
              <el-icon :size="40" color="#E0D6CE"><Star /></el-icon>
              <span>暂无内容</span>
              <a class="quick-access-card__empty-link">去逛逛</a>
            </div>
          </div>

          <div class="quick-access-card" @click="activeTab = 'history'">
            <div class="quick-access-card__header">
              <el-icon :size="20" color="#FF5000"><Clock /></el-icon>
              <span class="quick-access-card__title">我的足迹</span>
              <span class="quick-access-card__arrow">&gt;</span>
            </div>
            <div v-if="historyItems.length" class="quick-access-card__content">
              <div
                v-for="item in historyItems.slice(0, 2)"
                :key="item.id"
                class="quick-access-card__product"
              >
                <img :src="item.image" class="quick-access-card__product-img" />
                <div class="quick-access-card__product-info">
                  <span class="quick-access-card__product-name text-truncate">{{ item.name }}</span>
                  <span class="price price-sm">¥{{ item.price }}</span>
                </div>
              </div>
            </div>
            <div v-else class="quick-access-card__empty">
              <el-icon :size="40" color="#E0D6CE"><Clock /></el-icon>
              <span>暂无内容</span>
              <a class="quick-access-card__empty-link">去逛逛</a>
            </div>
          </div>

          <div class="quick-access-card" @click="handleCartClick">
            <div class="quick-access-card__header">
              <el-icon :size="20" color="#FF5000"><ShoppingCart /></el-icon>
              <span class="quick-access-card__title">购物车</span>
              <span class="quick-access-card__arrow">&gt;</span>
            </div>
            <div v-if="cartItemCount > 0" class="quick-access-card__content">
              <div class="quick-access-card__cart-info">
                <span class="quick-access-card__cart-count">{{ cartItemCount }}件商品</span>
                <span class="price">¥{{ cartTotal.toFixed(2) }}</span>
              </div>
            </div>
            <div v-else class="quick-access-card__empty">
              <el-icon :size="40" color="#E0D6CE"><ShoppingCart /></el-icon>
              <span>暂无内容</span>
              <a class="quick-access-card__empty-link">去逛逛</a>
            </div>
          </div>
        </div>

        <div class="frequent-section">
          <div class="frequent-section__header">
            <span class="frequent-section__icon-wrap">
              <el-icon :size="14" color="#FF5000"><Star /></el-icon>
            </span>
            <span class="frequent-section__title">常买常逛</span>
            <span class="frequent-section__desc">推荐常看商品</span>
          </div>
          <div class="frequent-section__scroll">
            <div v-for="item in frequentProducts" :key="item.id" class="frequent-product-card">
              <img :src="item.image" class="frequent-product-card__img" />
              <span class="price price-sm">¥{{ item.price }}</span>
              <span class="frequent-product-card__tag">最近浏览</span>
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
      <HistoryView
        v-if="activeTab === 'history' || activeTab.startsWith('history-')"
        :active-tab="activeTab"
        @update:activeTab="activeTab = $event"
      />
      <ReviewView v-if="activeTab === 'reviews'" />
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
          <span class="mobile-user__level-tag">{{ user.level }}</span>
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
      <div class="mobile-user__orders-nav">
        <div class="mobile-user__orders-header">
          <span style="font-weight: 600">我的订单</span>
          <a
            @click="activeTab = 'orders'"
            style="font-size: 12px; color: var(--color-text-light); cursor: pointer"
            >查看全部 &gt;</a
          >
        </div>
        <div class="mobile-user__orders-items">
          <div
            v-for="status in orderStatuses"
            :key="status.key"
            class="mobile-user__orders-item"
            @click="activeTab = status.key"
          >
            <el-icon :size="22"><component :is="status.icon" /></el-icon>
            <span>{{ status.label }}</span>
            <span v-if="status.count > 0" class="mobile-user__orders-badge">{{
              status.count
            }}</span>
          </div>
        </div>
      </div>
      <div class="mobile-user__menu">
        <div class="mobile-user__menu-item" @click="activeTab = 'coupons'">
          <el-icon><Ticket /></el-icon> 优惠券
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'history'">
          <el-icon><Clock /></el-icon> 足迹收藏
        </div>
        <div class="mobile-user__menu-item" @click="activeTab = 'reviews'">
          <el-icon><ChatDotRound /></el-icon> 评价管理
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
import { ref, onMounted, computed, reactive, watch } from 'vue'
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
  Coin,
  Present,
  Star,
  ShoppingCart,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { favoriteProducts, frequentProducts, browsingHistory, cartItems } from '@/mock/data'
import OrderView from '@/views/user/OrderView.vue'
import CouponView from '@/views/user/CouponView.vue'
import HistoryView from '@/views/user/HistoryView.vue'
import ReviewView from '@/views/user/ReviewView.vue'
import AddressView from '@/views/user/AddressView.vue'
import HelpView from '@/views/user/HelpView.vue'
import SettingsView from '@/views/user/SettingsView.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const user = ref(userStore.user)
const activeTab = ref('default')

const expandedMenus = reactive({
  orders: false,
  history: false,
  settings: false,
})

function toggleSub(menu) {
  expandedMenus[menu] = !expandedMenus[menu]
  if (menu === 'orders') {
    activeTab.value = 'orders'
  } else if (menu === 'history') {
    activeTab.value = 'history'
  } else if (menu === 'settings') {
    activeTab.value = 'settings'
  }
}

const favoriteItems = ref([...favoriteProducts])

const historyItems = computed(() => {
  const all = []
  browsingHistory.forEach((group) => {
    group.products.forEach((p) => all.push(p))
  })
  return all
})

const cartItemCount = computed(() => cartItems.length)
const cartTotal = computed(() =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

const showDefaultView = computed(() => {
  const tab = activeTab.value
  if (tab === 'default') return true
  if (['orders', 'coupons', 'history', 'address', 'help', 'settings', 'reviews'].includes(tab))
    return false
  if (tab.startsWith('order-') || tab.startsWith('settings-') || tab.startsWith('history-'))
    return false
  return true
})

function handleCartClick() {
  activeTab.value = 'cart'
  router.push('/cart')
}

// 单独监听导航栏切换和路由参数变化
// watch(
//   () => activeTab.value,
//   (newTab) => {
//     console.log('newTab', newTab)
//     router.replace({ query: { tab: newTab } })
//   },
// )
// watch(
//   () => route.query.tab,
//   (urlTab) => {
//     console.log('urlTab', urlTab)
//     activeTab.value = urlTab
//     router.replace({ query: { tab: urlTab } })
//   },
// )

// 同时监听路由参数变化和导航栏切换
watch(
  [() => route.query.tab, () => activeTab.value],
  ([urlTab, currentTab], [prevUrlTab, prevCurrentTab]) => {
    // console.log('urlTab', urlTab)
    // console.log('currentTab', currentTab)
    if (urlTab === currentTab) return
    // 导航栏切换时，更新路由参数
    if (currentTab && currentTab !== prevCurrentTab) {
      // console.log(1)
      if (
        currentTab.startsWith('order-') ||
        currentTab.startsWith('settings-') ||
        currentTab.startsWith('history-')
      )
        return
      currentTab === 'cart' ? router.push('/cart') : router.replace({ query: { tab: currentTab } })
    }
    // 路由参数变化时，更新导航栏，修改activeTab.value 导航当前选中的值 为urlTab 路由参数值
    if (urlTab && urlTab !== prevUrlTab) {
      // console.log(2)
      activeTab.value = urlTab
      router.replace({ query: { tab: urlTab } })
    }
  },
)

const orderSubs = [
  { key: 'orders', label: '全部订单' },
  { key: 'order-unpaid', label: '待付款' },
  { key: 'order-unshipped', label: '待发货' },
  { key: 'order-shipped', label: '待收货' },
  { key: 'order-review', label: '待评价' },
  { key: 'order-refund', label: '退换售后' },
]

const historySubs = [
  { key: 'history', label: '我的足迹' },
  { key: 'history-favorites', label: '商品收藏' },
  { key: 'history-shops', label: '店铺关注' },
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
  if (activeTab.value === 'orders' || activeTab.value.startsWith('order-')) {
    expandedMenus.orders = true
  }
  if (activeTab.value === 'history' || activeTab.value.startsWith('history-')) {
    expandedMenus.history = true
  }
  if (activeTab.value === 'settings' || activeTab.value.startsWith('settings-')) {
    expandedMenus.settings = true
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

.sidebar-nav__arrow {
  transition: transform var(--transition-fast);
}

.sidebar-nav__arrow.expanded {
  transform: rotate(180deg);
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

.user-default {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-profile-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-light);
  display: flex;
  flex-wrap: wrap;
}

.user-profile-card__left {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-profile-card__top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  object-fit: cover;
  flex-shrink: 0;
}

.user-profile-card__name-area {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-profile-card__name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.user-profile-card__level-tag {
  display: inline-block;
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: 10px;
  border-radius: var(--radius-pill);
  padding: 2px 10px;
  width: fit-content;
}

.user-profile-card__address-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-profile-card__address-text {
  font-size: 12px;
  color: var(--color-text-light);
}

.user-profile-card__address-link {
  font-size: 12px;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.user-profile-card__address-link:hover {
  color: var(--color-primary);
}

.user-profile-card__coin-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: var(--radius-btn);
  padding: 8px 12px;
}

.user-profile-card__coin-text {
  font-size: 12px;
  color: var(--color-text-mid);
}

.user-profile-card__right {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
}

.user-profile-card__asset-row {
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid var(--color-border);
}

.user-profile-card__asset-row:last-child {
  border-bottom: none;
}

.user-profile-card__asset-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 12px;
}

.user-profile-card__asset-label {
  font-size: 12px;
  color: var(--color-text-light);
}

.user-profile-card__asset-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
  font-family: var(--font-price);
  margin-left: auto;
}

.user-profile-card__cta-bar {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--color-border);
}

.user-profile-card__cta-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-profile-card__cta-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-light-orange);
}

.user-profile-card__cta-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.user-profile-card__cta-desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.user-profile-card__cta-btn {
  height: 28px;
  border-radius: var(--radius-pill);
  padding: 4px 16px;
  font-size: 12px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-profile-card__cta-btn:hover {
  background: var(--color-primary-hover);
}

.order-dashboard {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  box-shadow: var(--shadow-light);
}

.order-dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-dashboard__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.order-dashboard__link {
  font-size: 12px;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.order-dashboard__link:hover {
  color: var(--color-primary);
}

.order-dashboard__status-row {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
}

.order-dashboard__status-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: var(--radius-btn);
  transition: all var(--transition-fast);
  color: var(--color-text-dark);
}

.order-dashboard__status-item:hover {
  background: var(--color-light-orange);
}

.order-dashboard__status-item:hover .order-dashboard__status-label,
.order-dashboard__status-item:hover .order-dashboard__status-count {
  color: var(--color-primary);
}

.order-dashboard__status-item.has-pending .order-dashboard__status-count,
.order-dashboard__status-item.has-pending .order-dashboard__status-label {
  color: var(--color-primary);
}

.order-dashboard__status-count {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-price);
}

.order-dashboard__status-label {
  font-size: 12px;
  color: var(--color-text-mid);
}

.order-dashboard__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
}

.order-dashboard__footer-text {
  font-size: 12px;
  color: var(--color-text-light);
}

.order-dashboard__footer-link {
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
}

.order-dashboard__footer-link:hover {
  text-decoration: underline;
}

.quick-access-grid {
  display: flex;
  gap: 12px;
}

.quick-access-card {
  flex: 1;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px;
  box-shadow: var(--shadow-light);
  min-height: 120px;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.quick-access-card:hover {
  box-shadow: var(--shadow-card);
}

.quick-access-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.quick-access-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  flex: 1;
}

.quick-access-card__arrow {
  font-size: 12px;
  color: var(--color-text-light);
}

.quick-access-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-access-card__product {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-access-card__product-img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.quick-access-card__product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.quick-access-card__product-name {
  font-size: 12px;
  color: var(--color-text-dark);
}

.quick-access-card__cart-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-access-card__cart-count {
  font-size: 12px;
  color: var(--color-text-mid);
}

.quick-access-card__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.quick-access-card__empty span {
  font-size: 12px;
  color: var(--color-text-light);
}

.quick-access-card__empty-link {
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
}

.frequent-section {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  box-shadow: var(--shadow-light);
}

.frequent-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.frequent-section__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-light-orange);
}

.frequent-section__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.frequent-section__desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.frequent-section__scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.frequent-section__scroll::-webkit-scrollbar {
  height: 4px;
}

.frequent-section__scroll::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.frequent-product-card {
  flex-shrink: 0;
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.frequent-product-card__img {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-btn);
  object-fit: cover;
}

.frequent-product-card__tag {
  font-size: 10px;
  color: var(--color-text-light);
  background: #f5f5f5;
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  width: fit-content;
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
  margin: 0;
}

.mobile-user__level-tag {
  display: inline-block;
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: 10px;
  border-radius: var(--radius-pill);
  padding: 2px 10px;
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

.mobile-user__orders-nav {
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px;
  margin-bottom: 16px;
}

.mobile-user__orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mobile-user__orders-items {
  display: flex;
  justify-content: space-between;
}

.mobile-user__orders-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  padding: 4px 8px;
}

.mobile-user__orders-badge {
  position: absolute;
  top: -2px;
  right: 0;
  background: var(--color-primary);
  color: #fff;
  font-size: 10px;
  border-radius: var(--radius-pill);
  padding: 0 4px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
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
