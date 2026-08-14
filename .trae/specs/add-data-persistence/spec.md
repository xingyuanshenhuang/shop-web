# 网站数据持久化功能 Spec

## Why
当前项目存在两个核心问题：
1. **购物车与收藏夹数据在页面刷新后丢失**：`cart.js` 与 `favorites.js` 均从 mock 数据初始化，没有任何持久化机制，用户刷新或重新打开页面后，购物车商品和收藏商品全部重置为初始模拟数据，体验割裂。
2. **持久化方案碎片化**：仅 `user.js` 手写了 `localStorage` 读写逻辑用于登录态、记住我、登录锁定，与其它 store 完全脱节，缺乏统一策略，难以维护与扩展。

需要引入一套统一的、可维护的数据持久化方案，覆盖所有用户相关状态，并产出专业级技术文档指导团队理解与维护。

## What Changes
- 引入 `pinia-plugin-persistedstate` 作为统一持久化插件，在 `main.js` 中注册
- 为 `cart` store 增加持久化配置，购物车数据刷新后保留
- 为 `favorites` store 增加持久化配置，收藏数据刷新后保留
- 新增 `history` store（浏览历史），记录用户浏览过的商品并持久化，替换原先仅来自 mock 的浏览历史
- 统一存储 key 命名规范（集中管理，避免散落）
- 保留 `user.js` 现有手动 localStorage 安全逻辑（密码哈希、salt、登录锁定、记住我 TTL 过期判断），不在本次改造中改动其安全语义，但纳入文档统一说明
- 产出完整技术文档 `docs/persistence.md`，涵盖设计思路、技术选型、实现步骤、数据模型、API/接口说明、错误处理、性能优化、测试验证

## Impact
- Affected code:
  - `src/main.js`（注册持久化插件）
  - `src/stores/cart.js`（增加 persist 配置）
  - `src/stores/favorites.js`（增加 persist 配置）
  - `src/stores/history.js`（新增 store）
  - `src/views/user/HistoryView.vue`（接入 history store 替代直接读 mock）
  - `package.json`（新增依赖）
  - `docs/persistence.md`（新增技术文档）
- 不改动 `user.js` 的登录/注册/记住我/锁定等安全逻辑，避免破坏现有认证流程（硬约束：支付与登录流程逻辑保持不变）
- 不改动结算页（checkout）支付流程逻辑

## ADDED Requirements

### Requirement: 购物车数据持久化
系统 SHALL 在用户刷新页面或重新打开网站后，保留购物车中的全部商品（含数量、规格、选中状态）。

#### Scenario: 刷新后购物车保留
- **WHEN** 用户在购物车中添加/修改/删除商品后刷新浏览器
- **THEN** 购物车页面展示刷新前的最新商品列表，数量与选中状态一致

#### Scenario: 首次访问无历史数据
- **WHEN** 首次访问网站（localStorage 中无购物车持久化数据）
- **THEN** 购物车使用 mock 数据初始化，行为与当前一致

### Requirement: 收藏夹数据持久化
系统 SHALL 在用户刷新页面后保留收藏的商品列表。

#### Scenario: 刷新后收藏保留
- **WHEN** 用户添加或取消收藏后刷新浏览器
- **THEN** 收藏列表展示刷新前的最新状态

### Requirement: 浏览历史记录与持久化
系统 SHALL 新增 `history` store，在用户进入商品详情页时记录浏览记录，并持久化到本地，按访问时间倒序组织（今天/昨天/N天前）。

#### Scenario: 浏览商品被记录
- **WHEN** 用户进入商品详情页
- **THEN** 该商品被加入浏览历史（去重，最新置顶），并持久化

#### Scenario: 浏览历史页面展示持久化数据
- **WHEN** 用户刷新后进入"我的足迹"页面
- **THEN** 页面展示持久化的浏览历史；若无可回退到 mock 数据

### Requirement: 统一持久化配置与存储 key 管理
系统 SHALL 通过 `pinia-plugin-persistedstate` 统一管理各 store 的持久化，存储 key 集中定义，命名规范统一。

#### Scenario: 存储隔离
- **WHEN** 多个 store 同时持久化
- **THEN** 各 store 使用独立、命名规范的 localStorage key，互不干扰

### Requirement: 持久化技术文档
系统 SHALL 提供一份 Markdown 技术文档 `docs/persistence.md`，涵盖：设计思路、技术选型依据、实现步骤、数据模型定义、API/接口说明、错误处理机制、性能优化策略、测试验证方法。

## MODIFIED Requirements

### Requirement: 浏览历史数据来源
原先浏览历史页面直接读取 `mock/data.js` 的 `browsingHistory`。改为优先读取持久化的 `history` store；无历史数据时回退 mock。

## REMOVED Requirements
无。
