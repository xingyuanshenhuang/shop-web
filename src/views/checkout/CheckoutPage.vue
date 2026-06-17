<template>
  <div class="checkout-page">
    <div class="checkout-page__inner">
      <div class="checkout-steps">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step title="确认订单" />
          <el-step title="支付" />
          <el-step title="完成" />
        </el-steps>
      </div>

      <div v-if="currentStep === 0" class="checkout-content">
        <div class="checkout-address">
          <h3 class="section-title">收货地址</h3>
          <div v-if="selectedAddress" class="address-card address-card--selected">
            <div class="address-card__info">
              <div class="address-card__row">
                <span class="address-card__label">收货人：</span>
                <span>{{ selectedAddress.name }}</span>
              </div>
              <div class="address-card__row">
                <span class="address-card__label">联系方式：</span>
                <span>{{ selectedAddress.phone }}</span>
              </div>
              <div class="address-card__row">
                <span class="address-card__label">收货地址：</span>
                <span
                  >{{ selectedAddress.province }}{{ selectedAddress.city
                  }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</span
                >
              </div>
            </div>
            <div class="address-card__actions">
              <el-button size="small" @click="showAddressDialog = true">切换地址</el-button>
              <el-button size="small" @click="showAddAddress = true">添加地址</el-button>
            </div>
          </div>
          <div v-else class="address-empty">
            <p>暂无收货地址，请先添加收货地址</p>
            <el-button type="primary" @click="showAddAddress = true">添加地址</el-button>
          </div>
        </div>

        <div class="checkout-payment">
          <h3 class="section-title">支付方式</h3>
          <div class="payment-options">
            <div
              v-for="method in paymentMethods"
              :key="method.name"
              class="payment-option"
              :class="{ active: selectedPayment === method.name }"
              @click="selectedPayment = method.name"
            >
              <span class="payment-option__icon">{{ method.icon }}</span>
              <span class="payment-option__name">{{ method.name }}</span>
              <span
                class="payment-option__radio"
                :class="{ checked: selectedPayment === method.name }"
              ></span>
            </div>
          </div>
        </div>

        <div class="checkout-order">
          <h3 class="section-title">订单明细</h3>
          <div class="order-items">
            <div v-for="item in cartStore.checkedItems" :key="item.id" class="order-item">
              <img :src="item.image" class="order-item__img" />
              <div class="order-item__info">
                <span class="order-item__name text-truncate">{{ item.name }}</span>
                <span class="order-item__spec">{{ item.spec }}</span>
              </div>
              <span class="order-item__price">¥{{ item.price }}</span>
              <span class="order-item__qty">×{{ item.quantity }}</span>
              <span class="order-item__total price price-sm"
                >¥{{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </div>
          </div>
        </div>

        <div class="checkout-summary-bar">
          <div class="checkout-summary-bar__left">共 {{ cartStore.checkedCount }} 件商品</div>
          <div class="checkout-summary-bar__right">
            <span>合计：</span>
            <span class="price price-xl"
              >¥{{ Math.max(0, cartStore.totalPrice - 20).toFixed(2) }}</span
            >
            <el-button type="primary" size="large" @click="currentStep = 1">提交订单</el-button>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 1" class="checkout-pay">
        <div class="pay-amount">
          <p>支付金额</p>
          <span class="price" style="font-size: 36px"
            >¥{{ Math.max(0, cartStore.totalPrice - 20).toFixed(2) }}</span
          >
        </div>
        <div class="pay-methods">
          <div
            class="pay-method"
            :class="{ active: payMethod === 'alipay' }"
            @click="payMethod = 'alipay'"
          >
            <span style="font-size: 24px">💳</span>
            <span>支付宝</span>
          </div>
          <div
            class="pay-method"
            :class="{ active: payMethod === 'wechat' }"
            @click="payMethod = 'wechat'"
          >
            <span style="font-size: 24px">💚</span>
            <span>微信支付</span>
          </div>
        </div>
        <el-button
          type="primary"
          size="large"
          style="width: 300px; margin-top: 24px"
          @click="currentStep = 2"
          >确认支付</el-button
        >
      </div>

      <div v-if="currentStep === 2" class="checkout-success">
        <el-icon :size="64" color="#52C41A"><CircleCheck /></el-icon>
        <h2>支付成功！</h2>
        <p>订单编号：DD20250421001</p>
        <div class="checkout-success__actions">
          <el-button type="primary" @click="$router.push('/user?tab=orders')">查看订单</el-button>
          <el-button @click="$router.push('/')">继续购物</el-button>
        </div>
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
import { ref } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { addresses as mockAddresses } from '@/mock/data'

const cartStore = useCartStore()
const currentStep = ref(0)
const selectedAddressId = ref(1)
const selectedAddress = ref(mockAddresses.find((a) => a.isDefault) || mockAddresses[0])
const selectedPayment = ref('支付宝')
const payMethod = ref('alipay')
const showAddressDialog = ref(false)
const showAddAddress = ref(false)

const paymentMethods = [
  { name: '支付宝', icon: '💳' },
  { name: '微信支付', icon: '💚' },
  { name: '银行卡', icon: '🏦' },
  { name: '货到付款', icon: '📦' },
]

const addresses = ref(mockAddresses)

function selectAddress(addr) {
  selectedAddressId.value = addr.id
  selectedAddress.value = addr
  showAddressDialog.value = false
}
</script>

<style scoped>
.checkout-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: 24px 0;
}

.checkout-page__inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 128px;
}

.checkout-steps {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 24px 48px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.checkout-address,
.checkout-payment,
.checkout-order {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 24px;
  margin-bottom: 16px;
}

.address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.address-card--selected {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

.address-card__row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}

.address-card__label {
  color: var(--color-text-light);
  min-width: 70px;
}

.address-card__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-empty {
  text-align: center;
  padding: 24px;
  color: var(--color-text-light);
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.payment-option:hover,
.payment-option.active {
  border-color: var(--color-primary);
}

.payment-option__radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  margin-left: auto;
  transition: all var(--transition-fast);
}

.payment-option__radio.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
  box-shadow: inset 0 0 0 3px #fff;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-item__img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-btn);
  object-fit: cover;
}

.order-item__info {
  flex: 1;
  min-width: 0;
}

.order-item__name {
  display: block;
  font-size: 14px;
}

.order-item__spec {
  font-size: 12px;
  color: var(--color-text-light);
}

.order-item__price,
.order-item__qty {
  font-size: 14px;
  color: var(--color-text-mid);
}

.order-item__total {
  min-width: 80px;
  text-align: right;
}

.checkout-summary-bar {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkout-summary-bar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.checkout-pay,
.checkout-success {
  text-align: center;
  padding: 60px 0;
  background: var(--color-bg);
  border-radius: var(--radius-card);
}

.pay-amount {
  margin-bottom: 24px;
}

.pay-amount p {
  font-size: 14px;
  color: var(--color-text-mid);
  margin-bottom: 8px;
}

.pay-methods {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.pay-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pay-method:hover,
.pay-method.active {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

.checkout-success h2 {
  font-size: 24px;
  margin: 16px 0 8px;
}

.checkout-success p {
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.checkout-success__actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.address-option {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.address-option:hover,
.address-option.active {
  border-color: var(--color-primary);
  background: var(--color-light-orange);
}

@media (max-width: 1024px) {
  .checkout-page__inner {
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .checkout-page__inner {
    padding: 0 16px;
  }
  .payment-options {
    grid-template-columns: 1fr;
  }
}
</style>
