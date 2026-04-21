<template>
  <div class="address-view">
    <div class="address-view__header">
      <h3>收货地址</h3>
      <el-button type="primary" size="small" @click="showAddDialog = true">新增地址</el-button>
    </div>
    <div class="address-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-card">
        <el-tag
          v-if="addr.isDefault"
          type="danger"
          size="small"
          effect="dark"
          style="position: absolute; top: 8px; left: 8px"
          >默认</el-tag
        >
        <div class="address-card__name">
          {{ addr.name }} <span style="margin-left: 12px">{{ addr.phone }}</span>
        </div>
        <div class="address-card__detail">
          {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
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
      :title="editingAddress ? '编辑地址' : '新增收货地址'"
      width="480px"
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
        /></el-form-item>
        <el-form-item
          ><el-checkbox v-model="formData.isDefault">设为默认地址</el-checkbox></el-form-item
        >
      </el-form>
      <template #footer>
        <el-button type="primary" @click="showAddDialog = false">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="确认删除" width="360px">
      <p>确定删除该地址吗？</p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="deleteAddress">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { addresses as mockAddresses } from '@/mock/data'

const addresses = ref([...mockAddresses])
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const editingAddress = ref(null)
const deletingId = ref(null)

const formData = reactive({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false,
})

function editAddress(addr) {
  editingAddress.value = addr
  formData.name = addr.name
  formData.phone = addr.phone
  formData.region = addr.province + addr.city + addr.district
  formData.detail = addr.detail
  formData.isDefault = addr.isDefault
  showAddDialog.value = true
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
.address-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.address-view__header h3 {
  font-size: 18px;
  font-weight: 700;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  position: relative;
  background: var(--color-bg-white);
  border-radius: var(--radius-card);
  padding: 16px 24px;
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.address-card:hover {
  box-shadow: var(--shadow-card);
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
  top: 16px;
  right: 24px;
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
