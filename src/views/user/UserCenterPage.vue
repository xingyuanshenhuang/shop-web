<template>
  <div class="user-center" :class="{ 'mobile-subview': activeTab !== 'default' }">
    <div class="user-center__sidebar">
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
            <span>我的卡券包</span>
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
      <div class="mobile-back-bar" v-if="activeTab !== 'default'">
        <el-icon class="mobile-back-bar__back" @click="activeTab = 'default'"><ArrowLeft /></el-icon>
        <span class="mobile-back-bar__title">{{ mobileTitle }}</span>
      </div>
      <div v-if="showDefaultView" class="user-default">
        <div class="user-profile-card">
          <div class="user-profile-card__left">
            <div class="user-profile-card__top">
              <img :src="user.avatar" class="user-profile-card__avatar" />
              <div class="user-profile-card__name-area">
                <h3 class="user-profile-card__name">{{ user.name }}</h3>
                <div class="user-profile-card__inline-tags">
                  <span class="user-profile-card__inline-tag is-gold">黄金会员</span>
                  <span class="user-profile-card__tag-sep">|</span>
                  <a
                    class="user-profile-card__inline-tag user-profile-card__inline-link"
                    @click="activeTab = 'settings-address'"
                    >地址管理</a
                  >
                </div>
              </div>
            </div>
            <div class="user-profile-card__plus-bar">
              <span class="user-profile-card__plus-icon">👑</span>
              <span class="user-profile-card__plus-label">PLUS会员</span>
              <span class="user-profile-card__plus-desc">权益重磅升级 点击此处开通 &gt;</span>
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

        <div class="dashboard-grid">
          <div class="dashboard-card dashboard-card--wide" @click="activeTab = 'orders'">
            <div class="dashboard-card__header">
              <span class="dashboard-card__title">我的订单</span>
              <span class="dashboard-card__arrow"
                ><el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <div class="dashboard-card__status-row">
              <div
                v-for="status in orderStatuses"
                :key="status.key"
                class="dashboard-status-item"
                :class="{ 'has-pending': status.count > 0 }"
              >
                <span class="dashboard-status-item__count">{{ status.count }}</span>
                <span class="dashboard-status-item__label">{{ status.label }}</span>
              </div>
            </div>
            <div v-if="latestOrder" class="dashboard-card__order-preview">
              <img :src="latestOrder.image" class="dashboard-card__order-img" />
              <div class="dashboard-card__order-info">
                <p class="dashboard-card__order-text text-truncate">
                  {{ latestOrder.text }}
                </p>
                <span class="dashboard-card__order-time">{{ latestOrder.time }} 查看物流 &gt;</span>
              </div>
              <button class="dashboard-card__order-btn">确认收货</button>
            </div>
          </div>

          <div class="dashboard-card" @click="activeTab = 'favorites'">
            <div class="dashboard-card__header">
              <span class="dashboard-card__title">我的收藏</span>
              <span class="dashboard-card__arrow"
                ><el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <el-carousel
              v-if="favoriteItems.length"
              height="170px"
              :interval="3000"
              indicator-position="none"
              arrow="never"
              trigger="click"
            >
              <el-carousel-item v-for="item in favoriteItems" :key="item.id">
                <div class="dashboard-card__product-slide">
                  <img :src="item.image" class="dashboard-card__product-img" />
                  <div class="dashboard-card__product-info">
                    <span class="dashboard-card__product-name text-truncate">{{ item.name }}</span>
                    <span class="dashboard-card__product-stat">{{ favoriteCount }}人收藏</span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div v-else class="dashboard-card__empty">
              <span>暂无收藏内容</span>
            </div>
          </div>

          <div class="dashboard-card" @click="activeTab = 'history'">
            <div class="dashboard-card__header">
              <span class="dashboard-card__title">我的足迹</span>
              <span class="dashboard-card__arrow"
                ><el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <el-carousel
              v-if="historyItems.length"
              height="170px"
              :interval="3000"
              indicator-position="none"
              arrow="never"
              trigger="click"
            >
              <el-carousel-item v-for="item in historyItems" :key="item.id">
                <div class="dashboard-card__product-slide">
                  <img :src="item.image" class="dashboard-card__product-img" />
                  <div class="dashboard-card__product-info">
                    <span class="dashboard-card__product-name text-truncate">{{ item.name }}</span>
                    <span class="dashboard-card__product-price price-sm">¥{{ item.price }}</span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div v-else class="dashboard-card__empty">
              <span>暂无浏览记录</span>
            </div>
          </div>

          <div class="dashboard-card" @click="handleCartClick">
            <div class="dashboard-card__header">
              <span class="dashboard-card__title">购物车</span>
              <span class="dashboard-card__arrow"
                ><el-icon><ArrowRight /></el-icon
              ></span>
            </div>
            <el-carousel
              v-if="cartItemCount > 0"
              height="170px"
              :interval="3000"
              indicator-position="none"
              arrow="never"
              trigger="click"
            >
              <el-carousel-item v-for="item in cartItems" :key="item.id">
                <div class="dashboard-card__product-slide">
                  <img :src="item.image" class="dashboard-card__product-img" />
                  <div class="dashboard-card__product-info">
                    <span class="dashboard-card__product-name text-truncate">{{ item.name }}</span>
                    <span class="dashboard-card__cart-price"
                      ><em>追加入降</em> ¥{{ (item.price * item.quantity).toFixed(2) }}</span
                    >
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div v-else class="dashboard-card__empty">
              <span>购物车是空的</span>
            </div>
          </div>
        </div>

        <div v-if="showFrequent" class="frequent-section">
          <div class="frequent-section__sidebar">
            <span class="frequent-section__icon-wrap">
              <el-icon :size="20" color="#FF5000"><Star /></el-icon>
            </span>
            <span class="frequent-section__title">常卖常逛</span>
            <span class="frequent-section__desc" @click="refreshFrequent">推荐常看商品</span>
            <span class="frequent-section__ignore" @click="hideFrequent">不感兴趣</span>
          </div>
          <div class="frequent-section__viewport">
            <button
              class="frequent-section__arrow frequent-section__arrow--left"
              :class="{ 'is-disabled': !canScrollLeft }"
              :disabled="!canScrollLeft"
              @click="scrollLeft"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <div ref="scrollContainer" class="frequent-section__scroll">
              <div v-for="item in frequentList" :key="item.id" class="frequent-product-card">
                <img :src="item.image" class="frequent-product-card__img" />
                <span class="price price-sm">¥{{ item.price }}</span>
                <span class="frequent-product-card__tag">最近浏览</span>
              </div>
            </div>
            <button
              class="frequent-section__arrow frequent-section__arrow--right"
              :class="{ 'is-disabled': !canScrollRight }"
              :disabled="!canScrollRight"
              @click="scrollRight"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div v-if="isRefreshing" class="frequent-section__loading">
            <el-icon class="is-loading"><RefreshLeft /></el-icon>
          </div>
        </div>

        <div class="guess-section">
          <div class="guess-section__header">
            <span class="guess-section__title">猜你喜欢</span>
          </div>
          <div ref="guessScrollContainer" class="guess-section__grid">
            <div
              v-for="item in guessList"
              :key="item.id"
              class="guess-product-card"
              @click="goProduct(item)"
            >
              <div class="guess-product-card__img-wrap">
                <img :src="item.image" class="guess-product-card__img" />
              </div>
              <div class="guess-product-card__info">
                <span class="guess-product-card__name">{{ item.name }}</span>
                <div class="guess-product-card__tags">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="guess-product-card__tag"
                    :class="getTagClass(tag)"
                    >{{ tag }}</span
                  >
                </div>
                <div class="guess-product-card__footer">
                  <span class="guess-product-card__price price">¥{{ item.price }}</span>
                  <span class="guess-product-card__sales">{{ item.sales || '1万+' }}人购买</span>
                </div>
              </div>
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
      <HelpView v-if="activeTab === 'help'" />
      <SettingsView
        v-if="activeTab === 'settings' || activeTab.startsWith('settings-')"
        :active-tab="activeTab"
        @change-tab="activeTab = $event"
      />
    </div>

    <div class="mobile-user">
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
        <div class="mobile-user__menu-item" @click="activeTab = 'settings-address'">
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
  ArrowRight,
  ArrowLeft,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import { frequentProducts, browsingHistory, cartItems } from '@/mock/data'
import OrderView from '@/views/user/OrderView.vue'
import CouponView from '@/views/user/CouponView.vue'
import HistoryView from '@/views/user/HistoryView.vue'
import ReviewView from '@/views/user/ReviewView.vue'
import HelpView from '@/views/user/HelpView.vue'
import SettingsView from '@/views/user/SettingsView.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
// 使用 reactive 深拷贝以响应 store.user 的后续变更（登录后 user.value 会被更新）
const user = reactive({ ...userStore.user })
watch(
  () => userStore.user,
  (v) => Object.assign(user, v),
  { deep: true },
)
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

const favoriteItems = computed(() => favoritesStore.items)

const historyItems = computed(() => {
  const all = []
  browsingHistory.forEach((group) => {
    group.products.forEach((p) => all.push(p))
  })
  return all
})

const cartItemCount = computed(() => cartItems.length)

// 最新订单预览数据
const latestOrder = ref({
  image: 'https://picsum.photos/seed/order1/80/80',
  text: '您的快件已派送成功（美乐佳代点），如有疑问请电快递员【刘吉...',
  time: '2026-05-18 09:24:58',
})

// 收藏人数统计
const favoriteCount = computed(() => favoritesStore.count)

// 常卖常逛模块
const showFrequent = ref(true)
const isRefreshing = ref(false)
const frequentList = ref([...frequentProducts])
const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function refreshFrequent() {
  isRefreshing.value = true
  setTimeout(() => {
    frequentList.value = [...frequentProducts].sort(() => Math.random() - 0.5)
    isRefreshing.value = false
  }, 600)
}

function hideFrequent() {
  showFrequent.value = false
}

function scrollLeft() {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: -140, behavior: 'smooth' })
}

function scrollRight() {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({ left: 140, behavior: 'smooth' })
}

onMounted(() => {
  const el = scrollContainer.value
  if (el) {
    const checkScroll = () => {
      canScrollLeft.value = el.scrollLeft > 1
      canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    }
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
  }
  generateGuessList()
})

// 猜你喜欢推荐模块
const guessList = ref([])

function generateGuessList() {
  const allProducts = [...favoritesStore.items, ...frequentProducts]
  const shuffled = allProducts.sort(() => Math.random() - 0.5)
  const salesOptions = ['8000+', '1.2万+', '2万+', '3万+', '5万+', '10万+']
  guessList.value = shuffled.slice(0, 8).map((p, i) => ({
    ...p,
    rating: (4 + Math.random()).toFixed(1),
    tags: guessTags(p, i),
    sales: salesOptions[i % salesOptions.length],
  }))
}

function guessTags(item, index) {
  const tags = []
  if (item.price < 100) tags.push('官方立减')
  if (index % 2 === 0) tags.push('包邮')
  if (index % 3 === 0) tags.push('退货宝')
  if (item.price > 500) tags.push('空气炸锅热销榜第' + ((index % 10) + 1) + '名')
  return tags
}

function getTagClass(tag) {
  if (tag.startsWith('官方')) return 'tag-official'
  if (tag.includes('包邮')) return 'tag-shipping'
  if (tag.includes('退货')) return 'tag-return'
  if (tag.includes('热销')) return 'tag-hot'
  if (tag.includes('满减')) return 'tag-official'
  return ''
}

function goProduct(item) {
  router.push({ path: '/product', query: { id: item.id } })
}

const showDefaultView = computed(() => {
  const tab = activeTab.value
  if (tab === 'default') return true
  if (['orders', 'coupons', 'history', 'help', 'settings', 'reviews'].includes(tab)) return false
  if (tab.startsWith('order-') || tab.startsWith('settings-') || tab.startsWith('history-'))
    return false
  return true
})

// 移动端子视图顶部标题
const mobileTitle = computed(() => {
  const tab = activeTab.value
  if (tab === 'orders' || tab.startsWith('order-')) return '我的订单'
  if (tab === 'coupons') return '我的卡券包'
  if (tab === 'history' || tab.startsWith('history-')) return '足迹收藏'
  if (tab === 'reviews') return '评价管理'
  if (tab === 'help') return '帮助中心'
  if (tab === 'settings' || tab.startsWith('settings-')) return '账号设置'
  return '我的主页'
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
  // 未登录跳转登录页
  if (!userStore.isLoggedIn) {
    router.replace({ path: '/login', query: { redirect: '/user' } })
    return
  }
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
  background: var(--color-checkout-bg);
}

.user-center__sidebar {
  width: 200px;
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  padding: 16px 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

/* 小尺寸笔记本：收窄侧边栏与内容内边距，减少留白 */
@media (max-width: 1280px) and (min-width: 1025px) {
  .user-center__sidebar {
    width: 176px;
  }
  .user-center__content {
    padding: 16px 20px;
  }
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
  background: var(--color-bg);
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
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}

.user-profile-card__inline-tags {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-profile-card__inline-tag {
  font-size: 12px;
  color: var(--color-text-mid);
}

.user-profile-card__inline-tag.is-gold {
  color: #d4a017;
}

.user-profile-card__inline-link {
  cursor: pointer;
  transition: color var(--transition-fast);
}

.user-profile-card__inline-link:hover {
  color: var(--color-primary);
}

.user-profile-card__tag-sep {
  color: var(--color-text-light);
  font-size: 10px;
}

.user-profile-card__plus-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f0eb;
  border-radius: var(--radius-btn);
  padding: 6px 12px;
}

.user-profile-card__plus-icon {
  font-size: 14px;
}

.user-profile-card__plus-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.user-profile-card__plus-desc {
  font-size: 11px;
  color: var(--color-primary);
  cursor: pointer;
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

/* 仪表盘卡片网格布局 */
.dashboard-grid {
  display: flex;
  gap: 12px;
}

.dashboard-card {
  flex: 3;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px;
  box-shadow: var(--shadow-light);
  min-width: 0;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.dashboard-card:hover {
  box-shadow: var(--shadow-card);
}

.dashboard-card--wide {
  flex: 11;
  min-width: 320px;
}

.dashboard-card__header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.dashboard-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  line-height: 1;
}

.dashboard-card__arrow {
  font-size: 12px;
  color: var(--color-text-mid);
  font-weight: 700;
  line-height: 1;
}

.dashboard-card__status-row {
  display: flex;
  justify-content: space-around;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.dashboard-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dashboard-status-item__count {
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-price);
  color: var(--color-text-dark);
}

.dashboard-status-item__label {
  font-size: 11px;
  color: var(--color-text-mid);
}

.dashboard-status-item.has-pending .dashboard-status-item__count,
.dashboard-status-item.has-pending .dashboard-status-item__label {
  color: var(--color-primary);
}

.dashboard-card__order-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
}

.dashboard-card__order-img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.dashboard-card__order-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboard-card__order-text {
  font-size: 12px;
  color: var(--color-text-mid);
  line-height: 18px;
  margin: 0;
}

.dashboard-card__order-time {
  font-size: 11px;
  color: var(--color-primary);
  cursor: pointer;
}

.dashboard-card__order-btn {
  padding: 4px 14px;
  font-size: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: #fff;
  color: var(--color-text-dark);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.dashboard-card__order-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.dashboard-card__product-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 8px 0;
  cursor: pointer;
}

.dashboard-card__product-img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.dashboard-card .el-carousel__button {
  display: none;
}

.dashboard-card .el-carousel__container {
  height: 100%;
}

.dashboard-card__product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  width: 100%;
  padding: 0 8px;
}

.dashboard-card__product-name {
  font-size: 13px;
  color: var(--color-text-dark);
  line-height: 20px;
}

.dashboard-card__product-stat,
.dashboard-card__product-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.dashboard-card__cart-price {
  font-size: 13px;
  color: var(--color-text-mid);
}

.dashboard-card__cart-price em {
  font-style: normal;
  color: var(--color-primary);
  font-weight: 600;
  margin-right: 4px;
}

.dashboard-card__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
}

.dashboard-card__empty span {
  font-size: 12px;
  color: var(--color-text-light);
}

.frequent-section {
  display: flex;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px;
  box-shadow: var(--shadow-light);
  gap: 16px;
  position: relative;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.frequent-section__sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
  width: 80px;
  padding: 16px 8px;
  border-radius: var(--radius-btn);
  background: #fff5f0;
  border: 1px solid #ffe4d9;
}

.frequent-section__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-light-orange);
}

.frequent-section__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  text-align: center;
}

.frequent-section__desc {
  font-size: 11px;
  color: var(--color-text-light);
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.frequent-section__desc:hover {
  color: var(--color-primary);
}

.frequent-section__ignore {
  font-size: 10px;
  color: var(--color-text-light);
  text-align: center;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.frequent-section__ignore:hover {
  color: var(--color-deep-orange);
}

.frequent-section__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-card);
  z-index: 1;
}

.frequent-section__loading .is-loading {
  font-size: 24px;
  color: var(--color-primary);
  animation: rotating 1s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.frequent-section__viewport {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.frequent-section__scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.frequent-section__scroll::-webkit-scrollbar {
  display: none;
}

.frequent-section__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  font-size: 14px;
}

.frequent-section__arrow:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.25);
}

.frequent-section__arrow:active:not(:disabled) {
  transform: translateY(-50%) scale(0.92);
}

.frequent-section__arrow--left {
  left: 6px;
}

.frequent-section__arrow--right {
  right: 6px;
}

.frequent-section__arrow.is-disabled,
.frequent-section__arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
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
  padding: 12px 16px;
  width: 100%;
  gap: 12px;
}

.mobile-user__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0;
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
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 10px 12px;
  margin-bottom: 0;
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
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 12px;
  margin-bottom: 0;
}

.mobile-user__orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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
  padding: 4px 6px;
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
  gap: 10px;
}

.mobile-user__menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.mobile-user__menu-item:hover {
  background: var(--color-light-orange);
}

/* 平板及以下：隐藏左侧白色侧边栏，启用紧凑布局 */
@media (max-width: 1024px) {
  .user-center__sidebar {
    display: none;
  }
  .user-center__content {
    display: none;
    padding: 0 16px 16px;
  }
  .mobile-user {
    display: flex;
  }
  .mobile-back-bar {
    display: flex;
  }
  /* 进入子视图时显示内容区、隐藏移动端首页 */
  .user-center.mobile-subview .user-center__content {
    display: block;
  }
  .user-center.mobile-subview .mobile-user {
    display: none;
  }
  /* 平板宽度下菜单使用 6 列，充分利用横向空间 */
  .mobile-user__menu {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* 移动端子视图顶部返回栏 */
.mobile-back-bar {
  display: none;
  align-items: center;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-bg);
  padding: 12px 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.mobile-back-bar__back {
  font-size: 20px;
  color: var(--color-text-dark);
  cursor: pointer;
}

.mobile-back-bar__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-dark);
}

/* 手机端：进一步收紧间距 */
@media (max-width: 768px) {
  .mobile-user {
    padding: 8px 12px;
    gap: 10px;
  }
  .mobile-user__menu {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .mobile-user__menu-item {
    padding: 10px 6px;
  }
  .user-center__content {
    padding: 0 12px 16px;
  }
}

/* 猜你喜欢推荐模块 */
.guess-section {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px;
  box-shadow: var(--shadow-light);
}

.guess-section__header {
  margin-bottom: 12px;
}

.guess-section__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.guess-section__subtitle {
  font-size: 11px;
  color: var(--color-text-light);
  margin-left: 8px;
}

.guess-section__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.guess-section__grid::-webkit-scrollbar {
  display: none;
}

.guess-product-card {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition:
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  border: 1px solid #f0f0f0;
}

.guess-product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: transparent;
}

.guess-product-card__img-wrap {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.guess-product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guess-product-card__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
}

.guess-product-card__name {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guess-product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.guess-product-card__tag {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  line-height: 1.6;
  white-space: nowrap;
}

.guess-product-card__tag.tag-official {
  color: #ff5000;
  background: #fff2ed;
  border: 1px solid #ffd4c2;
}

.guess-product-card__tag.tag-shipping {
  color: #ff5000;
  background: #fff2ed;
  border: 1px solid #ffd4c2;
}

.guess-product-card__tag.tag-return {
  color: #07c160;
  background: #e8f8e8;
  border: 1px solid #b7ebc2;
}

.guess-product-card__tag.tag-hot {
  color: #ff5000;
  background: linear-gradient(135deg, #fff2ed, #ffe8df);
  border: 1px solid #ff5000;
  font-weight: 600;
}

.guess-product-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.guess-product-card__price {
  font-size: 16px;
  font-weight: 700;
  color: #ff5000;
  line-height: 1;
}

.guess-product-card__sales {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}
</style>
