import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favoriteProducts } from '@/mock/data'
import { PERSIST_KEYS } from './persistenceConfig'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref([...favoriteProducts])

  const count = computed(() => items.value.length)

  // 检查商品是否已收藏
  function isFavorite(productId) {
    return items.value.some((item) => item.id === productId)
  }

  // 添加收藏（从购物车商品）
  function addFromCart(cartItems) {
    cartItems.forEach((cartItem) => {
      // 避免重复收藏
      if (!isFavorite(cartItem.productId)) {
        items.value.push({
          id: cartItem.productId,
          name: cartItem.name,
          price: cartItem.price,
          image: cartItem.image,
        })
      }
    })
  }

  // 添加收藏（单个商品）
  function addFavorite(product) {
    if (!isFavorite(product.id)) {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  // 取消收藏
  function removeFavorite(productId) {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  return {
    items,
    count,
    isFavorite,
    addFromCart,
    addFavorite,
    removeFavorite,
  }
}, { persist: { key: PERSIST_KEYS.favorites } })
