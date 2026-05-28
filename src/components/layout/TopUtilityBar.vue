<template>
  <div class="top-utility-bar hide-on-mobile">
    <div class="top-utility-bar__inner">
      <div class="top-utility-bar__left">
        <span class="top-utility-bar__link" @click="showRegion = !showRegion">
          中国大陆 <el-icon :size="10"><ArrowDown /></el-icon>
        </span>
        <span class="top-utility-bar__divider"></span>
        <el-popover
          trigger="hover"
          placement="bottom"
          :width="230"
          :offset="8"
          popper-class="user-popover"
        >
          <template #reference>
            <span class="top-utility-bar__link user-trigger">
              <el-icon :size="14"><User /></el-icon>
              {{ userName }}
            </span>
          </template>
          <div class="user-popover__body">
            <div class="user-popover__top">
              <div class="user-popover__avatar">
                <img :src="userStore.user.avatar" alt="" />
              </div>
              <div class="user-popover__info">
                <p
                  class="user-popover__name"
                  :class="{ 'user-popover__name--long': userName.length > 4 }"
                >
                  {{ userStore.user.name }}
                </p>
                <div class="user-popover__actions">
                  <span
                    class="user-popover__action"
                    @click="$router.push('/user?tab=settings-security')"
                    >账号管理</span
                  >
                  <span class="user-popover__sep">|</span>
                  <span class="user-popover__action" @click="handleLogout">退出</span>
                </div>
              </div>
            </div>
            <button class="user-popover__btn" @click="$router.push('/user?tab=settings-profile')">
              查看你的专属权益
            </button>
          </div>
        </el-popover>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link hide-on-tablet" @click="showTheme = !showTheme">
          选择主题 <el-icon :size="10"><ArrowDown /></el-icon>
        </span>
      </div>
      <div class="top-utility-bar__right">
        <span class="top-utility-bar__link" @click="$router.push('/')">首页</span>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link">已买到的宝贝</span>
        <span class="top-utility-bar__divider"></span>
        <el-dropdown trigger="hover" @command="handleMyClick">
          <span
            class="top-utility-bar__link"
            @mouseenter="updateHover(true)"
            @mouseleave="updateHover(false)"
          >
            足迹与卡券 <el-icon :size="10"><arrowIcon /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="my-footprint">我的足迹</el-dropdown-item>
              <el-dropdown-item command="my-coupons">我的卡券包</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="top-utility-bar__divider"></span>
        <el-dropdown trigger="hover" @command="handleOrderStatusClick">
          <span
            class="top-utility-bar__link"
            @mouseenter="updateHover(true)"
            @mouseleave="updateHover(false)"
          >
            我的订单 <el-icon :size="10"><arrowIcon /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="orders">全部订单</el-dropdown-item>
              <el-dropdown-item command="order-unpaid">待付款</el-dropdown-item>
              <el-dropdown-item command="order-unshipped">待发货</el-dropdown-item>
              <el-dropdown-item command="order-shipped">待收货</el-dropdown-item>
              <el-dropdown-item command="order-review">待评价</el-dropdown-item>
              <el-dropdown-item command="order-refund">退换售后</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="top-utility-bar__divider"></span>
        <el-dropdown trigger="hover" @command="handleFavoriteClick">
          <span
            class="top-utility-bar__link"
            @mouseenter="updateHover(true)"
            @mouseleave="updateHover(false)"
          >
            收藏夹 <el-icon :size="10"><arrowIcon /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="history-favorites">收藏的商品</el-dropdown-item>
              <el-dropdown-item command="history-shops">收藏的店铺</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link">帮助中心</span>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link hide-on-tablet" style="color: var(--color-primary)"
          >免费开店</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useHoverArrow } from '@/composables/useHoverArrow'

const { updateHover, arrowIcon } = useHoverArrow()

const router = useRouter()
const userStore = useUserStore()
const userName = ref(userStore.user.name)
const showRegion = ref(false)
const showTheme = ref(false)

// 直接导航到子选项对应的路由参数
const handleOrderStatusClick = (command) => {
  router.push(`/user?tab=${command}`)
}
const handleFavoriteClick = (command) => {
  router.push(`/user?tab=${command}`)
}
const handleMyClick = (command) => {
  router.push(`/user?tab=${command}`)
}
function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.top-utility-bar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  height: 36px;
  font-size: 12px;
}

.top-utility-bar__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 128px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-utility-bar__left,
.top-utility-bar__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.top-utility-bar__link {
  color: var(--color-text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: color var(--transition-fast);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-utility-bar__link:hover {
  color: var(--color-primary);
}

.top-utility-bar__divider {
  width: 1px;
  height: 12px;
  background: var(--color-border-light);
}

@media (max-width: 1024px) {
  .top-utility-bar__inner {
    padding: 0 32px;
  }
}
</style>

<style>
.user-popover {
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  padding: 16px !important;
}

.user-popover__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-popover__top {
  display: flex;
  gap: 7px;
}

.user-popover__avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f5f5;
}

.user-popover__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-popover__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.user-popover__name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.3;
  text-align: center;
}

.user-popover__name--long {
  text-align: left;
}

.user-popover__actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  font-size: 14px;
}

.user-popover__action {
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.user-popover__action:hover {
  color: var(--color-primary);
}

.user-popover__sep {
  color: #ddd;
}

.user-popover__btn {
  display: block;
  text-align: center;
  width: 100%;
  height: 32px;
  line-height: 32px;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text-dark);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: 2px;
}

.user-popover__btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
