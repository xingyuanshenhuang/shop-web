# Tasks

- [x] Task 1: 引入持久化插件并完成基础注册
  - [x] SubTask 1.1: 安装依赖 `pinia-plugin-persistedstate`
  - [x] SubTask 1.2: 在 `src/main.js` 中引入并 `pinia.use(piniaPluginPersistedstate)` 注册插件
  - [x] SubTask 1.3: 新建 `src/stores/persistenceConfig.js`，集中定义各 store 的存储 key 常量与命名规范，供各 store 引用，避免散落

- [x] Task 2: 为 cart store 接入持久化
  - [x] SubTask 2.1: 在 `src/stores/cart.js` 的 `defineStore` 第三参数中增加 `persist` 配置，使用集中定义的 key，持久化 `items`（computed 自动派生无需持久化）
  - [x] SubTask 2.2: 验证首次访问（无持久化数据）时仍回退 mock 初始化逻辑不报错

- [x] Task 3: 为 favorites store 接入持久化
  - [x] SubTask 3.1: 在 `src/stores/favorites.js` 中增加 `persist` 配置，持久化 `items`

- [x] Task 4: 新增 history store 实现浏览历史记录与持久化
  - [x] SubTask 4.1: 新建 `src/stores/history.js`，定义 `items`（持久化），提供 `recordView(product)`（去重、最新置顶、按日期分组）、`clear()` 等方法
  - [x] SubTask 4.2: 在商品详情页 `src/views/product/ProductDetailPage.vue` 进入时调用 `historyStore.recordView`，传入当前商品（id/name/price/image）
  - [x] SubTask 4.3: 修改 `src/views/user/HistoryView.vue`，优先读取 history store 数据，无数据时回退 mock `browsingHistory`

- [x] Task 5: 编写持久化技术文档
  - [x] SubTask 5.1: 新建 `docs/persistence.md`，按以下章节完整撰写：设计思路、技术选型依据、实现步骤、数据模型定义、API/接口说明（各 store 持久化配置与 history store 方法）、错误处理机制、性能优化策略、测试验证方法
  - [x] SubTask 5.2: 文档中说明 user.js 现有手动 localStorage 方案（登录库/记住我/锁定）的定位与边界，说明为何保留其安全语义不纳入插件

- [x] Task 6: 验证与回归
  - [x] SubTask 6.1: 手动验证购物车增删改后刷新数据保留
  - [x] SubTask 6.2: 手动验证收藏增删后刷新数据保留
  - [x] SubTask 6.3: 手动验证浏览商品后在"我的足迹"页展示，刷新后保留
  - [x] SubTask 6.4: 回归登录/注册/记住我流程不受影响；回归结算页支付流程不受影响

# Task Dependencies
- Task 2、Task 3、Task 4 依赖 Task 1
- Task 5 可与 Task 2/3/4 并行（文档先行撰写框架，实现后补充细节）
- Task 6 依赖 Task 2、Task 3、Task 4 完成
