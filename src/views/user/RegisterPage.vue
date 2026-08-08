<template>
  <div class="register-page">
    <!-- 顶部工具栏 -->
    <div class="register-topbar">
      <div class="register-topbar__inner">
        <div class="register-topbar__left">
          <span class="register-topbar__greeting">亲，请登录</span>
          <router-link to="/register" class="register-topbar__link active">免费注册</router-link>
          <a class="register-topbar__link">网页无障碍</a>
        </div>
        <div class="register-topbar__right">
          <a class="register-topbar__link">淘宝网首页</a>
          <a class="register-topbar__link">已买到的宝贝</a>
          <a class="register-topbar__link">
            我的淘宝
            <el-icon><ArrowDown /></el-icon>
          </a>
          <a class="register-topbar__link">
            <el-icon><ShoppingCart /></el-icon>
            购物车
          </a>
          <a class="register-topbar__link">
            <el-icon><Star /></el-icon>
            收藏夹
            <el-icon><ArrowDown /></el-icon>
          </a>
          <a class="register-topbar__link">
            免费开店
            <el-icon><ArrowDown /></el-icon>
          </a>
          <a class="register-topbar__link">
            千牛卖家中心
            <el-icon><ArrowDown /></el-icon>
          </a>
          <a class="register-topbar__link">
            帮助中心
            <el-icon><ArrowDown /></el-icon>
          </a>
        </div>
      </div>
    </div>

    <!-- 页面头部 -->
    <header class="register-header">
      <div class="register-header__inner">
        <router-link to="/" class="register-header__logo">
          <span class="register-header__logo-main">淘宝</span>
          <span class="register-header__logo-sub">Taobao</span>
        </router-link>
        <h1 class="register-header__title">用户注册</h1>
      </div>
    </header>

    <!-- 注册主体 -->
    <main class="register-main">
      <form class="register-form" @submit.prevent="handleSubmit" novalidate>
        <!-- 手机号 -->
        <div class="form-line">
          <label class="form-line__label">手机号码</label>
          <div class="form-line__input form-line__input--phone">
            <el-select v-model="countryCode" class="country-select" popper-class="country-select-dropdown">
              <el-option label="中国大陆 +86" value="+86" />
              <el-option label="中国香港 +852" value="+852" />
              <el-option label="中国澳门 +853" value="+853" />
              <el-option label="中国台湾 +886" value="+886" />
            </el-select>
            <el-input
              v-model="form.phone"
              size="large"
              clearable
              autocomplete="tel"
              maxlength="11"
              placeholder="请输入你的手机号码"
              :aria-invalid="!!errors.phone"
              aria-describedby="err-phone"
              @input="onPhoneInput"
              @blur="validatePhone(true)"
            />
          </div>
        </div>
        <p v-if="errors.phone" id="err-phone" class="field-error" aria-live="polite">
          {{ errors.phone }}
        </p>

        <!-- 验证码 -->
        <div class="form-line">
          <label class="form-line__label">验证码</label>
          <div class="form-line__input form-line__input--code">
            <el-input
              v-model="smsCode"
              size="large"
              autocomplete="one-time-code"
              inputmode="numeric"
              maxlength="6"
              placeholder="请输入校验码"
              :aria-invalid="!!codeError"
              aria-describedby="err-code"
              @input="smsCode = smsCode.replace(/\D/g, ''); codeError = ''"
            />
            <button
              type="button"
              class="code-btn"
              :disabled="smsCountdown > 0 || sendingCode"
              @click="sendSmsCode"
            >
              {{ smsCountdown > 0 ? `${smsCountdown}s 后重发` : '获取验证码' }}
            </button>
          </div>
        </div>
        <p v-if="codeError" id="err-code" class="field-error" aria-live="polite">
          {{ codeError }}
        </p>

        <!-- 用户名 -->
        <div class="form-line">
          <label class="form-line__label">用户名</label>
          <div class="form-line__input">
            <el-input
              v-model="form.username"
              size="large"
              clearable
              maxlength="20"
              autocomplete="username"
              placeholder="设置用户名（2-20 位，中英文/数字/下划线）"
              :aria-invalid="!!errors.username"
              aria-describedby="err-username"
              @input="onUsernameInput"
              @blur="validateUsername(true)"
            />
          </div>
        </div>
        <p v-if="errors.username" id="err-username" class="field-error" aria-live="polite">
          {{ errors.username }}
        </p>

        <!-- 邮箱 -->
        <div class="form-line">
          <label class="form-line__label">邮箱</label>
          <div class="form-line__input">
            <el-input
              v-model="form.email"
              size="large"
              clearable
              type="email"
              autocomplete="email"
              placeholder="邮箱（选填，用于找回密码）"
              :aria-invalid="!!errors.email"
              aria-describedby="err-email"
              @input="errors.email = ''"
              @blur="validateEmail(true)"
            />
          </div>
        </div>
        <p v-if="errors.email" id="err-email" class="field-error" aria-live="polite">
          {{ errors.email }}
        </p>

        <!-- 设置密码 -->
        <div class="form-line">
          <label class="form-line__label">设置密码</label>
          <div class="form-line__input">
            <el-input
              v-model="form.password"
              size="large"
              autocomplete="new-password"
              :type="pwdVisible ? 'text' : 'password'"
              placeholder="设置密码（6-20 位，建议字母+数字+符号）"
              :aria-invalid="!!errors.password"
              aria-describedby="err-password"
              @input="onPasswordInput"
              @blur="validatePassword(true)"
            >
              <template #suffix>
                <el-icon
                  class="pwd-toggle"
                  @click="pwdVisible = !pwdVisible"
                  :aria-label="pwdVisible ? '隐藏密码' : '显示密码'"
                >
                  <View v-if="!pwdVisible" />
                  <Hide v-else />
                </el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <p v-if="errors.password" id="err-password" class="field-error" aria-live="polite">
          {{ errors.password }}
        </p>

        <!-- 密码强度 -->
        <div v-if="form.password" class="strength" :data-level="passwordStrength">
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

        <!-- 确认密码 -->
        <div class="form-line">
          <label class="form-line__label">确认密码</label>
          <div class="form-line__input">
            <el-input
              v-model="form.confirmPassword"
              size="large"
              autocomplete="new-password"
              :type="pwdVisible ? 'text' : 'password'"
              placeholder="再次输入密码"
              :aria-invalid="!!errors.confirmPassword"
              aria-describedby="err-confirm"
              @input="errors.confirmPassword = ''"
              @blur="validateConfirm(true)"
            />
          </div>
        </div>
        <p v-if="errors.confirmPassword" id="err-confirm" class="field-error" aria-live="polite">
          {{ errors.confirmPassword }}
        </p>

        <!-- 协议 -->
        <el-checkbox v-model="agreed" class="agreement">
          <span class="agreement__text">
            已阅读并同意以下协议
            <a class="link" @click.prevent="openAgreement('淘宝平台服务协议')">淘宝平台服务协议</a>、
            <a class="link" @click.prevent="openAgreement('隐私权政策')">隐私权政策</a>、
            <a class="link" @click.prevent="openAgreement('法律声明')">法律声明</a>、
            <a class="link" @click.prevent="openAgreement('支付宝及客户端服务协议')">支付宝及客户端服务协议</a>
          </span>
        </el-checkbox>

        <!-- 提交按钮 -->
        <button type="submit" class="register-btn" :disabled="submitting || !canSubmit">
          <el-icon v-if="submitting" class="spin"><Loading /></el-icon>
          <span>{{ submitting ? '注册中...' : '同意并注册' }}</span>
        </button>

        <!-- 企业注册切换 -->
        <div class="enterprise-row">
          <a class="link" @click="switchEnterprise">切换成企业账号注册</a>
        </div>
      </form>
    </main>

    <!-- 页脚 -->
    <footer class="register-footer">
      <div class="register-footer__nav">
        <div class="footer-column" v-for="col in footerColumns" :key="col.title">
          <h4 class="footer-column__title">{{ col.title }}</h4>
          <a v-for="link in col.links" :key="link" class="footer-column__link">{{ link }}</a>
        </div>
      </div>
      <div class="register-footer__partners">
        <a v-for="p in partners" :key="p" class="partner-link">{{ p }}</a>
      </div>
      <div class="register-footer__copyright">
        <p class="copyright-line">
          <a>关于淘宝</a>
          <a>营销中心</a>
          <a>廉政举报</a>
          <a>开放平台</a>
          <a>诚征英才</a>
          <a>隐私权政策</a>
          <a>法律声明</a>
          <a>知识产权</a>
          <span>© 2003-现在 Taobao.com 版权所有</span>
          <span>增值电信业务经营许可证：浙B2-20080224</span>
          <span>增值电信业务经营许可证（跨地区）：B2-20150210</span>
        </p>
        <p class="copyright-line">
          <span>浙网文（2025）0051-019号</span>
          <span>浙江省网络食品销售第三方平台提供者备案：浙网食A33010001</span>
          <span>网络餐饮服务第三方平台备案：浙网餐备2024A330000020</span>
          <span>互联网药品信息服务资格证书（浙）-经营性-2023-0008</span>
        </p>
        <p class="copyright-line">
          <span>信息网络传播视听许可证：1109364号</span>
          <span>出版物网络交易平台服务经营备案号：新出发浙备字第2024004号</span>
          <span>营业性演出许可证：330101120994</span>
        </p>
      </div>
      <div class="register-footer__badges">
        <span class="badge">营业执照</span>
        <span class="badge">可信网站</span>
        <span class="badge">违法和不良信息</span>
        <span class="badge">国家知识产权公共服务网</span>
        <span class="badge">中国扫黄打非网</span>
      </div>
    </footer>

    <!-- 协议提示弹窗 -->
    <AgreementPrompt
      v-model:visible="showAgreementPrompt"
      scene="register"
      :agreements="['《淘宝平台服务协议》', '《隐私权政策》', '《法律声明》', '《支付宝及客户端服务协议》']"
      @agree="handleAgreeAndSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import AgreementPrompt from '@/components/common/AgreementPrompt.vue'

const router = useRouter()
const userStore = useUserStore()

const PHONE_RE = /^1[3-9]\d{9}$/
const EMAIL_RE = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/
const USERNAME_RE = /^[A-Za-z0-9_\u4e00-\u9fa5]{2,20}$/

const countryCode = ref('+86')
const smsCode = ref('')
const codeError = ref('')
const sendingCode = ref(false)

const form = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const pwdVisible = ref(false)
const agreed = ref(false)
const showAgreementPrompt = ref(false)
const submitting = ref(false)

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
  if (!validatePhone(true)) return
  sendingCode.value = true
  setTimeout(() => {
    sendingCode.value = false
    startSmsCountdown()
    ElMessage.success('验证码已发送，请查收短信（演示验证码：123456）')
  }, 300)
}

// ===== 协议提示弹窗 =====
function handleAgreeAndSubmit() {
  agreed.value = true
  handleSubmit()
}

// ===== 实时校验 =====
function validateUsername(blur = false) {
  const v = form.username.trim()
  if (!v) errors.username = '请输入用户名'
  else if (!USERNAME_RE.test(v)) errors.username = '用户名需 2-20 位中英文/数字/下划线'
  else if (userStore.isUsernameTaken(v)) errors.username = '该用户名已被注册'
  else errors.username = ''
  void blur
  return !errors.username
}
function validateEmail(blur = false) {
  const v = form.email.trim()
  if (!v) errors.email = ''
  else if (!EMAIL_RE.test(v)) errors.email = '邮箱格式不正确'
  else if (userStore.isEmailTaken(v)) errors.email = '该邮箱已被注册'
  else errors.email = ''
  void blur
  return !errors.email
}
function validatePhone(blur = false) {
  const v = form.phone.trim()
  if (!v) errors.phone = '请输入手机号'
  else if (!PHONE_RE.test(v)) errors.phone = '手机号格式不正确'
  else if (userStore.isPhoneTaken(v)) errors.phone = '该手机号已被注册'
  else errors.phone = ''
  void blur
  return !errors.phone
}
function validatePassword(blur = false) {
  const v = form.password
  if (!v) errors.password = '请设置密码'
  else if (v.length < 6) errors.password = '密码长度不少于 6 位'
  else if (v.length > 20) errors.password = '密码长度不超过 20 位'
  else errors.password = ''
  if (form.confirmPassword) validateConfirm()
  void blur
  return !errors.password
}
function validateConfirm(blur = false) {
  if (!form.confirmPassword) errors.confirmPassword = '请再次输入密码'
  else if (form.confirmPassword !== form.password) errors.confirmPassword = '两次密码输入不一致'
  else errors.confirmPassword = ''
  void blur
  return !errors.confirmPassword
}

function onUsernameInput() {
  validateUsername()
}
function onPhoneInput() {
  form.phone = form.phone.replace(/\D/g, '')
  errors.phone = ''
}
function onPasswordInput() {
  validatePassword()
}

// ===== 强度 =====
function calcStrength(pwd) {
  if (!pwd || pwd.length < 6) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  const types = [
    /[a-z]/.test(pwd),
    /[A-Z]/.test(pwd),
    /\d/.test(pwd),
    /[^a-zA-Z0-9]/.test(pwd),
  ].filter(Boolean).length
  if (types >= 2) score++
  if (types >= 3) score++
  if (score <= 2) return 1
  if (score === 3) return 2
  return 3
}
const passwordStrength = computed(() => calcStrength(form.password))
const strengthLabel = computed(() => ['', '弱', '中', '强'][passwordStrength.value])

// ===== 整体可提交 =====
const canSubmit = computed(() => {
  return (
    form.username &&
    form.phone &&
    form.password &&
    form.confirmPassword &&
    !errors.username &&
    !errors.phone &&
    !errors.password &&
    !errors.confirmPassword &&
    agreed.value
  )
})

async function handleSubmit() {
  const ok =
    validateUsername(true) &
    validatePhone(true) &
    validateEmail(true) &
    validatePassword(true) &
    validateConfirm(true)
  if (!ok) return
  if (!agreed.value) {
    showAgreementPrompt.value = true
    return
  }
  if (!smsCode.value || smsCode.value.length !== 6) {
    codeError.value = '请输入 6 位验证码'
    return
  }
  codeError.value = ''
  submitting.value = true
  try {
    const res = await userStore.register({
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    })
    const account = form.phone.trim()
    userStore.completeLogin({
      account,
      remember: false,
      userData: { id: res.id, username: res.username, phone: account, email: form.email.trim() },
    })
    userStore.markVerified()
    ElMessage.success('注册成功，正在跳转首页...')
    setTimeout(() => router.push('/'), 300)
  } catch (e) {
    ElMessage.error(e.message || '注册失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

function openAgreement(type) {
  ElMessageBox.alert(`这里是《${type}》的演示内容，正式环境中将展示完整协议文本。`, type, {
    confirmButtonText: '我知道了',
  })
}

function switchEnterprise() {
  ElMessage.info('企业账号注册功能暂未开放')
}

// ===== 页脚数据 =====
const footerColumns = [
  { title: '规则协议', links: ['淘宝规则', '平台服务协议'] },
  { title: '新手上路', links: ['0元开店', '天猫开店', '商家服务'] },
  { title: '付款方式', links: ['快捷支付', '余额宝', '蚂蚁花呗'] },
  { title: '淘宝特色', links: ['阿里旺旺', '官方客服'] },
]

const partners = [
  '阿里巴巴集团',
  '淘宝',
  '天猫',
  '1688',
  '一淘',
  '阿里健康',
  '全球速卖通',
  '阿里巴巴国际站',
  '高德',
  '飞猪',
  '优酷',
  '大麦',
  '阿里影业',
  '钉钉',
  '支付宝',
  '阿里妈妈',
  '阿里云',
  'TAO',
]

onMounted(() => {
  userStore.resetAttempts()
})
</script>

<style scoped>
/* ============================================================
   淘宝风格注册页 · 参考官方注册页视觉
   ============================================================ */

.register-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
}

/* ===== 顶部工具栏 ===== */
.register-topbar {
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}
.register-topbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  font-size: 12px;
  color: #6c6c6c;
}
.register-topbar__left,
.register-topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.register-topbar__greeting {
  color: #ff5000;
}
.register-topbar__link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #6c6c6c;
  cursor: pointer;
  transition: color 150ms ease;
}
.register-topbar__link:hover,
.register-topbar__link.active {
  color: #ff5000;
}
.register-topbar__link .el-icon {
  font-size: 10px;
}

/* ===== 页面头部 ===== */
.register-header {
  background: #fff;
}
.register-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
}
.register-header__logo {
  display: flex;
  align-items: baseline;
  gap: 4px;
  text-decoration: none;
}
.register-header__logo-main {
  font-size: 32px;
  font-weight: 900;
  color: #ff5000;
  letter-spacing: 2px;
}
.register-header__logo-sub {
  font-size: 14px;
  color: #ff5000;
  font-weight: 600;
}
.register-header__title {
  font-size: 22px;
  font-weight: 500;
  color: #333;
}

/* ===== 注册主体 ===== */
.register-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 40px 20px 60px;
}
.register-form {
  width: 100%;
  max-width: 460px;
}

/* ===== 表单项 ===== */
.form-line {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.form-line__label {
  width: 90px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 16px;
  font-size: 14px;
  color: #333;
}
.form-line__input {
  flex: 1;
  min-width: 0;
}
.form-line__input--phone {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: box-shadow 150ms ease;
}
.form-line__input--phone :deep(.el-select) {
  width: 120px;
  flex-shrink: 0;
}
.form-line__input--phone :deep(.el-input__wrapper) {
  border-radius: 0;
  border-right: 1px solid #e8e8e8;
}
.form-line__input--phone :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
}
.form-line__input--phone > .el-input {
  flex: 1;
}
.form-line__input--phone > .el-input :deep(.el-input__wrapper) {
  border-radius: 0 8px 8px 0;
}
.form-line__input--code {
  display: flex;
  gap: 12px;
  align-items: center;
}
.form-line__input--code .el-input {
  flex: 1;
}
.code-btn {
  flex-shrink: 0;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ff5000;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms ease;
}
.code-btn:hover:not(:disabled) {
  color: #e04800;
}
.code-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 0 14px;
  height: 44px;
  background: #fff;
  box-shadow: 0 0 0 1px #e8e8e8 inset;
  transition: box-shadow 150ms ease;
}
.register-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #d0d0d0 inset;
}
.register-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #ff5000 inset;
}
.register-form :deep(.el-input__inner) {
  font-size: 14px;
  color: #333;
}
.register-form :deep(.el-input__inner::placeholder) {
  color: #999;
}

/* 国家代码选择器 */
.country-select :deep(.el-input__wrapper) {
  background: #f5f5f5;
  border-radius: 8px 0 0 8px;
  border-right: 1px solid #e8e8e8;
}
.country-select :deep(.el-input__inner) {
  font-size: 14px;
  color: #333;
}
:global(.country-select-dropdown .el-select-dropdown__item) {
  font-size: 14px;
}

.pwd-toggle {
  cursor: pointer;
  color: #999;
  transition: color 150ms ease;
}
.pwd-toggle:hover {
  color: #ff5000;
}
.field-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff4d4f;
  margin: -12px 0 12px 90px;
  line-height: 1.5;
  animation: err-in 0.25s ease;
}
@keyframes err-in {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
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

/* 密码强度 */
.strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -4px 0 16px 90px;
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
  background: #e8e8e8;
  transition: background 150ms ease;
}
.strength[data-level='1'] .is-active {
  background: #ff4d4f;
}
.strength[data-level='2'] .is-active {
  background: #faad14;
}
.strength[data-level='3'] .is-active {
  background: #52c41a;
}
.strength__label {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

/* 协议 */
.agreement {
  margin: 24px 0 24px 90px;
  align-items: flex-start;
}
.agreement :deep(.el-checkbox__label) {
  padding-left: 6px;
}
.agreement__text {
  font-size: 12px;
  line-height: 1.7;
  color: #999;
  white-space: normal;
}
.agreement :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #ff5000;
  border-color: #ff5000;
}
.agreement :deep(.el-checkbox__inner:hover) {
  border-color: #ff5000;
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

/* 注册按钮 */
.register-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  margin-left: 90px;
  width: calc(100% - 90px);
  border-radius: 24px;
  background: linear-gradient(90deg, #ff9000 0%, #ff5000 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  transition: opacity 150ms ease, transform 150ms ease;
}
.register-btn:hover:not(:disabled) {
  opacity: 0.92;
}
.register-btn:active:not(:disabled) {
  transform: scale(0.99);
}
.register-btn:disabled {
  background: #e0e0e0;
  color: #fff;
  cursor: not-allowed;
}
.register-btn .spin {
  animation: reg-spin 0.8s linear infinite;
}
@keyframes reg-spin {
  to { transform: rotate(360deg); }
}

.enterprise-row {
  text-align: right;
  margin-top: 16px;
  margin-left: 90px;
  font-size: 13px;
}

/* ===== 页脚 ===== */
.register-footer {
  background: #fff;
  border-top: 1px solid #eee;
  padding: 40px 20px 30px;
}
.register-footer__nav {
  max-width: 1200px;
  margin: 0 auto 32px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.footer-column__title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}
.footer-column__link {
  display: block;
  font-size: 12px;
  color: #999;
  line-height: 24px;
  cursor: pointer;
  transition: color 150ms ease;
}
.footer-column__link:hover {
  color: #ff5000;
}
.register-footer__partners {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
.partner-link {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: color 150ms ease;
}
.partner-link:hover {
  color: #ff5000;
}
.register-footer__copyright {
  max-width: 1200px;
  margin: 24px auto 0;
}
.copyright-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  font-size: 12px;
  color: #999;
  line-height: 1.8;
  margin-bottom: 4px;
}
.copyright-line a,
.copyright-line span {
  cursor: pointer;
  transition: color 150ms ease;
}
.copyright-line a:hover {
  color: #ff5000;
}
.register-footer__badges {
  max-width: 1200px;
  margin: 20px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  background: #f5f5f5;
  font-size: 12px;
  color: #666;
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .register-topbar__right {
    display: none;
  }
  .register-footer__nav {
    grid-template-columns: repeat(2, 1fr);
  }
  .register-footer__partners {
    gap: 12px 16px;
  }
}
@media (max-width: 600px) {
  .register-header__inner {
    padding: 16px 20px;
  }
  .register-main {
    padding: 24px 20px 40px;
  }
  .register-form {
    max-width: none;
  }
  .form-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .form-line__label {
    width: auto;
    text-align: left;
    padding-right: 0;
  }
  .form-line__input {
    width: 100%;
  }
  .field-error {
    margin-left: 0;
  }
  .agreement {
    margin-left: 0;
  }
  .register-btn {
    margin-left: 0;
    width: 100%;
  }
  .enterprise-row {
    margin-left: 0;
    text-align: center;
  }
  .strength {
    margin-left: 0;
  }
}
@media (max-width: 380px) {
  .form-line__input--phone :deep(.el-select) {
    width: 100px;
  }
  .code-btn {
    padding: 0 10px;
    font-size: 13px;
  }
  .register-footer__nav {
    grid-template-columns: 1fr;
  }
}
</style>
