<template>
  <div class="floating-toolbar hide-on-mobile" :style="toolbarStyle">
    <!-- 我的 -->
    <div class="floating-toolbar__item" @click="$router.push('/user')">
      <el-icon :size="20"><User /></el-icon>
      <span>我的</span>
    </div>

    <!-- 购物车 -->
    <div class="floating-toolbar__item" @click="$router.push('/cart')">
      <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" :max="99">
        <el-icon :size="20"><ShoppingCart /></el-icon>
      </el-badge>
      <span>购物车</span>
    </div>

    <!-- 客服 -->
    <div class="floating-toolbar__item">
      <el-icon :size="20"><Service /></el-icon>
      <span>客服</span>
    </div>

    <!-- 反馈 -->
    <div class="floating-toolbar__item" @click="handleFeedback">
      <el-icon :size="20"><ChatDotSquare /></el-icon>
      <span>反馈</span>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ShoppingCart, User, Service, ChatDotSquare } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'

// ==================== 常量定义 ====================

/** 淘宝设计规范：单个模块标准尺寸 48px × 48px */
const MODULE_SIZE = 48

/** 工具栏中的模块总数 */
const MODULE_COUNT = 4

/** 淘宝设计规范参考值：6 模块工具栏总高度 336px */
const REF_TOTAL_HEIGHT = 336

/** 淘宝设计规范参考值：6 模块 */
const REF_MODULE_COUNT = 6

// ==================== 动态尺寸计算 ====================

/**
 * 基于淘宝设计规范，按模块数量等比缩放计算工具栏尺寸
 * @param {number} moduleCount - 当前模块数量
 * @returns {{ width: string, height: string, gap: string }}
 */
function calculateToolbarSize(moduleCount) {
  const moduleTotalHeight = MODULE_SIZE * moduleCount
  const totalHeight = Math.round((REF_TOTAL_HEIGHT / REF_MODULE_COUNT) * moduleCount)
  const totalGap = totalHeight - moduleTotalHeight
  const gapSize = totalGap / (moduleCount - 1)

  return {
    width: `${MODULE_SIZE}px`,
    height: `${totalHeight}px`,
    gap: `${gapSize}px`,
  }
}

/** 工具栏动态样式：宽度、总高度、模块间隔均由计算结果驱动 */
const toolbarStyle = reactive(calculateToolbarSize(MODULE_COUNT))

// ==================== cartStore ====================

const cartStore = useCartStore()

// ==================== 反馈 ====================

function handleFeedback() {
  ElMessage.info('反馈功能开发中，敬请期待')
}
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: var(--radius-btn) 0 0 var(--radius-btn);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.floating-toolbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  color: var(--color-text-mid);
  background: var(--color-bg-white);
  transition: all var(--transition-fast);
  user-select: none;
}

.floating-toolbar__item:hover {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.floating-toolbar__item span {
  font-size: 10px;
  margin-top: 2px;
  line-height: 1;
}
</style>
