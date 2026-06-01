<template>
  <div
    class="floating-back-top hide-on-mobile"
    :style="{ top: `calc(50% + ${offset}px)` }"
    v-show="showBackTop"
  >
    <div class="floating-back-top__item" @click="scrollToTop">
      <el-icon :size="20"><Top /></el-icon>
      <span>顶部</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Top } from '@element-plus/icons-vue'

// ==================== 定位计算 ====================

/**
 * 主工具栏（FloatingToolbar）的尺寸常量，
 * 用于计算回顶部工具栏的垂直定位偏移。
 *
 * 主工具栏 4 模块尺寸：
 *   totalHeight = Math.round((336 / 6) × 4) = 224px
 *   halfHeight  = 112px
 *   singleGap   = (224 - 4 × 48) / (4 - 1) = 10.667px
 *
 * 回顶部工具栏位于主工具栏正下方，间隔一个标准间隙距离，
 * 因此垂直偏移量 = halfHeight + singleGap。
 */
const MAIN_MODULE_COUNT = 4
const MODULE_SIZE = 48
const REF_TOTAL_HEIGHT = 336
const REF_MODULE_COUNT = 6

const mainTotalHeight = Math.round((REF_TOTAL_HEIGHT / REF_MODULE_COUNT) * MAIN_MODULE_COUNT)
const mainHalfHeight = mainTotalHeight / 2
const mainGap = (mainTotalHeight - MODULE_SIZE * MAIN_MODULE_COUNT) / (MAIN_MODULE_COUNT - 1)

/** 回顶部工具栏的垂直偏移：主工具栏半高 + 一个标准间隙 */
const offset = mainHalfHeight + mainGap

// ==================== 回顶部逻辑 ====================

const showBackTop = ref(false)

function handleScroll() {
  showBackTop.value = window.scrollY > window.innerHeight
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.floating-back-top {
  position: fixed;
  right: 0;
  z-index: 998;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: var(--radius-btn) 0 0 var(--radius-btn);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.floating-back-top__item {
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

.floating-back-top__item:hover {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.floating-back-top__item span {
  font-size: 10px;
  margin-top: 2px;
  line-height: 1;
}
</style>