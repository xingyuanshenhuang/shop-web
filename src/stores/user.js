import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userInfo as mockUser } from '@/mock/data'

const REMEMBER_KEY = 'taobao_remember_token'
const LOCK_KEY = 'taobao_login_lock'
const USERS_KEY = 'taobao_users'
const MAX_ATTEMPTS = 5
const LOCK_DURATION = 60 * 1000 // 锁定 60 秒
const REMEMBER_TTL = 7 * 24 * 60 * 60 * 1000 // 记住我 7 天

// ========== 用户库（localStorage 模拟） ==========
// 记录字段：{ id, username, email, phone, passwordHash, salt, createdAt, avatar }
// 注意：此为前端演示实现，真实环境应由服务端哈希存储（bcrypt/argon2）。

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function genSalt() {
  const buf = new Uint8Array(16)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

// 使用 Web Crypto API 做 SHA-256（salt + 密码）哈希
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(buf)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// 纯文本比较：登录时对输入重新哈希后比对
async function verifyPassword(password, salt, expectedHash) {
  const hash = await hashPassword(password, salt)
  // 常量时间字符串比较（简化版，足够演示）
  if (hash.length !== expectedHash.length) return false
  let diff = 0
  for (let i = 0; i < hash.length; i++) {
    diff |= hash.charCodeAt(i) ^ expectedHash.charCodeAt(i)
  }
  return diff === 0
}

function findUserByAccount(users, account) {
  const key = account.trim().toLowerCase()
  return (
    users.find((u) => u.username.toLowerCase() === key) ||
    users.find((u) => u.email && u.email.toLowerCase() === key) ||
    users.find((u) => u.phone === account.trim()) ||
    null
  )
}

// 防 XSS：注册字段入库前过滤危险字符（前端最后一道防线）
function sanitizeUserInput(str) {
  return String(str)
    .replace(/[<>"'`]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}

export const useUserStore = defineStore('user', () => {
  const user = ref({ ...mockUser })
  const isCollected = ref(false)

  // ===== 登录态 / 安全 =====
  const isLoggedIn = ref(false)
  const failedAttempts = ref(0)
  const lockedUntil = ref(0) // 锁定到期时间戳
  const verifiedInSession = ref(false) // 当前会话是否已通过设备安全验证
  const sessionToken = ref('') // 会话 token（演示，真实应由后端颁发 JWT/SessionID）

  function toggleCollect() {
    isCollected.value = !isCollected.value
  }

  const isLocked = computed(() => lockedUntil.value > Date.now())
  const lockRemaining = computed(() =>
    Math.max(0, Math.ceil((lockedUntil.value - Date.now()) / 1000)),
  )

  // ===== 用户库操作 =====
  const users = ref([])

  function refreshUsers() {
    users.value = loadUsers()
  }

  function isUsernameTaken(username) {
    return users.value.some((u) => u.username.toLowerCase() === username.toLowerCase())
  }
  function isEmailTaken(email) {
    return users.value.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())
  }
  function isPhoneTaken(phone) {
    return users.value.some((u) => u.phone === phone)
  }

  // 注册
  async function register({ username, email, phone, password }) {
    refreshUsers()
    const u = sanitizeUserInput(username)
    const e = email ? sanitizeUserInput(email) : ''
    const p = phone ? sanitizeUserInput(phone) : ''
    const rawPwd = password

    if (!u) throw new Error('用户名不能为空')
    if (isUsernameTaken(u)) throw new Error('该用户名已被注册')
    if (e && isEmailTaken(e)) throw new Error('该邮箱已被注册')
    if (p && isPhoneTaken(p)) throw new Error('该手机号已被注册')

    const salt = genSalt()
    const passwordHash = await hashPassword(rawPwd, salt)
    const newUser = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      username: u,
      email: e,
      phone: p,
      passwordHash,
      salt,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(u)}/100/100`,
      createdAt: Date.now(),
    }
    const list = loadUsers()
    list.push(newUser)
    saveUsers(list)
    refreshUsers()
    return { ok: true, id: newUser.id, username: newUser.username }
  }

  // ===== 锁定 / 错误计数 =====
  function recordFailedAttempt() {
    failedAttempts.value += 1
    if (failedAttempts.value >= MAX_ATTEMPTS) {
      lockedUntil.value = Date.now() + LOCK_DURATION
      localStorage.setItem(
        LOCK_KEY,
        JSON.stringify({ failed: failedAttempts.value, until: lockedUntil.value }),
      )
    }
  }

  // ===== 登录 =====
  function login({ account, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const safeAccount = sanitizeUserInput(account)
          refreshUsers()
          const target = findUserByAccount(users.value, safeAccount)
          if (!target) {
            recordFailedAttempt()
            if (failedAttempts.value >= MAX_ATTEMPTS) {
              reject(new Error('账号不存在且尝试次数过多，已暂时锁定'))
            } else {
              reject(new Error('账号不存在，请检查输入或前往注册'))
            }
            return
          }
          const ok = await verifyPassword(password, target.salt, target.passwordHash)
          if (!ok) {
            recordFailedAttempt()
            if (failedAttempts.value >= MAX_ATTEMPTS) {
              reject(new Error('账号或密码错误次数过多，已暂时锁定'))
            } else {
              reject(new Error('密码错误，请重试'))
            }
            return
          }
          resolve({ success: true, user: target })
        } catch (e) {
          reject(e instanceof Error ? e : new Error('登录失败'))
        }
      }, 600)
    })
  }

  // 短信验证码登录（mock：手机号合法 且 验证码为 6 位）
  function loginBySms({ phone, code }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!phone || !code || code.length !== 6) {
          recordFailedAttempt()
          reject(new Error('验证码错误或已失效'))
          return
        }
        refreshUsers()
        const target = users.value.find((u) => u.phone === phone)
        if (!target) {
          // 未注册手机号：demo 中允许直接登录并创建匿名会话
          resolve({
            success: true,
            user: { ...mockUser, phone },
            anonymous: true,
          })
          return
        }
        resolve({ success: true, user: target })
      }, 600)
    })
  }

  // ===== 会话 / 记住我 =====
  function loadRemembered() {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.expiresAt && data.expiresAt > Date.now()) {
        isLoggedIn.value = true
        if (data.user) {
          user.value = { ...mockUser, ...data.user }
          sessionToken.value = data.token || ''
        }
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
    } catch {
      localStorage.removeItem(REMEMBER_KEY)
    }
  }

  function setRemembered(account, userData) {
    const expiresAt = Date.now() + REMEMBER_TTL
    const token = 'tk_' + Date.now().toString(36) + Math.random().toString(36).slice(2)
    sessionToken.value = token
    localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({
        account,
        token,
        expiresAt,
        user: { ...mockUser, ...userData },
      }),
    )
  }

  function clearRemembered() {
    localStorage.removeItem(REMEMBER_KEY)
    sessionToken.value = ''
  }

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

  // ===== 修改密码 =====
  async function changePassword({ currentPassword, newPassword }) {
    refreshUsers()
    const currentUser = users.value.find((u) => u.id === user.value.id)
    if (!currentUser) throw new Error('用户信息异常，请重新登录')

    const ok = await verifyPassword(currentPassword, currentUser.salt, currentUser.passwordHash)
    if (!ok) throw new Error('当前密码不正确')

    const salt = genSalt()
    const passwordHash = await hashPassword(newPassword, salt)
    currentUser.passwordHash = passwordHash
    currentUser.salt = salt
    saveUsers(users.value)
    refreshUsers()
    return { ok: true }
  }

  // ===== 更新用户资料（手机/邮箱/第三方账号等） =====
  function updateUserField(field, value) {
    refreshUsers()
    const currentUser = users.value.find((u) => u.id === user.value.id)
    if (!currentUser) throw new Error('用户信息异常，请重新登录')
    currentUser[field] = value
    saveUsers(users.value)
    // 同步更新 store 中的 user 对象
    if (user.value) {
      user.value[field] = value
    }
    refreshUsers()
    return { ok: true }
  }

  // 登录成功落盘
  function completeLogin({ account, remember, userData }) {
    isLoggedIn.value = true
    failedAttempts.value = 0
    lockedUntil.value = 0
    localStorage.removeItem(LOCK_KEY)
    if (userData) {
      // 优先使用真实登录用户的数据，兼容短信匿名登录场景（无 username 字段时回退 mockUser）
      const hasRealName = userData && userData.id && (userData.username || userData.phone)
      user.value = hasRealName
        ? {
            ...mockUser,
            ...userData,
            name: userData.username || userData.phone || mockUser.name,
          }
        : { ...mockUser, ...userData }
    }
    if (remember) setRemembered(account, userData)
  }

  function markVerified() {
    verifiedInSession.value = true
  }

  function logout() {
    isLoggedIn.value = false
    verifiedInSession.value = false
    user.value = { ...mockUser }
    clearRemembered()
  }

  // 初始化：确保一次刷新
  refreshUsers()

  return {
    user,
    isCollected,
    isLoggedIn,
    failedAttempts,
    isLocked,
    lockRemaining,
    verifiedInSession,
    sessionToken,
    users,
    toggleCollect,
    register,
    isUsernameTaken,
    isEmailTaken,
    isPhoneTaken,
    login,
    loginBySms,
    changePassword,
    updateUserField,
    completeLogin,
    markVerified,
    logout,
    loadRemembered,
    loadLock,
    resetAttempts,
  }
})
