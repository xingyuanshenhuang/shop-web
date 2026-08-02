import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userInfo as mockUser } from '@/mock/data'

const REMEMBER_KEY = 'taobao_remember_token'
const LOCK_KEY = 'taobao_login_lock'
const MAX_ATTEMPTS = 5
const LOCK_DURATION = 60 * 1000 // 锁定 60 秒
const REMEMBER_TTL = 7 * 24 * 60 * 60 * 1000 // 记住我 7 天

export const useUserStore = defineStore('user', () => {
  const user = ref({ ...mockUser })
  const isCollected = ref(false)

  // ===== 登录态 / 安全 =====
  const isLoggedIn = ref(false)
  const failedAttempts = ref(0)
  const lockedUntil = ref(0) // 锁定到期时间戳
  const verifiedInSession = ref(false) // 当前会话是否已通过设备安全验证

  function toggleCollect() {
    isCollected.value = !isCollected.value
  }

  const isLocked = computed(() => lockedUntil.value > Date.now())
  const lockRemaining = computed(() =>
    Math.max(0, Math.ceil((lockedUntil.value - Date.now()) / 1000)),
  )

  // 读取“记住我”令牌，7 天内自动登录
  function loadRemembered() {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.expiresAt && data.expiresAt > Date.now()) {
        isLoggedIn.value = true
        if (data.user) user.value = { ...mockUser, ...data.user }
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
    } catch {
      localStorage.removeItem(REMEMBER_KEY)
    }
  }

  function setRemembered(account) {
    const expiresAt = Date.now() + REMEMBER_TTL
    localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({ account, expiresAt, user: mockUser }),
    )
  }

  function clearRemembered() {
    localStorage.removeItem(REMEMBER_KEY)
  }

  // 读取历史锁定状态（刷新后仍生效）
  function loadLock() {
    try {
      const raw = localStorage.getItem(LOCK_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.until && data.until > Date.now()) {
        failedAttempts.value = data.failed || MAX_ATTEMPTS
        lockedUntil.value = data.until
      } else {
        failedAttempts.value = 0
        lockedUntil.value = 0
        localStorage.removeItem(LOCK_KEY)
      }
    } catch {
      localStorage.removeItem(LOCK_KEY)
    }
  }

  function resetAttempts() {
    failedAttempts.value = 0
    lockedUntil.value = 0
    localStorage.removeItem(LOCK_KEY)
  }

  // 账号密码登录（mock：账号≥2位 且 密码≥6位 即视为凭证正确）
  function login({ account, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const credentialOk = !!account && account.length >= 2 && !!password && password.length >= 6
        if (credentialOk) {
          resolve({ success: true, user: user.value })
        } else {
          failedAttempts.value += 1
          if (failedAttempts.value >= MAX_ATTEMPTS) {
            lockedUntil.value = Date.now() + LOCK_DURATION
            localStorage.setItem(
              LOCK_KEY,
              JSON.stringify({ failed: failedAttempts.value, until: lockedUntil.value }),
            )
          }
          reject(
            new Error(
              failedAttempts.value >= MAX_ATTEMPTS
                ? '账号或密码错误次数过多，已暂时锁定'
                : '账号或密码错误',
            ),
          )
        }
      }, 800)
    })
  }

  // 短信验证码登录（mock：手机号合法 且 验证码为 6 位）
  function loginBySms({ phone, code }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (phone && code && code.length === 6) {
          resolve({ success: true, user: user.value })
        } else {
          failedAttempts.value += 1
          if (failedAttempts.value >= MAX_ATTEMPTS) {
            lockedUntil.value = Date.now() + LOCK_DURATION
            localStorage.setItem(
              LOCK_KEY,
              JSON.stringify({ failed: failedAttempts.value, until: lockedUntil.value }),
            )
          }
          reject(new Error('验证码错误或已失效'))
        }
      }, 800)
    })
  }

  // 凭证校验通过后，完成登录态写入
  function completeLogin({ account, remember }) {
    isLoggedIn.value = true
    failedAttempts.value = 0
    lockedUntil.value = 0
    localStorage.removeItem(LOCK_KEY)
    if (remember) setRemembered(account)
  }

  function markVerified() {
    verifiedInSession.value = true
  }

  function logout() {
    isLoggedIn.value = false
    verifiedInSession.value = false
    clearRemembered()
  }

  return {
    user,
    isCollected,
    isLoggedIn,
    failedAttempts,
    isLocked,
    lockRemaining,
    verifiedInSession,
    toggleCollect,
    login,
    loginBySms,
    completeLogin,
    markVerified,
    logout,
    loadRemembered,
    loadLock,
    resetAttempts,
  }
})
