# 产品详情页响应式 Sticky 导航栏实现计划

## 概述

为产品详情页（`ProductDetailPage.vue`）的导航栏（`product-detail__tabs`）添加 responsive sticky 固定定位功能。当用户向下滚动页面时，导航栏在到达屏幕顶部后自动切换为固定定位，并伴有平滑过渡效果。

## 当前状态分析

### 页面布局结构
```
App.vue
├── TopUtilityBar (36px height, static 定位)
├── MainNav (position: fixed, 仅 / 和 /products 路由显示)
├── <main class="main-content">
│   └── ProductDetailPage.vue
│       └── .product-detail__inner (flex, max-width: 1440px, padding: 24px 128px)
│           ├── .product-detail__left (flex: 0 0 60%)
│           │   ├── .product-detail__gallery
│           │   ├── .product-detail__shop-bar
│           │   ├── .product-detail__tabs ← 需要 sticky 的元素
│           │   └── .product-detail__tab-content
│           │       ├── section-review
│           │       ├── section-params
│           │       ├── section-detail-images
│           │       └── section-recommend
│           └── .product-detail__right (flex: 0 0 calc(40% - 32px))
│               └── .right-sticky (position: fixed, z-index: 100, JS 控制)
└── FooterBar, FloatingToolbar, etc.
```

### 关键发现
1. `MainNav` 组件仅在 `/` 和 `/products` 路由显示，**商品详情页不显示 MainNav**
2. 右侧栏 `right-sticky` 已使用 JS 实现 `position: fixed` 定位（`z-index: 100`）
3. 导航栏 `.product-detail__tabs` 当前为普通流布局，高度 44px，位于 `product-detail__left` 内
4. 已有 `scroll-margin-top: 80px` 和 `handleTabClick` 中的 80px 偏移用于滚动定位

## 方案设计

### 核心方案：CSS `position: sticky` + IntersectionObserver 检测状态

选择 `position: sticky` 而非 JS 手动控制 `position: fixed`，因为：
- `position: sticky` 自动处理占位空间（元素在正常流中仍占位），无需额外 placeholder
- 更少的 JS 计算，性能更好
- 浏览器原生支持，滚动更平滑

配合 IntersectionObserver 检测 sticky 状态，以添加阴影等视觉反馈。

### 具体改动

#### 文件：`src/views/product/ProductDetailPage.vue`

##### 1. Template 改动

在 `.product-detail__tabs` 上方添加一个 sentinel 元素（0px 高），用于 IntersectionObserver 检测 sticky 状态：

```html
<div ref="tabsSentinel" class="tabs-sentinel"></div>
<div class="product-detail__tabs" :class="{ 'tabs-sticky': isTabsSticky }">
  ...
</div>
```

##### 2. Script 改动

新增变量和逻辑：

```javascript
const tabsSentinel = ref(null)  // sentinel 元素 ref
const isTabsSticky = ref(false) // 导航栏是否处于 sticky 状态
let tabsObserver = null         // IntersectionObserver 实例

// 在 onMounted 中：
tabsObserver = new IntersectionObserver(
  ([entry]) => {
    // 当 sentinel 不可见时（已滚出视口），导航栏处于 sticky 状态
    isTabsSticky.value = !entry.isIntersecting
  },
  { threshold: 0 }
)
if (tabsSentinel.value) {
  tabsObserver.observe(tabsSentinel.value)
}

// 在 onUnmounted 中清理：
if (tabsObserver) {
  tabsObserver.disconnect()
  tabsObserver = null
}
```

##### 3. Style 改动

###### 导航栏 sticky 定位样式
```css
.product-detail__tabs {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg);
  transition: box-shadow 0.3s ease;
  /* 保持原有样式：display: flex; height: 44px; 等 */
}

.product-detail__tabs.tabs-sticky {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

###### sentinel 元素
```css
.tabs-sentinel {
  height: 0;
  pointer-events: none;
}
```

##### 4. 滚动偏移调整

当前 `handleTabClick` 中的偏移为 80px，`section-wrapper` 的 `scroll-margin-top` 为 80px。导航栏固定后高度为 44px，需调整偏移量以确保点击标签后内容区域不被导航栏遮挡：

- `handleTabClick` 中的 `- 80` 改为 `- 60`（44px 导航栏 + 16px 间距）  
  *注意：此改动已在上一轮对话中由用户确认，此处仅记录为计划的一部分*

- `section-wrapper` 的 `scroll-margin-top` 保持 `80px` 不变（为浏览器原生锚点定位提供足够间距）

## 响应式适配

### 桌面端（>1024px）
- 导航栏在 `product-detail__left` 内 sticky，宽度由 flex 容器决定
- 右侧 `right-sticky` 保持 z-index: 100，高于导航栏的 z-index: 50

### 平板端（≤1024px）
- `product-detail__inner` 的 padding 变为 24px 32px，导航栏宽度自适应
- sticky 行为不变

### 移动端（≤768px）
- `product-detail__inner` 变为 `flex-direction: column`，导航栏随左栏宽度变为 100%
- sticky 行为不变
- `mobile-cta` 底部固定栏 z-index: 100，高于导航栏的 z-index: 50

## 性能优化

1. 使用 IntersectionObserver 而非 scroll 事件监听，避免高频触发
2. `top: 0` 的 sticky 定位由浏览器原生优化，无需额外计算
3. 仅通过 CSS class 切换控制阴影，无重排操作

## 边界情况处理

1. **页面加载时**：如果页面加载时已滚动到下方，sentinel 可能不可见，`isTabsSticky` 会正确设为 `true`
2. **窗口缩放**：resize 时 sticky 定位自动适应，无需额外处理
3. **内容高度不足**：如果页面内容不足以触发滚动，导航栏不会进入 sticky 状态，这是正确行为
4. **与右侧栏交互**：导航栏 z-index: 50 低于右侧栏 z-index: 100，确保右侧栏始终在导航栏上方

## 验证步骤

1. 打开商品详情页，确认导航栏在页面顶部时处于正常流状态（无阴影）
2. 向下滚动页面，确认导航栏在到达屏幕顶部后固定，并出现底部阴影
3. 点击导航栏各标签，确认平滑滚动到对应内容区域，且内容不被导航栏遮挡
4. 在移动端视口（≤768px）下重复上述测试
5. 确认"看了又看"标签不受影响
6. 确认右侧栏固定定位不受影响