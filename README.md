# 🛍️ XX商城 · Vue 3 电商购物网站

> 一个以 **Vue 3 + Vite** 构建的现代化、完整可用的电商购物网站前端演示项目。

基于真实购物场景设计，覆盖**首页浏览 → 商品搜索/筛选 → 详情决策 → 加入购物车 → 结算下单 → 支付结果 → 用户中心**的全链路体验。拥有淘宝风格的橙系品牌视觉、响应式三端布局，以及登录注册、数据持久化、SPA 路由优化等完善能力。

## 📌 项目亮点

- ✅ **完整闭环** —— 从浏览到下单、再到售后与个人中心的完整电商流程
- ✅ **真实购物体验** —— 商品筛选排序、规格选择、购物车、结算、优惠券、评价等
- ✅ **响应式三端** —— Desktop / Tablet / Mobile 自适应，移动端专属底部 Tab Bar
- ✅ **数据持久化** —— 基于 localStorage 的登录、购物车、订单、收藏数据存储
- ✅ **安全实践** —— 密码 SHA‑256 加盐哈希、输入 XSS 净化、登录失败锁定与验证
- ✅ **生产级部署** —— GitHub Actions 自动构建并发布到 GitHub Pages

## 🚀 在线体验

本项目已部署到 GitHub Pages，**无需本地运行**即可在线体验全部核心功能：

> ### 👉 https://xingyuanshenhuang.github.io/shop-web/

> 💡 若需本地入门指见 [快速开始](#quick-start)。

---

## ✨ 功能特性

### 🏠 首页
- Banner 轮播、快捷分类入口
- 限时秒杀（实时倒计时）
- 推荐商品网格、活动导览

### 🧭 商品中心
- **商品列表** `/products`：分类浏览、面包屑、Tab 导航、多条件排序与筛选、可展开筛选侧栏、分页
- **商品详情** `/product/:id`：缩略图 + 主图 + 放大镜、规格选择、评价 → 参数 → 图文详情 → 「本店推荐」
- 搜索、收藏、分页等完整交互

### 🛒 购物与结算
- **购物车** `/cart`：全选/单选、数量调整、价格明细、结算跳转
- **结算页** `/checkout`：三步流程指示、收货地址管理、支付方式选择、订单明细、支付确认
- **顺手买** 加购、支付成功/失败状态页

### 👤 用户中心
- **订单管理**：订单列表、状态筛选、物流时间线
- **营销能力**：优惠券领取与使用、浏览历史、评价管理（星级/标签/图片上传）
- **账号服务**：个人资料、安全设置、收货地址、帮助与 FAQ
- **账号体系**：账号密码 / 短信登录、注册、找回密码、异地登录滑块验证

### 🎨 设计规范
- 品牌橙 `#FF5000` 为核心的颜色体系、双层导航架构、标准圆角卡片
- 三段式 CTA 按钮、文字溢出防护、价格自适应
- Desktop 悬浮工具栏 + 移动端底部 Tab Bar

---

## 📄 页面与路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 品牌橱窗、推荐、活动导览 |
| `/products` | 商品列表 | 分类、筛选、排序、分页 |
| `/product/:id` | 商品详情 | 规格、评价、图文、推荐 |
| `/cart` | 购物车 | 商品管理、结算 |
| `/checkout` | 结算页 | 地址、支付、确认 |
| `/user` | 用户中心 | 订单/券/历史/评价/设置 |
| `/login` | 登录 | 账号 / 短信登录 |
| `/register` | 注册 | 账号注册 |
| `/forgot-password` | 找回密码 | 密码重置 |

> 受保护路由（`/cart`、`/checkout`、`/user`）由路由守卫自动拦截，未登录将重定向至登录页，并支持 `?redirect=` 登录后回跳。

---

## 🛠️ 技术栈

| 类别 | 技术 |
| --- | --- |
| 核心框架 | [Vue 3](https://vuejs.org/) + [Vite 8](https://vite.dev/) |
| 路由 | [Vue Router 5](https://router.vuejs.org/)（HTML5 History 模式） |
| 状态管理 | [Pinia 3](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate` |
| UI 组件 | [Element Plus](https://element-plus.org/) |
| 数据持久化 | Web Storage + Web Crypto 哈希 |
| 工程化 | ESLint + Prettier + OXLint |

---

## <span id="quick-start">🚀 快速开始</span>

**环境要求**：Node.js `^20.19` 或 `^22.12`，推荐使用 [pnpm](https://pnpm.io/)（项目锁定版本 `pnpm@10.32.1`）。

```sh
# 1. 克隆仓库
git clone https://github.com/xingyuanshenhuang/shop-web.git
cd shop-web

# 2. 安装依赖
pnpm install

# 3. 启动开发服务（热更新）
pnpm dev

# 4. 生产构建
pnpm build

# 5. 本地预览生产产物
pnpm preview

# 6. 代码检查与格式化
pnpm lint      # 运行 lint
pnpm format    # 格式化源码
```

开发服务器启动后，访问终端输出的本地地址（默认 `http://localhost:5173/`）即可开始体验。

---

## 📦 部署到 GitHub Pages

项目内置 [GitHub Actions 工作流](./.github/workflows/deploy.yml)：向 `main` 分支推送或手动触发 `workflow_dispatch` 时，CI 会自动**安装依赖 → 构建产物 → 发布到 Pages**。

**首次部署**需在仓库 **Settings → Pages** 中将 Source（构建来源）设置为 **GitHub Actions**。

### 部署要点

- `vite.config.js` 中 `base` 已设为 `/shop-web/`，确保静态资源在子路径下正确加载。
- 路由使用 HTML5 History 模式，CI 构建时将 `index.html` 复制为 `404.html` 作为 SPA 回退，保证深层路由刷新/直达不 404。
- `dist/` 产物已加入 `.gitignore`，由 CI 生成，不进入版本库。

---

## 📁 项目结构

```
shop-web/
├── .github/workflows/deploy.yml   # Pages 自动部署
├── public/                         # 静态资源与 favicon
├── src/
│   ├── components/                 # 布局 + 通用业务组件
│   │   ├── layout/                 # TopUtilityBar / MainNav / FooterBar
│   │   ├── common/                 # ProductCard / FloatingToolbar / MobileTabBar ...
│   │   └── product/                # ReviewDrawer ...
│   ├── views/                      # 6 大页面（home / product / cart / checkout / user ...）
│   ├── router/index.js             # 路由配置 + 登录守卫
│   ├── stores/                     # Pinia（cart / user / order）
│   ├── styles/                     # variables.css / global.css 设计令牌与全局样式
│   ├── mock/data.js                # 完整模拟数据
│   ├── App.vue                     # 根组件（含 blank 布局分流）
│   └── main.js                     # 应用入口
├── index.html
├── package.json
└── vite.config.js
```

---

## 🤝 贡献指南

欢迎通过 Pull Request 参与改进！

1. **Fork** 本仓库并创建特性分支：`git checkout -b feature/your-feature`
2. **提交前**请运行 `pnpm lint` 与 `pnpm format` 确保代码规范
3. **发起 PR**，清晰描述改动内容与验证方式
4. 遵守项目已有的代码风格与架构约定（贴合现有文件与组件模式，保持最小、一致的改动）

如发现 Bug 或有功能建议，也欢迎提交 **Issue**。

---

## 📄 许可证

本项目采用 **MIT License**，可自由使用、修改与商用。

```
MIT License

Copyright (c) 2026 xingyuanshenhuang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```