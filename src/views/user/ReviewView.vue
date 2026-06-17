<template>
  <div class="review-view">
    <div class="review-view__header">
      <h3>评价管理</h3>
      <div class="review-view__tabs">
        <span
          class="review-tab"
          :class="{ active: currentTab === 'pending' }"
          @click="currentTab = 'pending'"
          >待评价</span
        >
        <span
          class="review-tab"
          :class="{ active: currentTab === 'reviewed' }"
          @click="currentTab = 'reviewed'"
          >已评价</span
        >
        <span class="review-view__count">共 {{ totalCount }} 条</span>
      </div>
    </div>

    <div v-if="currentTab === 'pending'" class="review-list">
      <div v-if="pendingList.length">
        <div v-for="item in pendingList" :key="item.id" class="pending-card">
          <div class="pending-card__info">
            <img :src="item.image" class="pending-card__img" />
            <div class="pending-card__detail">
              <span class="pending-card__name text-truncate">{{ item.name }}</span>
              <span class="pending-card__spec">{{ item.spec }}</span>
            </div>
            <button class="pending-card__btn" @click="openReviewDialog(item)">去评价</button>
          </div>
        </div>
      </div>
      <div v-else class="review-empty">
        <el-icon :size="80" color="#E0D6CE"><ChatDotRound /></el-icon>
        <span>暂无待评价商品</span>
        <el-button type="primary" plain @click="$router.push('/')">去逛逛</el-button>
      </div>
    </div>

    <div v-if="currentTab === 'reviewed'" class="review-list">
      <div v-if="reviewedList.length">
        <div v-for="item in reviewedList" :key="item.id" class="reviewed-card">
          <div class="reviewed-card__info">
            <img :src="item.image" class="reviewed-card__img" />
            <div class="reviewed-card__detail">
              <span class="reviewed-card__name text-truncate">{{ item.name }}</span>
              <span class="reviewed-card__spec">{{ item.spec }}</span>
            </div>
            <div class="reviewed-card__meta">
              <span class="reviewed-card__date">{{ item.reviewDate }}</span>
              <a class="reviewed-card__link">查看详情 &gt;</a>
            </div>
          </div>
          <div class="reviewed-card__content">
            <div class="reviewed-card__stars">
              <el-icon
                v-for="i in 5"
                :key="i"
                :size="16"
                :color="i <= item.rating ? '#FF8547' : '#E0D6CE'"
                ><Star
              /></el-icon>
            </div>
            <p class="reviewed-card__text" :class="{ expanded: expandedReviews[item.id] }">
              {{ item.content }}
            </p>
            <a
              v-if="item.content.length > 60"
              class="reviewed-card__expand"
              @click="toggleExpand(item.id)"
              >{{ expandedReviews[item.id] ? '收起' : '展开全部' }}</a
            >
            <div v-if="item.images && item.images.length" class="reviewed-card__images">
              <img
                v-for="(img, idx) in item.images"
                :key="idx"
                :src="img"
                class="reviewed-card__review-img"
              />
            </div>
            <div v-if="item.merchantReply" class="reviewed-card__reply">
              <span class="reviewed-card__reply-label">商家回复</span>
              <span class="reviewed-card__reply-text">{{ item.merchantReply }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="review-empty">
        <el-icon :size="80" color="#E0D6CE"><ChatDotRound /></el-icon>
        <span>暂无已评价商品</span>
      </div>
    </div>

    <div v-if="totalPages > 1" class="review-pagination">
      <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
        &lt;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="pagination-btn"
        :class="{ active: currentPage === page }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
        &gt;
      </button>
    </div>

    <el-dialog
      v-model="showReviewDialog"
      title=""
      width="560px"
      :close-on-click-modal="false"
      class="review-dialog"
    >
      <div class="review-dialog__header">
        <img :src="reviewingItem?.image" class="review-dialog__product-img" />
        <div class="review-dialog__product-info">
          <span class="review-dialog__product-name text-truncate">{{ reviewingItem?.name }}</span>
          <span class="review-dialog__product-spec">{{ reviewingItem?.spec }}</span>
        </div>
      </div>

      <div class="review-dialog__rating">
        <span class="review-dialog__label">商品评分</span>
        <div class="review-dialog__stars">
          <el-icon
            v-for="i in 5"
            :key="i"
            :size="24"
            :color="i <= reviewRating ? '#FF8547' : '#E0D6CE'"
            style="cursor: pointer"
            @click="reviewRating = i"
            @mouseenter="hoverRating = i"
            @mouseleave="hoverRating = 0"
            ><Star
          /></el-icon>
        </div>
        <span class="review-dialog__rating-desc">{{ ratingDesc }}</span>
      </div>

      <div class="review-dialog__tags">
        <span class="review-dialog__label">快捷标签</span>
        <div class="review-dialog__tag-list">
          <span
            v-for="tag in quickTags"
            :key="tag"
            class="review-tag"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
            >{{ tag }}</span
          >
        </div>
      </div>

      <div class="review-dialog__input-area">
        <el-input
          v-model="reviewContent"
          type="textarea"
          :rows="5"
          placeholder="分享你的使用体验吧…"
          maxlength="500"
          show-word-limit
          resize="none"
        />
      </div>

      <div class="review-dialog__upload">
        <span class="review-dialog__upload-label">上传图片（可选）</span>
        <div class="review-dialog__upload-slots">
          <div
            v-for="(img, idx) in uploadedImages"
            :key="idx"
            class="upload-slot upload-slot--filled"
          >
            <img :src="img" class="upload-slot__img" />
            <span class="upload-slot__delete" @click="uploadedImages.splice(idx, 1)">×</span>
          </div>
          <div
            v-if="uploadedImages.length < 9"
            class="upload-slot upload-slot--empty"
            @click="simulateUpload"
          >
            <el-icon :size="24" color="#CCCCCC"><Plus /></el-icon>
          </div>
        </div>
      </div>

      <div class="review-dialog__anonymous">
        <span>匿名评价</span>
        <el-switch v-model="isAnonymous" />
      </div>

      <template #footer>
        <div class="review-dialog__footer">
          <el-button @click="showReviewDialog = false">暂不评价</el-button>
          <el-button type="primary" @click="submitReview">发布评价</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Star, Plus } from '@element-plus/icons-vue'
import { pendingReviews, reviewedItems } from '@/mock/data'

const currentTab = ref('pending')
const currentPage = ref(1)
const pageSize = 5

const pendingList = ref([...pendingReviews])
const reviewedList = ref([...reviewedItems])

const totalCount = computed(() => {
  return currentTab.value === 'pending' ? pendingList.value.length : reviewedList.value.length
})

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

const expandedReviews = reactive({})

function toggleExpand(id) {
  expandedReviews[id] = !expandedReviews[id]
}

const showReviewDialog = ref(false)
const reviewingItem = ref(null)
const reviewRating = ref(5)
const hoverRating = ref(0)
const reviewContent = ref('')
const selectedTags = ref([])
const uploadedImages = ref([])
const isAnonymous = ref(false)

const quickTags = ['质量好', '物流快', '包装好', '性价比高', '描述相符', '服务态度好']

const ratingDescs = {
  1: '很差',
  2: '一般',
  3: '满意',
  4: '很好',
  5: '非常好',
}

const ratingDesc = computed(() => {
  const r = hoverRating.value || reviewRating.value
  return ratingDescs[r] || ''
})

function openReviewDialog(item) {
  reviewingItem.value = item
  reviewRating.value = 5
  hoverRating.value = 0
  reviewContent.value = ''
  selectedTags.value = []
  uploadedImages.value = []
  isAnonymous.value = false
  showReviewDialog.value = true
}

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function simulateUpload() {
  const seed = `upload${Date.now()}`
  uploadedImages.value.push(`https://picsum.photos/seed/${seed}/200/200`)
}

function submitReview() {
  if (!reviewContent.value.trim()) {
    ElMessage.warning('请输入评价内容')
    return
  }
  showReviewDialog.value = false
  ElMessage({
    message: '评价发布成功 ✓',
    type: 'success',
    duration: 2000,
  })
  if (reviewingItem.value) {
    const idx = pendingList.value.findIndex((i) => i.id === reviewingItem.value.id)
    if (idx > -1) {
      pendingList.value.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
.review-view__header {
  margin-bottom: 16px;
}

.review-view__header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 12px 0;
}

.review-view__tabs {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
}

.review-tab {
  padding: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.review-tab:hover,
.review-tab.active {
  color: var(--color-primary);
  font-weight: 600;
}

.review-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.review-view__count {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-light);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pending-card {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.pending-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.pending-card__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pending-card__img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.pending-card__detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pending-card__name {
  font-size: 14px;
  color: var(--color-text-dark);
}

.pending-card__spec {
  font-size: 12px;
  color: var(--color-text-light);
}

.pending-card__btn {
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 13px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background var(--transition-fast);
  flex-shrink: 0;
}

.pending-card__btn:hover {
  background: var(--color-primary-hover);
}

.reviewed-card {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.reviewed-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.reviewed-card__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewed-card__img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.reviewed-card__detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewed-card__name {
  font-size: 14px;
  color: var(--color-text-dark);
}

.reviewed-card__spec {
  font-size: 12px;
  color: var(--color-text-light);
}

.reviewed-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.reviewed-card__date {
  font-size: 12px;
  color: var(--color-text-light);
}

.reviewed-card__link {
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
}

.reviewed-card__content {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--color-border);
}

.reviewed-card__stars {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.reviewed-card__text {
  font-size: 14px;
  color: var(--color-text-dark);
  line-height: 22px;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reviewed-card__text.expanded {
  -webkit-line-clamp: unset;
}

.reviewed-card__expand {
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
  display: inline-block;
  margin-bottom: 8px;
}

.reviewed-card__images {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.reviewed-card__review-img {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  cursor: pointer;
}

.reviewed-card__reply {
  margin-left: 12px;
  background: #f5f5f5;
  border-radius: var(--radius-btn);
  padding: 8px 12px;
}

.reviewed-card__reply-label {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
  margin-right: 8px;
}

.reviewed-card__reply-text {
  font-size: 12px;
  color: var(--color-text-mid);
}

.review-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 0;
}

.review-empty span {
  font-size: 14px;
  color: var(--color-text-light);
}

.review-pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-mid);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  font-weight: 600;
}

.pagination-btn:disabled {
  color: #e0d6ce;
  cursor: not-allowed;
}

.review-dialog__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.review-dialog__product-img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.review-dialog__product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.review-dialog__product-name {
  font-size: 14px;
  color: var(--color-text-dark);
}

.review-dialog__product-spec {
  font-size: 12px;
  color: var(--color-text-light);
}

.review-dialog__rating {
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-dialog__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.review-dialog__stars {
  display: flex;
  gap: 8px;
}

.review-dialog__rating-desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.review-dialog__tags {
  padding-bottom: 12px;
}

.review-dialog__tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.review-tag {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  background: var(--color-warm-bg);
  color: var(--color-text-mid);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.review-tag.active {
  background: var(--color-light-orange);
  color: var(--color-primary);
}

.review-dialog__input-area {
  padding-bottom: 12px;
}

.review-dialog__upload {
  padding-bottom: 16px;
}

.review-dialog__upload-label {
  font-size: 12px;
  color: var(--color-text-light);
  display: block;
  margin-bottom: 8px;
}

.review-dialog__upload-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-slot {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-btn);
  position: relative;
}

.upload-slot--empty {
  border: 1px dashed #e0d6ce;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.upload-slot--empty:hover {
  border-color: var(--color-primary);
}

.upload-slot--filled {
  overflow: hidden;
}

.upload-slot__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-slot__delete {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text-mid);
  cursor: pointer;
}

.review-dialog__anonymous {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  font-size: 14px;
  color: var(--color-text-dark);
}

.review-dialog__footer {
  display: flex;
  justify-content: space-between;
}
</style>
