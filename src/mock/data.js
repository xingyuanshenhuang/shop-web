// 图片统一使用 Pexels 免费商用授权图库（https://www.pexels.com/license/）
// 尺寸通过 query 参数裁剪，保证与页面布局匹配

const px = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

// 商品主图（400x400）
const IMG = {
  table: px(6394655, 400, 400),
  laptop: px(10655906, 400, 400),
  dress: px(35747131, 400, 400),
  baby: px(37904241, 400, 400),
  watch: px(13007642, 400, 400),
  sofa: px(4172381, 400, 400),
  nuts: px(30308595, 400, 400),
  shoes: px(11324527, 400, 400),
  coffee: px(12090814, 400, 400),
  blocks: px(7301356, 400, 400),
  wallet: px(7085799, 400, 400),
  luggage: px(34629932, 400, 400),
  earbuds: px(16303233, 300, 300),
  tshirt: px(18257675, 300, 300),
  robot: px(8566426, 300, 300),
  bottle: px(7507939, 300, 300),
}

export const banners = [
  {
    id: 1,
    title: '春季焕新家',
    subtitle: '精选家居好物，满300减50',
    image: px(39134571, 1200, 400),
    link: '/products?category=home',
  },
  {
    id: 2,
    title: '数码狂欢节',
    subtitle: '手机电脑低至5折，限时抢购',
    image: px(9986410, 1200, 400),
    link: '/products?category=digital',
  },
  {
    id: 3,
    title: '时尚穿搭季',
    subtitle: '春夏新品上市，潮流不等待',
    image: px(36409245, 1200, 400),
    link: '/products?category=fashion',
  },
]

export const categories = [
  { id: 1, name: '居家', icon: 'House', color: '#FF5000' },
  { id: 2, name: '美食', icon: 'Food', color: '#52C41A' },
  { id: 3, name: '服饰', icon: 'Suitcase', color: '#722ED1' },
  { id: 4, name: '母婴', icon: 'Present', color: '#FF8547' },
  { id: 5, name: '数码', icon: 'Cellphone', color: '#1890FF' },
  { id: 6, name: '运动', icon: 'Basketball', color: '#13C2C2' },
  { id: 7, name: '美妆', icon: 'Brush', color: '#EB2F96' },
  { id: 8, name: '图书', icon: 'Reading', color: '#FAAD14' },
  { id: 9, name: '家电', icon: 'Monitor', color: '#2F54EB' },
  { id: 10, name: '更多', icon: 'More', color: '#999999' },
]

export const flashSaleProducts = [
  {
    id: 101,
    name: '无线蓝牙耳机 降噪运动半入耳式超长续航',
    price: 59.9,
    originalPrice: 199,
    image: IMG.earbuds,
    sold: 8562,
  },
  {
    id: 102,
    name: '夏季薄款纯棉T恤男女宽松圆领短袖',
    price: 29.9,
    originalPrice: 99,
    image: IMG.tshirt,
    sold: 12340,
  },
  {
    id: 103,
    name: '家用智能扫地机器人全自动吸尘拖地',
    price: 399,
    originalPrice: 1299,
    image: IMG.robot,
    sold: 3456,
  },
  {
    id: 104,
    name: '304不锈钢保温杯大容量男女便携水杯',
    price: 39.9,
    originalPrice: 128,
    image: IMG.bottle,
    sold: 6789,
  },
]

export const products = [
  {
    id: 1,
    name: '日式简约实木餐桌北欧原木色饭桌小户型',
    price: 1299,
    originalPrice: 2599,
    image: IMG.table,
    sold: 3562,
    tag: '天猫',
    shop: '源氏木语旗舰店',
    location: '上海',
    promoTags: ['包邮'],
  },
  {
    id: 2,
    name: '2025新款轻薄笔记本电脑14英寸商务办公',
    price: 3999,
    originalPrice: 5299,
    image: IMG.laptop,
    sold: 8921,
    tag: '天猫',
    shop: '联想官方旗舰店',
    location: '北京',
    promoTags: ['超级立减50%'],
  },
  {
    id: 3,
    name: '夏季新款女士碎花连衣裙法式复古气质',
    price: 159,
    originalPrice: 399,
    image: IMG.dress,
    sold: 15623,
    tag: '淘宝',
    shop: '气质女装店',
    location: '杭州',
    promoTags: ['退货宝', '包邮'],
  },
  {
    id: 4,
    name: '婴儿纯棉连体衣春夏新生儿爬服哈衣',
    price: 49.9,
    originalPrice: 128,
    image: IMG.baby,
    sold: 9876,
    tag: '天猫',
    shop: '巴拉巴拉旗舰店',
    location: '宁波',
    promoTags: [],
  },
  {
    id: 5,
    name: '智能手表运动健康监测心率血氧NFC',
    price: 899,
    originalPrice: 1499,
    image: IMG.watch,
    sold: 4567,
    tag: '天猫',
    shop: '华为官方旗舰店',
    location: '深圳',
    promoTags: ['键盘热销榜第二名'],
  },
  {
    id: 6,
    name: '北欧简约布艺沙发小户型客厅可拆洗',
    price: 2399,
    originalPrice: 4599,
    image: IMG.sofa,
    sold: 2345,
    tag: '淘宝',
    shop: '全友家居',
    location: '成都',
    promoTags: ['包邮', '退货宝'],
  },
  {
    id: 7,
    name: '有机坚果混合装每日坚果零食大礼包',
    price: 69.9,
    originalPrice: 139,
    image: IMG.nuts,
    sold: 34521,
    tag: '天猫',
    shop: '三只松鼠旗舰店',
    location: '芜湖',
    promoTags: ['超级立减50%'],
  },
  {
    id: 8,
    name: '运动鞋男透气网面跑步鞋轻便休闲',
    price: 199,
    originalPrice: 499,
    image: IMG.shoes,
    sold: 7890,
    tag: '淘宝',
    shop: '运动前线',
    location: '泉州',
    promoTags: [],
  },
  {
    id: 9,
    name: '全自动胶囊咖啡机意式小型家用',
    price: 599,
    originalPrice: 1299,
    image: IMG.coffee,
    sold: 1234,
    tag: '天猫',
    shop: 'Nespresso旗舰店',
    location: '上海',
    promoTags: ['包邮'],
  },
  {
    id: 10,
    name: '儿童益智积木拼装玩具男孩女孩通用',
    price: 89,
    originalPrice: 199,
    image: IMG.blocks,
    sold: 18923,
    tag: '天猫',
    shop: '乐高官方旗舰店',
    location: '嘉兴',
    promoTags: ['退货宝'],
  },
  {
    id: 11,
    name: '真皮男士钱包短款牛皮商务折叠钱夹',
    price: 129,
    originalPrice: 399,
    image: IMG.wallet,
    sold: 5678,
    tag: '淘宝',
    shop: '皮具世家',
    location: '广州',
    promoTags: [],
  },
  {
    id: 12,
    name: '大容量旅行箱万向轮行李箱20/24寸',
    price: 259,
    originalPrice: 599,
    image: IMG.luggage,
    sold: 9012,
    tag: '天猫',
    shop: '外交官旗舰店',
    location: '上海',
    promoTags: ['包邮', '超级立减50%'],
  },
]

export const productDetail = {
  id: 1,
  name: '日式简约实木餐桌北欧原木色饭桌小户型1.3m/1.5m',
  brand: '源氏木语',
  price: 1299,
  originalPrice: 2599,
  discount: '-50%',
  sold: 3562,
  rating: 4.9,
  reviewCount: 300,
  goodRate: '100%',
  images: [
    px(6394655, 600, 600),
    px(2092058, 600, 600),
    px(35833817, 600, 600),
    px(7518979, 600, 600),
    px(6934271, 600, 600),
  ],
  colors: [
    { name: '原木色', image: px(7599715, 50, 50), hot: true },
    { name: '胡桃色', image: px(36081877, 50, 50), hot: false },
    { name: '白色', image: px(4073920, 50, 50), hot: false },
    { name: '黑色', image: px(1250283, 50, 50), hot: false },
  ],
  sizes: ['1.3m', '1.5m', '1.8m'],
  services: ['48小时发货', '预计后天送达', '快递免运费', '大促价保', '7天无理由退货', '极速退款'],
  shop: {
    name: '源氏木语旗舰店',
    rating: 4.9,
    goodRate: '98%',
    shipTime: '24小时',
    responseTime: '<30秒',
  },
  params: [
    { label: '产地', value: '中国' },
    { label: '品牌', value: '源氏木语' },
    { label: '材质', value: '橡木' },
    { label: '货号', value: 'YJ-2025-001' },
    { label: '颜色分类', value: '原木色/胡桃色/白色/黑色' },
    { label: '适用场景', value: '餐厅/厨房' },
    { label: '是否可定制', value: '否' },
    { label: '是否组装', value: '是' },
  ],
  reviewTags: [
    { label: '全部', count: 300 },
    { label: '图/视频', count: 156 },
    { label: '追评', count: 42 },
    { label: '物流很快', count: 28 },
    { label: '质量不错', count: 19 },
    { label: '舒适', count: 15 },
  ],
  styleOptions: [
    { label: '原木色 / 1.3m', value: '原木色 / 1.3m', image: px(7599715, 50, 50), tag: '热销' },
    { label: '原木色 / 1.5m', value: '原木色 / 1.5m', image: px(7599715, 50, 50) },
    { label: '胡桃色 / 1.3m', value: '胡桃色 / 1.3m', image: px(36081877, 50, 50), disabled: true },
    { label: '胡桃色 / 1.5m', value: '胡桃色 / 1.5m', image: px(36081877, 50, 50) },
    { label: '白色 / 1.3m', value: '白色 / 1.3m', image: px(4073920, 50, 50) },
  ],
  reviews: [
    {
      id: 1,
      user: '小***花',
      avatar: px(20867012, 60, 60),
      date: '2025-04-15',
      rating: 5,
      spec: '原木色 / 1.3m',
      level: 2,
      content:
        '桌子质量非常好，实木的很有质感，安装也很简单，一个人就能搞定。颜色和图片一样，原木色很温馨，放在小户型餐厅刚好合适。',
      images: [px(6394655, 200, 200), px(2092058, 200, 200)],
      tags: ['质量不错', '舒适'],
      replyCount: 0,
      likeCount: 12,
      isLiked: false,
    },
    {
      id: 2,
      user: '家***居',
      avatar: px(38165069, 60, 60),
      date: '2025-04-12',
      rating: 5,
      spec: '原木色 / 1.5m',
      level: 4,
      content:
        '第二次购买了，之前买过1.3m的，这次给父母家买1.5m的。质量一如既往的好，物流也很快，两天就到了。',
      images: [px(35833817, 200, 200)],
      tags: ['物流很快', '舒适'],
      replyCount: 1,
      likeCount: 8,
      isLiked: false,
      append: {
        content: '用了一段时间再来追评，桌面没有划痕，很耐用，父母也很满意。',
        images: [px(7518979, 200, 200)],
      },
    },
    {
      id: 3,
      user: '木***匠',
      avatar: px(5511504, 60, 60),
      date: '2025-04-08',
      rating: 5,
      spec: '原木色 / 1.3m',
      level: 5,
      content: '性价比很高，同品质的在其他店要贵一倍。做工精细，没有毛刺，很满意！',
      images: [],
      tags: ['质量不错'],
      replyCount: 0,
      likeCount: 3,
      isLiked: false,
    },
    {
      id: 4,
      user: '阳***明',
      avatar: px(30641142, 60, 60),
      date: '2025-04-05',
      rating: 5,
      spec: '白色 / 1.3m',
      level: 2,
      content: '白色很百搭，和家里的装修风格很配。物流师傅帮忙送到楼上，服务很好。',
      images: [px(6934271, 200, 200), px(1872885, 200, 200), px(6394655, 200, 200)],
      tags: ['物流很快'],
      replyCount: 2,
      likeCount: 15,
      isLiked: true,
    },
    {
      id: 5,
      user: '夜***辰',
      avatar: px(38478218, 60, 60),
      date: '2025-04-01',
      rating: 5,
      spec: '原木色 / 1.5m',
      level: 4,
      content: '确实很不错，实木餐桌质感很好，朋友来家里都问链接。推荐购买！',
      images: [],
      tags: ['质量不错'],
      replyCount: 0,
      likeCount: 6,
      isLiked: false,
    },
  ],
}

// ===== 商品详情动态生成 =====
// 根据路由传入的商品 ID 生成对应的专属详情（画廊/参数/色系/尺寸/评价均按品类差异化），
// 确保不同商品点击后展示各自独立的详情内容。
const CATEGORY_OF = {
  1: 'home', // 实木餐桌
  2: 'digital', // 笔记本电脑
  3: 'fashion', // 连衣裙
  4: 'fashion', // 婴儿连体衣
  5: 'digital', // 智能手表
  6: 'home', // 布艺沙发
  7: 'food', // 每日坚果
  8: 'fashion', // 运动鞋
  9: 'digital', // 咖啡机
  10: 'toy', // 积木玩具
  11: 'travel', // 真皮钱包
  12: 'travel', // 旅行箱
  101: 'digital', // 蓝牙耳机
  102: 'fashion', // 纯棉T恤
  103: 'digital', // 扫地机器人
  104: 'food', // 保温杯
}

const CATEGORY_CONFIG = {
  home: {
    gallery: [6394655, 2092058, 35833817, 7518979, 6934271],
    material: '橡木/布艺',
    scene: '客厅/餐厅/卧室',
    colors: ['原木色', '胡桃色', '白色', '黑色'],
    sizes: ['1.3m', '1.5m', '1.8m'],
    tags: ['物流很快', '质量不错', '舒适'],
  },
  digital: {
    gallery: [10655906, 9986410, 8566426, 16303233, 13007642],
    material: '铝合金/工程塑料',
    scene: '办公/居家',
    colors: ['曜石黑', '珍珠白', '经典银'],
    sizes: ['标准版', 'Pro版', '旗舰版'],
    tags: ['物流很快', '性能强劲', '性价比高'],
  },
  fashion: {
    gallery: [35747131, 36409245, 11324527, 18257675, 37904241],
    material: '棉麻/聚酯纤维',
    scene: '日常/通勤/聚会',
    colors: ['经典黑', '象牙白', '雾霾蓝'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['物流很快', '版型好', '面料舒适'],
  },
  food: {
    gallery: [30308595, 7507939, 30308595, 7507939, 30308595],
    material: '原产地直采',
    scene: '零食/送礼/下午茶',
    colors: ['经典装', '礼盒装'],
    sizes: ['750g装', '1kg装'],
    tags: ['物流很快', '口感好', '日期新鲜'],
  },
  toy: {
    gallery: [7301356, 37904241, 7301356, 7301356, 37904241],
    material: 'ABS 环保塑料',
    scene: '儿童房/亲子互动',
    colors: ['经典款', '进阶款'],
    sizes: ['标准款', '进阶款'],
    tags: ['物流很快', '益智有趣', '做工安全'],
  },
  travel: {
    gallery: [34629932, 7085799, 34629932, 7085799, 34629932],
    material: 'PC/ABS 复合材质',
    scene: '差旅/度假/学生',
    colors: ['曜石黑', '商务灰', '典雅红'],
    sizes: ['20寸', '24寸', '28寸'],
    tags: ['物流很快', '轮子顺滑', '结实耐用'],
  },
}

// 家居品类专属的实木色卡（木质纹理图）
const HOME_SWATCH = { 原木色: 7599715, 胡桃色: 36081877, 白色: 4073920, 黑色: 1250283 }

// 从商品主图 URL 中提取 Pexels 图片 ID，用于生成同源色卡缩略图
function imgIdFromUrl(url) {
  const m = String(url).match(/photos\/(\d+)/)
  return m ? Number(m[1]) : 6394655
}

const REVIEW_USERS = [
  { user: '小***花', avatar: 20867012 },
  { user: '家***居', avatar: 38165069 },
  { user: '阳***明', avatar: 30641142 },
  { user: '木***匠', avatar: 5511504 },
  { user: '夜***辰', avatar: 38478218 },
]

const REVIEW_TEMPLATES = [
  '实物和图片完全一致，{name}做工扎实，细节处理到位，用起来很顺手，家人非常满意，值得回购！',
  '第二次购买了，之前那件用了很久都很好。这次物流依旧很快，第二天就收到了，品质有保障。',
  '性价比很高，同等品质里价格很有优势。{name}没有瑕疵，和描述完全一致，五星好评。',
  '商品很满意，规格尺寸都很准，客服回复及时，整体购物体验很好，会继续关注店铺上新。',
  '包装严实，收到货完好无损。{name}比想象中还要好，朋友看到都问链接，推荐入手。',
]

// 根据商品 ID 生成对应专属详情（用于详情页动态渲染）
export function getProductDetail(id) {
  const pid = Number(id)
  const source =
    [...products, ...flashSaleProducts].find((p) => p.id === pid) || products[0]
  const catKey = CATEGORY_OF[source.id] || 'home'
  const cat = CATEGORY_CONFIG[catKey]
  const isHome = catKey === 'home'
  const brand = String(source.shop || '').replace(/(旗舰店|专营店|店)$/, '') || '品牌优选'
  const mainId = imgIdFromUrl(source.image)

  const colors = cat.colors.map((name, idx) => {
    const woodId = HOME_SWATCH[name]
    const swatch = isHome && woodId ? px(woodId, 50, 50) : px(mainId, 50, 50)
    return { name, image: swatch, hot: idx === 0 }
  })

  const images = cat.gallery.map((gid, idx) => px(idx === 0 ? mainId : gid, 600, 600))
  const reviewCount = Math.max(50, Math.round((source.sold || 100) * 0.12))
  const rating = +(4.7 + (pid % 3) * 0.1).toFixed(1)
  const colorsText = colors.map((c) => c.name).join('/')
  const defaultSpec = `${colors[0].name} / ${cat.sizes[0]}`

  const styleOptions = [
    { label: defaultSpec, value: defaultSpec, image: colors[0].image, tag: '热销' },
  ]
  colors.forEach((c, ci) => {
    cat.sizes.forEach((s, si) => {
      if (ci === 0 && si === 0) return
      styleOptions.push({
        label: `${c.name} / ${s}`,
        value: `${c.name} / ${s}`,
        image: c.image,
        disabled: ci === 1 && si === 0,
      })
    })
  })

  const reviews = REVIEW_USERS.map((ru, i) => {
    const content = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length]
      .split('{name}')
      .join(source.name)
    return {
      id: source.id * 100 + i + 1,
      user: ru.user,
      avatar: px(ru.avatar, 60, 60),
      date: `2026-08-${String(20 - i).padStart(2, '0')}`,
      rating: 5,
      spec: defaultSpec,
      level: 2 + i,
      content,
      images: i % 2 === 0 ? [px(mainId, 200, 200), px(cat.gallery[1], 200, 200)] : [],
      tags: [cat.tags[1]],
      replyCount: i,
      likeCount: 8 + i * 3,
      isLiked: false,
    }
  })

  return {
    id: source.id,
    name: source.name,
    brand,
    price: source.price,
    originalPrice: source.originalPrice || source.price,
    discount: source.originalPrice
      ? `-${Math.round((1 - source.price / source.originalPrice) * 100)}%`
      : '',
    sold: source.sold || 100,
    rating,
    reviewCount,
    goodRate: rating >= 4.9 ? '100%' : '99%',
    images,
    colors,
    sizes: cat.sizes,
    services: ['48小时发货', '预计后天送达', '快递免运费', '大促价保', '7天无理由退货', '极速退款'],
    shop: {
      name: source.shop || '品牌优选旗舰店',
      rating,
      goodRate: rating >= 4.9 ? '99%' : '98%',
      shipTime: '24小时',
      responseTime: '<30秒',
    },
    params: [
      { label: '产地', value: source.location || '中国' },
      { label: '品牌', value: brand },
      { label: '材质', value: cat.material },
      { label: '货号', value: `X-2026-${String(source.id).padStart(3, '0')}` },
      { label: '颜色分类', value: colorsText },
      { label: '适用场景', value: cat.scene },
      { label: '是否定制', value: '否' },
      { label: '是否组装', value: isHome ? '是' : '否' },
    ],
    reviewTags: [
      { label: '全部', count: reviewCount },
      { label: '图/视频', count: Math.round(reviewCount / 2) },
      { label: '追评', count: Math.round(reviewCount / 7) },
      { label: cat.tags[0], count: Math.round(reviewCount / 10) },
      { label: cat.tags[1], count: Math.round(reviewCount / 15) },
      { label: cat.tags[2], count: Math.round(reviewCount / 20) },
    ],
    styleOptions,
    reviews,
  }
}

export const cartItems = [
  {
    id: 1,
    productId: 1,
    name: '日式简约实木餐桌北欧原木色饭桌',
    spec: '原木色 / 1.3m',
    price: 1299,
    quantity: 1,
    image: px(6394655, 200, 200),
    checked: true,
  },
  {
    id: 2,
    productId: 5,
    name: '智能手表运动健康监测心率血氧NFC',
    spec: '曜石黑 / 标准版',
    price: 899,
    quantity: 1,
    image: px(13007642, 200, 200),
    checked: true,
  },
  {
    id: 3,
    productId: 7,
    name: '有机坚果混合装每日坚果零食大礼包',
    spec: '750g装',
    price: 69.9,
    quantity: 2,
    image: px(30308595, 200, 200),
    checked: true,
  },
]

export const addresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    detail: '文三路478号华星科技大厦16楼',
    isDefault: true,
  },
  {
    id: 2,
    name: '张三',
    phone: '13800138000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '张杨路500号华润时代广场',
    isDefault: false,
  },
]

export const orders = [
  {
    id: 'DD20250415001',
    status: '待收货',
    statusType: 'shipped',
    date: '2025-04-15',
    items: [
      {
        productId: 1,
        name: '日式简约实木餐桌北欧原木色饭桌',
        spec: '原木色 / 1.3m',
        price: 1299,
        quantity: 1,
        image: px(6394655, 200, 200),
      },
    ],
    total: 1299,
    freight: 0,
    discount: 0,
    address: {
      name: '张三',
      phone: '13800138000',
      detail: '浙江省杭州市西湖区文三路478号华星科技大厦16楼',
    },
    logistics: {
      company: '顺丰速运',
      no: 'SF1234567890',
      timeline: [
        { time: '2025-04-16 14:30', desc: '快件已到达【杭州西湖区营业点】', status: 'current' },
        { time: '2025-04-16 08:00', desc: '快件已从【上海转运中心】发出', status: 'done' },
        { time: '2025-04-15 20:00', desc: '快件已到达【上海转运中心】', status: 'done' },
        { time: '2025-04-15 14:00', desc: '卖家已发货', status: 'done' },
      ],
    },
  },
  {
    id: 'DD20250410002',
    status: '待评价',
    statusType: 'review',
    date: '2025-04-10',
    items: [
      {
        productId: 7,
        name: '有机坚果混合装每日坚果零食大礼包',
        spec: '750g装',
        price: 69.9,
        quantity: 2,
        image: px(30308595, 200, 200),
      },
    ],
    total: 139.8,
    freight: 0,
    discount: 20,
    address: {
      name: '张三',
      phone: '13800138000',
      detail: '浙江省杭州市西湖区文三路478号华星科技大厦16楼',
    },
  },
  {
    id: 'DD20250405003',
    status: '已完成',
    statusType: 'completed',
    date: '2025-04-05',
    items: [
      {
        productId: 5,
        name: '智能手表运动健康监测心率血氧NFC',
        spec: '曜石黑 / 标准版',
        price: 899,
        quantity: 1,
        image: px(13007642, 200, 200),
      },
    ],
    total: 899,
    freight: 0,
    discount: 100,
    address: {
      name: '张三',
      phone: '13800138000',
      detail: '浙江省杭州市西湖区文三路478号华星科技大厦16楼',
    },
  },
]

export const coupons = [
  {
    id: 1,
    amount: 50,
    condition: '满199可用',
    name: '家居品类券',
    validFrom: '2025.04.01',
    validTo: '2025.04.30',
    scope: '限家居分类商品',
    status: 'available',
    type: 'claimable',
  },
  {
    id: 2,
    amount: 30,
    condition: '满99可用',
    name: '全品类通用券',
    validFrom: '2025.04.01',
    validTo: '2025.04.30',
    scope: '全场通用',
    status: 'available',
    type: 'claimable',
  },
  {
    id: 3,
    amount: 100,
    condition: '满499可用',
    name: '数码专享券',
    validFrom: '2025.04.10',
    validTo: '2025.05.10',
    scope: '限数码分类商品',
    status: 'available',
    type: 'claimable',
  },
  {
    id: 4,
    amount: 20,
    condition: '全场通用',
    name: '新人专享券',
    validFrom: '2025.03.01',
    validTo: '2025.03.31',
    scope: '全场通用',
    status: 'expired',
    type: 'my',
  },
  {
    id: 5,
    amount: 10,
    condition: '满59可用',
    name: '食品品类券',
    validFrom: '2025.04.01',
    validTo: '2025.04.15',
    scope: '限食品分类商品',
    status: 'used',
    type: 'my',
  },
]

export const browsingHistory = [
  {
    date: '今天',
    products: [
      {
        id: 1,
        name: '日式简约实木餐桌',
        price: 1299,
        image: px(6394655, 200, 200),
      },
      {
        id: 6,
        name: '北欧简约布艺沙发',
        price: 2399,
        image: px(4172381, 200, 200),
      },
      {
        id: 9,
        name: '全自动胶囊咖啡机',
        price: 599,
        image: px(12090814, 200, 200),
      },
    ],
  },
  {
    date: '昨天',
    products: [
      {
        id: 2,
        name: '轻薄笔记本电脑14英寸',
        price: 3999,
        image: px(10655906, 200, 200),
      },
      {
        id: 5,
        name: '智能手表运动健康监测',
        price: 899,
        image: px(13007642, 200, 200),
      },
      {
        id: 7,
        name: '有机坚果混合装',
        price: 69.9,
        image: px(30308595, 200, 200),
      },
      {
        id: 8,
        name: '运动鞋男透气网面',
        price: 199,
        image: px(11324527, 200, 200),
      },
    ],
  },
  {
    date: '3天前',
    products: [
      {
        id: 3,
        name: '夏季新款女士碎花连衣裙',
        price: 159,
        image: px(35747131, 200, 200),
      },
      {
        id: 10,
        name: '儿童益智积木拼装',
        price: 89,
        image: px(7301356, 200, 200),
      },
    ],
  },
]

export const faqCategories = [
  {
    name: '购物流程',
    icon: 'ShoppingCart',
    questions: ['如何注册账号？', '如何搜索商品？', '如何下单购买？', '如何使用优惠券？'],
  },
  {
    name: '支付问题',
    icon: 'CreditCard',
    questions: ['支持哪些支付方式？', '如何申请退款？', '分期付款如何操作？'],
  },
  {
    name: '发货配送',
    icon: 'Van',
    questions: ['多久可以发货？', '如何查看物流信息？', '支持哪些配送方式？'],
  },
  {
    name: '退换货',
    icon: 'RefreshLeft',
    questions: ['如何申请退换货？', '退换货的时限是多久？', '运费谁承担？'],
  },
  {
    name: '账户安全',
    icon: 'Lock',
    questions: ['如何修改密码？', '账号被盗怎么办？', '如何绑定手机？'],
  },
  {
    name: '优惠活动',
    icon: 'Present',
    questions: ['如何参与秒杀活动？', '优惠券如何使用？', '会员有什么权益？'],
  },
]

export const userInfo = {
  name: '小明',
  avatar: px(4781155, 100, 100),
  level: '黄金会员',
  phone: '138****8888',
  redPacket: 25.5,
  couponCount: 5,
  points: 3200,
  address: '浙江省杭州市',
}

export const pendingReviews = [
  {
    id: 1,
    productId: 7,
    name: '有机坚果混合装每日坚果零食大礼包',
    spec: '750g装',
    image: px(30308595, 200, 200),
    orderId: 'DD20250410002',
  },
  {
    id: 2,
    productId: 5,
    name: '智能手表运动健康监测心率血氧NFC',
    spec: '曜石黑 / 标准版',
    image: px(13007642, 200, 200),
    orderId: 'DD20250405003',
  },
]

export const reviewedItems = [
  {
    id: 1,
    productId: 8,
    name: '运动鞋男透气网面跑步鞋轻便休闲',
    spec: '黑色 / 42码',
    image: px(11324527, 200, 200),
    rating: 5,
    content:
      '鞋子质量非常好，穿着很舒适，透气性也不错。物流很快，两天就到了，包装也很好，下次还会回购！',
    images: [px(11324527, 200, 200), px(32044925, 200, 200)],
    reviewDate: '2025-04-08',
    merchantReply: '感谢您的好评，欢迎下次光临！',
  },
  {
    id: 2,
    productId: 3,
    name: '夏季新款女士碎花连衣裙法式复古气质',
    spec: '碎花 / M码',
    image: px(35747131, 200, 200),
    rating: 4,
    content: '裙子面料很舒服，颜色和图片一样，就是稍微有点大，不过整体还是很满意的。',
    images: [px(35747129, 200, 200)],
    reviewDate: '2025-04-05',
    merchantReply: null,
  },
]

export const frequentProducts = [
  { id: 1, name: '日式简约实木餐桌', price: 1299, image: px(6394655, 200, 200) },
  { id: 7, name: '有机坚果混合装', price: 69.9, image: px(30308595, 200, 200) },
  { id: 5, name: '智能手表运动版', price: 899, image: px(13007642, 200, 200) },
  { id: 9, name: '全自动胶囊咖啡机', price: 599, image: px(12090814, 200, 200) },
  { id: 2, name: '轻薄笔记本电脑', price: 3999, image: px(10655906, 200, 200) },
  { id: 6, name: '北欧简约布艺沙发', price: 2399, image: px(4172381, 200, 200) },
  { id: 8, name: '运动鞋男透气网面', price: 199, image: px(11324527, 200, 200) },
  { id: 10, name: '儿童益智积木拼装', price: 89, image: px(7301356, 200, 200) },
]

export const favoriteProducts = [
  {
    id: 1,
    name: '日式简约实木餐桌北欧原木色饭桌小户型',
    price: 1299,
    image: px(6394655, 200, 200),
    collectCount: 97,
    status: 'normal',
  },
  {
    id: 6,
    name: '北欧简约布艺沙发小户型客厅可拆洗',
    price: 2399,
    image: px(4172381, 200, 200),
    collectCount: 56,
    status: 'normal',
  },
  {
    id: 9,
    name: '全自动胶囊咖啡机意式小型家用',
    price: 599,
    image: px(12090814, 200, 200),
    collectCount: 12,
    status: 'price-down',
  },
  {
    id: 2,
    name: '2025新款轻薄笔记本电脑14英寸商务办公',
    price: 3999,
    image: px(10655906, 200, 200),
    collectCount: 203,
    status: 'normal',
  },
  {
    id: 5,
    name: '智能手表运动健康监测心率血氧NFC',
    price: 899,
    image: px(13007642, 200, 200),
    collectCount: 78,
    status: 'price-down',
  },
  {
    id: 7,
    name: '有机坚果混合装每日坚果零食大礼包',
    price: 69.9,
    image: px(30308595, 200, 200),
    collectCount: 342,
    status: 'normal',
  },
  {
    id: 3,
    name: '夏季新款女士碎花连衣裙法式复古气质',
    price: 159,
    image: px(35747131, 200, 200),
    collectCount: 45,
    status: 'off-shelf',
  },
]

export const followedShops = [
  {
    id: 1,
    name: '源氏木语旗舰店',
    logo: px(1337380, 100, 100),
    tag: '自营',
    hasNew: true,
    hasCoupon: true,
    isSelf: true,
  },
  {
    id: 2,
    name: '华为官方旗舰店',
    logo: px(1339365, 100, 100),
    tag: '自营',
    hasNew: true,
    hasCoupon: false,
    isSelf: true,
  },
  {
    id: 3,
    name: '全友家居生活馆',
    logo: px(7661411, 100, 100),
    tag: null,
    hasNew: false,
    hasCoupon: true,
    isSelf: false,
  },
  {
    id: 4,
    name: '三只松鼠旗舰店',
    logo: px(7598007, 100, 100),
    tag: '自营',
    hasNew: true,
    hasCoupon: true,
    isSelf: true,
  },
]

export const listingCategories = [
  { id: 1, name: '床', icon: 'bed' },
  { id: 2, name: '沙发', icon: 'sofa' },
  { id: 3, name: '茶几', icon: 'table' },
  { id: 4, name: '书桌', icon: 'desk' },
  { id: 5, name: '衣柜', icon: 'wardrobe' },
  { id: 6, name: '鞋柜', icon: 'shoe' },
  { id: 7, name: '餐椅', icon: 'chair' },
  { id: 8, name: '电视柜', icon: 'tv' },
]

export const brandLogos = ['源氏木语', '全友家居', '林氏木业', '顾家家居', '宜家']

// 类目特定顶部图文筛选数据（用于 /products 顶部筛选区）
export const categoryTopFilters = [
  {
    key: 'stationery',
    keywords: ['文具', '笔', '本子', '笔记本', '红笔'],
    queryCategories: ['stationery', 'wenju'],
    label: '文具精选',
    options: [
      { id: 'notebook', name: '笔记本', image: px(6991332, 80, 80) },
      { id: 'red-pen', name: '红笔', image: px(19875635, 80, 80) },
      { id: 'blue-pen', name: '蓝笔', image: px(5264514, 80, 80) },
      { id: 'pencil', name: '铅笔', image: px(8250942, 80, 80) },
      { id: 'eraser', name: '橡皮', image: px(5705986, 80, 80) },
      { id: 'ruler', name: '尺子', image: px(5147906, 80, 80) },
      { id: 'folder', name: '文件夹', image: px(35915217, 80, 80) },
      { id: 'stapler', name: '订书机', image: px(7054761, 80, 80) },
    ],
  },
  {
    key: 'jewelry',
    keywords: ['珠宝', '首饰', '项链', '戒指', '耳环'],
    queryCategories: ['jewelry', 'zhubao'],
    label: '珠宝精选',
    options: [
      { id: 'necklace', name: '项链', image: px(25283500, 80, 80) },
      { id: 'ring', name: '戒指', image: px(33080097, 80, 80) },
      { id: 'earring', name: '耳环', image: px(33737455, 80, 80) },
      { id: 'bracelet', name: '手链', image: px(38999397, 80, 80) },
      { id: 'anklet', name: '脚链', image: px(12564238, 80, 80) },
      { id: 'brooch', name: '胸针', image: px(16262654, 80, 80) },
    ],
  },
]
