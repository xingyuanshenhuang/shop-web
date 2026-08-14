# 网站数据持久化技术文档

> 适用项目：shop-web（Vue 3 + Vite + Pinia + Element Plus 淘宝风格电商网站）
> 文档版本：1.0
> 维护对象：购物车、收藏夹、浏览历史、用户登录态等本地持久化数据

---

## 目录

- [1. 设计思路](#1-设计思路)
- [2. 技术选型依据](#2-技术选型依据)
- [3. 具体实现步骤](#3-具体实现步骤)
- [4. 数据模型定义](#4-数据模型定义)
- [5. API 接口说明](#5-api-接口说明)
- [6. 错误处理机制](#6-错误处理机制)
- [7. 性能优化策略](#7-性能优化策略)
- [8. 测试验证方法](#8-测试验证方法)
- [维护指南](#维护指南)

---

## 1. 设计思路

### 1.1 问题背景

在引入持久化方案之前，项目存在两个核心问题：

1. **业务状态刷新即丢失**：`cart.js` 与 `favorites.js` 均从 `src/mock/data.js` 初始化，没有任何持久化机制。用户在购物车中添加/修改商品、在详情页收藏商品后，一旦刷新或重新打开页面，数据全部重置为初始模拟数据，购物体验割裂。
2. **持久化方案碎片化**：仅 `user.js` 手写了 `localStorage` 读写逻辑，用于登录态、记住我、登录锁定等安全场景，与其它 store 完全脱节。各处存储 key 散落、命名不统一，难以维护与扩展。

### 1.2 整体方案

采用「统一插件 + 集中 key 管理 + 分层持久化」的方案：

- **统一插件**：引入 `pinia-plugin-persistedstate`（v4.x）作为统一持久化插件，在 `src/main.js` 中通过 `pinia.use(piniaPluginPersistedstate)` 全局注册。
- **集中 key 管理**：所有持久化存储 key 集中定义在 `src/stores/persistenceConfig.js`，命名规范统一为 `shop_web_<store>`，各 store 引用常量而非硬编码字符串。
- **持久化范围**：
  - `cart` → `shop_web_cart`，持久化字段 `items`
  - `favorites` → `shop_web_favorites`，持久化字段 `items`
  - `history`（新增）→ `shop_web_history`，持久化字段 `items`
- **默认存储介质**：`localStorage`（跨会话保留）。

### 1.3 分层策略

持久化按数据语义分为两层，互不干扰：

| 层级 | 适用对象 | 实现方式 | 说明 |
| --- | --- | --- | --- |
| 业务状态层 | cart / favorites / history | `pinia-plugin-persistedstate` 声明式持久化 | 纯展示/交互数据，无安全语义，适合插件统一托管 |
| 安全状态层 | user（登录库 / 记住我 / 登录锁定） | `user.js` 内部手动 `localStorage` | 含密码哈希（Web Crypto API SHA-256 + salt）、TTL 过期判断、登录锁定等安全语义，保持现有逻辑不变，不纳入插件 |

> **硬约束**：`user.js` 的登录 / 注册 / 记住我 / 锁定等安全逻辑，以及结算页（checkout）支付流程逻辑，本次改造一律不改动，仅纳入文档统一说明其定位与边界。

### 1.4 数据流

持久化的完整数据流如下：

```
应用启动
  │
  ▼
createPinia() + pinia.use(piniaPluginPersistedstate)   ← 插件注册
  │
  ▼
组件首次 useXxxStore()                                  ← store 实例化
  │
  ├─ 1. 初始化：items 从 mock 数据初始化（首次访问兜底）
  │
  ├─ 2. 插件 hydrate：读取 localStorage 中 shop_web_<store>
  │      若存在持久化数据 → 覆盖恢复 items；若不存在 → 保持 mock 初始值
  │
  ▼
后续任意变更（addItem / removeItem / recordView ...）
  │
  ▼
插件通过 $subscribe 监听 state 变化 → 自动序列化写入 localStorage
```

关键点：**store 先以 mock 初始化，插件随后用持久化数据覆盖（hydrate）**。因此首次访问（无持久化数据）时回退 mock，行为与改造前一致；已有持久化数据时则恢复上次状态。

---

## 2. 技术选型依据

### 2.1 方案对比：localStorage 手写 vs pinia-plugin-persistedstate

| 维度 | 直接手写 localStorage | pinia-plugin-persistedstate |
| --- | --- | --- |
| 接入方式 | 每个 store 手动 `getItem/setItem`、`JSON.parse/stringify` | 声明式 `persist` 配置，零侵入 |
| setup store 兼容 | 需自行处理 ref 读写时机 | 原生支持 setup store 语法 |
| 字段级控制 | 需手动挑选序列化字段 | 通过 `pick`/`paths` 按需持久化 |
| 自动写入 | 需手动在每次变更后调用保存 | 基于 `$subscribe` 自动持久化 |
| computed 处理 | 易误存 computed，需手动排除 | 自动只持久化 state，computed 不入库 |
| 代码量 | 多、易遗漏、易写错 | 极少，配置即生效 |
| 维护成本 | 高（散落多处） | 低（集中配置） |

### 2.2 选择 pinia-plugin-persistedstate 的理由

1. **声明式、零侵入**：仅需在 `defineStore` 第三参数增加 `persist` 配置，无需改动 store 内部业务逻辑。
2. **setup store 友好**：本项目全部采用 setup store 语法，插件原生兼容。
3. **按需 pick 字段**：可指定只持久化 `items`，自动排除 computed 派生值，避免冗余存储。
4. **社区维护活跃**：v4.x 为当前主流版本，文档完善，与 Pinia 3.x 兼容。
5. **自动订阅写入**：基于 `$subscribe` 监听状态变化并自动落盘，开发者无需手动维护保存调用点，降低遗漏风险。

### 2.3 user.js 保留手写方案的理由

`user.js` 涉及的本地数据具有强安全语义，不适合纳入插件统一托管：

- **密码哈希**：使用 Web Crypto API（`crypto.subtle.digest('SHA-256', ...)`）配合随机 salt 存储用户库，注册/登录/改密均依赖该流程。
- **TTL 过期判断**：记住我 token 含 `expiresAt`，需在读取时判断是否过期并清理；登录锁定含 `until` 时间戳，需计算剩余锁定时长。
- **登录锁定**：失败计数达阈值（5 次）后写入锁定记录，60 秒内禁止登录。
- **常量时间比较**：密码校验采用常量时间字符串比较，避免计时侧信道。

这些逻辑与持久化紧密耦合，若改用插件声明式持久化，反而会破坏现有安全语义与控制粒度。因此保持 `user.js` 现有手写方案不变。

### 2.4 存储介质选择：localStorage vs sessionStorage

| 介质 | 生命周期 | 是否适用 |
| --- | --- | --- |
| `localStorage` | 跨会话持久（手动清除前一直保留） | ✅ 选用 |
| `sessionStorage` | 仅当前标签页会话，关闭即清空 | ❌ 不适用 |

购物车、收藏夹、浏览历史属于用户期望「下次打开仍在」的数据，必须跨会话保留，因此统一选用 `localStorage`。`user.js` 的记住我（7 天 TTL）同样需要跨会话，亦使用 `localStorage`。

---

## 3. 具体实现步骤

### 3.1 安装依赖

```bash
pnpm add pinia-plugin-persistedstate
```

安装后 `package.json` 的 `dependencies` 中应包含：

```json
{
  "pinia-plugin-persistedstate": "^4.7.1"
}
```

### 3.2 在 main.js 注册插件

`src/main.js` 关键片段：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// ...其它导入

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 注册持久化插件
app.use(pinia)
// ...
app.mount('#app')
```

### 3.3 创建 persistenceConfig.js

新建 `src/stores/persistenceConfig.js`，集中定义存储 key 常量与命名规范：

```js
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
```

### 3.4 为 cart store 接入持久化

在 `src/stores/cart.js` 的 `defineStore` 第三参数增加 `persist` 配置，引用集中 key：

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartItems as mockCart } from '@/mock/data'
import { useFavoritesStore } from './favorites'
import { PERSIST_KEYS } from './persistenceConfig'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref([...mockCart]) // 先以 mock 初始化，插件 hydrate 时覆盖恢复

    // ...computed 与方法保持不变（totalCount / totalPrice / addItem 等）

    return { items, /* ... */ }
  },
  {
    // 仅需配置 key；store 内只有 items 为响应式 state，computed 自动不持久化
    persist: { key: PERSIST_KEYS.cart },
  },
)
```

> 首次访问（localStorage 无 `shop_web_cart`）时，`items` 保持 mock 初始值，行为不变；已有数据时插件覆盖恢复。

### 3.5 为 favorites store 接入持久化

`src/stores/favorites.js` 同理：

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favoriteProducts } from '@/mock/data'
import { PERSIST_KEYS } from './persistenceConfig'

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const items = ref([...favoriteProducts])

    // ...count / isFavorite / addFavorite / removeFavorite 等

    return { items, /* ... */ }
  },
  {
    persist: { key: PERSIST_KEYS.favorites },
  },
)
```

### 3.6 新建 history store

新建 `src/stores/history.js`，实现浏览历史记录与持久化。核心逻辑：按 id 去重、更新 `viewedAt` 为 `Date.now()`、置顶、上限 100 条，并按日期分组。

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PERSIST_KEYS } from './persistenceConfig'

const MAX_HISTORY = 100

export const useHistoryStore = defineStore(
  'history',
  () => {
    // items 元素结构：{ id, name, price, image, viewedAt, status }
    const items = ref([])

    // 总条数
    const count = computed(() => items.value.length)

    // 按日期分组（今天 / 昨天 / N天前），最新在前
    const groups = computed(() => {
      // 将 items 按 viewedAt 对应的日期归组并排序
      // 返回 [{ date: string, products: array }]
      // ...分组实现
    })

    // 记录一次浏览：去重、更新时间、置顶、控制上限
    function recordView(product) {
      const { id, name, price, image } = product
      // 移除已存在的同 id 记录
      items.value = items.value.filter((i) => i.id !== id)
      // 置顶插入
      items.value.unshift({ id, name, price, image, viewedAt: Date.now(), status: 'normal' })
      // 上限保护
      if (items.value.length > MAX_HISTORY) {
        items.value = items.value.slice(0, MAX_HISTORY)
      }
    }

    function removeItem(id) {
      items.value = items.value.filter((i) => i.id !== id)
    }

    function removeItems(ids) {
      items.value = items.value.filter((i) => !ids.includes(i.id))
    }

    function clear() {
      items.value = []
    }

    return { items, count, groups, recordView, removeItem, removeItems, clear }
  },
  {
    persist: { key: PERSIST_KEYS.history },
  },
)
```

### 3.7 接入详情页与足迹页

**详情页 `src/views/product/ProductDetailPage.vue`**：进入页面时调用 `recordView` 记录当前商品（传入 id/name/price/image）：

```js
import { useHistoryStore } from '@/stores/history'

const historyStore = useHistoryStore()

// 在加载到商品详情后记录浏览
historyStore.recordView({
  id: detail.id,
  name: detail.name,
  price: detail.price,
  image: detail.images[0],
})
```

**足迹页 `src/views/user/HistoryView.vue`**：优先读取 `historyStore.groups`（持久化数据），无历史数据时回退 mock `browsingHistory`：

```js
import { useHistoryStore } from '@/stores/history'
import { browsingHistory } from '@/mock/data'

const historyStore = useHistoryStore()

// 优先使用持久化的浏览历史；为空时回退 mock
const historyGroups = computed(() =>
  historyStore.groups.length ? historyStore.groups : browsingHistory,
)
```

---

## 4. 数据模型定义

### 4.1 cart items（购物车，key：`shop_web_cart`）

`items` 为数组，每个元素结构如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 购物车条目唯一标识（`Date.now()` 生成） |
| `productId` | number/string | 商品 id |
| `name` | string | 商品名称 |
| `spec` | string | 规格描述（如「原木色 / 1.3m」） |
| `price` | number | 单价 |
| `quantity` | number | 购买数量 |
| `image` | string | 商品图片 URL |
| `checked` | boolean | 是否选中（用于结算勾选） |

### 4.2 favorites items（收藏夹，key：`shop_web_favorites`）

`items` 为数组，每个元素结构如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number/string | 商品 id（用作去重与取消收藏依据） |
| `name` | string | 商品名称 |
| `price` | number | 商品价格 |
| `image` | string | 商品图片 URL |

### 4.3 history items（浏览历史，key：`shop_web_history`）

`items` 为数组，每个元素结构如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number/string | 商品 id（去重依据） |
| `name` | string | 商品名称 |
| `price` | number | 商品价格 |
| `image` | string | 商品图片 URL |
| `viewedAt` | number | 浏览时间戳（`Date.now()`，用于排序与日期分组） |
| `status` | string | 商品状态，固定 `'normal'`（预留降价/失效等扩展） |

### 4.4 user.js 手动管理的 localStorage 数据结构

`user.js` 不经插件，直接读写以下三个 key：

#### 4.4.1 用户库记录（key：`taobao_users`）

整体为 JSON 数组，每个用户记录结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 用户 id（`u_` + 时间戳 + 随机串） |
| `username` | string | 用户名（已做危险字符过滤） |
| `email` | string | 邮箱（可为空） |
| `phone` | string | 手机号（可为空） |
| `passwordHash` | string | 密码哈希（SHA-256(salt + password) 的十六进制串） |
| `salt` | string | 随机盐（16 字节十六进制串） |
| `avatar` | string | 头像 URL |
| `createdAt` | number | 注册时间戳 |

> 说明：此为前端演示实现，真实环境应由服务端哈希存储（bcrypt/argon2）。

#### 4.4.2 记住我 token（key：`taobao_remember_token`）

JSON 对象结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `account` | string | 登录账号 |
| `token` | string | 会话 token（`tk_` 前缀，演示用） |
| `expiresAt` | number | 过期时间戳（当前时间 + 7 天） |
| `user` | object | 用户信息（mockUser 与真实数据合并） |

#### 4.4.3 登录锁定记录（key：`taobao_login_lock`）

JSON 对象结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `failed` | number | 连续失败次数 |
| `until` | number | 锁定到期时间戳（当前时间 + 60 秒） |

---

## 5. API 接口说明

### 5.1 各 store 的 persist 配置

| store | 文件 | persist 配置 | 持久化字段 | localStorage key |
| --- | --- | --- | --- | --- |
| cart | `src/stores/cart.js` | `{ key: PERSIST_KEYS.cart }` | `items` | `shop_web_cart` |
| favorites | `src/stores/favorites.js` | `{ key: PERSIST_KEYS.favorites }` | `items` | `shop_web_favorites` |
| history | `src/stores/history.js` | `{ key: PERSIST_KEYS.history }` | `items` | `shop_web_history` |

> 由于上述三个 setup store 对外暴露的响应式 state 仅有 `items`（其余为 computed 或方法），插件实际持久化载荷即为 `items`。computed（如 `totalCount`、`count`、`groups`）为派生值，不会被序列化。

### 5.2 history store API

文件：`src/stores/history.js`（setup store）

#### State

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `items` | `Array<HistoryItem>` | 浏览历史数组，元素结构见 [4.3](#43-history-itemskeyshop_web_history) |

#### Computed

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `count` | `number` | `items` 的长度，即浏览历史总条数 |
| `groups` | `Array<{ date: string, products: Array }>` | 按日期分组（今天 / 昨天 / N 天前），最新在前；每组含 `date` 文案与对应商品数组 |

#### Methods

| 方法签名 | 用途 |
| --- | --- |
| `recordView(product)` | 记录一次浏览。`product` 为 `{ id, name, price, image }`；按 id 去重、更新 `viewedAt` 为 `Date.now()`、置顶，并维持上限 100 条 |
| `removeItem(id)` | 按 id 删除单条浏览记录 |
| `removeItems(ids)` | 批量删除多条浏览记录，`ids` 为 id 数组 |
| `clear()` | 清空全部浏览历史 |

### 5.3 PERSIST_KEYS 常量

定义于 `src/stores/persistenceConfig.js`，集中管理插件持久化所用 key：

```js
export const PERSIST_KEYS = {
  cart: 'shop_web_cart',
  favorites: 'shop_web_favorites',
  history: 'shop_web_history',
}
```

- **用途**：供 cart / favorites / history 三个 store 的 `persist` 配置引用，避免 key 字符串散落多处。
- **命名规范**：`shop_web_<store_name>`，统一前缀便于在 DevTools 中识别与排查。
- **边界**：仅管理插件统一持久化的 key；`user.js` 手动管理的 `taobao_users` / `taobao_remember_token` / `taobao_login_lock` 不在此常量中，仍由 `user.js` 内部私有常量维护。

### 5.4 user.js 关键手动持久化方法

`user.js` 内部以模块级私有常量管理 key，并提供以下方法（均为 store 内函数）：

| 方法 | 定位说明 |
| --- | --- |
| `loadUsers()` | 读取 `taobao_users` 用户库；`try/catch` 包裹，解析失败返回空数组（清除脏数据） |
| `saveUsers(users)` | 将用户库数组序列化写入 `taobao_users` |
| `loadRemembered()` | 读取 `taobao_remember_token`；校验 `expiresAt` 未过期则恢复登录态，过期则清除 |
| `setRemembered(account, userData)` | 生成 token、计算 7 天过期时间，写入记住我记录 |
| `clearRemembered()` | 移除 `taobao_remember_token` 并清空会话 token |
| `loadLock()` | 读取 `taobao_login_lock`；未过期则恢复失败计数与锁定时间，过期则清除 |
| `recordFailedAttempt()` | 累计失败次数，达阈值（5 次）时写入锁定记录 |
| `resetAttempts()` | 重置失败计数与锁定，移除 `taobao_login_lock` |

> 这些方法承载密码哈希、TTL 过期、登录锁定等安全语义，与插件声明式持久化隔离，互不影响。

---

## 6. 错误处理机制

### 6.1 插件层面

- **JSON 解析失败回退**：`pinia-plugin-persistedstate` 在读取 localStorage 时若 `JSON.parse` 失败，会回退到 store 的默认初始值（即 mock 初始化值），不会抛出中断应用。
- **localStorage 不可用容错**：在浏览器隐私模式或存储被禁用时，插件对读写异常做容错处理，不会因存储不可用而导致 store 初始化失败；此时持久化实质降级为「仅内存」，刷新后数据不保留，但不影响当次会话功能。

### 6.2 user.js 现有 try/catch 容错

`user.js` 对所有本地数据读取均以 `try/catch` 包裹，解析失败时主动清除脏数据，避免脏数据反复触发异常：

- `loadUsers()`：解析失败 → 返回 `[]`。
- `loadRemembered()`：解析失败 → `localStorage.removeItem(REMEMBER_KEY)`。
- `loadLock()`：解析失败 → `localStorage.removeItem(LOCK_KEY)`。

### 6.3 history store 上限保护

`recordView` 在置顶插入后强制截断，保证 `items.length` 不超过 100 条，避免历史记录无限增长导致 localStorage 膨胀：

```js
if (items.value.length > MAX_HISTORY) {
  items.value = items.value.slice(0, MAX_HISTORY)
}
```

### 6.4 数据迁移与版本演进策略建议

- **key 版本号**：当数据结构发生不兼容变更时，建议在 key 中引入版本号（如 `shop_web_cart_v2`），新版本读取旧 key 失败则回退默认值，避免字段错乱。
- **字段兼容**：新增字段时应保证旧数据缺字段时的默认值合理；消费端对可能缺失的字段做兜底（如 `item.status || 'normal'`）。
- **迁移函数**：如需从旧结构迁移，可在 store 初始化后做一次性迁移并写入新 key，迁移完成删除旧 key。
- **当前现状**：v1 阶段 key 不带版本号；后续如需重大结构调整，再按上述策略升级。

---

## 7. 性能优化策略

### 7.1 按需持久化

- 三个 store 对外暴露的 state 仅有 `items`，computed（`totalCount`、`totalPrice`、`count`、`groups` 等）均为派生值，插件只序列化 state，computed 不入库，避免冗余存储与反序列化开销。
- 如未来 store 增加不应持久化的临时状态，可通过 `persist.paths`（或 `pick`）显式指定只持久化 `items`。

### 7.2 写入节流

- 插件默认基于 Pinia 的 `$subscribe` 订阅 state 变化并写入，内部带防抖机制，避免高频变更（如连续点击加入购物车）触发频繁 `localStorage.setItem`。
- 业务层无需手动节流。

### 7.3 数据量控制

- **history 上限 100 条**：`recordView` 强制截断，防止单 key 数据膨胀。
- **避免存储大对象**：本项目仅存储商品图片 **URL**（字符串），不存储图片 base64 等大体积数据，控制单条记录体积。
- **cart / favorites**：条目数量受用户实际操作约束，单条体积小（无大字段）。

### 7.4 读取时机

- store 实例化时即由插件完成 hydrate（读取并恢复），无需首屏额外发起请求，恢复零网络成本。
- localStorage 读取为同步操作但数据量小，对首屏性能影响可忽略。

### 7.5 localStorage 容量限制注意事项

- localStorage 单域名容量约 **5MB**，多个 key 共享该配额。
- 本项目持久化数据均为结构化小对象（商品元信息 + URL），远低于配额上限。
- 若未来扩展导致数据量增长，需关注 `QuotaExceededError`：写入失败时插件容错不会中断应用，但数据无法落盘；建议在数据量接近上限时主动清理（如历史记录上限）或拆分 key。

---

## 8. 测试验证方法

### 8.1 手动验证清单

| 编号 | 场景 | 预期结果 |
| --- | --- | --- |
| H1 | 在购物车增/删/改商品（数量、选中状态）后刷新浏览器 | 购物车展示刷新前的最新列表，数量与选中状态一致 |
| H2 | 在详情页收藏 / 取消收藏后刷新浏览器 | 收藏列表展示刷新前的最新状态 |
| H3 | 进入若干商品详情页后，进入「我的足迹」页面 | 足迹页按日期分组展示已浏览商品，最新在前 |
| H4 | 浏览商品后刷新浏览器再进入足迹页 | 足迹记录保留，刷新不丢失 |
| H5 | 首次访问（清空 localStorage 后）打开购物车 / 收藏 / 足迹 | 购物车与收藏回退 mock 初始数据，足迹为空或回退 mock |

### 8.2 浏览器 DevTools 验证

1. 打开 DevTools → **Application** → **Storage** → **Local Storage** → 当前域名。
2. 查看以下 key 是否存在且值为合法 JSON：
   - `shop_web_cart`
   - `shop_web_favorites`
   - `shop_web_history`
   - `taobao_users` / `taobao_remember_token` / `taobao_login_lock`（登录相关操作后）
3. 在页面进行增删操作后，回到 DevTools 刷新存储列表，确认对应 key 的 JSON 内容已更新。
4. 可直接编辑某个 key 的 JSON 内容（如手动改数量），刷新页面验证 store 是否按修改后的值恢复。

### 8.3 回归验证

| 编号 | 场景 | 预期结果 |
| --- | --- | --- |
| R1 | 注册新账号 → 登录 → 勾选记住我 → 刷新 | 登录态保持，7 天内自动恢复 |
| R2 | 连续输错密码 5 次 | 账号锁定 60 秒，刷新后锁定状态保持 |
| R3 | 登录后进入结算页完成支付流程 | 支付流程不受持久化改造影响，行为正常 |
| R4 | 退出登录 | 记住我 token 清除，购物车/收藏/足迹本地数据保留（与登录态解耦） |

### 8.4 边界场景

| 编号 | 场景 | 预期结果 |
| --- | --- | --- |
| B1 | 浏览器隐私模式（localStorage 受限） | 应用不报错，功能正常使用，刷新后数据不保留（降级为仅内存） |
| B2 | localStorage 写满（`QuotaExceededError`） | 写入失败被容错，不中断应用；当次会话功能正常 |
| B3 | 手动篡改 localStorage JSON 为非法字符串 | 插件/user.js 解析失败回退默认值，应用正常启动不白屏 |
| B4 | history 记录达到 100 条后继续浏览新商品 | 最早记录被截断，始终维持 100 条上限 |

### 8.5 可选的自动化测试思路

使用 **Vitest + happy-dom**（或 jsdom）模拟 localStorage 环境，对 store 持久化行为进行单元测试：

```js
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useHistoryStore } from '@/stores/history'

describe('history store 持久化', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('recordView 应去重并置顶', () => {
    const store = useHistoryStore()
    store.recordView({ id: 1, name: 'A', price: 10, image: 'a.jpg' })
    store.recordView({ id: 2, name: 'B', price: 20, image: 'b.jpg' })
    store.recordView({ id: 1, name: 'A', price: 10, image: 'a.jpg' }) // 重复浏览
    expect(store.count).toBe(2)
    expect(store.items[0].id).toBe(1) // 最新浏览置顶
  })

  it('超过 100 条应截断', () => {
    const store = useHistoryStore()
    for (let i = 0; i < 120; i++) store.recordView({ id: i, name: 'N', price: 1, image: 'x' })
    expect(store.count).toBe(100)
  })

  it('刷新（重新实例化）后应恢复持久化数据', () => {
    const store = useHistoryStore()
    store.recordView({ id: 1, name: 'A', price: 10, image: 'a.jpg' })
    // 模拟刷新：重新创建 pinia 与 store
    setActivePinia(createPinia())
    const restored = useHistoryStore()
    expect(restored.count).toBe(1)
    expect(restored.items[0].id).toBe(1)
  })
})
```

> 注：自动化测试需配置 happy-dom 提供的 `localStorage`，并确保插件在测试 pinia 上已注册。

---

## 维护指南

### 新增需要持久化的 store

1. 在 `src/stores/persistenceConfig.js` 的 `PERSIST_KEYS` 中新增一项，遵循 `shop_web_<store>` 命名规范。
2. 在目标 store 的 `defineStore` 第三参数增加 `persist: { key: PERSIST_KEYS.<store> }`。
3. 若只需持久化部分字段，使用 `persist: { key: PERSIST_KEYS.<store>, pick: ['items'] }` 显式指定。
4. 确认 store 的 state 中不包含不应入库的大对象或敏感数据。
5. 在本文档「数据模型定义」与「API 接口说明」章节补充该 store 的字段与配置说明。
6. 按 [8. 测试验证方法](#8-测试验证方法) 进行手动与（可选）自动化验证。

### 修改存储 key 的注意事项

- **直接改名会导致旧数据丢失**：localStorage 中旧 key 的数据不会被新 key 读取，store 将回退默认值。
- 如需保留旧数据，应编写一次性迁移逻辑：读取旧 key → 转换 → 写入新 key → 删除旧 key。
- key 一旦发布到生产环境，修改需谨慎，建议通过版本号（如 `_v2`）渐进迁移。
- 修改后同步更新 `PERSIST_KEYS` 与本文档表格，避免文档与代码不一致。

### 清理本地数据的方法

- **开发调试**：DevTools → Application → Local Storage → 选中目标 key 右键删除，或点击清除全部。
- **代码清理**：在浏览器控制台执行：
  ```js
  localStorage.removeItem('shop_web_cart')
  localStorage.removeItem('shop_web_favorites')
  localStorage.removeItem('shop_web_history')
  // 用户相关
  localStorage.removeItem('taobao_users')
  localStorage.removeItem('taobao_remember_token')
  localStorage.removeItem('taobao_login_lock')
  ```
- **store 内清空**：调用各 store 提供的清空方法（如 `historyStore.clear()`），清空后会同步写入空值到 localStorage。
- **隐私模式**：关闭隐私窗口即自动清理本次会话的存储（若隐私模式下 localStorage 可用）。
