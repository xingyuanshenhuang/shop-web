<template>
  <el-drawer
    v-model="visible"
    :with-header="false"
    direction="ltr"
    size="50%"
    class="review-drawer"
    append-to-body
    destroy-on-close
    :lock-scroll="false"
  >
    <div class="review-drawer__header">
      <div class="review-drawer__title">
        用户评价
        <span class="review-drawer__count">· {{ totalCount }}</span>
      </div>
      <el-icon class="review-drawer__close" :size="20" @click="close"><Close /></el-icon>
    </div>

    <div class="review-drawer__body">
      <div class="review-filter-tags">
        <span
          v-for="tag in tags"
          :key="tag.label"
          class="review-filter-tag"
          :class="{ active: activeTag === tag.label }"
          @click="activeTag = tag.label"
        >
          {{ tag.label }}
          <template v-if="tag.count !== undefined"> {{ tag.count }}</template>
        </span>
      </div>

      <div class="review-toolbar">
        <div class="review-toolbar__badge">
          <el-icon :size="14" color="#ff8547"><Medal /></el-icon>
          <span>为你展示真实评价</span>
        </div>
        <div class="review-toolbar__right">
          <el-select v-model="sortValue" class="review-sort" popper-class="review-sort-dropdown">
            <el-option
              v-for="opt in sortOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <div class="review-style-filter" @click="styleDialogVisible = true">
            <el-icon :size="14"><Filter /></el-icon>
            <span>款式筛选</span>
          </div>
        </div>
      </div>

      <div class="review-list">
        <div v-for="review in filteredReviews" :key="review.id" class="review-item">
          <img :src="review.avatar" class="review-item__avatar" alt="头像" />
          <div class="review-item__main">
            <div class="review-item__meta">
              <span class="review-item__name">{{ review.user }}</span>
              <span class="review-item__level" v-if="review.level">{{ review.level }}</span>
              <div class="review-item__sub">
                <span>{{ formatDate(review.date) }}</span>
                <span class="review-item__spec">已购：{{ review.spec || '默认款式' }}</span>
              </div>
            </div>
            <p class="review-item__content">{{ review.content }}</p>
            <div v-if="review.images?.length" class="review-item__images">
              <img
                v-for="(img, idx) in review.images"
                :key="idx"
                :src="img"
                class="review-item__img"
                alt="评价图片"
              />
            </div>
            <div v-if="review.append" class="review-item__append">
              <div class="review-item__append-label">追评</div>
              <p class="review-item__append-content">{{ review.append.content }}</p>
              <div v-if="review.append.images?.length" class="review-item__images">
                <img
                  v-for="(img, idx) in review.append.images"
                  :key="idx"
                  :src="img"
                  class="review-item__img"
                  alt="追评图片"
                />
              </div>
            </div>
          </div>
          <div class="review-item__actions">
            <div class="review-action" :class="{ active: review.replyCount > 0 }">
              <el-icon :size="14"><ChatDotRound /></el-icon>
              <span>{{ review.replyCount || 0 }}</span>
            </div>
            <div
              class="review-action"
              :class="{ active: review.isLiked }"
              @click="toggleLike(review)"
            >
              <svg
                class="review-action__like-icon"
                :class="{ filled: review.isLiked }"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path
                  d="M14.17 1.5l.48.16c1.39.49 2.35 1.8 2.35 3.28V9h4.16c.83 0 1.58.4 2.02 1.06.45.66.53 1.5.2 2.23l-3.16 7.36c-.42.98-1.38 1.61-2.45 1.61H3.84V9.5h2.66l3.5-6.3c.55-.99 1.78-1.42 2.84-.97l.07.03L14.17 1.5zM5.84 11v6.26h8.74c.36 0 .69-.2.85-.52l3.16-7.36c.07-.16.04-.34-.07-.47-.1-.13-.27-.2-.44-.2H14.5c-.41 0-.75-.34-.75-.75V4.94c0-.63-.35-1.2-.9-1.48l-.48-.16-.48-.16c-.35-.12-.74.04-.92.36l-3.5 6.3c-.13.23-.37.38-.63.38H5.84z"
                />
              </svg>
              <span>{{ review.likeCount || 0 }}</span>
            </div>
            <div class="review-action">
              <el-icon :size="14"><MoreFilled /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="styleDialogVisible"
      title="款式筛选"
      width="640px"
      :close-on-click-modal="false"
      class="style-filter-dialog"
      append-to-body
      align-center
    >
      <div class="style-filter__body">
        <div class="style-filter__left">
          <img :src="productImage" class="style-filter__product-img" alt="商品图" />
        </div>
        <div class="style-filter__right">
          <div class="style-filter__label">{{ styleFilterLabel }}</div>
          <div class="style-filter__options">
            <div
              v-for="style in styleOptions"
              :key="style.value"
              class="style-filter__option"
              :class="{ active: pendingStyles.includes(style.value), disabled: style.disabled }"
              @click="toggleStyle(style)"
            >
              <img :src="style.image" class="style-filter__option-img" alt="款式图" />
              <span class="style-filter__option-text">{{ style.label }}</span>
              <span v-if="style.tag" class="style-filter__option-tag">{{ style.tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="style-filter__footer">
          <button class="style-filter__btn style-filter__btn--default" @click="clearStyles">
            清空选择
          </button>
          <button class="style-filter__btn style-filter__btn--primary" @click="confirmStyles">
            确定
          </button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Close,
  Medal,
  Filter,
  ChatDotRound,
  MoreFilled,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  totalCount: { type: Number, default: 0 },
  goodRate: { type: String, default: '100%' },
  reviews: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  productImage: { type: String, default: '' },
  styleFilterLabel: { type: String, default: '款式' },
  styleOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const activeTag = ref('全部')
const sortValue = ref('default')
const styleDialogVisible = ref(false)
const selectedStyles = ref([])
const pendingStyles = ref([])

const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '时间排序', value: 'time' },
]

function close() {
  visible.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const filteredReviews = computed(() => {
  let list = [...props.reviews]
  if (activeTag.value === '图/视频') {
    list = list.filter((r) => r.images?.length || r.append?.images?.length)
  } else if (activeTag.value === '追评') {
    list = list.filter((r) => !!r.append)
  } else if (activeTag.value !== '全部') {
    list = list.filter((r) => r.tags?.includes(activeTag.value))
  }
  if (selectedStyles.value.length) {
    list = list.filter((r) => selectedStyles.value.includes(r.spec))
  }
  if (sortValue.value === 'time') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return list
})

function toggleLike(review) {
  review.isLiked = !review.isLiked
  review.likeCount = (review.likeCount || 0) + (review.isLiked ? 1 : -1)
  if (review.isLiked) {
    ElMessage.success('点赞成功')
  }
}

function toggleStyle(style) {
  if (style.disabled) return
  const idx = pendingStyles.value.indexOf(style.value)
  if (idx > -1) {
    pendingStyles.value.splice(idx, 1)
  } else {
    pendingStyles.value.push(style.value)
  }
}

function clearStyles() {
  pendingStyles.value = []
}

function confirmStyles() {
  selectedStyles.value = [...pendingStyles.value]
  styleDialogVisible.value = false
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      activeTag.value = '全部'
      sortValue.value = 'default'
    }
  }
)

// 打开款式筛选对话框时，从已确认的筛选中初始化待选状态
watch(styleDialogVisible, (val) => {
  if (val) {
    pendingStyles.value = [...selectedStyles.value]
  }
})
</script>

<style scoped>
.review-drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.review-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.review-drawer__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.review-drawer__count {
  color: var(--color-text-light);
  font-weight: 400;
  margin-left: 4px;
}

.review-drawer__close {
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.review-drawer__close:hover {
  color: var(--color-text-dark);
}

.review-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 24px;
}

.review-filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.review-filter-tag {
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.review-filter-tag:hover,
.review-filter-tag.active {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.review-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.review-toolbar__badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-deep-orange);
  flex-shrink: 0;
}

.review-toolbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.review-sort {
  width: 110px;
}

.review-sort :deep(.el-input__wrapper) {
  box-shadow: none;
  padding: 0;
}

.review-sort :deep(.el-input__inner) {
  font-size: 13px;
  color: var(--color-text-mid);
}

.review-sort :deep(.el-select__icon) {
  color: var(--color-text-light);
}

.review-style-filter {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: color var(--transition-fast);
  flex-shrink: 0;
}

.review-style-filter:hover {
  color: var(--color-primary);
}

.review-list {
  display: flex;
  flex-direction: column;
}

.review-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.review-item:last-child {
  border-bottom: none;
}

.review-item__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.review-item__main {
  flex: 1;
  min-width: 0;
}

.review-item__meta {
  margin-bottom: 8px;
}

.review-item__name {
  font-size: 14px;
  color: var(--color-text-dark);
  font-weight: 500;
  margin-right: 6px;
}

.review-item__level {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, #ff8547, #ff5000);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  margin-right: 6px;
}

.review-item__sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-light);
  margin-top: 4px;
}

.review-item__spec {
  position: relative;
  padding-left: 8px;
}

.review-item__spec::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 10px;
  background: var(--color-border);
}

.review-item__content {
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-dark);
  margin: 0 0 8px;
  word-break: break-word;
}

.review-item__images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.review-item__img {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.review-item__img:hover {
  opacity: 0.9;
}

.review-item__append {
  margin-top: 10px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: var(--radius-btn);
}

.review-item__append-label {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 6px;
}

.review-item__append-content {
  font-size: 13px;
  line-height: 20px;
  color: var(--color-text-dark);
  margin: 0 0 8px;
}

.review-item__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
  padding-top: 4px;
}

.review-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.review-action:hover,
.review-action.active {
  color: var(--color-primary);
}

.review-action__like-icon {
  fill: currentColor;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.review-action__like-icon.filled {
  opacity: 1;
}

.style-filter-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  margin-right: 0;
  border-bottom: 1px solid var(--color-border);
}

.style-filter-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.style-filter-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.style-filter__body {
  display: flex;
  gap: 20px;
  min-height: 260px;
}

.style-filter__left {
  flex: 0 0 180px;
}

.style-filter__product-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}

.style-filter__right {
  flex: 1;
  min-width: 0;
}

.style-filter__label {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 12px;
}

.style-filter__options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.style-filter__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.style-filter__option:hover {
  border-color: var(--color-primary);
}

.style-filter__option.active {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

.style-filter__option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.style-filter__option-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.style-filter__option-text {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.style-filter__option-tag {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
}

.style-filter__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.style-filter__btn {
  padding: 10px 24px;
  border-radius: var(--radius-btn);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.style-filter__btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.style-filter__btn--primary:hover {
  background: var(--color-primary-hover);
}

.style-filter__btn--default {
  background: #fff;
  color: var(--color-text-mid);
  border-color: var(--color-border);
}

.style-filter__btn--default:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .review-drawer :deep(.el-drawer) {
    width: 100% !important;
  }

  .review-toolbar {
    flex-wrap: wrap;
  }

  .review-toolbar__right {
    margin-left: auto;
  }

  .review-item__actions {
    flex-direction: row;
    align-items: center;
    padding-top: 0;
  }

  .style-filter-dialog :deep(.el-dialog) {
    width: 90% !important;
  }

  .style-filter__body {
    flex-direction: column;
  }

  .style-filter__left {
    flex: 0 0 auto;
    width: 140px;
  }

  .style-filter__footer {
    justify-content: space-between;
  }
}
</style>

<style>
.review-sort-dropdown .el-select-dropdown__item {
  font-size: 13px;
}
</style>
