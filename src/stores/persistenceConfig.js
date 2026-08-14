// 持久化存储 key 集中管理
// 命名规范：shop_web_<store_name>
export const PERSIST_KEYS = {
  cart: 'shop_web_cart',
  favorites: 'shop_web_favorites',
  history: 'shop_web_history',
}

// 说明：user store 的登录库/记住我/登录锁定仍由 user.js 内部手动管理 localStorage，
// 因其包含密码哈希、salt、TTL 过期判断等安全语义，不纳入插件统一持久化。
// 相关 key：taobao_users / taobao_remember_token / taobao_login_lock
