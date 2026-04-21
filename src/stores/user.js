import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userInfo as mockUser } from '@/mock/data'

export const useUserStore = defineStore('user', () => {
  const user = ref({ ...mockUser })
  const isCollected = ref(false)

  function toggleCollect() {
    isCollected.value = !isCollected.value
  }

  return { user, isCollected, toggleCollect }
})
