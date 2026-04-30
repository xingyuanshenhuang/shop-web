import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orderSelectedStatus = ref('')
  const updateSelectedStatus = (status) => {
    orderSelectedStatus.value = status
  }

  return { orderSelectedStatus, updateSelectedStatus }
})
