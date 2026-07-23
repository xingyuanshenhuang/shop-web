# 商品列表页（`/products`）搜索栏与筛选区改造计划

## 1. 摘要

将商品列表页顶部搜索栏替换为与首页完全复用的 `HomeSearchBar` 组件，支持关键词搜索与首页分类入口跳转。在列表页新增“类目特定顶部图文筛选区”，当搜索关键词或分类参数命中预设品类（如文具、珠宝）时，展示左图右文的细分选项。保留并优化原有底部筛选栏，确保响应式、交互连贯与性能。

> 注：用户描述中的“商品详情页”在本项目中对应路由为 `/products`（商品列表/搜索结果页），而非 `/product/:id` 单商品详情页。

## 2. 当前状态分析

| 文件 | 当前状态 | 说明 |
|------|----------|------|
| `src/components/common/HomeSearchBar.vue` | 已完成 | 已抽取首页搜索栏全部功能，含历史搜索、猜你想搜、快捷导航、搜同款，支持 `showBonus` prop。 |
| `src/views/home/HomePage.vue` | 已完成 | 已引入 `HomeSearchBar :show-bonus="true"`；频道列表与分类子菜单均通过 `navigateToProducts(query)` 带 query 跳转至 `/products`。 |
| `src/views/product/ProductListPage.vue` | 已完成 | 已引入 `HomeSearchBar :show-bonus="false"`；新增 `top-category-filter` 图文筛选区；保留原有 `.listing-categories` 等下部筛选区；已做移动端适配；修复 `selectedTopOption` 监听器在 `subCategory` 变化时误清空的问题。 |
| `src/mock/data.js` | 已完成 | 已在文件末尾追加并导出 `categoryTopFilters`，包含文具、珠宝两类。 |
| `src/router/index.js` | 无需改动 | `/products` 路由已存在，支持 `query` 参数。 |

### 关键依赖

- Vue 3 + `<script setup>`
- Element Plus（`el-input`、`el-icon`、`el-breadcrumb`、`el-pagination`、`el-button`）
- Vue Router（`useRoute`/`useRouter`）
- `localStorage` 搜索历史
- CSS 变量 + CSS Grid/Flexbox + 媒体查询实现响应式

## 3. 已完成的改造内容

### 3.1 复用 `HomeSearchBar` 并替换首页内联搜索栏

**文件**：`src/views/home/HomePage.vue`

- 删除原内联搜索栏模板、搜索相关 `ref`/`函数`及 `.search-bar-*` 样式。
- 引入 `HomeSearchBar` 组件：`<HomeSearchBar :show-bonus="true" />`。
- 频道列表 `channelList` 改为带 `query` 的对象数组，点击调用 `navigateToProducts(query)`。
- 左侧分类导航子菜单点击时携带 `keyword` query 跳转。

### 3.2 改造商品列表页

**文件**：`src/views/product/ProductListPage.vue`

#### 模板结构

```
product-listing
├─ HomeSearchBar (showBonus=false)
└─ listing-content
   ├─ listing-breadcrumb
   ├─ top-category-filter（新增，条件渲染）
   ├─ listing-categories（原有）
   ├─ listing-tabs（原有）
   ├─ listing-sort（原有）
   ├─ listing-promo（原有）
   └─ listing-main（原有）
```

#### 搜索栏替换

- 删除 `.listing-search-bar` 及内部所有元素与样式。
- 引入 `HomeSearchBar` 组件：`<HomeSearchBar :show-bonus="false" />`。
- 搜索状态与方法由 `HomeSearchBar` 内部接管。

#### 新增顶部图文筛选区

- 新增计算属性 `matchedTopFilter`，根据 `route.query.keyword` 或 `route.query.category` 匹配 `categoryTopFilters`。
- 命中时渲染 `.top-category-filter` 区域：
  - 标题：展示品类名称（如“文具精选”）。
  - 选项卡片：左图（40×40px，圆角 8px）右文（13px，主色激活态）。
  - 桌面端横向排列并允许折行；移动端横向滚动。
  - 每个图片加 `loading="lazy"`。
- 新增 `selectedTopOption`，点击后通过 `router.push` 更新 `subCategory` query；再次点击取消。
- 监听 `route.query.keyword` / `route.query.category` 变化，当实际值改变时清空 `selectedTopOption`；避免因 watcher 返回新数组引用而在 `subCategory` 变化时误清空选中态。

#### 原有筛选区保留

- 保留 `.listing-categories`、`.listing-tabs`、`.listing-sort`、`.listing-promo`、`.listing-main`、`.listing-pagination` 的功能与布局。
- 仅做响应式微调：顶部图文筛选区与原有分类栏的间距、移动端横向溢出处理。

### 3.3 新增 mock 数据

**文件**：`src/mock/data.js`

在文件末尾追加并导出 `categoryTopFilters` 数组，结构如下：

```js
export const categoryTopFilters = [
  {
    key: 'stationery',
    keywords: ['文具', '笔', '本子', '笔记本', '红笔'],
    queryCategories: ['stationery', 'wenju'],
    label: '文具精选',
    options: [
      { id: 'notebook', name: '笔记本', image: 'https://picsum.photos/seed/notebook/80/80' },
      { id: 'red-pen', name: '红笔', image: 'https://picsum.photos/seed/redpen/80/80' },
      { id: 'blue-pen', name: '蓝笔', image: 'https://picsum.photos/seed/bluepen/80/80' },
      { id: 'pencil', name: '铅笔', image: 'https://picsum.photos/seed/pencil/80/80' },
      { id: 'eraser', name: '橡皮', image: 'https://picsum.photos/seed/eraser/80/80' },
      { id: 'ruler', name: '尺子', image: 'https://picsum.photos/seed/ruler/80/80' },
      { id: 'folder', name: '文件夹', image: 'https://picsum.photos/seed/folder/80/80' },
      { id: 'stapler', name: '订书机', image: 'https://picsum.photos/seed/stapler/80/80' },
    ],
  },
  {
    key: 'jewelry',
    keywords: ['珠宝', '首饰', '项链', '戒指', '耳环'],
    queryCategories: ['jewelry', 'zhubao'],
    label: '珠宝精选',
    options: [
      { id: 'necklace', name: '项链', image: 'https://picsum.photos/seed/necklace/80/80' },
      { id: 'ring', name: '戒指', image: 'https://picsum.photos/seed/ring/80/80' },
      { id: 'earring', name: '耳环', image: 'https://picsum.photos/seed/earring/80/80' },
      { id: 'bracelet', name: '手链', image: 'https://picsum.photos/seed/bracelet/80/80' },
      { id: 'anklet', name: '脚链', image: 'https://picsum.photos/seed/anklet/80/80' },
      { id: 'brooch', name: '胸针', image: 'https://picsum.photos/seed/brooch/80/80' },
    ],
  },
]
```

### 3.4 首页分类入口跳转

**文件**：`src/views/home/HomePage.vue`

- 顶部频道列表 `channelList` 中入口点击时跳转到 `/products?category=xxx` 或 `/products?keyword=xxx`。
- 左侧分类导航的子菜单项点击时跳转到 `/products?keyword=xxx`。
- 实现 `navigateToProducts(query = {})` 统一处理 query 到 URL 参数的转换。

## 4. 响应式与性能

### 响应式

- 桌面端：维持 `min-width: 1280px` 与容器查询缩放。
- 平板/移动端：
  - `HomeSearchBar` 已有 `@media (max-width: 768px)` 适配。
  - 顶部图文筛选区在移动端改为 `overflow-x: auto` 横向滚动。
  - 列表页栅格在 ≤1280px 时保持 5 列、≤1024px 时 4 列、≤768px 时 2 列。

### 性能

- 顶部筛选图片使用固定小尺寸（80×80）并加 `loading="lazy"`。
- `matchedTopFilter` 使用 `computed` 缓存。
- `HomeSearchBar` 下拉面板按需渲染。

## 5. 验证结果

> 已通过本地服务与浏览器完成验证，所有核心功能正常。

1. ✅ 本地开发服务（`http://localhost:5173/`）运行正常。
2. ✅ 首页：
   - `HomeSearchBar` 正确渲染，显示“天天领红包”右侧入口。
   - 搜索框输入“文具”提交后跳转至 `/products?keyword=文具`。
   - 点击顶部频道“国家补贴”跳转至 `/products?category=subsidy`。
   - 悬停左侧分类导航，点击子菜单“笔记本”跳转至 `/products?keyword=笔记本`。
3. ✅ 商品列表页：
   - 顶部显示 `HomeSearchBar`，无右侧“天天领红包”。
   - 在列表页搜索框输入“珠宝”提交后，URL 更新为 `/products?keyword=珠宝`，显示“珠宝精选”顶部图文筛选区。
   - 访问 `/products?category=stationery` 显示“文具精选”。
   - 点击“红笔”选项，URL 更新为 `?keyword=笔记本&subCategory=red-pen`，选项高亮。
   - 再次点击可取消选中，`subCategory` 从 URL 移除。
   - 底部 tabs、排序、筛选标签、侧边栏、商品网格、分页保持正常。
4. ✅ 响应式：
   - 1119px 视口下商品网格为 5 列，顶部筛选区 flex 折行排列。
   - 已确认样式表中包含 `@media (max-width: 768px)` 对顶部筛选区横向滚动与商品网格 2 列的适配规则。
5. ✅ 构建：`npm run build` 两次均成功（exit code 0），仅存在 chunk 体积警告，无语法/类型错误。

## 6. 可选优化项（验证后视情况执行）

- 若 `HomeSearchBar` 在列表页与页面内容产生最小宽度冲突，可对其外层做 `overflow-x: auto` 或调整容器 `min-width`。
- 若顶部筛选区图片加载影响首屏，可引入更小尺寸占位图或骨架屏。
- 若从首页带 `category` 跳转后列表页面包屑未同步，可后续根据 `route.query` 动态生成面包屑（超出本次需求范围，暂不强制）。