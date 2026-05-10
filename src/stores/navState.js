import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavStore = defineStore('nav', () => {
  const navSelectedStatus = ref('')
  const updateSelectedStatus = (status) => {
    navSelectedStatus.value = status
  }

  return { navSelectedStatus, updateSelectedStatus }
})
