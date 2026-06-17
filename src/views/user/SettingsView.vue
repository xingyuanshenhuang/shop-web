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
          <div class="security-score__circle" :style="{ '--percent': 80 }">
            <span>80</span>
          </div>
        </div>
        <div class="security-score__items">
          <div><span style="color: var(--color-success)">✓</span> 登录密码已设置</div>
          <div><span style="color: var(--color-success)">✓</span> 手机已绑定</div>
          <div><span style="color: var(--color-deep-orange)">!</span> 邮箱未绑定</div>
        </div>
      </div>
      <div class="security-list">
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Lock /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">登录密码</span>
            <span class="security-item__status" style="color: var(--color-success)">已设置</span>
          </div>
          <el-button text size="small">修改</el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Iphone /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">手机绑定</span>
            <span class="security-item__status">138****8888</span>
          </div>
          <el-button text size="small">更换</el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Message /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">邮箱绑定</span>
            <span class="security-item__status" style="color: var(--color-danger)">未绑定</span>
          </div>
          <el-button text size="small" type="primary">绑定</el-button>
        </div>
        <div class="security-item">
          <el-icon :size="20" color="#FF5000"><Link /></el-icon>
          <div class="security-item__info">
            <span class="security-item__title">第三方账号</span>
            <span class="security-item__status" style="color: var(--color-success)"
              >已绑定微信</span
            >
          </div>
          <el-button text size="small">管理</el-button>
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
        <div class="about-brand__logo">🛍️</div>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Lock, Iphone, Message, Link, Monitor, ArrowRight } from '@element-plus/icons-vue'
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

// 收货地址管理
// 收货地址列表数据
const addresses = ref([...mockAddresses])
// 新增/编辑地址弹窗显示状态
const showAddDialog = ref(false)
// 删除地址确认弹窗显示状态
const showDeleteDialog = ref(false)
// 是否正在编辑地址
const isEditing = ref(false)
// 当前正在编辑的地址对象
const editingAddress = ref(null)
// 待删除的地址ID
const deletingId = ref(null)
const defaultAddress = ref({
  name: '', // 收件人姓名
  phone: '', // 手机号
  region: '', // 所在地区（省/市/区）
  detail: '', // 详细地址
  isDefault: false, // 是否设为默认地址
})

// 地址表单数据（用于新增/编辑地址）
const formData = ref({
  name: '', // 收件人姓名
  phone: '', // 手机号
  region: '', // 所在地区（省/市/区）
  detail: '', // 详细地址
  isDefault: false, // 是否设为默认地址
})

function addAddress() {
  isEditing.value = false
  formData.value = { ...defaultAddress.value }
  showAddDialog.value = true
}

// 编辑地址：将选中地址数据回填到表单并打开编辑弹窗
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

// 确认删除：记录待删除地址ID并打开确认弹窗
function confirmDelete(addr) {
  deletingId.value = addr.id
  showDeleteDialog.value = true
}

// 执行删除：从地址列表中移除指定ID的地址并关闭弹窗
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
</style>
