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

  function toggleCheck(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.checked = !item.checked
  }

  function toggleAll(checked) {
    items.value.forEach((item) => {
      item.checked = checked
    })
  }

  return {
    items,
    totalCount,
    checkedItems,
    totalPrice,
    checkedCount,
    updateQuantity,
    removeItem,
    toggleCheck,
    toggleAll,
  }
})
