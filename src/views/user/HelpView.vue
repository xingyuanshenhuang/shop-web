<template>
  <div class="help-view">
    <div class="help-view__header">
      <h3>帮助中心</h3>
    </div>
    <div class="help-search">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索常见问题"
        size="large"
        class="help-search__input"
      >
        <template #prefix
          ><el-icon><Search /></el-icon
        ></template>
      </el-input>
    </div>
    <div class="help-quick">
      <div v-for="entry in quickEntries" :key="entry.title" class="help-quick__item">
        <span class="help-quick__icon">{{ entry.icon }}</span>
        <div>
          <div class="help-quick__title">{{ entry.title }}</div>
          <div class="help-quick__desc">{{ entry.desc }}</div>
        </div>
      </div>
    </div>
    <div class="help-faq">
      <div v-for="cat in faqCategories" :key="cat.name" class="faq-category">
        <div class="faq-category__header" @click="toggleCategory(cat.name)">
          <span>{{ cat.icon }} {{ cat.name }}</span>
          <el-icon :class="{ rotated: expandedCategories.includes(cat.name) }"
            ><ArrowDown
          /></el-icon>
        </div>
        <div v-if="expandedCategories.includes(cat.name)" class="faq-category__list">
          <div v-for="q in cat.questions" :key="q" class="faq-item" @click="selectedQuestion = q">
            <span>{{ q }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="help-footer">
      <span style="font-size: 12px; color: var(--color-text-light)">没有找到答案？</span>
      <el-button>联系人工客服</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import { faqCategories } from '@/mock/data'

const searchKeyword = ref('')
const expandedCategories = ref(['购物流程'])
const selectedQuestion = ref('')

const quickEntries = [
  { icon: '💬', title: '在线客服', desc: '平均响应时间 < 30秒' },
  { icon: '📞', title: '电话客服', desc: '400-XXX-XXXX' },
  { icon: '✉️', title: '投诉建议', desc: '我们会尽快处理' },
]

function toggleCategory(name) {
  const idx = expandedCategories.value.indexOf(name)
  if (idx > -1) expandedCategories.value.splice(idx, 1)
  else expandedCategories.value.push(name)
}
</script>

<style scoped>
.help-view__header {
  margin-bottom: 16px;
}

.help-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.help-search {
  margin-bottom: 16px;
}

.help-search__input :deep(.el-input__wrapper) {
  border-radius: var(--radius-pill);
  background: var(--color-warm-bg);
}

.help-quick {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.help-quick__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}

.help-quick__item:hover {
  box-shadow: var(--shadow-card);
}

.help-quick__icon {
  font-size: 32px;
}

.help-quick__title {
  font-size: 14px;
  font-weight: 600;
}

.help-quick__desc {
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 2px;
}

.faq-category {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  margin-bottom: 8px;
  overflow: hidden;
}

.faq-category__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background var(--transition-fast);
}

.faq-category__header:hover {
  background: var(--color-warm-bg);
}

.faq-category__header .el-icon {
  transition: transform var(--transition-fast);
}

.faq-category__header .el-icon.rotated {
  transform: rotate(180deg);
}

.faq-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 24px 0 48px;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  border-top: 1px solid var(--color-border);
  transition: color var(--transition-fast);
}

.faq-item:hover {
  color: var(--color-primary);
}

.help-footer {
  text-align: center;
  padding: 24px;
}

@media (max-width: 768px) {
  .help-quick {
    grid-template-columns: 1fr;
  }
}
</style>
