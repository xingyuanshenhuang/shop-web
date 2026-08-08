<template>
  <teleport to="body">
    <transition name="agreement-fade">
      <div v-if="visible" class="agreement-overlay" @click.self="handleCancel">
        <div class="agreement-modal" role="dialog" aria-modal="true" aria-labelledby="agree-title">
          <button class="agreement-modal__close" aria-label="关闭" @click="handleCancel">
            <el-icon><Close /></el-icon>
          </button>

          <div class="agreement-modal__icon">
            <el-icon><WarningFilled /></el-icon>
          </div>

          <h2 id="agree-title" class="agreement-modal__title">请先同意协议</h2>

          <p class="agreement-modal__desc">
            您需要阅读并同意以下协议条款，才能继续进行{{ scene === 'login' ? '登录' : '注册' }}操作：
          </p>

          <div class="agreement-modal__list">
            <span
              v-for="(item, i) in agreements"
              :key="i"
              class="agreement-modal__tag"
            >
              {{ item }}
            </span>
          </div>

          <div class="agreement-modal__actions">
            <button class="agreement-btn agreement-btn--primary" @click="handleAgree">
              <el-icon><Check /></el-icon>
              同意协议并继续
            </button>
            <button class="agreement-btn agreement-btn--cancel" @click="handleCancel">
              暂不同意
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { Close, WarningFilled, Check } from '@element-plus/icons-vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  scene: { type: String, default: 'login' }, // login | register
  agreements: { type: Array, default: () => ['《用户服务协议》', '《隐私政策》'] },
})

const emit = defineEmits(['update:visible', 'agree', 'cancel'])

function handleAgree() {
  emit('agree')
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
/* ===== 遮罩层 ===== */
.agreement-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
}

/* ===== 弹窗卡片 ===== */
.agreement-modal {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: var(--radius-modal, 16px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 36px 32px 28px;
  text-align: center;
  animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== 关闭按钮 ===== */
.agreement-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: var(--color-text-light, #999);
  cursor: pointer;
  transition: all 0.2s ease;
}
.agreement-modal__close:hover {
  background: #eee;
  color: #1a1a1a;
}

/* ===== 图标 ===== */
.agreement-modal__icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.agreement-modal__icon .el-icon {
  font-size: 48px;
  color: var(--color-primary, #ff5000);
  filter: drop-shadow(0 4px 12px rgba(255, 80, 0, 0.25));
}

/* ===== 标题 ===== */
.agreement-modal__title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

/* ===== 描述 ===== */
.agreement-modal__desc {
  font-size: 14px;
  color: var(--color-text-mid, #666);
  line-height: 1.7;
  margin-bottom: 18px;
}

/* ===== 协议标签列表 ===== */
.agreement-modal__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}
.agreement-modal__tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: var(--radius-pill, 20px);
  background: linear-gradient(135deg, #fff5f0, #ffe8de);
  color: var(--color-primary, #ff5000);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 80, 0, 0.12);
}

/* ===== 按钮组 ===== */
.agreement-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agreement-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}
.agreement-btn:active {
  transform: scale(0.98);
}

.agreement-btn--primary {
  background: linear-gradient(135deg, #ff7a18, #ff5000);
  color: #fff;
  box-shadow: 0 6px 16px rgba(255, 80, 0, 0.28);
}
.agreement-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(255, 80, 0, 0.38);
}
.agreement-btn--primary:active {
  transform: translateY(0);
}

.agreement-btn--cancel {
  background: #f5f5f5;
  color: var(--color-text-mid, #666);
  font-weight: 500;
}
.agreement-btn--cancel:hover {
  background: #eee;
  color: #1a1a1a;
}

/* ===== 过渡动画 ===== */
.agreement-fade-enter-active,
.agreement-fade-leave-active {
  transition: opacity 0.25s ease;
}
.agreement-fade-enter-active .agreement-modal,
.agreement-fade-leave-active .agreement-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.agreement-fade-enter-from,
.agreement-fade-leave-to {
  opacity: 0;
}
.agreement-fade-enter-from .agreement-modal,
.agreement-fade-leave-to .agreement-modal {
  transform: translateY(20px) scale(0.96);
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .agreement-modal {
    max-width: 100%;
    padding: 28px 24px 24px;
    border-radius: 12px;
  }
  .agreement-modal__icon .el-icon {
    font-size: 40px;
  }
  .agreement-modal__title {
    font-size: 18px;
  }
}
</style>