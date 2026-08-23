<template>
  <div class="settings-view">
    <div class="settings-view__header">
      <h3>账号设置</h3>
    </div>
    <div class="settings-tabs">
      <span
        v-for="tab in settingsTabs"
        :key="tab.key"
        class="settings-tab"
        :class="{ active: currentTab === tab.key }"
        @click="handleTabClick(tab.key)"
        >{{ tab.label }}</span
      >
    </div>

    <div v-if="currentTab === 'settings-profile'" class="settings-profile">
      <div class="profile-avatar">
        <img :src="user.avatar" class="profile-avatar__img" />
        <el-button size="small">更换头像</el-button>
      </div>
      <div class="profile-form">
        <div class="form-row">
          <label>昵称</label>
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称" maxlength="20" />
          <span class="form-row__count">{{ profileForm.nickname.length }}/20</span>
        </div>
        <div class="form-row">
          <label>真实姓名</label>
          <el-input v-model="profileForm.realName" placeholder="请输入真实姓名" maxlength="10" />
          <el-tag v-if="profileForm.verified" type="success" size="small" style="margin-left: 8px"
            >已认证</el-tag
          >
        </div>
        <div class="form-row">
          <label>性别</label>
          <el-radio-group v-model="profileForm.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
            <el-radio value="secret">保密</el-radio>
          </el-radio-group>
        </div>
        <div class="form-row">
          <label>生日</label>
          <el-date-picker v-model="profileForm.birthday" type="date" placeholder="选择日期" />
        </div>
        <div class="form-row">
          <label>个性签名</label>
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            placeholder="介绍一下自己吧"
            maxlength="100"
            :rows="3"
          />
        </div>
        <el-button type="primary" style="display: block; margin: 24px auto 0; width: 200px"
          >保存修改</el-button
        >
      </div>
    </div>

    <div v-if="currentTab === 'settings-security'" class="settings-security">
      <div class="security-score">
        <div class="security-score__chart">
          <div class="security-score__circle" :style="{ '--percent': securityScore }">
            <span>{{ securityScore }}</span>
          </div>
        </div>
        <div class="security-score__items">
          <div>
            <span :style="{ color: hasPassword ? 'var(--color-success)' : 'var(--color-deep-orange)' }">
              {{ hasPassword ? '✓' : '!' }}
            </span>
            登录密码{{ hasPassword ? '已设置' : '未设置' }}
          </div>
          <div>
            <span :style="{ color: hasPhone ? 'var(--color-success)' : 'var(--color-deep-orange)' }">
              {{ hasPhone ? '✓' : '!' }}
            </span>
            手机{{ hasPhone ? '已绑定' : '未绑定' }}
          </div>
          <div>
            <span :style="{ color: hasEmail ? 'var(--color-success)' : 'var(--color-deep-orange)' }">
              {{ hasEmail ? '✓' : '!' }}
            </span>
            邮箱{{ hasEmail ? '已绑定' : '未绑定' }}
          </div>
        </div>
      </div>
      <div class="security-list">
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Lock /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">登录密码</span>
            <span class="security-item__status" :style="{ color: hasPassword ? 'var(--color-success)' : 'var(--color-danger)' }">
              {{ hasPassword ? '已设置' : '未设置' }}
            </span>
          </div>
          <el-button text size="small" @click="openPasswordDialog">修改</el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Iphone /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">手机绑定</span>
            <span class="security-item__status" :style="{ color: hasPhone ? '' : 'var(--color-danger)' }">
              {{ displayPhone }}
            </span>
          </div>
          <el-button text :type="hasPhone ? '' : 'primary'" size="small" @click="openPhoneDialog">
            {{ hasPhone ? '更换' : '绑定' }}
          </el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Message /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">邮箱绑定</span>
            <span class="security-item__status" :style="{ color: hasEmail ? '' : 'var(--color-danger)' }">
              {{ displayEmail }}
            </span>
          </div>
          <el-button text :type="hasEmail ? '' : 'primary'" size="small" @click="openEmailDialog">
            {{ hasEmail ? '修改' : '绑定' }}
          </el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Link /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">第三方账号</span>
            <span class="security-item__status" style="color: var(--color-success)">{{ thirdPartySummary }}</span>
          </div>
          <el-button text size="small" @click="openThirdPartyDialog">管理</el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Monitor /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">设备管理</span>
            <span class="security-item__status">当前 2 台设备登录</span>
          </div>
          <el-button text size="small">查看</el-button>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'settings-address'" class="settings-address">
      <div class="address-header">
        <el-button type="primary" size="small" @click="addAddress()">新增地址</el-button>
      </div>
      <div class="address-list">
        <div
          v-for="addr in addresses"
          :key="addr.id"
          class="address-card"
          :class="{ 'is-default': addr.isDefault }"
        >
          <div class="address-card__default-tag" v-if="addr.isDefault">默认</div>
          <div class="address-card__content">
            <div class="address-card__name">
              {{ addr.name }} <span style="margin-left: 12px">{{ addr.phone }}</span>
            </div>
            <div class="address-card__detail">
              {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
            </div>
          </div>
          <div class="address-card__actions">
            <el-button text size="small" @click="editAddress(addr)">编辑</el-button>
            <el-button text size="small" type="danger" @click="confirmDelete(addr)">删除</el-button>
          </div>
        </div>
      </div>
      <div v-if="!addresses.length" class="address-empty">
        <el-icon :size="64" color="#E0D6CE"><Message /></el-icon>
        <p>暂无收货地址</p>
        <el-button @click="showAddDialog = true">新增收货地址</el-button>
      </div>

      <el-dialog
        v-model="showAddDialog"
        :title="isEditing ? '编辑地址' : '新增收货地址'"
        width="480px"
        :close-on-click-modal="false"
      >
        <el-form label-width="80px">
          <el-form-item label="收件人" required
            ><el-input v-model="formData.name" placeholder="请输入收件人姓名"
          /></el-form-item>
          <el-form-item label="手机号" required
            ><el-input v-model="formData.phone" placeholder="请输入手机号" maxlength="11"
          /></el-form-item>
          <el-form-item label="所在地区" required
            ><el-input v-model="formData.region" placeholder="省/市/区"
          /></el-form-item>
          <el-form-item label="详细地址" required
            ><el-input
              v-model="formData.detail"
              type="textarea"
              placeholder="请输入详细地址"
              :rows="3"
              resize="none"
          /></el-form-item>
          <el-form-item
            ><el-checkbox v-model="formData.isDefault">设为默认地址</el-checkbox></el-form-item
          >
        </el-form>
        <template #footer>
          <el-button type="primary" @click="showAddDialog = false">保存</el-button>
        </template>
      </el-dialog>

      <el-dialog
        v-model="showDeleteDialog"
        title="确认删除"
        width="360px"
        :close-on-click-modal="false"
      >
        <p>确定删除该地址吗？</p>
        <template #footer>
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="deleteAddress">删除</el-button>
        </template>
      </el-dialog>
    </div>

    <div v-if="currentTab === 'settings-about'" class="settings-about">
      <div class="about-brand">
        <div class="about-brand__logo">
          <el-icon :size="48" color="var(--color-primary)"><ShoppingCart /></el-icon>
        </div>
        <h2>XX商城</h2>
        <p>品质购物，尽享生活</p>
      </div>
      <div class="about-info">
        <div class="about-info__row">
          <span>当前版本</span>
          <span style="color: var(--color-text-light)">V1.0.0</span>
          <el-button text size="small">检查更新</el-button>
        </div>
        <div class="about-info__row">
          <span>用户协议</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="about-info__row">
          <span>隐私政策</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="about-info__row">
          <span>免责声明</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="about-info__row">
          <span>联系我们</span>
          <span style="color: var(--color-text-light)">service@example.com</span>
          <el-button text size="small">复制</el-button>
        </div>
      </div>
      <div class="about-social">
        <h4>关注我们</h4>
        <div class="about-social__icons">
          <span
            v-for="social in ['微信', '微博', '抖音', '小红书']"
            :key="social"
            class="about-social__icon"
            >{{ social }}</span
          >
        </div>
      </div>
      <div class="about-copyright">
        <p>© 2025 XX商城 版权所有</p>
        <p>ICP备案号：京ICP备XXXXXXXX号</p>
      </div>
    </div>

    <!-- ===== 修改密码弹窗 ===== -->
    <el-dialog v-model="showPasswordDialog" title="修改登录密码" width="460px" :close-on-click-modal="false" @closed="resetPasswordForm">
      <div class="security-dialog-body">
        <div class="dialog-field">
          <label>当前密码</label>
          <el-input
            v-model="pwdForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            :aria-invalid="!!pwdErrors.currentPassword"
            @input="pwdErrors.currentPassword = ''"
          />
          <p v-if="pwdErrors.currentPassword" class="field-error">{{ pwdErrors.currentPassword }}</p>
        </div>
        <div class="dialog-field">
          <label>新密码</label>
          <el-input
            v-model="pwdForm.newPassword"
            :type="pwdVisible ? 'text' : 'password'"
            placeholder="请输入新密码（需包含大小写字母、数字和特殊符号，长度≥8位）"
            show-password
            :aria-invalid="!!pwdErrors.newPassword"
            @input="onNewPasswordInput"
          />
          <div v-if="pwdForm.newPassword" class="strength" :data-level="newPasswordStrength">
            <div class="strength__bar">
              <span v-for="i in 4" :key="i" class="strength__seg" :class="{ 'is-active': i <= newPasswordStrength }"></span>
            </div>
            <span class="strength__label">强度：{{ newPasswordStrengthLabel }}</span>
          </div>
          <p v-if="pwdErrors.newPassword" class="field-error">{{ pwdErrors.newPassword }}</p>
        </div>
        <div class="dialog-field">
          <label>确认新密码</label>
          <el-input
            v-model="pwdForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            :aria-invalid="!!pwdErrors.confirmPassword"
            @input="pwdErrors.confirmPassword = ''"
          />
          <p v-if="pwdErrors.confirmPassword" class="field-error">{{ pwdErrors.confirmPassword }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" :loading="pwdSubmitting" @click="handleChangePassword">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- ===== 手机绑定弹窗 ===== -->
    <el-dialog v-model="showPhoneDialog" :title="phoneDialogTitle" width="460px" :close-on-click-modal="false" @closed="resetPhoneForm">
      <div class="security-dialog-body">
        <div class="dialog-field">
          <label>手机号</label>
          <el-input
            v-model="phoneForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
            :aria-invalid="!!phoneErrors.phone"
            @input="phoneForm.phone = phoneForm.phone.replace(/\D/g, ''); phoneErrors.phone = ''"
          />
          <p v-if="phoneErrors.phone" class="field-error">{{ phoneErrors.phone }}</p>
        </div>
        <div class="dialog-field">
          <label>验证码</label>
          <div class="sms-code-row-dialog">
            <el-input
              v-model="phoneForm.code"
              placeholder="请输入验证码"
              maxlength="6"
              :aria-invalid="!!phoneErrors.code"
              @input="phoneForm.code = phoneForm.code.replace(/\D/g, ''); phoneErrors.code = ''"
            />
            <button
              type="button"
              class="sms-code-btn"
              :disabled="phoneSmsCountdown > 0 || phoneSending"
              @click="sendPhoneSmsCode"
            >
              {{ phoneSmsCountdown > 0 ? `${phoneSmsCountdown}s 后重发` : '发送验证码' }}
            </button>
          </div>
          <p v-if="phoneErrors.code" class="field-error">{{ phoneErrors.code }}</p>
          <p class="sms-tip">演示验证码：<strong>123456</strong></p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPhoneDialog = false">取消</el-button>
        <el-button type="primary" :loading="phoneSubmitting" @click="handleBindPhone">{{ hasPhone ? '确认更换' : '确认绑定' }}</el-button>
      </template>
    </el-dialog>

    <!-- ===== 邮箱绑定弹窗 ===== -->
    <el-dialog v-model="showEmailDialog" :title="emailDialogTitle" width="460px" :close-on-click-modal="false" @closed="resetEmailForm">
      <div class="security-dialog-body">
        <div class="dialog-field">
          <label>邮箱地址</label>
          <el-input
            v-model="emailForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            :aria-invalid="!!emailErrors.email"
            @input="emailErrors.email = ''"
          />
          <p v-if="emailErrors.email" class="field-error">{{ emailErrors.email }}</p>
        </div>
        <div class="dialog-field">
          <label>验证码</label>
          <div class="sms-code-row-dialog">
            <el-input
              v-model="emailForm.code"
              placeholder="请输入验证码"
              maxlength="6"
              :aria-invalid="!!emailErrors.code"
              @input="emailForm.code = emailForm.code.replace(/\D/g, ''); emailErrors.code = ''"
            />
            <button
              type="button"
              class="sms-code-btn"
              :disabled="emailSmsCountdown > 0 || emailSending"
              @click="sendEmailCode"
            >
              {{ emailSmsCountdown > 0 ? `${emailSmsCountdown}s 后重发` : '发送验证码' }}
            </button>
          </div>
          <p v-if="emailErrors.code" class="field-error">{{ emailErrors.code }}</p>
          <p class="sms-tip">演示验证码：<strong>123456</strong></p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showEmailDialog = false">取消</el-button>
        <el-button type="primary" :loading="emailSubmitting" @click="handleBindEmail">{{ hasEmail ? '确认修改' : '确认绑定' }}</el-button>
      </template>
    </el-dialog>

    <!-- ===== 第三方账号管理弹窗 ===== -->
    <el-dialog v-model="showThirdPartyDialog" title="第三方账号管理" width="460px" :close-on-click-modal="false">
      <div class="third-party-list">
        <div v-for="provider in thirdPartyProviders" :key="provider.name" class="third-party-item">
          <div class="third-party-item__left">
            <span class="third-party-item__icon" :style="{ background: provider.color }" v-html="provider.svg"></span>
            <div class="third-party-item__info">
              <span class="third-party-item__name">{{ provider.name }}</span>
              <span class="third-party-item__status" :style="{ color: provider.bound ? 'var(--color-success)' : 'var(--color-text-light)' }">
                {{ provider.bound ? `已绑定${provider.bindName ? `（${provider.bindName}）` : ''}` : '未绑定' }}
              </span>
            </div>
          </div>
          <el-button
            v-if="provider.bound"
            text
            size="small"
            type="danger"
            @click="confirmUnbind(provider)"
          >解绑</el-button>
          <el-button
            v-else
            text
            size="small"
            type="primary"
            @click="handleBindThirdParty(provider)"
          >绑定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 解绑二次确认弹窗 -->
    <el-dialog v-model="showUnbindConfirm" title="确认解绑" width="400px" :close-on-click-modal="false">
      <div class="unbind-warning">
        <el-icon :size="40" color="#faad14"><WarningFilled /></el-icon>
        <p>确定要解绑 <strong>{{ unbindingProvider?.name }}</strong> 账号吗？</p>
        <p class="unbind-warning__tip">解绑后可能会影响使用该账号登录的功能，请谨慎操作。</p>
      </div>
      <template #footer>
        <el-button @click="showUnbindConfirm = false">取消</el-button>
        <el-button type="danger" :loading="unbindSubmitting" @click="handleUnbind">确认解绑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { Lock, Iphone, Message, Link, Monitor, ArrowRight, WarningFilled, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { addresses as mockAddresses } from '@/mock/data'

const props = defineProps({
  activeTab: { type: String, default: 'settings' },
})

const emit = defineEmits(['change-tab'])

function handleTabClick(key) {
  currentTab.value = key
  emit('change-tab', key)
}
const userStore = useUserStore()
const user = ref(userStore.user)

const currentTab = ref('settings-profile')

const settingsTabs = [
  { key: 'settings-profile', label: '个人资料' },
  { key: 'settings-security', label: '安全设置' },
  { key: 'settings-address', label: '收货地址' },
  { key: 'settings-about', label: '关于我们' },
]

const profileForm = reactive({
  nickname: '小明',
  realName: '',
  gender: 'secret',
  birthday: '',
  bio: '',
  verified: false,
})

watch(
  () => props.activeTab,
  (newVal) => {
    if (newVal && newVal.startsWith('settings-')) {
      currentTab.value = newVal
    }
  },
)

onMounted(() => {
  if (props.activeTab && props.activeTab.startsWith('settings-')) {
    currentTab.value = props.activeTab
  }
})

// ===== 安全状态计算 =====
const hasPassword = computed(() => {
  const users = userStore.users
  const currentUser = users.find((u) => u.id === userStore.user.id)
  return !!(currentUser && currentUser.passwordHash)
})

const hasPhone = computed(() => {
  return !!(userStore.user.phone && userStore.user.phone !== '138****8888')
})

const hasEmail = computed(() => {
  return !!(userStore.user.email)
})

const displayPhone = computed(() => {
  const phone = userStore.user.phone
  if (!phone || phone === '138****8888') return '未绑定'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const displayEmail = computed(() => {
  const email = userStore.user.email
  if (!email) return '未绑定'
  const [name, domain] = email.split('@')
  return name.slice(0, 2) + '***@' + domain
})

const securityScore = computed(() => {
  let score = 0
  if (hasPassword.value) score += 35
  if (hasPhone.value) score += 35
  if (hasEmail.value) score += 30
  return score
})

// ===== 第三方账号 =====
const thirdPartyBound = ref(loadThirdPartyBinding())

function loadThirdPartyBinding() {
  try {
    const raw = localStorage.getItem('taobao_third_party')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveThirdPartyBinding(data) {
  localStorage.setItem('taobao_third_party', JSON.stringify(data))
  thirdPartyBound.value = { ...data }
}

const thirdPartySummary = computed(() => {
  const bound = Object.values(thirdPartyBound.value).filter(Boolean).length
  return bound > 0 ? `已绑定 ${bound} 个账号` : '未绑定'
})

const thirdPartyProviders = computed(() => {
  const bound = thirdPartyBound.value
  return socialProviders.map((sp) => ({
    ...sp,
    bound: !!bound[sp.name],
    bindName: bound[sp.name] || '',
  }))
})

const socialProviders = [
  {
    name: '微信',
    color: '#07C160',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.852-.544-3.785-4.735-6.536-9.596-6.536zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.913 2.534 3.687 4.394 6.687 4.394.812 0 1.595-.13 2.332-.357a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.583.583 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89l-.406-.032zm-2.93 3.18c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>`,
  },
  {
    name: 'QQ',
    color: '#12B7F5',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M12.003 0c-2.265 0-4.661.232-6.745 1.624-.98.646-2.042 1.528-2.739 2.497-.717.433-1.212.94-1.474 1.52-.13.287-.16.7-.16 1.084.001.255.028.518.053.785l.063.704c.057.684.158 1.472-.156 2.025-.183.318-.485.544-.81.74-.352.21-.65.335-.945.436-.246.085-.46.16-.66.302-.088.062-.198.16-.218.295-.024.16.075.31.196.41.16.13.39.21.61.242.49.07 1.024-.02 1.397-.075.248-.036.426-.057.626-.04.244.02.485.123.71.32.27.236.413.56.494.9.044.187.067.378.092.566.045.337.087.66.243.94.117.21.28.405.42.51.07.05.13.06.17.06.06 0 .12-.02.18-.07.13-.11.18-.29.21-.49.04-.27.06-.55.06-.81.02-.13.06-.24.12-.34.08-.13.18-.21.29-.21.12 0 .23.07.32.18.09.11.16.26.22.42.18.48.36 1.06.62 1.61.24.51.55 1 .93 1.34.36.33.78.55 1.2.7.46.16.95.23 1.43.27.48.04.96.05 1.42.05h.06c.46 0 .94-.01 1.42-.05.48-.04.97-.11 1.43-.27.42-.15.84-.37 1.2-.7.38-.34.69-.83.93-1.34.26-.55.44-1.13.62-1.61.06-.16.13-.31.22-.42.09-.11.2-.18.32-.18.11 0 .21.08.29.21.06.1.1.21.12.34 0 .26.02.54.06.81.03.2.08.38.21.49.06.05.12.07.18.07.04 0 .1-.01.17-.06.14-.105.30-.3.42-.51.156-.28.198-.603.243-.94.025-.188.048-.379.092-.566.081-.34.224-.664.494-.9.225-.197.466-.3.71-.32.2-.017.378.004.626.04.373.055.907.145 1.397.075.22-.032.45-.112.61-.242.121-.1.22-.25.196-.41-.02-.135-.13-.233-.218-.295-.2-.142-.414-.217-.66-.302-.295-.101-.593-.226-.945-.436-.325-.196-.627-.422-.81-.74-.314-.553-.213-1.341-.156-2.025l.063-.704c.025-.267.052-.53.053-.785 0-.384-.03-.797-.16-1.084-.262-.58-.757-1.087-1.474-1.52-.697-.969-1.759-1.851-2.739-2.497C16.664.232 14.268 0 12.003 0z"/></svg>`,
  },
  {
    name: '微博',
    color: '#E6162D',
    svg: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M12.09 7.432c-2.654-.443-5.502.946-6.957 3.168-1.58 2.406-.997 5.08 1.348 6.068 2.376 1.003 5.556.205 7.008-1.98 1.43-2.15.82-4.866-1.4-5.256zm-.76 5.694c-1.02.42-2.384.085-3.017-.737-.684-.889-.423-2.026.605-2.542 1.052-.53 2.34-.078 2.919.95.52.924.07 1.962-.507 2.33zm4.205-4.896c-.305-.378-.207-.96.213-1.276.414-.312.996-.228 1.294.124.302.356.197.918-.21 1.238-.397.314-.996.24-1.297-.086zm1.275-2.57c-1.89-2.14-5.03-2.898-7.945-1.87a.362.362 0 0 1-.442-.5c1.2-2.685 4.543-4.094 7.752-2.98a.363.363 0 0 1-.245.68c-.166-.06-.332-.123-.498-.19 0 0 .282.237.378.354.48.584.82 1.302.82 2.1 0 .198-.16.362-.358.362a.363.363 0 0 1-.362-.363c0-.536-.228-1.04-.617-1.403-.162-.15-.338-.285-.528-.4-.97-.603-2.14-.846-3.308-.717a.363.363 0 0 1-.36-.362c0-.2.162-.363.362-.363 1.427-.09 2.86.24 4.07.956.312.187.608.402.88.638.272.237.518.502.73.79.16.218.08.576-.238.594-.17.01-.332-.09-.48-.212zM20.888 2.69c-2.04-2.67-5.957-3.74-9.766-2.418a.43.43 0 0 0-.27.54.43.43 0 0 0 .54.27c3.5-1.21 7.05-.22 8.86 2.15a.43.43 0 0 0 .606.08.43.43 0 0 0 .08-.606c-.02-.02-.04-.034-.05-.05z"/></svg>`,
  },
]

// ===== 修改密码 =====
const showPasswordDialog = ref(false)
const pwdForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const pwdErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const pwdVisible = ref(false)
const pwdSubmitting = ref(false)

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

function calcNewPasswordStrength(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++
  if (score <= 2) return 1
  if (score <= 3) return 2
  if (score <= 4) return 3
  return 4
}
const newPasswordStrength = computed(() => calcNewPasswordStrength(pwdForm.newPassword))
const newPasswordStrengthLabel = computed(() => ['', '弱', '较弱', '中', '强'][newPasswordStrength.value])

function validateNewPassword() {
  const v = pwdForm.newPassword
  if (!v) { pwdErrors.newPassword = '请输入新密码'; return false }
  if (v.length < 8) { pwdErrors.newPassword = '密码长度不能少于 8 位'; return false }
  if (!PWD_REGEX.test(v)) { pwdErrors.newPassword = '密码需包含大小写字母、数字和特殊符号'; return false }
  pwdErrors.newPassword = ''
  return true
}

function validateConfirmPassword() {
  if (!pwdForm.confirmPassword) { pwdErrors.confirmPassword = '请再次输入新密码'; return false }
  if (pwdForm.confirmPassword !== pwdForm.newPassword) { pwdErrors.confirmPassword = '两次密码输入不一致'; return false }
  pwdErrors.confirmPassword = ''
  return true
}

function onNewPasswordInput() {
  if (pwdErrors.newPassword) validateNewPassword()
  if (pwdForm.confirmPassword) validateConfirmPassword()
}

function openPasswordDialog() {
  resetPasswordForm()
  showPasswordDialog.value = true
}

function resetPasswordForm() {
  pwdForm.currentPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
  pwdErrors.currentPassword = ''
  pwdErrors.newPassword = ''
  pwdErrors.confirmPassword = ''
  pwdSubmitting.value = false
}

async function handleChangePassword() {
  let valid = true
  if (!pwdForm.currentPassword) { pwdErrors.currentPassword = '请输入当前密码'; valid = false }
  if (!validateNewPassword()) valid = false
  if (!validateConfirmPassword()) valid = false
  if (!valid) return

  pwdSubmitting.value = true
  try {
    await userStore.changePassword({
      currentPassword: pwdForm.currentPassword,
      newPassword: pwdForm.newPassword,
    })
    ElMessage.success('密码修改成功，请使用新密码登录')
    showPasswordDialog.value = false
  } catch (e) {
    if (e.message.includes('当前密码不正确')) {
      pwdErrors.currentPassword = e.message
    } else {
      ElMessage.error(e.message || '密码修改失败')
    }
  } finally {
    pwdSubmitting.value = false
  }
}

// ===== 手机绑定 =====
const showPhoneDialog = ref(false)
const phoneForm = reactive({
  phone: '',
  code: '',
})
const phoneErrors = reactive({
  phone: '',
  code: '',
})
const phoneSmsCountdown = ref(0)
const phoneSending = ref(false)
const phoneSubmitting = ref(false)
let phoneSmsTimer = null

const phoneDialogTitle = computed(() => hasPhone.value ? '更换手机号' : '绑定手机号')

const PHONE_RE = /^1[3-9]\d{9}$/

function openPhoneDialog() {
  resetPhoneForm()
  phoneForm.phone = hasPhone.value ? userStore.user.phone || '' : ''
  showPhoneDialog.value = true
}

function resetPhoneForm() {
  phoneForm.phone = ''
  phoneForm.code = ''
  phoneErrors.phone = ''
  phoneErrors.code = ''
  phoneSubmitting.value = false
  if (phoneSmsTimer) {
    clearInterval(phoneSmsTimer)
    phoneSmsTimer = null
  }
  phoneSmsCountdown.value = 0
}

function sendPhoneSmsCode() {
  const v = phoneForm.phone.trim()
  if (!v) { phoneErrors.phone = '请输入手机号'; return }
  if (!PHONE_RE.test(v)) { phoneErrors.phone = '手机号格式不正确'; return }
  phoneErrors.phone = ''
  phoneSending.value = true
  setTimeout(() => {
    phoneSending.value = false
    phoneSmsCountdown.value = 60
    phoneSmsTimer = setInterval(() => {
      phoneSmsCountdown.value--
      if (phoneSmsCountdown.value <= 0) {
        clearInterval(phoneSmsTimer)
        phoneSmsTimer = null
        phoneSmsCountdown.value = 0
      }
    }, 1000)
    ElMessage.success('验证码已发送，请查收短信（演示验证码：123456）')
  }, 500)
}

async function handleBindPhone() {
  const v = phoneForm.phone.trim()
  if (!v) { phoneErrors.phone = '请输入手机号'; return }
  if (!PHONE_RE.test(v)) { phoneErrors.phone = '手机号格式不正确'; return }
  if (!phoneForm.code || phoneForm.code.length !== 6) { phoneErrors.code = '请输入 6 位验证码'; return }
  if (phoneForm.code !== '123456') { phoneErrors.code = '验证码错误'; return }

  phoneSubmitting.value = true
  try {
    // 检查手机号是否已被其他用户注册
    if (userStore.isPhoneTaken(v) && userStore.user.phone !== v) {
      phoneErrors.phone = '该手机号已被其他账号绑定'
      phoneSubmitting.value = false
      return
    }
    userStore.updateUserField('phone', v)
    ElMessage.success(hasPhone.value ? '手机号更换成功' : '手机号绑定成功')
    showPhoneDialog.value = false
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  } finally {
    phoneSubmitting.value = false
  }
}

// ===== 邮箱绑定 =====
const showEmailDialog = ref(false)
const emailForm = reactive({
  email: '',
  code: '',
})
const emailErrors = reactive({
  email: '',
  code: '',
})
const emailSmsCountdown = ref(0)
const emailSending = ref(false)
const emailSubmitting = ref(false)
let emailSmsTimer = null

const emailDialogTitle = computed(() => hasEmail.value ? '修改邮箱' : '绑定邮箱')

const EMAIL_RE = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/

function openEmailDialog() {
  resetEmailForm()
  emailForm.email = hasEmail.value ? userStore.user.email || '' : ''
  showEmailDialog.value = true
}

function resetEmailForm() {
  emailForm.email = ''
  emailForm.code = ''
  emailErrors.email = ''
  emailErrors.code = ''
  emailSubmitting.value = false
  if (emailSmsTimer) {
    clearInterval(emailSmsTimer)
    emailSmsTimer = null
  }
  emailSmsCountdown.value = 0
}

function sendEmailCode() {
  const v = emailForm.email.trim()
  if (!v) { emailErrors.email = '请输入邮箱地址'; return }
  if (!EMAIL_RE.test(v)) { emailErrors.email = '邮箱格式不正确'; return }
  emailErrors.email = ''
  emailSending.value = true
  setTimeout(() => {
    emailSending.value = false
    emailSmsCountdown.value = 60
    emailSmsTimer = setInterval(() => {
      emailSmsCountdown.value--
      if (emailSmsCountdown.value <= 0) {
        clearInterval(emailSmsTimer)
        emailSmsTimer = null
        emailSmsCountdown.value = 0
      }
    }, 1000)
    ElMessage.success('验证码已发送至邮箱，请查收（演示验证码：123456）')
  }, 500)
}

async function handleBindEmail() {
  const v = emailForm.email.trim()
  if (!v) { emailErrors.email = '请输入邮箱地址'; return }
  if (!EMAIL_RE.test(v)) { emailErrors.email = '邮箱格式不正确'; return }
  if (!emailForm.code || emailForm.code.length !== 6) { emailErrors.code = '请输入 6 位验证码'; return }
  if (emailForm.code !== '123456') { emailErrors.code = '验证码错误'; return }

  emailSubmitting.value = true
  try {
    if (userStore.isEmailTaken(v) && userStore.user.email !== v) {
      emailErrors.email = '该邮箱已被其他账号绑定'
      emailSubmitting.value = false
      return
    }
    userStore.updateUserField('email', v)
    ElMessage.success(hasEmail.value ? '邮箱修改成功' : '邮箱绑定成功')
    showEmailDialog.value = false
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  } finally {
    emailSubmitting.value = false
  }
}

// ===== 第三方账号管理 =====
const showThirdPartyDialog = ref(false)
const showUnbindConfirm = ref(false)
const unbindingProvider = ref(null)
const unbindSubmitting = ref(false)

function openThirdPartyDialog() {
  showThirdPartyDialog.value = true
}

function confirmUnbind(provider) {
  unbindingProvider.value = provider
  showUnbindConfirm.value = true
}

async function handleUnbind() {
  if (!unbindingProvider.value) return
  unbindSubmitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const data = loadThirdPartyBinding()
    delete data[unbindingProvider.value.name]
    saveThirdPartyBinding(data)
    ElMessage.success(`${unbindingProvider.value.name} 已解绑`)
    showUnbindConfirm.value = false
    unbindingProvider.value = null
  } catch (e) {
    ElMessage.error('解绑失败，请稍后重试')
  } finally {
    unbindSubmitting.value = false
  }
}

function handleBindThirdParty(provider) {
  try {
    const data = loadThirdPartyBinding()
    data[provider.name] = provider.name + '_' + Math.random().toString(36).slice(2, 8)
    saveThirdPartyBinding(data)
    ElMessage.success(`${provider.name} 绑定成功`)
  } catch (e) {
    ElMessage.error('绑定失败，请稍后重试')
  }
}

onUnmounted(() => {
  if (phoneSmsTimer) clearInterval(phoneSmsTimer)
  if (emailSmsTimer) clearInterval(emailSmsTimer)
})

// 收货地址管理
const addresses = ref([...mockAddresses])
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const editingAddress = ref(null)
const deletingId = ref(null)
const defaultAddress = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false,
})

const formData = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false,
})

function addAddress() {
  isEditing.value = false
  formData.value = { ...defaultAddress.value }
  showAddDialog.value = true
}

function editAddress(addr) {
  editingAddress.value = addr
  formData.value.name = addr.name
  formData.value.phone = addr.phone
  formData.value.region = addr.province + addr.city + addr.district
  formData.value.detail = addr.detail
  formData.value.isDefault = addr.isDefault
  showAddDialog.value = true
  isEditing.value = true
}

function confirmDelete(addr) {
  deletingId.value = addr.id
  showDeleteDialog.value = true
}

function deleteAddress() {
  addresses.value = addresses.value.filter((a) => a.id !== deletingId.value)
  showDeleteDialog.value = false
}
</script>

<style scoped>
.settings-view__header {
  margin-bottom: 16px;
}

.settings-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.settings-tabs {
  display: flex;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.settings-tab {
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-mid);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.settings-tab:hover,
.settings-tab.active {
  color: var(--color-primary);
}

.settings-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-primary);
}

.profile-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.profile-avatar__img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  object-fit: cover;
}

.profile-form {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 24px;
}

.form-row {
  display: flex;
  align-items: center;
  height: 44px;
  margin-bottom: 20px;
}

.form-row label {
  width: 80px;
  font-size: 14px;
  color: var(--color-text-dark);
  flex-shrink: 0;
}

.form-row .el-input,
.form-row .el-textarea {
  flex: 1;
}

.form-row__count {
  font-size: 12px;
  color: var(--color-text-light);
  margin-left: 8px;
}

.security-score {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 24px;
  margin-bottom: 16px;
}

.security-score__circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(var(--color-success) calc(var(--percent) * 1%), #e0d6de 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.security-score__circle::before {
  content: '';
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
}

.security-score__circle span {
  position: relative;
  font-size: 24px;
  font-weight: 700;
  font-family: var(--font-price);
}

.security-score__items {
  font-size: 12px;
  color: var(--color-text-mid);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.security-list {
  background: var(--color-bg);
  border-radius: var(--radius-card);
}

.security-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
}

.security-item:last-child {
  border-bottom: none;
}

.security-item__info {
  flex: 1;
}

.security-item__title {
  font-size: 14px;
  color: var(--color-text-dark);
}

.security-item__status {
  font-size: 12px;
  color: var(--color-text-light);
  margin-left: 8px;
}

/* ===== 弹窗内表单样式 ===== */
.security-dialog-body {
  padding: 8px 0;
}

.dialog-field {
  margin-bottom: 18px;
}

.dialog-field label {
  display: block;
  font-size: 13px;
  color: var(--color-text-dark);
  font-weight: 500;
  margin-bottom: 6px;
}

.dialog-field .el-input {
  width: 100%;
}

.field-error {
  font-size: 12px;
  color: var(--color-danger);
  margin: 4px 0 0;
  line-height: 1.5;
}

/* 密码强度 */
.strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
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

.strength[data-level='1'] .is-active { background: var(--color-danger); }
.strength[data-level='2'] .is-active { background: #fa8c16; }
.strength[data-level='3'] .is-active { background: #faad14; }
.strength[data-level='4'] .is-active { background: var(--color-success); }

.strength__label {
  font-size: 12px;
  color: var(--color-text-light);
  white-space: nowrap;
}

/* 短信验证码行 */
.sms-code-row-dialog {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sms-code-row-dialog .el-input {
  flex: 1;
}

.sms-code-btn {
  flex-shrink: 0;
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--color-primary);
  background: var(--color-light-orange);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sms-code-btn:hover:not(:disabled) {
  background: #ffe0cc;
}

.sms-code-btn:disabled {
  border-color: var(--color-border);
  background: #f5f5f5;
  color: var(--color-text-light);
  cursor: not-allowed;
}

.sms-tip {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 6px 0 0;
}

.sms-tip strong {
  color: var(--color-primary);
  letter-spacing: 1px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--color-light-orange);
}

/* ===== 第三方账号管理 ===== */
.third-party-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.third-party-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.third-party-item:last-child {
  border-bottom: none;
}

.third-party-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.third-party-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.third-party-item__icon :deep(svg) {
  display: block;
}

.third-party-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.third-party-item__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-dark);
}

.third-party-item__status {
  font-size: 12px;
}

/* 解绑确认弹窗 */
.unbind-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0;
  gap: 12px;
}

.unbind-warning p {
  font-size: 14px;
  color: var(--color-text-dark);
  margin: 0;
}

.unbind-warning__tip {
  font-size: 12px !important;
  color: var(--color-text-light) !important;
}

/* 收货地址样式 */
.settings-address {
  flex-direction: column;
}

.address-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  position: relative;
  display: flex;
  align-items: stretch;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
  overflow: hidden;
}

.address-card:hover {
  box-shadow: var(--shadow-card);
}

.address-card__default-tag {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #fff;
  font-size: 12px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 2px;
}

.address-card__content {
  flex: 1;
  padding: 16px 24px;
}

.address-card__name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.address-card__detail {
  font-size: 12px;
  color: var(--color-text-mid);
  line-height: 20px;
  max-width: 80%;
}

.address-card__actions {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

.address-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
}

.address-empty p {
  font-size: 14px;
  color: var(--color-text-light);
}

/* 关于我们（保留但未改动） */
.about-brand {
  text-align: center;
  padding: 32px;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  margin-bottom: 16px;
}

.about-brand__logo {
  font-size: 48px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
}

.about-brand h2 {
  font-size: 24px;
  font-weight: 700;
}

.about-brand p {
  font-size: 14px;
  color: var(--color-text-light);
  margin-top: 4px;
}

.about-info {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  margin-bottom: 16px;
}

.about-info__row {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.about-info__row:last-child {
  border-bottom: none;
}

.about-info__row span:first-child {
  flex: 1;
}

.about-social {
  background: var(--color-bg);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  margin-bottom: 16px;
}

.about-social h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.about-social__icons {
  display: flex;
  gap: 12px;
}

.about-social__icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-btn);
  background: var(--color-warm-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-text-mid);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.about-social__icon:hover {
  background: var(--color-light-orange);
}

.about-copyright {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #ccc;
}
</style>