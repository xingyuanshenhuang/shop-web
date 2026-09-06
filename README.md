# shop-web · XX商城

一个以 Vue 3 + Vite 构建的电商购物网站前端演示项目，提供完整的在线购物体验。

## 在线体验

本项目已部署到 GitHub Pages，访客可直接在线访问全部核心功能：

> **https://xingyuanshenhuang.github.io/shop-web/**

涵盖的页面与功能：

- **首页** `HomePage` — 品牌橱窗、商品推荐、活动导览
- **商品列表** `/products` — 分类浏览、筛选、搜索、收藏
- **商品详情** `/product/:id` — 图文详情、规格选择、评价与「本店推荐」
- **购物车** `/cart` — 购物车管理、数量调整、结算跳转
- **结算页** `/checkout` — 收货信息、支付明细与「顺手买」加购
- **支付结果** — 成功/失败状态页
- **用户中心** `/user` — 个人账号信息
- **登录/注册/找回密码** — 账号密码、短信登录、注册与验证码

> 面向真实购物场景，从浏览到下单的完整闭环均可线上体验。

## 技术栈

- Vue 3 + Vite 8
- Vue Router 5（HTML5 History 模式）
- Pinia（状态管理 + localStorage 持久化）
- Element Plus（UI 组件库）
- 数据持久化采用 Web Crypto 哈希与 Web Storage

## 本地开发

环境要求：Node.js 20.19 及以上 / 22.12 及以上，推荐使用 pnpm。

```sh
# 安装依赖
pnpm install

# 启动开发服务（热更新）
pnpm dev

# 生产构建
pnpm build

# 本地预览生产产物
pnpm preview

# 代码检查
pnpm lint
```

## 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署工作流：推送代码到 `main` 分支或手动触发时，会自动安装依赖、构建产物并发布到 Pages。部署地址为 `https://xingyuanshenhuang.github.io/shop-web/`。

首次部署需在仓库 **Settings → Pages** 中将 Source（构建来源）设置为 **GitHub Actions**。

### 部署要点

- `vite.config.js` 中的 `base` 已设为 `/shop-web/`，确保静态资源在子路径下正确加载。
- 路由使用 HTML5 History 模式，构建时将 `index.html` 复制为 `404.html` 作为 SPA 回退，保证刷新或直接访问深层路由不 404。
- `dist/` 部署产物已加入 `.gitignore`，由 CI 构建生成，不进入版本库。

## 许可证

MIT