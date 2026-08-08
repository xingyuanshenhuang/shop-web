import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartItems as mockCart } from '@/mock/data'
import { useFavoritesStore } from './favorites'

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
    // 获取要收藏的商品列表
    const itemsToFav = items.value.filter((i) => targetIds.includes(i.id))
    // 调用收藏夹store添加收藏
    const favoritesStore = useFavoritesStore()
    favoritesStore.addFromCart(itemsToFav)
    // 从购物车移除
    items.value = items.value.filter((i) => !targetIds.includes(i.id))
  }

  function addItem(product) {
    // 检查是否已存在相同商品
    const existing = items.value.find(
      (i) => i.productId === product.productId && i.spec === product.spec,
    )
    if (existing) {
      existing.quantity += product.quantity || 1
      existing.checked = true
    } else {
      items.value.push({
        id: Date.now(),
        productId: product.productId,
        name: product.name,
        spec: product.spec,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.image,
        checked: true,
      })
    }
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
    addItem,
  }
})
