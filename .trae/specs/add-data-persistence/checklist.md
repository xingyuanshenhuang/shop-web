# Checklist

- [x] `pinia-plugin-persistedstate` 已安装并在 `main.js` 注册
- [x] 存储 key 在 `persistenceConfig.js` 中集中定义，命名规范统一
- [x] cart store 已配置 persist，刷新后购物车商品（数量/规格/选中状态）保留
- [x] 首次访问（无 localStorage 数据）时购物车正常回退 mock 初始化且无报错
- [x] favorites store 已配置 persist，刷新后收藏列表保留
- [x] 新增 `history` store，持久化浏览历史，提供 recordView/clear 方法
- [x] 商品详情页进入时调用 recordView 记录浏览历史（去重、最新置顶、按日期分组）
- [x] HistoryView 优先读取 history store，无数据时回退 mock
- [x] user.js 的登录/注册/记住我/锁定等安全逻辑未被破坏
- [x] 结算页支付流程（确认订单 → 支付 → 成功）逻辑未受影响
- [x] 技术文档 `docs/persistence.md` 已创建，包含全部八个章节（设计思路/技术选型/实现步骤/数据模型/API接口/错误处理/性能优化/测试验证）
- [x] 文档内容专业、条理清晰，能指导团队理解与维护持久化系统
