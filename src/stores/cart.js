import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartItems as mockCart } from '@/mock/data'

export const useCartStore = defineStore('cart', () => {
  const items = ref([...mockCart])

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const checkedItems = computed(() => items.value.filter((item) => item.checked))

  const totalPrice = computed(() =>
    checkedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const checkedCount = computed(() => checkedItems.value.length)

  function updateQuantity(id, quantity) {
    const item = items.value.find((i) => i.id === id)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function batchRemove(ids) {
    if (ids && ids.length > 0) {
      items.value = items.value.filter((i) => !ids.includes(i.id))
    } else {
      items.value = items.value.filter((i) => !i.checked)
    }
  }

  function toggleCheck(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.checked = !item.checked
  }

  function toggleAll(checked) {
    items.value.forEach((item) => {
      item.checked = checked
    })
  }

  function moveToFavorites(ids) {
    const targetIds = ids && ids.length > 0 ? ids : items.value.filter((i) => i.checked).map((i) => i.id)
    // 实际项目中应调用收藏接口，这里仅从购物车移除并打印日志
    console.log('[cart] move to favorites:', targetIds)
    items.value = items.value.filter((i) => !targetIds.includes(i.id))
  }

  return {
    items,
    totalCount,
    checkedItems,
    totalPrice,
    checkedCount,
    updateQuantity,
    removeItem,
    batchRemove,
    toggleCheck,
    toggleAll,
    moveToFavorites,
  }
})
