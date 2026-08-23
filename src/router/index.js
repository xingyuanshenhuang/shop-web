import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/product/ProductListPage.vue'),
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/ProductDetailPage.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/CartPage.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/checkout/CheckoutPage.vue'),
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/user/UserCenterPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/LoginPage.vue'),
    meta: { layout: 'blank' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/RegisterPage.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/user/LoginPage.vue'),
    meta: { layout: 'blank', page: 'forgot' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由前置守卫：拦截未登录用户访问需要登录的页面
router.beforeEach(async (to) => {
  // 需要登录才能访问的路由路径前缀
  const protectedRoutes = ['/user', '/cart', '/checkout']

  const requiresAuth = protectedRoutes.some((path) => {
    if (to.path === path) return true
    // 支持子路径匹配，如 /user/orders
    if (to.path.startsWith(path + '/')) return true
    return false
  })

  if (requiresAuth) {
    // 动态导入 userStore，确保 Pinia 已初始化
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      // 未登录，重定向到登录页，并携带 redirect 参数供登录后跳回
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
