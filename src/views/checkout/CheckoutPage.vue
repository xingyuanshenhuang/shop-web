<template>
  <div class="checkout-page">
    <!-- 顶部：Logo + 确认订单 -->
    <div class="checkout-topbar">
      <div class="checkout-topbar__inner">
        <router-link to="/" class="checkout-logo">
          <span class="checkout-logo__main">淘宝</span>
          <span class="checkout-logo__sub">确认订单</span>
        </router-link>
      </div>
    </div>

    <div class="checkout-page__inner">
      <!-- 确认订单 -->
      <div v-if="currentStep === 0" class="checkout-content">
        <div class="checkout-main">
          <!-- 左侧：地址 + 订单信息 + 顺手买 -->
          <div class="checkout-left">
            <!-- 确认收货地址 -->
            <div class="checkout-section checkout-address">
              <div class="section-header">
                <h3 class="section-title">确认收货地址</h3>
                <div class="section-actions">
                  <button class="section-action" @click="showAddAddress = true">使用新地址</button>
                  <button class="section-action" @click="showAddressDialog = true">管理地址</button>
                </div>
              </div>
              <div v-if="selectedAddress" class="address-card address-card--selected">
                <div class="address-card__tag">默认</div>
                <div class="address-card__info">
                  <p class="address-card__loc">
                    {{ selectedAddress.province }}{{ selectedAddress.city
                    }}{{ selectedAddress.district }}
                  </p>
                  <p class="address-card__detail">{{ selectedAddress.detail }}</p>
                  <p class="address-card__user">
                    <span>{{ selectedAddress.name }}</span>
                    <span>{{ selectedAddress.phone }}</span>
                  </p>
                </div>
              </div>
              <div v-else class="address-empty">
                <p>暂无收货地址，请先添加收货地址</p>
                <el-button type="primary" @click="showAddAddress = true">添加地址</el-button>
              </div>
            </div>

            <!-- 确认订单信息 -->
            <div class="checkout-section checkout-order">
              <h3 class="section-title">确认订单信息</h3>
              <div class="order-shop">
                <span class="shop-tag">天猫</span>
                <span class="shop-name">源氏木语旗舰店</span>
              </div>
              <div class="order-header-row">
                <span class="order-header__name">店铺宝贝</span>
                <span class="order-header__attr">商品属性</span>
                <span class="order-header__qty">数量</span>
                <span class="order-header__price">价格</span>
              </div>
              <div class="order-items">
                <div v-for="item in cartStore.checkedItems" :key="item.id" class="order-item">
                  <div class="order-item__product">
                    <img :src="item.image" class="order-item__img" />
                    <div class="order-item__info">
                      <span class="order-item__name">{{ item.name }}</span>
                      <span class="order-item__spec">{{ item.spec }}</span>
                      <span class="order-item__service">7天无理由退换 如实描述 支持信用卡支付</span>
                    </div>
                  </div>
                  <div class="order-item__attr">
                    <span>口味：{{ item.spec }}</span>
                  </div>
                  <div class="order-item__qty">
                    <el-input-number v-model="item.quantity" :min="1" :max="99" size="small" />
                  </div>
                  <div class="order-item__price">
                    <span class="price price-sm">¥{{ item.price }}</span>
                    <span class="order-item__original"
                      >¥{{ item.originalPrice || (item.price * 1.5).toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="order-extras">
                <div class="order-extra">
                  <span class="order-extra__label">发票</span>
                  <div class="order-extra__content">
                    <el-checkbox v-model="needInvoice">我需要开具发票</el-checkbox>
                  </div>
                </div>
                <div class="order-extra order-extra--delivery">
                  <span class="order-extra__label">配送服务</span>
                  <div class="order-extra__content">
                    <span class="delivery-type">{{ currentDelivery.type }}</span>
                    <el-select
                      v-model="selectedDelivery"
                      class="delivery-select"
                      popper-class="delivery-select__dropdown"
                    >
                      <el-option
                        v-for="option in deliveryOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      >
                        <div class="delivery-option">
                          <span class="delivery-option__label">{{ option.label }}</span>
                          <span v-if="option.fee > 0" class="delivery-option__fee"
                            >¥{{ option.fee.toFixed(2) }}</span
                          >
                        </div>
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="order-extra order-extra--remark">
                  <span class="order-extra__label">订单备注</span>
                  <div class="order-extra__content">
                    <el-input
                      v-model="orderRemark"
                      type="textarea"
                      :rows="2"
                      resize="none"
                      maxlength="200"
                      show-word-limit
                      placeholder="请输入，付款后商家可见，建议先和商家协商一致"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 顺手买 -->
            <div ref="upsellRef" class="checkout-section checkout-upsell">
              <h3 class="section-title">顺手买</h3>
              <div class="upsell-container">
                <button
                  v-if="upsellCurrentPage > 0"
                  class="upsell-nav-btn upsell-nav-btn--prev"
                  @click="prevUpsellPage"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </button>
                <div class="upsell-list-wrapper">
                  <div
                    class="upsell-list"
                    :style="{
                      transform: `translateX(-${upsellCurrentPage * (100 / (upsellProducts.length / ITEMS_PER_PAGE))}%)`,
                      width: `${(upsellProducts.length / ITEMS_PER_PAGE) * 100}%`,
                    }"
                  >
                    <div
                      v-for="product in upsellProducts"
                      :key="product.id"
                      class="upsell-card"
                      :class="{
                        'upsell-card--selected': selectedUpsellProducts.includes(product.id),
                      }"
                      @click="toggleUpsellProduct(product)"
                    >
                      <img :src="product.image" class="upsell-card__img" />
                      <div class="upsell-card__info">
                        <p class="upsell-card__name">{{ product.name }}</p>
                        <p class="upsell-card__tags">
                          <span class="upsell-tag">假一赔四</span>
                          <span class="upsell-tag">退货宝</span>
                          <span class="upsell-tag">破损包退</span>
                          <span class="upsell-tag upsell-tag--shop">我买过的店</span>
                        </p>
                        <div class="upsell-card__bottom">
                          <div class="upsell-card__price">
                            <span class="price price-sm">¥{{ product.price }}</span>
                            <span class="upsell-card__original"
                              >¥{{ product.originalPrice || (product.price * 2).toFixed(2) }}</span
                            >
                          </div>
                          <div class="upsell-card__shop">
                            <span class="shop-tag">天猫</span>
                            <span class="upsell-shop-name">{{ product.shop || '官方旗舰店' }}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="selectedUpsellProducts.includes(product.id)"
                        class="upsell-card__selected-badge"
                      >
                        <el-icon><Checked /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  v-if="upsellCurrentPage < Math.ceil(upsellProducts.length / ITEMS_PER_PAGE) - 1"
                  class="upsell-nav-btn upsell-nav-btn--next"
                  @click="nextUpsellPage"
                >
                  <el-icon><ArrowRight /></el-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧：付款详情 -->
          <div class="checkout-right">
            <!-- 占位符，用于固定时避免布局跳动 -->
            <div
              v-if="isSummaryFixed"
              class="checkout-summary-placeholder"
              :style="{ height: summaryHeight + 'px' }"
            ></div>
            <div
              ref="summaryRef"
              class="checkout-summary sticky"
              :class="{
                'is-fixed': isSummaryFixed && summaryStyle.position === 'fixed',
                'is-absolute': isSummaryFixed && summaryStyle.position === 'absolute',
              }"
              :style="summaryStyle"
            >
              <div class="summary-header">
                <span class="summary-title">付款详情</span>
                <span class="summary-count"
                  >共 {{ cartStore.checkedCount + selectedUpsellProducts.length }} 件商品</span
                >
              </div>
              <div class="summary-rows">
                <div class="summary-row">
                  <span>商品总价</span>
                  <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
                </div>
                <div v-if="selectedUpsellPrice > 0" class="summary-row summary-row--upsell">
                  <div class="summary-row__label">
                    <el-icon class="discount-icon" color="#52C41A"><Checked /></el-icon>
                    <span>顺手买特惠</span>
                  </div>
                  <span class="upsell-amount">+¥{{ selectedUpsellPrice.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-row--discount">
                  <div class="summary-row__label">
                    <span class="discount-tag">店铺优惠</span>
                    <span class="discount-desc">限时立减</span>
                  </div>
                  <span class="discount-amount">-¥{{ storeDiscount.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-row--discount">
                  <div class="summary-row__label">
                    <span class="discount-tag discount-tag--sub">店铺优惠</span>
                    <span class="discount-desc">限时立减</span>
                  </div>
                  <span class="discount-amount">-¥{{ storeDiscount2.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-row--discount">
                  <div class="summary-row__label">
                    <el-icon class="discount-icon" color="#FF5000"><Checked /></el-icon>
                    <span class="discount-tag discount-tag--platform">平台优惠</span>
                  </div>
                  <span class="discount-amount">-¥{{ platformDiscount.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-row--discount">
                  <div class="summary-row__label">
                    <el-icon class="discount-icon" color="#FF5000"><Checked /></el-icon>
                    <span>淘金币</span>
                  </div>
                  <span class="discount-amount">-¥{{ coinDiscount.toFixed(2) }}</span>
                </div>
                <div class="summary-row summary-row--discount">
                  <div class="summary-row__label">
                    <el-icon class="discount-icon" color="#FF5000"><Checked /></el-icon>
                    <span>红包</span>
                  </div>
                  <span class="discount-desc">不可用</span>
                </div>
              </div>
              <div class="summary-total">
                <span class="summary-total__label">优惠共减</span>
                <span class="summary-total__discount">-¥{{ totalDiscount.toFixed(2) }}</span>
                <span class="summary-total__amount">合计 ¥{{ finalPrice.toFixed(2) }}</span>
              </div>

              <div class="summary-payment">
                <div
                  v-for="method in paymentMethods"
                  :key="method.name"
                  class="summary-payment__item"
                  :class="{ active: selectedPayment === method.name }"
                  @click="selectedPayment = method.name"
                >
                  <span
                    class="payment-radio"
                    :class="{ checked: selectedPayment === method.name }"
                  ></span>
                  <span class="payment-icon">{{ method.icon }}</span>
                  <span class="payment-name">{{ method.name }}</span>
                </div>
                <div
                  class="summary-payment__item summary-payment__item--protect"
                  @click="isPhoneProtected = !isPhoneProtected"
                >
                  <span class="payment-radio" :class="{ checked: isPhoneProtected }"></span>
                  <el-icon class="protect-icon" color="#FF5000"><Checked /></el-icon>
                  <span class="payment-name">号码保护中</span>
                  <span class="protect-desc">匿名购买并隐藏真实手机号</span>
                </div>
              </div>

              <div class="summary-actions">
                <button class="summary-btn summary-btn--back" @click="$router.push('/cart')">
                  返回
                </button>
                <button
                  ref="payBtnRef"
                  class="summary-btn summary-btn--pay"
                  :disabled="isProcessing"
                  @click="payOrder"
                >
                  {{ isProcessing ? '支付处理中...' : `立即支付¥${finalPrice.toFixed(2)}` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 小屏浮动结算框 -->
      <div
        v-if="currentStep === 0"
        class="checkout-float-summary"
        :class="{ 'is-visible': !isPayButtonVisible }"
      >
        <div class="checkout-float-summary__main">
          <button
            class="checkout-float-summary__toggle"
            @click="showFloatDetail = !showFloatDetail"
          >
            <span>查看付款详情</span>
            <el-icon :class="{ 'is-open': showFloatDetail }"><ArrowUp /></el-icon>
          </button>
          <button class="checkout-float-summary__back" @click="$router.push('/cart')">返回</button>
          <button class="checkout-float-summary__pay" :disabled="isProcessing" @click="payOrder">
            {{ isProcessing ? '支付处理中...' : `立即支付¥${finalPrice.toFixed(2)}` }}
          </button>
        </div>
        <transition name="detail-slide">
          <div v-if="showFloatDetail" class="checkout-float-summary__detail">
            <div class="detail-row">
              <span>商品总价</span>
              <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div v-if="selectedUpsellPrice > 0" class="detail-row">
              <span>顺手买特惠</span>
              <span class="upsell-amount">+¥{{ selectedUpsellPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>店铺优惠</span>
              <span class="discount-amount"
                >-¥{{ (storeDiscount + storeDiscount2).toFixed(2) }}</span
              >
            </div>
            <div class="detail-row">
              <span>平台优惠</span>
              <span class="discount-amount">-¥{{ platformDiscount.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span>淘金币</span>
              <span class="discount-amount">-¥{{ coinDiscount.toFixed(2) }}</span>
            </div>
            <div class="detail-row detail-row--total">
              <span>优惠共减</span>
              <span class="discount-amount">-¥{{ totalDiscount.toFixed(2) }}</span>
            </div>
            <div class="detail-row detail-row--final">
              <span>合计</span>
              <span>¥{{ finalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- 支付结果 -->
      <div
        v-if="currentStep === 1"
        class="payment-result"
        :class="`payment-result--${paymentResult}`"
      >
        <div class="payment-result__icon">
          <el-icon v-if="paymentResult === 'success'"><CircleCheck /></el-icon>
          <el-icon v-else><CircleClose /></el-icon>
        </div>
        <h2 class="payment-result__title">
          {{ paymentResult === 'success' ? '支付成功！' : '支付失败' }}
        </h2>
        <p class="payment-result__desc">
          {{ paymentResult === 'success' ? `订单编号：${orderId}` : failReason }}
        </p>
        <div class="payment-result__actions">
          <template v-if="paymentResult === 'success'">
            <el-button type="primary" size="large" @click="$router.push('/user?tab=orders')">
              查看订单
            </el-button>
            <el-button size="large" @click="$router.push('/')">继续购物</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="large" @click="retryPay">重新支付</el-button>
            <el-button size="large" @click="changePayMethod">更换支付方式</el-button>
          </template>
        </div>
        <div class="payment-result__secondary">
          <template v-if="paymentResult === 'success'">
            <el-button link @click="$router.push('/')">返回首页</el-button>
          </template>
          <template v-else>
            <el-button link @click="contactService">联系客服</el-button>
            <el-button link @click="backToEdit">返回修改</el-button>
          </template>
        </div>
        <p v-if="paymentResult === 'success'" class="payment-result__countdown">
          <span class="countdown-num">{{ countdown }}</span> 秒后自动返回首页，
          <el-button link type="primary" @click="cancelCountdown">取消跳转</el-button>
        </p>
      </div>
    </div>

    <el-dialog v-model="showAddressDialog" title="切换收货地址" width="500px">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="address-option"
        :class="{ active: selectedAddressId === addr.id }"
        @click="selectAddress(addr)"
      >
        <div>
          <strong>{{ addr.name }}</strong> {{ addr.phone }}
          <p style="font-size: 12px; color: var(--color-text-mid); margin-top: 4px">
            {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
          </p>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="showAddAddress" title="新增收货地址" width="480px">
      <el-form label-width="80px">
        <el-form-item label="收件人"><el-input placeholder="请输入收件人姓名" /></el-form-item>
        <el-form-item label="手机号"
          ><el-input placeholder="请输入手机号" maxlength="11"
        /></el-form-item>
        <el-form-item label="所在地区"><el-input placeholder="省/市/区" /></el-form-item>
        <el-form-item label="详细地址"
          ><el-input type="textarea" placeholder="请输入详细地址" :rows="3"
        /></el-form-item>
        <el-form-item><el-checkbox>设为默认地址</el-checkbox></el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="showAddAddress = false">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, watch, nextTick } from 'vue'
import {
  CircleCheck,
  CircleClose,
  Checked,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { addresses as mockAddresses, products } from '@/mock/data'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()
const router = useRouter()
const currentStep = ref(0)
const selectedAddressId = ref(1)
const selectedAddress = ref(mockAddresses.find((a) => a.isDefault) || mockAddresses[0])
const selectedPayment = ref('支付宝')
const showAddressDialog = ref(false)
const showAddAddress = ref(false)
const needInvoice = ref(false)
const orderRemark = ref('')
const isPhoneProtected = ref(true)
const selectedDelivery = ref('free')
const payBtnRef = ref(null)
const isPayButtonVisible = ref(true)
const showFloatDetail = ref(false)
let payBtnObserver = null

// 支付流程相关
const paymentResult = ref('success') // 'success' | 'failure'
const isProcessing = ref(false)
const failReason = ref('')
const orderId = ref('')
const countdown = ref(5)
let countdownTimer = null
let processTimer = null

const failReasons = [
  '支付超时，请重试',
  '余额不足，请更换支付方式或充值后重试',
  '网络异常，请检查网络后稍后重试',
  '银行卡限额，请更换支付方式',
]

// 生成订单编号
function generateOrderId() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `DD${y}${m}${d}${rand}`
}

// 触发支付
function payOrder() {
  if (isProcessing.value) return
  isProcessing.value = true
  // 模拟支付处理过程
  processTimer = setTimeout(() => {
    // 随机决定支付结果（约 70% 成功率，便于演示两种状态）
    const isSuccess = Math.random() < 0.7
    paymentResult.value = isSuccess ? 'success' : 'failure'
    if (isSuccess) {
      orderId.value = generateOrderId()
    } else {
      failReason.value = failReasons[Math.floor(Math.random() * failReasons.length)]
    }
    currentStep.value = 1
    isProcessing.value = false
    // 滚动到顶部展示结果
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // 支付成功时启动倒计时自动跳转
    if (isSuccess) {
      startCountdown()
    }
  }, 1500)
}

// 启动倒计时
function startCountdown() {
  countdown.value = 5
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      cancelCountdown()
      router.push('/')
    }
  }, 1000)
}

// 取消倒计时
function cancelCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 重新支付
function retryPay() {
  cancelCountdown()
  currentStep.value = 0
}

// 更换支付方式
function changePayMethod() {
  cancelCountdown()
  currentStep.value = 0
}

// 联系客服
function contactService() {
  ElMessage.info('正在为您接通在线客服，请稍候...')
}

// 返回修改
function backToEdit() {
  cancelCountdown()
  currentStep.value = 0
}

// 顺手买轮播和选中相关
const upsellCurrentPage = ref(0)
const selectedUpsellProducts = ref([])
const ITEMS_PER_PAGE = 2

// 付款详情固定定位相关
const summaryRef = ref(null)
const upsellRef = ref(null)
const isSummaryFixed = ref(false)
const summaryStyle = reactive({})
const summaryOriginalTop = ref(0)
const summaryHeight = ref(0)

const paymentMethods = [
  { name: '支付宝', icon: '💳' },
  { name: '微信支付', icon: '💚' },
  { name: '朋友代付', icon: '👤' },
]

const deliveryOptions = [
  { value: 'free', label: '快递 包邮', type: '普通配送', fee: 0 },
  { value: 'sf', label: '¥7.18', type: '顺丰', fee: 7.18 },
]

const addresses = ref(mockAddresses)

// 确保商品数量是偶数，方便分页显示（每页2个）
const upsellProducts = computed(() => {
  const allProducts = products.slice(0, 6)
  // 确保商品数量是偶数
  const evenCount = allProducts.length % 2 === 0 ? allProducts.length : allProducts.length - 1
  return allProducts.slice(0, Math.max(evenCount, 2)) // 至少保留2个商品
})

// 当前显示的商品（每页显示2个）
const currentUpsellProducts = computed(() => {
  const start = upsellCurrentPage.value * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return upsellProducts.value.slice(start, end)
})

// 选中商品的总价格
const selectedUpsellPrice = computed(() => {
  return selectedUpsellProducts.value.reduce((total, productId) => {
    const product = upsellProducts.value.find((p) => p.id === productId)
    return total + (product ? product.price : 0)
  }, 0)
})

// 当前选中的配送方式
const currentDelivery = computed(() => {
  return (
    deliveryOptions.find((option) => option.value === selectedDelivery.value) || deliveryOptions[0]
  )
})

// 上一页
function prevUpsellPage() {
  if (upsellCurrentPage.value > 0) {
    upsellCurrentPage.value--
  }
}

// 下一页
function nextUpsellPage() {
  const maxPage = Math.ceil(upsellProducts.value.length / ITEMS_PER_PAGE) - 1
  if (upsellCurrentPage.value < maxPage) {
    upsellCurrentPage.value++
  }
}

// 切换商品选中状态
function toggleUpsellProduct(product) {
  const index = selectedUpsellProducts.value.indexOf(product.id)
  if (index > -1) {
    // 取消选中
    selectedUpsellProducts.value.splice(index, 1)
    ElMessage.success(`已移除：${product.name}`)
  } else {
    // 选中添加
    selectedUpsellProducts.value.push(product.id)
    ElMessage.success(`已添加：${product.name}，价格 ¥${product.price}`)
  }
}

const storeDiscount = ref(3)
const storeDiscount2 = ref(3)
const platformDiscount = ref(0.69)
const coinDiscount = ref(0.69)

const totalDiscount = computed(
  () => storeDiscount.value + storeDiscount2.value + platformDiscount.value + coinDiscount.value,
)
const finalPrice = computed(() => {
  const basePrice = cartStore.totalPrice + selectedUpsellPrice.value
  return Math.max(0, basePrice - totalDiscount.value)
})

function selectAddress(addr) {
  selectedAddressId.value = addr.id
  selectedAddress.value = addr
  showAddressDialog.value = false
}

// 付款详情滚动固定处理
function handleSummaryScroll() {
  // 小屏幕不执行滚动固定逻辑（CSS 已覆盖为 position: static）
  if (window.innerWidth <= 1024) {
    if (isSummaryFixed.value) {
      isSummaryFixed.value = false
      summaryStyle.position = ''
      summaryStyle.top = ''
      summaryStyle.width = ''
      summaryStyle.zIndex = ''
    }
    return
  }

  if (!summaryRef.value || !upsellRef.value) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const elementRect = summaryRef.value.getBoundingClientRect()
  const elementTop = elementRect.top + scrollTop

  // 记录元素的原始位置（只记录一次）
  if (summaryOriginalTop.value === 0) {
    summaryOriginalTop.value = elementTop
  }

  // 动态获取当前高度（因为选中顺手买后高度会变化）
  summaryHeight.value = elementRect.height

  // 获取"顺手买"区域的底部位置
  const upsellRect = upsellRef.value.getBoundingClientRect()
  const upsellBottom = upsellRect.bottom + scrollTop
  const viewportHeight = window.innerHeight

  // 计算付款详情区域的最大可固定位置（不能超过"顺手买"底部）
  const summaryBottom = scrollTop + 16 + summaryHeight.value
  const shouldStopAtBottom = summaryBottom > upsellBottom

  // 判断是否需要固定：当元素顶部即将离开视口顶部时（留16px缓冲）
  const shouldFix = scrollTop > summaryOriginalTop.value - 16

  if (shouldFix && !shouldStopAtBottom) {
    // 切换为固定定位
    if (!isSummaryFixed.value) {
      isSummaryFixed.value = true
    }
    summaryStyle.position = 'fixed'
    summaryStyle.top = '16px'
    summaryStyle.width = '320px'
    summaryStyle.zIndex = '100'
  } else if (shouldFix && shouldStopAtBottom) {
    // 到达底部边界，切换为绝对定位
    isSummaryFixed.value = true
    summaryStyle.position = 'absolute'
    summaryStyle.top = upsellBottom - summaryHeight.value + 'px'
    summaryStyle.width = '320px'
    summaryStyle.zIndex = '100'
  } else if (!shouldFix && isSummaryFixed.value) {
    // 恢复原始布局
    isSummaryFixed.value = false
    summaryStyle.position = ''
    summaryStyle.top = ''
    summaryStyle.width = ''
    summaryStyle.zIndex = ''
  }
}

// 监听顺手买价格变化，重新计算边界
watch(selectedUpsellPrice, () => {
  // 等待 DOM 更新后再重新计算
  nextTick(() => {
    handleSummaryScroll()
  })
})

onMounted(() => {
  // 监听滚动事件
  window.addEventListener('scroll', handleSummaryScroll, { passive: true })

  // 监听窗口大小变化，切换屏幕尺寸时清理滚动固定状态
  window.addEventListener('resize', handleSummaryScroll, { passive: true })

  // 支付按钮可见性观察
  if (payBtnRef.value && 'IntersectionObserver' in window) {
    payBtnObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isPayButtonVisible.value = entry.isIntersecting
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 0px 0px',
      },
    )
    payBtnObserver.observe(payBtnRef.value)
  }
})

onUnmounted(() => {
  // 清理滚动事件监听
  window.removeEventListener('scroll', handleSummaryScroll)

  // 清理窗口大小变化监听
  window.removeEventListener('resize', handleSummaryScroll)

  // 清理支付按钮观察者
  if (payBtnObserver && payBtnRef.value) {
    payBtnObserver.unobserve(payBtnRef.value)
    payBtnObserver.disconnect()
  }

  // 清理支付流程定时器
  cancelCountdown()
  if (processTimer) {
    clearTimeout(processTimer)
    processTimer = null
  }
})
</script>

<style scoped>
.checkout-page {
  background: var(--color-checkout-bg);
  min-height: 100vh;
  /* 抵消父元素 .main-content 的 padding */
  margin-left: calc(-1 * clamp(0px, calc((100vw - 1524px) / 2), 80px));
  margin-right: calc(-1 * clamp(0px, calc((100vw - 1524px) / 2), 80px));
}

/* 顶部栏 */
.checkout-topbar {
  background: var(--color-checkout-bg);
  border-bottom: 1px solid var(--color-border);
}

.checkout-topbar__inner {
  max-width: 1524px;
  min-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px 12px 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkout-logo {
  display: flex;
  align-items: baseline;
  gap: 8px;
  text-decoration: none;
}

.checkout-logo__main {
  font-size: 36px;
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: 4px;
  line-height: 1;
}

.checkout-logo__sub {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

/* 内容容器 */
.checkout-page__inner {
  max-width: 1524px;
  min-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px 24px 35px;
}

/* 主内容：左右布局 */
.checkout-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.checkout-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkout-right {
  width: 320px;
  flex-shrink: 0;
}

.checkout-section {
  background: #fff;
  border-radius: var(--radius-card);
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 16px;
}

.section-action {
  font-size: 13px;
  color: var(--color-text-mid);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.section-action:hover {
  color: var(--color-primary);
}

/* 收货地址 */
.address-card {
  position: relative;
  padding: 16px 20px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-card);
  background: #fff;
}

.address-card__tag {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 12px;
  color: var(--color-primary);
  background: #fff0e8;
  padding: 2px 8px;
  border-radius: 4px;
}

.address-card__loc {
  font-size: 14px;
  color: var(--color-text-dark);
  margin: 0 0 4px;
}

.address-card__detail {
  font-size: 14px;
  color: var(--color-text-dark);
  margin: 0 0 8px;
}

.address-card__user {
  font-size: 13px;
  color: var(--color-text-mid);
  margin: 0;
}

.address-card__user span + span {
  margin-left: 12px;
}

.address-empty {
  text-align: center;
  padding: 24px;
  color: var(--color-text-light);
}

/* 订单信息 */
.order-shop {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.shop-tag {
  font-size: 12px;
  color: var(--color-primary);
  background: #fff0e8;
  padding: 1px 4px;
  border-radius: 4px;
}

.shop-name {
  font-size: 13px;
  color: var(--color-text-dark);
  font-weight: 500;
}

.order-header-row {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 1fr;
  gap: 12px;
  padding: 8px 0;
  font-size: 12px;
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.order-header__qty,
.order-header__price {
  text-align: center;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.order-item__product {
  display: flex;
  gap: 12px;
}

.order-item__img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.order-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-item__name {
  font-size: 13px;
  color: var(--color-text-dark);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-item__spec {
  font-size: 12px;
  color: var(--color-text-light);
}

.order-item__service {
  font-size: 11px;
  color: var(--color-text-mid);
}

.order-item__attr {
  font-size: 12px;
  color: var(--color-text-mid);
}

.order-item__qty {
  display: flex;
  justify-content: center;
}

.order-item__price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.order-item__original {
  font-size: 12px;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.order-extras {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-extra {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.order-extra__label {
  width: 70px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-dark);
  font-weight: 500;
}

.order-extra__content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-mid);
}

.order-extra--remark .order-extra__content {
  align-items: stretch;
}

/* 配送服务 */
.order-extra--delivery .order-extra__content {
  gap: 12px;
}

.delivery-type {
  font-size: 13px;
  color: var(--color-text-mid);
  flex-shrink: 0;
}

.delivery-select {
  width: 120px;
}

.delivery-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--color-border) inset;
  padding: 0 8px;
}

.delivery-select :deep(.el-input__inner) {
  font-size: 13px;
  color: var(--color-text-dark);
}

.delivery-select :deep(.el-input__suffix) {
  color: var(--color-text-light);
}

/* 配送下拉菜单 */
.delivery-select__dropdown .el-select-dropdown__item {
  padding: 0 12px;
  height: auto;
}

.delivery-select__dropdown .el-select-dropdown__item.selected {
  color: var(--color-primary);
  font-weight: 600;
}

.delivery-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  font-size: 13px;
}

.delivery-option__label {
  color: var(--color-text-dark);
}

.delivery-option__fee {
  color: var(--color-primary);
  font-weight: 600;
}

/* 顺手买 */
.checkout-upsell {
  background: #fff;
}

.upsell-container {
  display: flex;
  align-items: stretch;
  gap: 12px;
  position: relative;
}

.upsell-list-wrapper {
  flex: 1;
  overflow: hidden;
}

.upsell-list {
  display: flex;
  align-items: stretch;
  gap: 12px;
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.upsell-nav-btn {
  width: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  cursor: pointer;
  color: var(--color-text-mid);
  transition: all 0.2s ease;
  font-size: 18px;
}

.upsell-nav-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #fff5f0;
}

.upsell-nav-btn--prev {
  order: -1;
}

.upsell-card {
  /* 宽度通过动态计算：每页2个商品，总页数 = 商品数 / 2 */
  /* 每个卡片宽度 = 100% / 总页数 / 2 - 间隙调整 */
  flex: 1;
  min-width: 0;
  max-width: calc(50% - 6px); /* 每页2个商品，每个最多占50% */
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-sizing: border-box;
}

.upsell-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.1);
}

.upsell-card--selected {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  box-shadow: 0 2px 12px rgba(255, 80, 0, 0.15);
}

.upsell-card__selected-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.upsell-card__img {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-btn);
  object-fit: cover;
  flex-shrink: 0;
}

.upsell-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upsell-card__name {
  font-size: 13px;
  color: var(--color-text-dark);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.upsell-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.upsell-tag {
  font-size: 11px;
  color: #07c160;
  background: #e8f8e8;
  padding: 1px 4px;
  border-radius: 2px;
}

.upsell-tag--shop {
  color: var(--color-text-mid);
  background: #f5f5f5;
}

.upsell-card__bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upsell-card__price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.upsell-card__original {
  font-size: 12px;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.upsell-shop-name {
  font-size: 11px;
  color: var(--color-text-mid);
}

/* 付款详情 */
.checkout-summary {
  background: #fff;
  border-radius: var(--radius-card);
  padding: 20px;
}

.checkout-summary.sticky {
  position: sticky;
  top: 16px;
}

.checkout-summary.is-fixed {
  position: fixed;
  top: 16px;
  width: 320px;
  z-index: 100;
}

.checkout-summary.is-absolute {
  position: absolute;
  width: 320px;
  z-index: 100;
}

.checkout-summary-placeholder {
  background: transparent;
  border-radius: var(--radius-card);
  padding: 20px;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.summary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
}

.summary-count {
  font-size: 12px;
  color: var(--color-text-light);
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--color-border);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-mid);
}

.summary-row__label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-row--upsell {
  color: #52c41a;
}

.upsell-amount {
  color: #52c41a;
  font-weight: 600;
}

.discount-tag {
  font-size: 11px;
  color: #ff0036;
  background: #fff0f0;
  padding: 1px 4px;
  border-radius: 2px;
}

.discount-tag--sub {
  color: #ff0036;
  background: #fff0f0;
}

.discount-tag--platform {
  color: #ff0036;
  background: #fff0f0;
}

.discount-desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.discount-amount {
  color: #ff0036;
}

.discount-icon {
  font-size: 14px;
}

.summary-total {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 0;
  font-size: 13px;
  color: var(--color-text-mid);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.summary-total__discount {
  color: #ff0036;
}

.summary-total__amount {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
}

/* 支付方式 */
.summary-payment {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-payment__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: var(--color-text-dark);
}

.summary-payment__item:hover,
.summary-payment__item.active {
  border-color: var(--color-primary);
  background: #fff5f0;
}

.payment-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.payment-radio.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
  box-shadow: inset 0 0 0 3px #fff;
}

.payment-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.payment-name {
  flex: 1;
}

.summary-payment__item--protect {
  cursor: pointer;
}

.protect-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.protect-desc {
  font-size: 11px;
  color: var(--color-text-light);
  margin-left: auto;
}

/* 操作按钮 */
.summary-actions {
  display: flex;
  gap: 12px;
}

.summary-btn {
  flex: 1;
  height: 44px;
  border-radius: var(--radius-card);
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

.summary-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.summary-btn--pay {
  flex: 2;
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.summary-btn--pay:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

.summary-btn--pay:disabled {
  background: var(--color-primary);
  color: #fff;
  opacity: 0.7;
  cursor: not-allowed;
}

/* 小屏浮动结算框 */
.checkout-float-summary {
  display: none;
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  min-width: 360px;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 14px 18px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.checkout-float-summary.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.checkout-float-summary__main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout-float-summary__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: auto;
  transition: color 0.2s ease;
}

.checkout-float-summary__toggle:hover {
  color: var(--color-primary-hover);
}

.checkout-float-summary__toggle .el-icon {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.checkout-float-summary__toggle .el-icon.is-open {
  transform: rotate(180deg);
}

.checkout-float-summary__back {
  height: 40px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text-dark);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkout-float-summary__back:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.checkout-float-summary__pay {
  height: 40px;
  padding: 0 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.checkout-float-summary__pay:hover {
  background: var(--color-primary-hover);
}

.checkout-float-summary__pay:disabled {
  background: var(--color-primary);
  color: #fff;
  opacity: 0.7;
  cursor: not-allowed;
}

.checkout-float-summary__detail {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-border);
}

.checkout-float-summary__detail .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-text-mid);
  margin-bottom: 8px;
}

.checkout-float-summary__detail .detail-row:last-child {
  margin-bottom: 0;
}

.checkout-float-summary__detail .detail-row--total {
  font-weight: 600;
  color: var(--color-text-dark);
  margin-top: 4px;
}

.checkout-float-summary__detail .detail-row--final {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
}

/* 优惠明细展开动画 */
.detail-slide-enter-active,
.detail-slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.detail-slide-enter-from,
.detail-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

/* 支付结果 */
.payment-result {
  text-align: center;
  padding: 64px 24px;
  background: #fff;
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-result__icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.payment-result__icon .el-icon {
  font-size: 64px;
}

.payment-result--success .payment-result__icon {
  background: #f0fff0;
  color: #52c41a;
}

.payment-result--failure .payment-result__icon {
  background: #fff0f0;
  color: #ff0036;
}

.payment-result__title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--color-text-dark);
}

.payment-result--success .payment-result__title {
  color: #52c41a;
}

.payment-result--failure .payment-result__title {
  color: #ff0036;
}

.payment-result__desc {
  font-size: 14px;
  color: var(--color-text-mid);
  margin: 0 0 32px;
}

.payment-result__actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.payment-result__secondary {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.payment-result__countdown {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.countdown-num {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 16px;
  min-width: 20px;
  display: inline-block;
  text-align: center;
}

/* 地址弹窗 */
.address-option {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-option:hover,
.address-option.active {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

/* 响应式 */
@media (max-width: 1280px) {
  .checkout-topbar__inner {
    min-width: auto;
    padding: 16px 12px 12px;
  }

  .checkout-page__inner {
    min-width: auto;
    padding: 16px 12px 24px;
  }
}

@media (max-width: 1024px) {
  .checkout-page__inner {
    padding-bottom: 100px;
  }

  .checkout-main {
    flex-direction: column;
  }

  .checkout-right {
    width: 100%;
  }

  .checkout-summary.sticky,
  .checkout-summary.is-fixed,
  .checkout-summary.is-absolute {
    position: static;
  }

  .order-header-row {
    display: none;
  }

  .order-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .order-item__attr,
  .order-item__qty,
  .order-item__price {
    justify-content: flex-start;
  }

  .upsell-list {
    flex-wrap: wrap;
  }

  .upsell-nav-btn {
    display: none;
  }

  .checkout-float-summary {
    display: block;
  }
}

@media (max-width: 768px) {
  .checkout-topbar__inner {
    padding: 12px;
  }

  .checkout-logo__main {
    font-size: 28px;
  }

  .checkout-logo__sub {
    font-size: 18px;
  }

  .checkout-page__inner {
    padding: 12px 12px 100px;
  }

  .checkout-section {
    padding: 16px;
  }

  .section-actions {
    gap: 8px;
  }

  .order-item__img {
    width: 60px;
    height: 60px;
  }

  .summary-actions {
    flex-direction: column;
  }

  .checkout-float-summary {
    left: 12px;
    right: 12px;
    bottom: 12px;
    min-width: auto;
    max-width: none;
    border-radius: 20px;
    padding: 12px 14px;
  }

  .checkout-float-summary__back,
  .checkout-float-summary__pay {
    height: 36px;
    padding: 0 14px;
    font-size: 13px;
    border-radius: 12px;
  }
}
</style>
