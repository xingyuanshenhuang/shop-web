<template>
  <div class="top-utility-bar hide-on-mobile">
    <div class="top-utility-bar__inner">
      <div class="top-utility-bar__left">
        <span class="top-utility-bar__link" @click="showRegion = !showRegion">
          中国大陆 <el-icon :size="10"><ArrowDown /></el-icon>
        </span>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link hide-on-tablet" @click="showTheme = !showTheme">
          选择主题 <el-icon :size="10"><ArrowDown /></el-icon>
        </span>
      </div>
      <div class="top-utility-bar__right">
        <span class="top-utility-bar__link" @click="$router.push('/user?tab=default')">
          <el-icon :size="14"><User /></el-icon>
          Hi，{{ userName }}
        </span>
        <span class="top-utility-bar__divider"></span>
        <span class="top-utility-bar__link">已买到的宝贝</span>
        <span class="top-utility-bar__divider"></span>
        <el-dropdown trigger="hover" @command="handleOrderStatusClick">
          <span class="top-utility-bar__link">
            我的订单 <el-icon :size="10"><ArrowDown /></el-icon>
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
        <el-dropdown trigger="hover">
          <span class="top-utility-bar__link">
            收藏夹 <el-icon :size="10"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>收藏的宝贝</el-dropdown-item>
              <el-dropdown-item>收藏的店铺</el-dropdown-item>
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
import { useOrderStore } from '@/stores/order'
const orderStore = useOrderStore()

const router = useRouter()
const userStore = useUserStore()
const userName = ref(userStore.user.name)
const showRegion = ref(false)
const showTheme = ref(false)
const handleOrderStatusClick = (command) => {
  console.log(command)
  router.push('/user?tab=orders')
  if (command === 'orders') return
  orderStore.updateSelectedStatus(command)
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
  gap: 16px;
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
