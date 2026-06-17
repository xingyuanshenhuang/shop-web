<template>
  <footer class="site-footer hide-on-mobile">
    <div class="footer-services">
      <div class="footer-services__inner" v-for="svc in services" :key="svc.title">
        <div class="footer-services__icon">
          {{ svc.icon }}
        </div>
        <div class="footer-services__text">
          <div class="footer-services__title">{{ svc.title }}</div>
          <div class="footer-services__desc">{{ svc.desc }}</div>
        </div>
      </div>
    </div>
    <div class="footer-nav">
      <div class="footer-nav__column" v-for="col in navColumns" :key="col.title">
        <h4 class="footer-nav__title">{{ col.title }}</h4>
        <a v-for="link in col.links" :key="link" class="footer-nav__link">{{ link }}</a>
      </div>
    </div>
    <div class="footer-copyright">
      <p>© 2025 XX商城 版权所有 | 增值电信业务经营许可证：浙B2-XXXXXXXX</p>
      <p>浙公网安备 XXXXXXXXXXXXX 号 | 隐私权政策 | 法律声明 | 知识产权</p>
    </div>
  </footer>
</template>

<script setup>
const services = [
  { icon: '🛡️', title: '正品保障', desc: '品牌授权，假一赔十' },
  { icon: '⚡', title: '极速发货', desc: '48小时内发货' },
  { icon: '↩️', title: '七天退换', desc: '无理由退换货' },
  { icon: '💬', title: '贴心客服', desc: '7×24小时在线' },
]

const navColumns = [
  { title: '购物指南', links: ['免费注册', '购物流程', '会员介绍', '常见问题'] },
  { title: '配送方式', links: ['上门自提', '快递运输', '配送范围', '海外配送'] },
  { title: '支付方式', links: ['在线支付', '货到付款', '分期付款', '余额支付'] },
  { title: '售后服务', links: ['退换政策', '退款说明', '投诉建议', '售后热线'] },
]
</script>

<style scoped>
.site-footer {
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  margin-top: 32px;
}

.footer-services {
  display: flex;
  justify-content: center;
  gap: 64px;
  padding: 32px 128px;
}

.footer-services__inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-services__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--color-light-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.footer-services__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
}

.footer-services__desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 32px 128px;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.footer-nav__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 12px;
}

.footer-nav__link {
  display: block;
  font-size: 12px;
  color: var(--color-text-light);
  line-height: 24px;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.footer-nav__link:hover {
  color: var(--color-primary);
}

.footer-copyright {
  padding: 24px 128px;
  text-align: center;
}

.footer-copyright p {
  font-size: 11px;
  color: #bbbbbb;
  line-height: 20px;
}

@media (max-width: 1024px) {
  .footer-services,
  .footer-nav,
  .footer-copyright {
    padding-left: 32px;
    padding-right: 32px;
  }
  .footer-services {
    gap: 32px;
  }
}
</style>
