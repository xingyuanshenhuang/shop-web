<template>
  <div class="login-page">
    <!-- 左侧品牌展示区（PC） -->
    <aside class="login-brand hide-on-mobile" aria-hidden="true">
      <div class="login-brand__bg"></div>
      <div class="login-brand__inner">
        <div class="login-brand__logo">
          <span class="login-brand__logo-main">淘宝</span>
          <span class="login-brand__logo-sub">Taobao.com</span>
        </div>
        <h2 class="login-brand__title">淘宝一下，想要就来</h2>
        <p class="login-brand__desc">
          千万好物，一键直达。登录账号即可解锁专属优惠、订单跟踪与购物车同步。
        </p>
        <img
          :src="brandImage"
          alt="购物主题插画"
          class="login-brand__illustration"
          loading="lazy"
          decoding="async"
        />
        <ul class="login-brand__features">
          <li><el-icon><CircleCheckFilled /></el-icon><span>官方正品，假一赔十</span></li>
          <li><el-icon><CircleCheckFilled /></el-icon><span>7 天无理由退货保障</span></li>
          <li><el-icon><CircleCheckFilled /></el-icon><span>全站 HTTPS 加密，账号更安全</span></li>
        </ul>
        <router-link to="/" class="login-brand__back">返回首页 &gt;</router-link>
      </div>
    </aside>

    <!-- 右侧登录卡 -->
    <main class="login-main">
      <div class="login-card">
        <div class="login-card__top">
          <div class="login-card__logo">
            <span class="login-card__logo-main">淘宝</span>
            <span class="login-card__logo-sub">Taobao.com</span>
          </div>
          <router-link to="/" class="login-card__home show-on-mobile-only">返回首页</router-link>
        </div>

        <header class="login-card__header">
          <h1 class="login-card__title">欢迎登录</h1>
          <p class="login-card__subtitle">登录后即可享受专属购物体验</p>
        </header>

        <!-- 账号锁定提示 -->
        <transition name="fade">
          <div v-if="isLocked" class="lock-banner" role="alert">
            <el-icon><WarningFilled /></el-icon>
            <span>
              账号已暂时锁定，请 <strong>{{ lockRemaining }}</strong> 秒后重试（连续 5 次错误将触发锁定）。
            </span>
          </div>
        </transition>

        <el-tabs v-model="loginMode" class="login-tabs">
          <el-tab-pane label="账号登录" name="account" />
          <el-tab-pane label="短信登录" name="sms" />
        </el-tabs>

        <!-- 账号登录表单 -->
        <form class="login-form" @submit.prevent="handleSubmit" v-show="loginMode === 'account'">
          <div class="account-types" role="tablist" aria-label="账号类型">
            <button
              v-for="t in accountTypes"
              :key="t.key"
              type="button"
              role="tab"
              :aria-selected="accountType === t.key"
              class="account-types__item"
              :class="{ active: accountType === t.key }"
              @click="switchAccountType(t.key)"
            >
              {{ t.label }}
            </button>
          </div>

          <el-input
            v-model="account"
            size="large"
            clearable
            autocomplete="username"
            :placeholder="accountPlaceholder"
            :aria-invalid="!!accountError"
            aria-describedby="account-error"
            @input="accountError = ''"
            @blur="validateAccount"
            @keyup.enter="handleSubmit"
          >
            <template #prefix>
              <el-icon>
                <Iphone v-if="accountType === 'phone'" />
                <Message v-else-if="accountType === 'email'" />
                <User v-else />
              </el-icon>
            </template>
          </el-input>
          <p v-if="accountError" id="account-error" class="field-error" aria-live="polite">
            {{ accountError }}
          </p>

          <el-input
            v-model="password"
            size="large"
            autocomplete="new-password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="请输入密码（6-20 位）"
            :aria-invalid="!!passwordError"
            aria-describedby="password-error"
            @input="passwordError = ''"
            @blur="validatePassword"
            @keyup.enter="handleSubmit"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
            <template #suffix>
              <el-icon
                class="pwd-toggle"
                :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
                @click="passwordVisible = !passwordVisible"
              >
                <View v-if="!passwordVisible" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
          <p v-if="passwordError" id="password-error" class="field-error" aria-live="polite">
            {{ passwordError }}
          </p>

          <!-- 密码强度指示器 -->
          <div v-if="password" class="strength" :data-level="passwordStrength">
            <div class="strength__bar">
              <span
                v-for="i in 3"
                :key="i"
                class="strength__seg"
                :class="{ 'is-active': i <= passwordStrength }"
              ></span>
            </div>
            <span class="strength__label">强度：{{ strengthLabel }}</span>
          </div>

          <div class="row-between">
            <el-checkbox v-model="rememberMe">记住我（7 天免登录）</el-checkbox>
            <a class="link" @click="handleForgotPassword">忘记密码？</a>
          </div>
        </form>

        <!-- 短信登录表单 -->
        <form class="login-form" @submit.prevent="handleSubmit" v-show="loginMode === 'sms'">
          <el-input
            v-model="phone"
            size="large"
            clearable
            autocomplete="tel"
            placeholder="请输入手机号"
            maxlength="11"
            :aria-invalid="!!phoneError"
            aria-describedby="phone-error"
            @input="phone = phone.replace(/\D/g, ''); phoneError = ''"
            @blur="validatePhone"
            @keyup.enter="handleSubmit"
          >
            <template #prefix"><el-icon><Iphone /></el-icon></template>
          </el-input>
          <p v-if="phoneError" id="phone-error" class="field-error" aria-live="polite">
            {{ phoneError }}
          </p>

          <div class="sms-code-row">
            <el-input
              v-model="smsCode"
              size="large"
              autocomplete="one-time-code"
              inputmode="numeric"
              maxlength="6"
              placeholder="请输入 6 位验证码"
              :aria-invalid="!!codeError"
              aria-describedby="code-error"
              @input="smsCode = smsCode.replace(/\D/g, ''); codeError = ''"
              @keyup.enter="handleSubmit"
            >
              <template #prefix><el-icon><Key /></el-icon></template>
            </el-input>
            <button
              type="button"
              class="sms-code-btn"
              :disabled="smsCountdown > 0 || loading"
              @click="sendSmsCode"
            >
              {{ smsCountdown > 0 ? `${smsCountdown}s 后重发` : '获取验证码' }}
            </button>
          </div>
          <p v-if="codeError" id="code-error" class="field-error" aria-live="polite">
            {{ codeError }}
          </p>
          <p class="sms-tip">演示验证码：<strong>123456</strong></p>

          <div class="row-between">
            <el-checkbox v-model="rememberMe">记住我（7 天免登录）</el-checkbox>
            <a class="link" @click="handleForgotPassword">忘记密码？</a>
          </div>
        </form>

        <!-- 协议勾选 -->
        <el-checkbox v-model="agreed" class="agreement">
          我已阅读并同意
          <a class="link" @click.prevent="openAgreement('用户服务协议')">《用户服务协议》</a>
          和
          <a class="link" @click.prevent="openAgreement('隐私政策')">《隐私政策》</a>
        </el-checkbox>

        <!-- 登录按钮（防重复点击） -->
        <button
          type="button"
          class="login-btn"
          :disabled="loginBtnDisabled"
          @click="handleSubmit"
        >
          <el-icon v-if="loading" class="spin"><Loading /></el-icon>
          <span>{{ loginBtnText }}</span>
        </button>

        <div class="register-row">
          还没有账号？<a class="link" @click="handleRegister">免费注册</a>
        </div>

        <div class="divider"><span>其他登录方式</span></div>

        <div class="social-row">
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
            <span class="social-btn__label">{{ s.name }}</span>
          </button>
        </div>

        <div class="secure-note">
          <el-icon><Lock /></el-icon>
          <span>本页面通过 HTTPS 加密传输，保障您的账号信息安全</span>
        </div>
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
        <div
          ref="sliderTrackRef"
          class="slider-track"
          :class="{ 'is-verified': sliderVerified }"
        >
          <div class="slider-progress" :style="{ width: sliderPos + 44 + 'px' }"></div>
          <span class="slider-text">{{ sliderVerified ? '验证通过' : '向右滑动滑块完成验证' }}</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const redirectTarget = computed(() =>
  route.query.redirect ? String(route.query.redirect) : '/',
)

// ===== 品牌插画（懒加载） =====
const brandImage =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flat%20vector%20illustration%20online%20shopping%20concept%20happy%20young%20people%20with%20shopping%20bags%20gift%20boxes%20and%20smartphone%20warm%20orange%20palette%20modern%20minimal%20e%20commerce%20theme%20soft%20gradients%20clean%20background&image_size=portrait_4_3'

// ===== 登录方式 =====
const loginMode = ref('account') // account | sms
const accountType = ref('phone') // phone | email | username
const accountTypes = [
  { key: 'phone', label: '手机号' },
  { key: 'email', label: '邮箱' },
  { key: 'username', label: '用户名' },
]
function switchAccountType(key) {
  accountType.value = key
  account.value = ''
  accountError.value = ''
}

// ===== 表单字段 =====
const account = ref('')
const password = ref('')
const passwordVisible = ref(false)
const phone = ref('')
const smsCode = ref('')
const rememberMe = ref(false)
const agreed = ref(false)

// ===== 错误提示 =====
const accountError = ref('')
const passwordError = ref('')
const phoneError = ref('')
const codeError = ref('')

// ===== 校验规则 =====
const PHONE_RE = /^1[3-9]\d{9}$/
const EMAIL_RE = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/
const USERNAME_RE = /^[A-Za-z0-9_\u4e00-\u9fa5]{2,20}$/

const accountPlaceholder = computed(
  () => ({ phone: '请输入手机号', email: '请输入邮箱', username: '请输入用户名' })[accountType.value],
)

function validateAccount() {
  const v = account.value.trim()
  if (!v) accountError.value = '请输入账号'
  else if (accountType.value === 'phone' && !PHONE_RE.test(v))
    accountError.value = '手机号格式不正确'
  else if (accountType.value === 'email' && !EMAIL_RE.test(v))
    accountError.value = '邮箱格式不正确'
  else if (accountType.value === 'username' && !USERNAME_RE.test(v))
    accountError.value = '用户名需 2-20 位中英文/数字/下划线'
  else accountError.value = ''
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

// ===== 密码强度 =====
function calcStrength(pwd) {
  if (!pwd || pwd.length < 6) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  const types = [/[a-z]/.test(pwd), /[A-Z]/.test(pwd), /\d/.test(pwd), /[^a-zA-Z0-9]/.test(pwd)].filter(
    Boolean,
  ).length
  if (types >= 2) score++
  if (types >= 3) score++
  if (score <= 2) return 1
  if (score === 3) return 2
  return 3
}
const passwordStrength = computed(() => calcStrength(password.value))
const strengthLabel = computed(() => ['', '弱', '中', '强'][passwordStrength.value])

// ===== XSS 输入过滤 =====
function sanitize(str) {
  return String(str)
    .replace(/[<>"'`]/g, '')
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
  // 锁定到期后重置错误计数
  if (v <= 0 && userStore.failedAttempts > 0) {
    userStore.resetAttempts()
    stopLockTicker()
  }
})

// ===== 短信倒计时 =====
const smsCountdown = ref(0)
let smsTimer = null
function startSmsCountdown() {
  smsCountdown.value = 60
  smsTimer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(smsTimer)
      smsCountdown.value = 0
    }
  }, 1000)
}
function sendSmsCode() {
  if (!validatePhone()) return
  startSmsCountdown()
  ElMessage.success('验证码已发送，请查收短信（演示验证码：123456）')
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
    ElMessage.warning('请先阅读并同意《用户服务协议》和《隐私政策》')
    return
  }
  loading.value = true
  try {
    const safeAccount = sanitize(account.value)
    await userStore.login({ account: safeAccount, password: password.value })
    // 凭证正确：异常场景下触发异地登录安全验证
    if (userStore.failedAttempts > 0 && !userStore.verifiedInSession) {
      pendingAccount.value = safeAccount
      pendingRemember.value = rememberMe.value
      loading.value = false
      showSecurityVerify.value = true
      return
    }
    finishLogin(safeAccount, rememberMe.value)
  } catch (e) {
    loading.value = false
    if (isLocked.value) startLockTicker()
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
    ElMessage.warning('请先阅读并同意《用户服务协议》和《隐私政策》')
    return
  }
  loading.value = true
  try {
    const safePhone = sanitize(phone.value)
    await userStore.loginBySms({ phone: safePhone, code: smsCode.value })
    if (userStore.failedAttempts > 0 && !userStore.verifiedInSession) {
      pendingAccount.value = safePhone
      pendingRemember.value = rememberMe.value
      loading.value = false
      showSecurityVerify.value = true
      return
    }
    finishLogin(safePhone, rememberMe.value)
  } catch (e) {
    loading.value = false
    if (isLocked.value) startLockTicker()
    ElMessage.error(e.message || '登录失败，请稍后重试')
  }
}

function finishLogin(account, remember) {
  userStore.completeLogin({ account, remember })
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
    setTimeout(() => finishLogin(pendingAccount.value, pendingRemember.value), 500)
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
function handleRegister() {
  ElMessageBox.alert(
    '注册功能正在建设中，您可暂时使用微信、QQ、支付宝快速登录，或联系客服开通账号。',
    '注册账号',
    { confirmButtonText: '我知道了' },
  )
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
    svg: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#fff" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.852-.544-3.785-4.735-6.536-9.596-6.536zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.913 2.534 3.687 4.394 6.687 4.394.812 0 1.595-.13 2.332-.357a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.583.583 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.406-.032zm-2.93 3.18c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>`,
  },
  {
    name: 'QQ',
    color: '#12B7F5',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#fff" d="M12.003 0c-2.265 0-4.661.232-6.745 1.624-.98.646-2.042 1.528-2.739 2.497-.717.433-1.212.94-1.474 1.52-.13.287-.16.7-.16 1.084.001.255.028.518.053.785l.063.704c.057.684.158 1.472-.156 2.025-.183.318-.485.544-.81.74-.352.21-.65.335-.945.436-.246.085-.46.16-.66.302-.088.062-.198.16-.218.295-.024.16.075.31.196.41.16.13.39.21.61.242.49.07 1.024-.02 1.397-.075.248-.036.426-.057.626-.04.244.02.485.123.71.32.27.236.413.56.494.9.044.187.067.378.092.566.045.337.087.66.243.94.117.21.28.405.42.51.07.05.13.06.17.06.06 0 .12-.02.18-.07.13-.11.18-.29.21-.49.04-.27.06-.55.06-.81.02-.13.06-.24.12-.34.08-.13.18-.21.29-.21.12 0 .23.07.32.18.09.11.16.26.22.42.18.48.36 1.06.62 1.61.24.51.55 1 .93 1.34.36.33.78.55 1.2.7.46.16.95.23 1.43.27.48.04.96.05 1.42.05h.06c.46 0 .94-.01 1.42-.05.48-.04.97-.11 1.43-.27.42-.15.84-.37 1.2-.7.38-.34.69-.83.93-1.34.26-.55.44-1.13.62-1.61.06-.16.13-.31.22-.42.09-.11.2-.18.32-.18.11 0 .21.08.29.21.06.1.1.21.12.34 0 .26.02.54.06.81.03.2.08.38.21.49.06.05.12.07.18.07.04 0 .1-.01.17-.06.14-.105.30-.3.42-.51.156-.28.198-.603.243-.94.025-.188.048-.379.092-.566.081-.34.224-.664.494-.9.225-.197.466-.3.71-.32.2-.017.378.004.626.04.373.055.907.145 1.397.075.22-.032.45-.112.61-.242.121-.1.22-.25.196-.41-.02-.135-.13-.233-.218-.295-.2-.142-.414-.217-.66-.302-.295-.101-.593-.226-.945-.436-.325-.196-.627-.422-.81-.74-.314-.553-.213-1.341-.156-2.025l.063-.704c.025-.267.052-.53.053-.785 0-.384-.03-.797-.16-1.084-.262-.58-.757-1.087-1.474-1.52-.697-.969-1.759-1.851-2.739-2.497C16.664.232 14.268 0 12.003 0z"/></svg>`,
  },
  {
    name: '支付宝',
    color: '#1677FF',
    svg: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="PingFang SC, sans-serif">支</text></svg>`,
  },
]

// ===== 生命周期 =====
onMounted(() => {
  userStore.loadLock()
  userStore.loadRemembered()
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
.login-page {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 60%);
}

/* ===== 左侧品牌区 ===== */
.login-brand {
  position: relative;
  flex: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.login-brand__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ff7a18 0%, #ff5000 55%, #e04800 100%);
}
.login-brand__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.12), transparent 45%);
}
.login-brand__inner {
  position: relative;
  z-index: 1;
  max-width: 440px;
  padding: 48px 40px;
  color: #fff;
  text-align: center;
}
.login-brand__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
  margin-bottom: 24px;
}
.login-brand__logo-main {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 4px;
}
.login-brand__logo-sub {
  font-size: 12px;
  letter-spacing: 1px;
  opacity: 0.85;
}
.login-brand__title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
}
.login-brand__desc {
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.92;
  margin-bottom: 24px;
}
.login-brand__illustration {
  width: 100%;
  max-width: 360px;
  height: auto;
  border-radius: var(--radius-card);
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.login-brand__features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin: 0 auto 24px;
  width: fit-content;
}
.login-brand__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.95;
}
.login-brand__back {
  font-size: 13px;
  color: #fff;
  opacity: 0.9;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 2px;
  transition: opacity var(--transition-fast);
}
.login-brand__back:hover {
  opacity: 1;
}

/* ===== 右侧登录区 ===== */
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: var(--radius-modal);
  box-shadow: var(--shadow-modal);
  padding: 32px 32px 24px;
}
.login-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.login-card__logo {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.login-card__logo-main {
  font-size: 22px;
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: 3px;
}
.login-card__logo-sub {
  font-size: 11px;
  color: var(--color-text-light);
}
.login-card__home {
  font-size: 12px;
  color: var(--color-text-mid);
}
.login-card__header {
  margin-bottom: 16px;
}
.login-card__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.login-card__subtitle {
  font-size: 13px;
  color: var(--color-text-light);
  margin-top: 4px;
}

/* ===== 锁定提示 ===== */
.lock-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: var(--color-danger);
  padding: 8px 12px;
  border-radius: var(--radius-btn);
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 12px;
}
.lock-banner .el-icon {
  flex-shrink: 0;
}

/* ===== 标签页 ===== */
.login-tabs {
  margin-bottom: 4px;
}
.login-tabs :deep(.el-tabs__header) {
  margin: 0 0 16px;
}

/* ===== 账号类型切换 ===== */
.account-types {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.account-types__item {
  flex: 1;
  height: 32px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: #fff;
  font-size: 13px;
  color: var(--color-text-mid);
  transition: all var(--transition-fast);
}
.account-types__item:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.account-types__item.active {
  color: #fff;
  background: var(--color-primary);
  border-color: var(--color-primary);
  font-weight: 600;
}

/* ===== 表单 ===== */
.login-form .el-input {
  margin-bottom: 4px;
}
.login-form :deep(.el-input__wrapper) {
  border-radius: var(--radius-btn);
  padding: 0 12px;
  transition: box-shadow var(--transition-fast);
}
.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.25);
}
.pwd-toggle {
  cursor: pointer;
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}
.pwd-toggle:hover {
  color: var(--color-primary);
}
.field-error {
  font-size: 12px;
  color: var(--color-danger);
  margin: 2px 0 10px;
  line-height: 1.5;
}

/* 密码强度 */
.strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0 12px;
}
.strength__bar {
  display: flex;
  gap: 4px;
  flex: 1;
}
.strength__seg {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--color-border);
  transition: background var(--transition-fast);
}
.strength[data-level='1'] .is-active {
  background: var(--color-danger);
}
.strength[data-level='2'] .is-active {
  background: #faad14;
}
.strength[data-level='3'] .is-active {
  background: var(--color-success);
}
.strength__label {
  font-size: 12px;
  color: var(--color-text-light);
  white-space: nowrap;
}

/* 行布局 */
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 14px;
}

/* 短信验证码 */
.sms-code-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.sms-code-row .el-input {
  flex: 1;
  margin-bottom: 0;
}
.sms-code-btn {
  flex-shrink: 0;
  height: 40px;
  padding: 0 14px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--color-primary);
  background: #fff;
  color: var(--color-primary);
  font-size: 13px;
  white-space: nowrap;
  transition: all var(--transition-fast);
}
.sms-code-btn:hover:not(:disabled) {
  background: var(--color-light-orange);
}
.sms-code-btn:disabled {
  border-color: var(--color-border);
  color: var(--color-text-light);
  cursor: not-allowed;
}
.sms-tip {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 6px 0 10px;
}
.sms-tip strong {
  color: var(--color-primary);
  letter-spacing: 1px;
}

/* 协议 */
.agreement {
  margin: 4px 0 16px;
  align-items: flex-start;
}
.agreement :deep(.el-checkbox__label) {
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-mid);
  white-space: normal;
}

/* 链接 */
.link {
  color: var(--color-primary);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  border-radius: var(--radius-btn);
  background: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all var(--transition-fast);
}
.login-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: 0 6px 16px rgba(255, 80, 0, 0.3);
}
.login-btn:active:not(:disabled) {
  transform: scale(0.99);
}
.login-btn:disabled {
  background: var(--color-border-light);
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

/* 注册 */
.register-row {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-mid);
  margin-top: 14px;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0 16px;
  color: var(--color-text-light);
  font-size: 12px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.divider span {
  padding: 0 12px;
}

/* 第三方登录 */
.social-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 18px;
}
.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
}
.social-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: transform var(--transition-fast);
}
.social-btn__icon :deep(svg) {
  display: block;
}
.social-btn:hover .social-btn__icon {
  transform: translateY(-2px);
}
.social-btn__label {
  font-size: 12px;
  color: var(--color-text-mid);
}

/* 安全提示 */
.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-light);
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
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
  color: var(--color-text-mid);
  line-height: 1.7;
  margin-bottom: 18px;
}
.verify-tip__icon {
  color: var(--color-deep-orange);
  flex-shrink: 0;
  margin-top: 2px;
}
.slider-track {
  position: relative;
  width: 100%;
  height: 44px;
  border-radius: var(--radius-pill);
  background: #f2f2f2;
  border: 1px solid var(--color-border);
  overflow: hidden;
  user-select: none;
}
.slider-track.is-verified {
  border-color: var(--color-success);
}
.slider-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--color-light-orange);
  border-radius: var(--radius-pill);
}
.slider-track.is-verified .slider-progress {
  background: var(--color-light-green);
}
.slider-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--color-text-mid);
  pointer-events: none;
}
.slider-handle {
  position: absolute;
  left: 0;
  top: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.slider-handle:active {
  cursor: grabbing;
}
.slider-track.is-verified .slider-handle {
  background: var(--color-success);
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .login-brand {
    display: none;
  }
  .login-main {
    padding: 40px 20px;
  }
}
@media (max-width: 768px) {
  .login-page {
    background: #fff;
  }
  .login-main {
    padding: 24px 16px;
    align-items: flex-start;
  }
  .login-card {
    max-width: none;
    box-shadow: none;
    padding: 24px 16px;
  }
  .social-row {
    gap: 20px;
  }
}
</style>
