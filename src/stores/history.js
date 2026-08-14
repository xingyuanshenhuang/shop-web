import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PERSIST_KEYS } from './persistenceConfig'

// 将时间戳转为日期分组标签
function getDateLabel(ts) {
  const now = new Date()
  const d = new Date(ts)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOfToday - startOfDay) / (24 * 60 * 60 * 1000))
  if (diffDays <= 0) return '今天'
  if (diffDays === 1) return '昨天'
  return `${diffDays}天前`
}

export const useHistoryStore = defineStore(
  'history',
  () => {
    // items 元素结构：{ id, name, price, image, viewedAt: number(时间戳), status: 'normal' }
    const items = ref([])

    const count = computed(() => items.value.length)

    // 按日期分组（今天/昨天/N天前），最新在前
    const groups = computed(() => {
      const map = new Map()
      for (const item of items.value) {
        const label = getDateLabel(item.viewedAt)
        if (!map.has(label)) map.set(label, [])
        map.get(label).push(item)
      }
      const order = ['今天', '昨天']
      return [...map.entries()]
        .sort((a, b) => {
          const ia = order.indexOf(a[0])
          const ib = order.indexOf(b[0])
          if (ia !== -1 && ib !== -1) return ia - ib
          if (ia !== -1) return -1
          if (ib !== -1) return 1
          // 均为 "N天前" 时按天数升序
          return parseInt(a[0], 10) - parseInt(b[0], 10)
        })
        .map(([date, products]) => ({ date, products }))
    })

    // 记录浏览（去重、置顶、更新时间）
    function recordView(product) {
      const existing = items.value.find((i) => i.id === product.id)
      if (existing) {
        existing.viewedAt = Date.now()
        existing.name = product.name ?? existing.name
        existing.price = product.price ?? existing.price
        existing.image = product.image ?? existing.image
        existing.status = 'normal'
        // 移到最前
        items.value = items.value.filter((i) => i.id !== product.id)
        items.value.unshift(existing)
      } else {
        items.value.unshift({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          viewedAt: Date.now(),
          status: 'normal',
        })
        // 限制最大条数，避免无限增长
        if (items.value.length > 100) items.value = items.value.slice(0, 100)
      }
    }

    function removeItem(id) {
      items.value = items.value.filter((i) => i.id !== id)
    }

    function removeItems(ids) {
      const set = new Set(ids)
      items.value = items.value.filter((i) => !set.has(i.id))
    }

    function clear() {
      items.value = []
    }

    return { items, count, groups, recordView, removeItem, removeItems, clear }
  },
  { persist: { key: PERSIST_KEYS.history } },
)
