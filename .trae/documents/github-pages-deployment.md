# 部署 shop-web 到 GitHub Pages

## Context（背景）

用户希望把当前 `shop-web`（Vue3 + Vite + Element Plus + Pinia SPA）完整部署到 GitHub，生成一个访客可在线体验的环境。仓库已存在：`xingyuanshenhuang/shop-web`（用户仓库），部署地址将是：

`https://xingyuanshenhuang.github.io/shop-web/`

### 已确认的决策

* **部署方式**：GitHub Actions 自动部署（push 到 main 时自动构建并发布 Pages）。需用户在 Settings→Pages 将 Source 设为「GitHub Actions」。

* **路由模式**：保留 HTML5 History（`createWebHistory`），并用 404 回退解决深层路由刷新 404。

### 需要解决的技术问题

1. **Vite base 路径**：vite.config.js 未设置 `base`（默认 `/`）。部署到子路径 `/shop-web/` 时静态资源路径会错误，必须改为 `base: '/shop-web/'`。
2. **深层路由 404**：GitHub Pages 对未知路径返回 404，需将 `dist/index.html` 复制为 `dist/404.html`，未命中路径时回退首页，再由前端路由接管。路由文件已用 `createWebHistory(import.meta.env.BASE_URL)`，会随 base 自动适配，无需改路由代码。
3. **版本控制**：核心配置与工作流本应一次提交管理；部署产物 `dist/` 已在 .gitignore 中忽略，由 Actions 在 CI 中构建。

## 改动清单

### 1. `vite.config.js`

在 `defineConfig` 中加入 `base: '/shop-web/'`：

```js
export default defineConfig({
  base: '/shop-web/',
  plugins: [vue(), vueDevTools()],
  ...
})
```

### 2. 新建 `.github/workflows/deploy.yml`

GitHub Actions 工作流：检出 → 安装 pnpm → 构建 → 复制 404.html → 上传产物 → 发布到 Pages。

* 触发：`push` 到 `main`，`workflow_dispatch` 手动触发。

* 关键步骤：

  * `actions/configure-pages` 注入 base path

  * `pnpm install --frozen-lockfile`

  * `pnpm build`

  * 构建后执行 `cp dist/index.html dist/404.html`

  * `actions/upload-pages-artifact` 上传 `dist`

  * `actions/deploy-pages` 发布

* `permissions: contents: read, pages: write, id-token: write`

### 3. `README.md`

替换默认 Vite 模板说明，新增：

* 项目简介与核心功能（首页/商品/详情/购物车/结算/登录注册/用户中心）

* **在线体验链接**：`https://xingyuanshenhuang.github.io/shop-web/`

* 本地开发/构建/预览命令（沿用现有脚本 `pnpm dev/build/preview`）

* 部署说明（含首次需在 Settings→Pages 开启「GitHub Actions」源）

### 4. 版本控制

配置与文档改动合并为一次提交，提交信息遵循仓库约定的 conventional commit 风格（见 [.trae/rules/git-commit-message.md](file:///d:/Desktop/vue项目/shop-web/.trae/rules/git-commit-message.md)），如 `feat(deploy): 配置 GitHub Pages 自动部署`。push 到 origin/main 后由 Actions 自动构建发布。

## 验证

1. **本地构建**：`pnpm build` 确认成功生成 `dist/`，且产物 HTML 中资源引用含 `/shop-web/` 前缀。
2. **本地预览**：`pnpm preview` 访问本地服务，确认首页和深层路由 `/product/:id` 正常渲染。
3. **404 回退**：确认 `dist/404.html` 生成。
4. **线上验证**（Actions 运行完成后）：访问 `https://xingyuanshenhuang.github.io/shop-web/`，检查：

   * 资源加载（控制台无 404）

   * 导航跳转正常

   * 刷新深层路由（如 `/shop-web/product/1`）不再 404

   * 响应式（窄屏/移动端布局）正常

   * 核心功能（加购、结算、登录注册）可用
5. **性能**：确认 bundle 体积正常、首屏可加载。

## 注意 / 需用户配合

* Actions 发布 Pages 需要仓库 **Settings → Pages → Source = GitHub Actions**，这一项需在 GitHub 网页端手动开启（首次触发时若未开启，工作流可运行但 Pages 不会发布）。

* 需确认本机 git push 认证（token）可用。

