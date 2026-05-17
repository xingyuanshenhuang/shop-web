/**
 * 悬停箭头切换 Composable
 * 用于实现鼠标悬停时箭头图标上下切换的效果
 */
import { ref, computed } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
export function useHoverArrow() {
  const isHover = ref(false)
  const updateHover = (hover) => {
    isHover.value = hover
  }
  const arrowIcon = computed(() => (isHover.value ? ArrowUp : ArrowDown))
  return {
    isHover,
    updateHover,
    arrowIcon,
  }
}
