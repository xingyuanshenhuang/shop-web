<template>
  <div class="history-view">
    <div class="history-view__header">
      <h3>我的足迹</h3>
      <el-button text size="small" @click="showClearDialog = true">清空</el-button>
    </div>
    <div v-for="group in browsingHistory" :key="group.date" class="history-group">
      <h4 class="history-group__title">{{ group.date }}</h4>
      <div class="history-grid">
        <div
          v-for="product in group.products"
          :key="product.id"
          class="history-item"
          @click="$router.push(`/product/${product.id}`)"
        >
          <img :src="product.image" class="history-item__img" />
          <span class="history-item__name text-truncate">{{ product.name }}</span>
          <span class="price price-sm">¥{{ product.price }}</span>
          <el-icon class="history-item__delete" :size="14" @click.stop><Close /></el-icon>
        </div>
      </div>
    </div>

    <el-dialog v-model="showClearDialog" title="确认清空" width="360px">
      <p>确定清空所有浏览记录吗？</p>
      <template #footer>
        <el-button @click="showClearDialog = false">取消</el-button>
        <el-button type="danger" @click="showClearDialog = false">清空</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { browsingHistory } from '@/mock/data'

const showClearDialog = ref(false)
</script>

<style scoped>
.history-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.history-group {
  margin-bottom: 24px;
}

.history-group__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.history-item {
  background: var(--color-bg-white);
  border-radius: var(--radius-btn);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: box-shadow var(--transition-fast);
}

.history-item:hover {
  box-shadow: var(--shadow-card);
}

.history-item__img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-btn);
}

.history-item__name {
  display: block;
  font-size: 12px;
  padding: 4px 8px 0;
}

.history-item__delete {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 2px;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.history-item__delete:hover {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .history-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
