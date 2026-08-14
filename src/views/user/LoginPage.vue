<template>
  <div class="login-page">
    <!-- 顶部导航 -->
    <header class="login-header">
      <div class="login-header__inner">
        <router-link to="/" class="login-header__logo">
          <span class="login-header__logo-main">淘宝</span>
          <span class="login-header__logo-sub">Taobao</span>
        </router-link>
        <div class="login-header__links">
          <a class="login-header__link">网站无障碍</a>
          <a class="login-header__link login-header__link--feedback">
            <el-icon><ChatDotRound /></el-icon>
            <span>"登录页面"改进建议</span>
          </a>
        </div>
      </div>
    </header>

    <!-- 主体登录卡 -->
    <main class="login-main">
      <div class="login-card">
        <!-- 左侧：扫码登录 -->
        <section class="login-card__left">
          <h2 class="login-card__left-title">手机扫码登录</h2>
          <div class="qr-wrap">
            <svg viewBox="0 0 145 145" class="qr-code" aria-label="手机扫码登录二维码">
              <rect width="145" height="145" fill="#fff" />
              <g v-for="(row, i) in qrModules" :key="'r' + i">
                <rect
                  v-for="(cell, j) in row"
                  v-show="cell"
                  :key="'c' + j"
                  :x="j * 5"
                  :y="i * 5"
                  width="5"
                  height="5"
                  fill="#000"
                />
              </g>
              <circle cx="72.5" cy="72.5" r="16" fill="#fff" />
              <circle cx="72.5" cy="72.5" r="12" fill="#ff5000" />
              <text
                x="72.5"
                y="77.5"
                text-anchor="middle"
                fill="#fff"
                font-size="12"
                font-weight="700"
              >
                淘
              </text>
            </svg>
          </div>
          <p class="qr-tip">打开<em>淘宝APP</em>—点击左上角扫一扫</p>
          <a class="qr-help">怎么扫码登录？</a>
        </section>

        <!-- 右侧：表单登录 -->
        <section class="login-card__right">
          <!-- 登录方式切换 -->
          <div class="login-tabs" role="tablist" aria-label="登录方式">
            <button
              type="button"
              role="tab"
              :aria-selected="loginMode === 'account'"
              class="login-tabs__item"
              :class="{ active: loginMode === 'account' }"
              @click="loginMode = 'account'"
            >
              密码登录
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="loginMode === 'sms'"
              class="login-tabs__item"
              :class="{ active: loginMode === 'sms' }"
              @click="loginMode = 'sms'"
            >
              短信登录
            </button>
          </div>

          <!-- 账号锁定提示 -->
          <transition name="fade">
            <div v-if="isLocked" class="lock-banner" role="alert">
              <el-icon><WarningFilled /></el-icon>
              <span>
                账号已暂时锁定，请 <strong>{{ lockRemaining }}</strong> 秒后重试（连续 5
                次错误将触发锁定）。
              </span>
            </div>
          </transition>

          <!-- 密码登录表单 -->
          <form class="login-form" @submit.prevent="handleSubmit" v-show="loginMode === 'account'">
            <div class="form-row">
              <el-input
                v-model="account"
                size="large"
                clearable
                autocomplete="username"
                placeholder="账号名/邮箱/手机号"
                :aria-invalid="!!accountError"
                aria-describedby="account-error"
                @input="accountError = ''"
                @blur="validateAccount"
                @keyup.enter="handleSubmit"
              />
            </div>
            <p v-if="accountError" id="account-error" class="field-error" aria-live="polite">
              {{ accountError }}
            </p>

            <div class="form-row form-row--password">
              <el-input
                v-model="password"
                size="large"
                autocomplete="current-password"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="请输入登录密码"
                :aria-invalid="!!passwordError"
                aria-describedby="password-error"
                @input="passwordError = ''"
                @blur="validatePassword"
                @keyup.enter="handleSubmit"
              />
              <a class="forgot-link" @click="handleForgotPassword">忘记密码</a>
            </div>
            <p v-if="passwordError" id="password-error" class="field-error" aria-live="polite">
              {{ passwordError }}
            </p>
          </form>

          <!-- 短信登录表单 -->
          <form class="login-form" @submit.prevent="handleSubmit" v-show="loginMode === 'sms'">
            <div class="form-row">
              <el-input
                v-model="phone"
                size="large"
                clearable
                autocomplete="tel"
                placeholder="请输入手机号"
                maxlength="11"
                :aria-invalid="!!phoneError"
                aria-describedby="phone-error"
                @input="handlePhoneInput"
                @blur="validatePhone"
                @keyup.enter="handleSubmit"
              />
            </div>
            <p v-if="phoneError" id="phone-error" class="field-error" aria-live="polite">
              {{ phoneError }}
            </p>

            <div class="form-row sms-code-row">
              <el-input
                v-model="smsCode"
                size="large"
                autocomplete="one-time-code"
                inputmode="numeric"
                maxlength="6"
                placeholder="请输入 6 位验证码"
                :aria-invalid="!!codeError"
                aria-describedby="code-error"
                @input="handleSmsCodeInput"
                @keyup.enter="handleSubmit"
              />
              <button
                type="button"
                class="sms-code-btn"
                :class="{ 'is-countdown': smsCountdown > 0 }"
                :disabled="smsCountdown > 0 || sendingSms || loading"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `重新获取(${smsCountdown}s)` : '获取验证码' }}
              </button>
            </div>
            <p v-if="codeError" id="code-error" class="field-error" aria-live="polite">
              {{ codeError }}
            </p>
            <p class="sms-tip">演示验证码：<strong>123456</strong></p>
          </form>

          <!-- 登录按钮 -->
          <button
            type="button"
            class="login-btn"
            :disabled="loginBtnDisabled"
            @click="handleSubmit"
          >
            <el-icon v-if="loading" class="spin"><Loading /></el-icon>
            <span>{{ loginBtnText }}</span>
          </button>

          <!-- 第三方 / 辅助链接 -->
          <div class="login-helpers">
            <div class="social-login">
              <button
                v-for="s in socialProviders"
                :key="s.name"
                type="button"
                class="social-btn"
                :style="{ '--brand': s.color }"
                :aria-label="`${s.name}登录`"
                @click="handleThirdParty(s.name)"
              >
                <span class="social-btn__icon" v-html="s.svg"></span>
              </button>
            </div>
            <div class="helper-links">
              <a class="link" @click="handleForgotAccount">忘记账号</a>
              <span class="divider-dot">|</span>
              <a class="link" @click="handleRegister">免费注册</a>
            </div>
          </div>

          <!-- 协议勾选 -->
          <el-checkbox v-model="agreed" class="agreement">
            <span class="agreement__text">
              <em>*</em>已阅读并同意以下协议
              <a class="link" @click.prevent="openAgreement('淘宝平台服务协议')">淘宝平台服务协议</a
              >、 <a class="link" @click.prevent="openAgreement('隐私权政策')">隐私权政策</a>、
              <a class="link" @click.prevent="openAgreement('法律声明')">法律声明</a>、
              <a class="link" @click.prevent="openAgreement('支付宝及客户端服务协议')"
                >支付宝及客户端服务协议</a
              >
            </span>
          </el-checkbox>
        </section>
      </div>
    </main>

    <!-- 异地登录安全验证 -->
    <el-dialog
      v-model="showSecurityVerify"
      title="异地登录安全验证"
      width="420"
      :close-on-click-modal="false"
      align-center
      @close="resetSlider"
    >
      <div class="verify-body">
        <p class="verify-tip">
          <el-icon class="verify-tip__icon"><WarningFilled /></el-icon>
          检测到本次登录存在异常（如新设备 / 异地），为保障账号安全，请完成滑块验证。
        </p>
        <div ref="sliderTrackRef" class="slider-track" :class="{ 'is-verified': sliderVerified }">
          <div class="slider-progress" :style="{ width: sliderPos + 44 + 'px' }"></div>
          <span class="slider-text">{{
            sliderVerified ? '验证通过' : '向右滑动滑块完成验证'
          }}</span>
          <div
            class="slider-handle"
            :style="{ transform: `translateX(${sliderPos}px)` }"
            role="slider"
            aria-label="滑动验证"
            :aria-valuenow="sliderVerified ? 1 : 0"
            aria-valuemin="0"
            aria-valuemax="1"
            @mousedown="onSliderDown"
            @touchstart="onSliderDown"
          >
            <el-icon><Check v-if="sliderVerified" /><ArrowRight v-else /></el-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 协议提示弹窗 -->
    <AgreementPrompt
      v-model:visible="showAgreementPrompt"
      scene="login"
      :agreements="[
        '《淘宝平台服务协议》',
        '《隐私权政策》',
        '《法律声明》',
        '《支付宝及客户端服务协议》',
      ]"
      @agree="handleAgreeAndSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import AgreementPrompt from '@/components/common/AgreementPrompt.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const redirectTarget = computed(() => (route.query.redirect ? String(route.query.redirect) : '/'))

// ===== 登录方式 =====
const loginMode = ref('account') // account | sms

// ===== 表单字段 =====
const account = ref('')
const password = ref('')
const passwordVisible = ref(false)
const phone = ref('')
const smsCode = ref('')
const agreed = ref(false)

// ===== 错误提示 =====
const accountError = ref('')
const passwordError = ref('')
const phoneError = ref('')
const codeError = ref('')

// ===== 校验规则 =====
const PHONE_RE = /^1[3-9]\d{9}$/
const EMAIL_RE = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/

function validateAccount() {
  const v = account.value.trim()
  if (!v) {
    accountError.value = '请输入账号名/邮箱/手机号'
  } else if (/^\d+$/.test(v)) {
    if (!PHONE_RE.test(v)) accountError.value = '手机号格式不正确'
    else accountError.value = ''
  } else if (v.includes('@')) {
    if (!EMAIL_RE.test(v)) accountError.value = '邮箱格式不正确'
    else accountError.value = ''
  } else {
    accountError.value = ''
  }
  return !accountError.value
}
function validatePassword() {
  const v = password.value
  if (!v) passwordError.value = '请输入密码'
  else if (v.length < 6) passwordError.value = '密码长度不少于 6 位'
  else if (v.length > 20) passwordError.value = '密码长度不超过 20 位'
  else passwordError.value = ''
  return !passwordError.value
}
function validatePhone() {
  const v = phone.value.trim()
  if (!v) phoneError.value = '请输入手机号'
  else if (!PHONE_RE.test(v)) phoneError.value = '手机号格式不正确'
  else phoneError.value = ''
  return !phoneError.value
}
function handlePhoneInput(val) {
  phone.value = val.replace(/\D/g, '')
  phoneError.value = ''
}
function handleSmsCodeInput(val) {
  smsCode.value = val.replace(/\D/g, '')
  codeError.value = ''
}

// ===== XSS 输入过滤 =====
function sanitize(str) {
  return String(str)
    .replace(/[<>'"`]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}

// ===== 锁定状态（每秒刷新） =====
const nowTick = ref(Date.now())
let lockTimer = null
function startLockTicker() {
  stopLockTicker()
  lockTimer = setInterval(() => {
    nowTick.value = Date.now()
  }, 1000)
}
function stopLockTicker() {
  if (lockTimer) {
    clearInterval(lockTimer)
    lockTimer = null
  }
}
const isLocked = computed(() => {
  void nowTick.value
  return userStore.lockedUntil > Date.now()
})
const lockRemaining = computed(() => {
  void nowTick.value
  return Math.max(0, Math.ceil((userStore.lockedUntil - Date.now()) / 1000))
})
watch(lockRemaining, (v) => {
  if (v <= 0 && userStore.failedAttempts > 0) {
    userStore.resetAttempts()
    stopLockTicker()
  }
})

// ===== 短信倒计时 =====
const SMS_COUNTDOWN_SECONDS = 60
const SMS_COUNTDOWN_KEY = 'sms_code_countdown'
const smsCountdown = ref(0)
const sendingSms = ref(false)
let smsTimer = null

function startSmsCountdown() {
  sendingSms.value = false
  smsCountdown.value = SMS_COUNTDOWN_SECONDS
  const endTime = Date.now() + SMS_COUNTDOWN_SECONDS * 1000
  localStorage.setItem(SMS_COUNTDOWN_KEY, String(endTime))
  smsTimer = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
    smsCountdown.value = remaining
    if (remaining <= 0) {
      clearInterval(smsTimer)
      smsTimer = null
      localStorage.removeItem(SMS_COUNTDOWN_KEY)
    }
  }, 1000)
}

function loadSmsCountdown() {
  const saved = localStorage.getItem(SMS_COUNTDOWN_KEY)
  if (!saved) return
  const endTime = parseInt(saved, 10)
  const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
  if (remaining <= 0) {
    localStorage.removeItem(SMS_COUNTDOWN_KEY)
    smsCountdown.value = 0
    return
  }
  smsCountdown.value = remaining
  smsTimer = setInterval(() => {
    const r = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
    smsCountdown.value = r
    if (r <= 0) {
      clearInterval(smsTimer)
      smsTimer = null
      localStorage.removeItem(SMS_COUNTDOWN_KEY)
    }
  }, 1000)
}

function sendSmsCode() {
  if (sendingSms.value || smsCountdown.value > 0) return
  if (!validatePhone()) return
  sendingSms.value = true
  startSmsCountdown()
  ElMessage.success('验证码已发送，请查收短信（演示验证码：123456）')
}

// ===== 协议提示弹窗 =====
const showAgreementPrompt = ref(false)
function handleAgreeAndSubmit() {
  agreed.value = true
  handleSubmit()
}

// ===== 提交状态 =====
const loading = ref(false)
const loginBtnDisabled = computed(() => loading.value || isLocked.value)
const loginBtnText = computed(() => {
  if (loading.value) return '登录中...'
  if (isLocked.value) return `已锁定 ${lockRemaining.value}s`
  return '登 录'
})

function handleSubmit() {
  if (loginMode.value === 'account') handleAccountLogin()
  else handleSmsLogin()
}

async function handleAccountLogin() {
  if (loading.value || isLocked.value) return
  const okAccount = validateAccount()
  const okPassword = validatePassword()
  if (!okAccount || !okPassword) return
  if (!agreed.value) {
    showAgreementPrompt.value = true
    return
  }
  loading.value = true
  try {
    const safeAccount = sanitize(account.value)
    const res = await userStore.login({ account: safeAccount, password: password.value })
    if (userStore.failedAttempts > 0) {
      pendingAccount.value = safeAccount
      pendingRemember.value = false
      pendingUserData.value = res.user
      loading.value = false
      showSecurityVerify.value = true
      return
    }
    finishLogin(safeAccount, false, res.user)
  } catch (e) {
    loading.value = false
    if (isLocked.value) startLockTicker()
    if (e.message?.includes('账号不存在')) {
      accountError.value = e.message
    } else if (e.message?.includes('密码错误')) {
      passwordError.value = e.message
    }
    ElMessage.error(e.message || '登录失败，请稍后重试')
  }
}

async function handleSmsLogin() {
  if (loading.value || isLocked.value) return
  if (!validatePhone()) return
  if (!smsCode.value || smsCode.value.length !== 6) {
    codeError.value = '请输入 6 位验证码'
    return
  }
  codeError.value = ''
  if (!agreed.value) {
    showAgreementPrompt.value = true
    return
  }
  loading.value = true
  try {
    const safePhone = sanitize(phone.value)
    const res = await userStore.loginBySms({ phone: safePhone, code: smsCode.value })
    if (userStore.failedAttempts > 0) {
      pendingAccount.value = safePhone
      pendingRemember.value = false
      pendingUserData.value = res.user
      loading.value = false
      showSecurityVerify.value = true
      return
    }
    finishLogin(safePhone, false, res.user)
  } catch (e) {
    loading.value = false
    if (isLocked.value) startLockTicker()
    ElMessage.error(e.message || '登录失败，请稍后重试')
  }
}

function finishLogin(account, remember, userData) {
  userStore.completeLogin({ account, remember, userData })
  userStore.markVerified()
  showSecurityVerify.value = false
  loading.value = false
  ElMessage.success('登录成功，正在跳转...')
  setTimeout(() => router.push(redirectTarget.value), 400)
}

// ===== 异地登录滑块验证 =====
const showSecurityVerify = ref(false)
const sliderTrackRef = ref(null)
const sliderPos = ref(0)
const sliderMax = ref(0)
const sliderDragging = ref(false)
const sliderVerified = ref(false)
let dragStartX = 0
const pendingAccount = ref('')
const pendingRemember = ref(false)
const pendingUserData = ref(null)

function onSliderDown(e) {
  if (sliderVerified.value || !sliderTrackRef.value) return
  sliderDragging.value = true
  dragStartX = e.touches ? e.touches[0].clientX : e.clientX
  sliderMax.value = sliderTrackRef.value.clientWidth - 44
  window.addEventListener('mousemove', onSliderMove)
  window.addEventListener('mouseup', onSliderUp)
  window.addEventListener('touchmove', onSliderMove, { passive: false })
  window.addEventListener('touchend', onSliderUp)
}
function onSliderMove(e) {
  if (!sliderDragging.value) return
  if (e.cancelable) e.preventDefault()
  const x = e.touches ? e.touches[0].clientX : e.clientX
  let pos = x - dragStartX
  pos = Math.max(0, Math.min(pos, sliderMax.value))
  sliderPos.value = pos
}
function onSliderUp() {
  if (!sliderDragging.value) return
  sliderDragging.value = false
  window.removeEventListener('mousemove', onSliderMove)
  window.removeEventListener('mouseup', onSliderUp)
  window.removeEventListener('touchmove', onSliderMove)
  window.removeEventListener('touchend', onSliderUp)
  if (sliderPos.value >= sliderMax.value - 2) {
    sliderVerified.value = true
    ElMessage.success('安全验证通过')
    setTimeout(
      () => finishLogin(pendingAccount.value, pendingRemember.value, pendingUserData.value),
      500,
    )
  } else {
    sliderPos.value = 0
  }
}
function resetSlider() {
  sliderPos.value = 0
  sliderVerified.value = false
  sliderDragging.value = false
}

// ===== 辅助功能入口 =====
async function handleForgotPassword() {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入账号绑定的手机号或邮箱，我们将向您发送密码重置链接。',
      '找回密码',
      {
        confirmButtonText: '发送重置链接',
        cancelButtonText: '取消',
        inputPlaceholder: '手机号 / 邮箱',
        inputValidator: (v) => (v && v.trim().length >= 2) || '请输入有效的手机号或邮箱',
      },
    )
    if (value) ElMessage.success('重置链接已发送，请注意查收')
  } catch {
    /* 用户取消 */
  }
}
function handleForgotAccount() {
  ElMessage.info('请尝试使用注册时的手机号或邮箱找回账号')
}
function handleRegister() {
  router.push('/register')
}
function handleThirdParty(name) {
  ElMessage.info(`即将跳转至${name}完成授权登录...`)
}
function openAgreement(type) {
  ElMessageBox.alert(`这里是《${type}》的演示内容，正式环境中将展示完整协议文本。`, type, {
    confirmButtonText: '我知道了',
  })
}

// ===== 第三方登录（官方品牌色 + 标准图标） =====
const socialProviders = [
  {
    name: '微信',
    color: '#07C160',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.852-.544-3.785-4.735-6.536-9.596-6.536zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.913 2.534 3.687 4.394 6.687 4.394.812 0 1.595-.13 2.332-.357a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.583.583 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.406-.032zm-2.93 3.18c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>`,
  },
  {
    name: '支付宝',
    color: '#1677FF',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="PingFang SC, sans-serif">支</text></svg>`,
  },
]

// ===== 二维码图案 =====
const qrModules = computed(() => {
  const size = 29
  const modules = Array.from({ length: size }, () => Array(size).fill(0))

  const addFinder = (x, y) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          modules[y + i][x + j] = 1
        }
      }
    }
  }
  addFinder(0, 0)
  addFinder(size - 7, 0)
  addFinder(0, size - 7)

  const addAlignment = (x, y) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2)) {
          modules[y + i][x + j] = 1
        }
      }
    }
  }
  addAlignment(size - 9, size - 9)

  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0 ? 1 : 0
    modules[i][6] = i % 2 === 0 ? 1 : 0
  }
  modules[size - 8][8] = 1

  let rand = 123456789
  const random = () => {
    rand = (rand * 9301 + 49297) % 233280
    return rand / 233280
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (modules[i][j] === 0 && random() > 0.5) {
        modules[i][j] = 1
      }
    }
  }
  return modules
})

// ===== 生命周期 =====
onMounted(() => {
  userStore.loadLock()
  userStore.loadRemembered()
  loadSmsCountdown()
  if (route.query.registered === '1') {
    ElMessage.success('注册成功！请使用新账号登录')
  }
  if (userStore.isLoggedIn) {
    router.replace(redirectTarget.value)
    return
  }
  if (isLocked.value) startLockTicker()
})
onUnmounted(() => {
  stopLockTicker()
  if (smsTimer) clearInterval(smsTimer)
  window.removeEventListener('mousemove', onSliderMove)
  window.removeEventListener('mouseup', onSliderUp)
  window.removeEventListener('touchmove', onSliderMove)
  window.removeEventListener('touchend', onSliderUp)
})
</script>

<style scoped>
/* ============================================================
   淘宝风格登录页 · 参考官方登录页视觉
   ============================================================ */

.login-page {
  min-height: 100vh;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航 ===== */
.login-header {
  flex-shrink: 0;
  background: #f2f2f2;
  padding: 20px 40px;
}
.login-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-header__logo {
  display: flex;
  align-items: baseline;
  gap: 4px;
  text-decoration: none;
}
.login-header__logo-main {
  font-size: 28px;
  font-weight: 900;
  color: #ff5000;
  letter-spacing: 2px;
}
.login-header__logo-sub {
  font-size: 13px;
  color: #ff5000;
  font-weight: 600;
}
.login-header__links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.login-header__link {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: color 150ms ease;
}
.login-header__link:hover {
  color: #ff5000;
}
.login-header__link--feedback {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #999;
}
.login-header__link--feedback .el-icon {
  color: #ff5000;
  font-size: 14px;
}

/* ===== 主体区域 ===== */
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
.login-card {
  display: flex;
  width: 100%;
  max-width: 880px;
  min-height: 460px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ===== 左侧：扫码登录 ===== */
.login-card__left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  border-right: 1px solid #f0f0f0;
}
.login-card__left-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 28px;
}
.qr-wrap {
  width: 180px;
  height: 180px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  margin-bottom: 20px;
}
.qr-code {
  width: 100%;
  height: 100%;
  display: block;
}
.qr-tip {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}
.qr-tip em {
  color: #ff5000;
  font-style: normal;
  font-weight: 500;
}
.qr-help {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}
.qr-help:hover {
  color: #ff5000;
}

/* ===== 右侧：表单登录 ===== */
.login-card__right {
  flex: 1;
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
}
.login-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
}
.login-tabs__item {
  position: relative;
  padding: 0;
  border: none;
  background: none;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: color 150ms ease;
}
.login-tabs__item:hover {
  color: #ff5000;
}
.login-tabs__item.active {
  color: #ff5000;
  font-weight: 700;
}
.login-tabs__item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 3px;
  background: #ff5000;
  border-radius: 2px;
}

/* ===== 锁定提示 ===== */
.lock-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 14px;
  animation: shake-x 0.4s ease;
}
@keyframes shake-x {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.lock-banner .el-icon {
  flex-shrink: 0;
  font-size: 16px;
}

/* ===== 表单 ===== */
.login-form {
  margin-bottom: 8px;
}
.form-row {
  margin-bottom: 16px;
}
.form-row--password {
  position: relative;
}
.form-row--password .el-input :deep(.el-input__inner) {
  padding-right: 70px;
}
.forgot-link {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #999;
  cursor: pointer;
  transition: color 150ms ease;
}
.forgot-link:hover {
  color: #ff5000;
}
.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 0 14px;
  height: 44px;
  background: #f5f5f5;
  box-shadow: none;
  transition:
    background 150ms ease,
    box-shadow 150ms ease;
}
.login-form :deep(.el-input__wrapper:hover) {
  background: #fff;
  box-shadow: 0 0 0 1px #e8e8e8 inset;
}
.login-form :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 1px #ff5000 inset;
}
.login-form :deep(.el-input__inner) {
  font-size: 14px;
  color: #333;
}
.login-form :deep(.el-input__inner::placeholder) {
  color: #999;
}
.field-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff4d4f;
  margin: -12px 0 12px;
  line-height: 1.5;
  animation: err-in 0.25s ease;
}
@keyframes err-in {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.field-error::before {
  content: '!';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

/* 短信验证码 */
.sms-code-row {
  position: relative;
}
.sms-code-row :deep(.el-input__inner) {
  padding-right: 100px;
}
.sms-code-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 34px;
  padding: 0 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #ff5000;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  z-index: 1;
  transition:
    color 150ms ease,
    background 150ms ease,
    opacity 150ms ease;
}
.sms-code-btn:hover:not(:disabled) {
  color: #e04800;
}
.sms-code-btn.is-countdown {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}
.sms-code-btn:disabled {
  color: #999;
  cursor: not-allowed;
  opacity: 0.5;
}
.sms-tip {
  font-size: 12px;
  color: #999;
  margin: 8px 0 0;
}
.sms-tip strong {
  color: #ff5000;
  letter-spacing: 1px;
}

/* ===== 登录按钮 ===== */
.login-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #ff9000 0%, #ff5000 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 4px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
  margin-top: 8px;
}
.login-btn:hover:not(:disabled) {
  opacity: 0.92;
}
.login-btn:active:not(:disabled) {
  transform: scale(0.99);
}
.login-btn:disabled {
  background: #e0e0e0;
  color: #fff;
  cursor: not-allowed;
}
.login-btn .spin {
  animation: login-spin 0.8s linear infinite;
}
@keyframes login-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== 辅助链接 ===== */
.login-helpers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
.social-login {
  display: flex;
  align-items: center;
  gap: 12px;
}
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand);
  cursor: pointer;
  transition: transform 150ms ease;
}
.social-btn:hover {
  transform: translateY(-2px);
}
.helper-links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.divider-dot {
  color: #e0e0e0;
}
.link {
  color: #ff5000;
  cursor: pointer;
  transition: color 150ms ease;
}
.link:hover {
  color: #e04800;
  text-decoration: underline;
}

/* ===== 协议 ===== */
.agreement {
  margin-top: 18px;
  align-items: flex-start;
}
.agreement :deep(.el-checkbox__label) {
  padding-left: 6px;
}
.agreement__text {
  font-size: 12px;
  line-height: 1.6;
  color: #999;
  white-space: normal;
}
.agreement__text em {
  color: #ff5000;
  font-style: normal;
  margin-right: 2px;
}
.agreement :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #ff5000;
  border-color: #ff5000;
}
.agreement :deep(.el-checkbox__inner:hover) {
  border-color: #ff5000;
}

/* ===== 滑块验证 ===== */
.verify-body {
  padding: 4px 0;
}
.verify-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 18px;
}
.verify-tip__icon {
  color: #ff5000;
  flex-shrink: 0;
  margin-top: 2px;
}
.slider-track {
  position: relative;
  width: 100%;
  height: 46px;
  border-radius: 999px;
  background: #f2f2f2;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  user-select: none;
}
.slider-track.is-verified {
  border-color: #52c41a;
}
.slider-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #fff1e8, #ffd4b8);
  border-radius: 999px;
  transition: width 150ms ease;
}
.slider-track.is-verified .slider-progress {
  background: linear-gradient(90deg, #f0fff0, #d4f4d4);
}
.slider-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #999;
  pointer-events: none;
}
.slider-handle {
  position: absolute;
  left: 0;
  top: 0;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff9000 0%, #ff5000 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  box-shadow: 0 3px 8px rgba(255, 80, 0, 0.3);
  transition: box-shadow 150ms ease;
}
.slider-handle:hover {
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.4);
}
.slider-handle:active {
  cursor: grabbing;
}
.slider-track.is-verified .slider-handle {
  background: linear-gradient(90deg, #6fd66f, #52c41a);
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .login-card {
    max-width: 460px;
  }
  .login-card__left {
    display: none;
  }
  .login-card__right {
    padding: 36px 32px;
  }
}
@media (max-width: 600px) {
  .login-header {
    padding: 16px 20px;
  }
  .login-header__links {
    display: none;
  }
  .login-main {
    padding: 24px 16px;
  }
  .login-card {
    border-radius: 16px;
  }
  .login-card__right {
    padding: 28px 24px;
  }
  .login-tabs__item {
    font-size: 16px;
  }
  .login-helpers {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
@media (max-width: 380px) {
  .login-card__right {
    padding: 24px 18px;
  }
  .sms-code-btn {
    font-size: 12px;
    padding: 0 8px;
  }
}
</style>
