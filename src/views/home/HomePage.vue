<template>
  <div class="homepage">
    <!-- 结构1: 搜索栏（复用组件） -->
    <HomeSearchBar :show-bonus="true" />

    <!-- 结构2: 顶部频道 + 下部分三栏主体 -->
    <div class="main-layout">
      <!-- 顶部频道列表 -->
      <div class="channel-strip">
        <a
          v-for="(channel, idx) in channelList"
          :key="idx"
          class="channel-item"
          @click.prevent="navigateToProducts(channel.query)"
        >
          {{ channel.label }}
        </a>
      </div>

      <!-- 下部分三栏 -->
      <div class="screen-outer">
        <!-- 左侧：全品类分类导航 -->
        <div class="screen-left">
          <div class="category-nav">
            <div
              v-for="(cat, cIdx) in categoryList"
              :key="cIdx"
              class="category-nav__item"
              :class="{ active: activeCategory === cIdx }"
              @mouseenter="activeCategory = cIdx"
            >
              <span class="category-nav__text">{{ cat.name }}</span>
              <el-icon class="category-nav__arrow"><ArrowRight /></el-icon>
            </div>
            <transition name="submenu-fade">
              <div
                v-if="activeCategory !== null"
                class="category-submenu"
                @mouseleave="activeCategory = null"
              >
                <div
                  v-for="(sub, sIdx) in categoryList[activeCategory]?.children"
                  :key="sIdx"
                  class="submenu-row"
                >
                  <span class="submenu-title">{{ sub.title }}</span>
                  <div class="submenu-links">
                    <a
                      v-for="(link, lIdx) in sub.items"
                      :key="lIdx"
                      @click.prevent="navigateToProducts({ keyword: link })"
                    >
                      {{ link }}
                    </a>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- 中间：核心促销区域 -->
        <div class="screen-center">
          <div class="promo-area">
            <!-- 上半行：轮播图 + 百亿补贴 -->
            <div class="promo-top">
              <div class="promo-banner">
                <el-carousel height="158px" indicator-position="outside" :interval="4000">
                  <el-carousel-item v-for="(banner, bIdx) in bannerList" :key="bIdx">
                    <div class="banner-slide" :style="{ background: banner.bg }">
                      <div class="banner-content">
                        <div class="banner-tag">{{ banner.tag }}</div>
                        <h3 class="banner-title">{{ banner.title }}</h3>
                        <p class="banner-desc">{{ banner.desc }}</p>
                      </div>
                      <div class="banner-img-wrap">
                        <img :src="banner.img" alt="" class="banner-img" />
                        <span class="banner-img__badge">特惠</span>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="promo-subsidy">
                <div class="subsidy-header">
                  <span class="subsidy-header__title">百亿补贴 · 买贵必赔</span>
                  <span class="subsidy-header__tag">新人专享</span>
                </div>
                <div class="subsidy-grid">
                  <div
                    v-for="(item, idx) in subsidyProducts"
                    :key="idx"
                    class="subsidy-card"
                    @click="$router.push('/products')"
                  >
                    <img :src="item.img" alt="" class="subsidy-card__img" />
                    <div class="subsidy-card__price">
                      <span class="price-symbol">¥</span>
                      <span class="price-num">{{ item.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 下半行：特色栏目矩阵 -->
            <div class="promo-matrix">
              <div class="matrix-card matrix-card--community" @click="$router.push('/products')">
                <div class="matrix-card__header">
                  <span class="matrix-card__title">淘江湖</span>
                  <span class="matrix-card__badge">人气热帖</span>
                </div>
                <div class="matrix-card__body">
                  <p v-for="(post, idx) in communityPosts" :key="idx">{{ post }}</p>
                </div>
              </div>
              <div class="matrix-card matrix-card--live" @click="$router.push('/products')">
                <div class="matrix-card__header">
                  <span class="matrix-card__title">淘宝直播</span>
                  <span class="matrix-card__badge matrix-card__badge--red">红包雨</span>
                </div>
                <div class="matrix-card__body matrix-card__body--live">
                  <div v-for="(live, idx) in liveList" :key="idx" class="live-item">
                    <span class="live-item__badge">1.1</span>
                    <img :src="live.avatar" alt="" class="live-item__avatar" />
                    <span class="live-item__name">{{ live.name }}</span>
                  </div>
                </div>
              </div>
              <div class="matrix-card matrix-card--subsidy" @click="$router.push('/products')">
                <div class="matrix-card__header">
                  <span class="matrix-card__title">
                    <el-icon class="matrix-card__icon"><CircleCheckFilled /></el-icon>
                    国家补贴
                  </span>
                </div>
                <div class="matrix-card__body matrix-card__body--goods">
                  <img :src="subsidySingle.img" alt="" class="matrix-card__img" />
                  <div class="matrix-card__price">
                    <span class="price-symbol">¥</span>
                    <span class="price-num">{{ subsidySingle.price }}</span>
                  </div>
                </div>
              </div>
              <div class="matrix-card matrix-card--seckill" @click="$router.push('/products')">
                <div class="matrix-card__header">
                  <span class="matrix-card__title">淘宝秒杀</span>
                  <span class="matrix-card__badge matrix-card__badge--red">超低价</span>
                </div>
                <div class="matrix-card__body matrix-card__body--goods">
                  <img :src="seckillSingle.img" alt="" class="matrix-card__img" />
                  <div class="matrix-card__price">
                    <span class="price-symbol">¥</span>
                    <span class="price-num">{{ seckillSingle.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：个人中心 -->
        <div class="screen-right">
          <div class="profile-card">
            <!-- 1. 用户信息区 -->
            <div class="profile-header">
              <div class="profile-header__avatar">
                <span class="profile-header__avatar-text">淘</span>
              </div>
              <div class="profile-header__info">
                <span class="profile-header__greeting">晚上好</span>
                <div class="profile-header__actions">
                  <span @click="$router.push('/login')">注册</span>
                  <span class="profile-header__divider">|</span>
                  <span class="profile-header__open-shop" @click="$router.push('/products')">开店</span>
                </div>
              </div>
            </div>

            <!-- 2. 登录引导区 -->
            <div class="profile-login-guide">
              <h3 class="profile-login-guide__title">登录淘宝后更多精彩</h3>
              <p class="profile-login-guide__desc">嘿！更懂你的推荐，更便捷的搜索</p>
              <button class="profile-login-guide__btn" @click="$router.push('/login')">立即登录</button>
            </div>

            <!-- 3. 快捷操作区 -->
            <div class="profile-actions">
              <div
                v-for="(item, idx) in bottomEntries"
                :key="idx"
                class="profile-actions__item"
                @click="$router.push('/products')"
              >
                <el-icon :size="20"><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>

            <!-- 4. 营销活动区 -->
            <div class="profile-promo">
              <div class="profile-promo__left">
                <span class="profile-promo__title">淘金币购物抵钱用</span>
                <span class="profile-promo__desc">100金币抵1元</span>
                <button class="profile-promo__btn" @click="$router.push('/products')">立即领取</button>
              </div>
              <div class="profile-promo__coin">
                <div class="profile-promo__coin-circle">
                  <span class="profile-promo__coin-char">币</span>
                  <span class="profile-promo__coin-tag">省钱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结构3: 猜你喜欢 -->
    <div class="layer">
      <div class="recommend-header">
        <h2>为你推荐</h2>
        <router-link to="/products" class="recommend-header__more">查看全部 &gt;</router-link>
      </div>
      <div class="recommend-grid">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Goods,
  Collection,
  Shop,
  Clock,
  CircleCheckFilled,
} from '@element-plus/icons-vue'
import { products } from '@/mock/data'
import ProductCard from '@/components/common/ProductCard.vue'
import HomeSearchBar from '@/components/common/HomeSearchBar.vue'

const router = useRouter()

// ===== 频道列表 =====
const channelList = [
  { label: '司法拍卖', query: { category: 'auction' } },
  { label: '领券中心', query: { category: 'coupon' } },
  { label: '企业购', query: { category: 'enterprise' } },
  { label: '天猫', query: { category: 'tianmao' } },
  { label: '淘宝直播', query: { category: 'live' } },
  { label: '二手手机', query: { keyword: '二手手机' } },
  { label: '国家补贴', query: { category: 'subsidy' } },
  { label: '全部频道', query: {} },
]

function navigateToProducts(query = {}) {
  if (Object.keys(query).length === 0) {
    router.push('/products')
  } else {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      params.append(key, value)
    })
    router.push(`/products?${params.toString()}`)
  }
}

// ===== 分类导航 =====
const activeCategory = ref(null)
const categoryList = [
  {
    name: '电脑 / 配件 / 办公 / 文具',
    children: [
      { title: '电脑整机', items: ['轻薄本', '游戏本', '台式机', '一体机', '平板电脑'] },
      { title: '电脑配件', items: ['显示器', '显卡', '主板', 'CPU', '内存', '硬盘'] },
      { title: '办公设备', items: ['打印机', '投影仪', '碎纸机', '扫描仪', '考勤机'] },
      { title: '文具用品', items: ['笔记本', '红笔', '蓝笔', '铅笔', '橡皮', '尺子'] },
    ],
  },
  {
    name: '工业品 / 商业 / 农业 / 定制',
    children: [
      { title: '五金工具', items: ['电动工具', '手动工具', '测量工具', '劳防用品'] },
      { title: '商业办公', items: ['收银机', 'POS机', '展示架', '货架'] },
    ],
  },
  {
    name: '家电 / 手机 / 通信 / 数码',
    children: [
      { title: '手机', items: ['5G手机', '拍照手机', '游戏手机', '老人机'] },
      { title: '数码配件', items: ['耳机', '充电宝', '数据线', '手机壳', '充电器'] },
      { title: '大家电', items: ['电视', '冰箱', '洗衣机', '空调', '热水器'] },
    ],
  },
  {
    name: '家具 / 家装 / 家居 / 厨具',
    children: [
      { title: '住宅家具', items: ['沙发', '床', '床垫', '餐桌', '衣柜'] },
      { title: '家装主材', items: ['灯具', '卫浴', '五金', '涂料', '地板'] },
    ],
  },
  {
    name: '女装 / 男装 / 内衣 / 服饰',
    children: [
      { title: '女装', items: ['连衣裙', 'T恤', '衬衫', '牛仔裤', '外套'] },
      { title: '男装', items: ['休闲裤', 'POLO衫', '夹克', '西服', '卫衣'] },
    ],
  },
  {
    name: '女性 / 男性 / 运动 / 户外',
    children: [
      { title: '运动鞋服', items: ['跑步鞋', '篮球鞋', '运动T恤', '瑜伽服'] },
      { title: '户外装备', items: ['帐篷', '登山包', '冲锋衣', '垂钓用品'] },
    ],
  },
  {
    name: '汽车 / 珠宝 / 文玩 / 箱包',
    children: [
      { title: '珠宝首饰', items: ['项链', '戒指', '耳环', '手链', '脚链', '胸针'] },
      { title: '汽车用品', items: ['坐垫', '脚垫', '行车记录仪', '机油'] },
      { title: '箱包', items: ['女包', '男包', '旅行箱', '双肩包'] },
    ],
  },
  {
    name: '食品 / 鲜花 / 酒水 / 健康',
    children: [
      { title: '休闲零食', items: ['坚果', '饼干', '糖果', '巧克力'] },
      { title: '酒水', items: ['白酒', '葡萄酒', '啤酒', '洋酒'] },
      { title: '营养健康', items: ['维生素', '蛋白粉', '燕窝', '阿胶'] },
    ],
  },
]

// ===== 核心资源位 Banner =====
const bannerList = [
  {
    tag: '聚划算 × 淘宝百亿补贴',
    title: '百亿补贴\n限时加补5折起',
    desc: '精选好物超值抢购',
    bg: 'linear-gradient(135deg, #ff0036 0%, #ff5000 100%)',
    img: 'https://picsum.photos/seed/promo1/150/130',
  },
  {
    tag: '聚划算 × 淘宝百亿补贴',
    title: '超级补贴日\n爆款低至1折',
    desc: '每日精选 限量开抢',
    bg: 'linear-gradient(135deg, #ff0036 0%, #ff5000 100%)',
    img: 'https://picsum.photos/seed/promo2/150/130',
  },
  {
    tag: '聚划算 × 淘宝百亿补贴',
    title: '品牌特卖\n全场5折封顶',
    desc: '大牌好物 一价到底',
    bg: 'linear-gradient(135deg, #ff0036 0%, #ff5000 100%)',
    img: 'https://picsum.photos/seed/promo3/150/130',
  },
]

// ===== 超值补贴区 =====
const subsidyProducts = [
  { img: 'https://picsum.photos/seed/sub1/90/90', price: '412.43' },
  { img: 'https://picsum.photos/seed/sub2/90/90', price: '12.7' },
  { img: 'https://picsum.photos/seed/sub3/90/90', price: '123.85' },
  { img: 'https://picsum.photos/seed/sub4/90/90', price: '9.9' },
]

// ===== 特色栏目矩阵 =====
const communityPosts = [
  '#来波回忆杀# 一起找寻你和淘宝的珍贵记忆',
  '#前辈请赐教# 一起聊聊生意经吧！',
]
const liveList = [
  { name: '朴素眼镜线上2', avatar: 'https://picsum.photos/seed/live1/100/100' },
  { name: '清清眼镜', avatar: 'https://picsum.photos/seed/live2/100/100' },
]
const subsidySingle = { img: 'https://picsum.photos/seed/guobu/140/100', price: '6374.15' }
const seckillSingle = { img: 'https://picsum.photos/seed/miaosha/140/100', price: '57.1' }

// ===== 个人中心 =====
const bottomEntries = [
  { label: '已买到', icon: Goods },
  { label: '收藏夹', icon: Collection },
  { label: '买过的店', icon: Shop },
  { label: '足迹', icon: Clock },
]

onMounted(() => {
  // 可在此添加首页初始化逻辑
})
</script>

<style scoped>
/* ===== 主体布局 ===== */
.main-layout {
  width: 100%;
  max-width: 1524px;
  margin: 0 auto;
  padding: 0 16px 16px;
  container-type: inline-size;
}

/* 顶部频道列表 */
.channel-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.channel-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 8px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  border-radius: 18px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.channel-item:hover {
  color: #ff5000;
  background: #fff0e8;
}

/* 下部分三栏 */
.screen-outer {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.screen-left {
  width: clamp(200px, 15.748cqi, 240px);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.screen-center {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.screen-right {
  width: 256px;
  flex-shrink: 0;
}

/* 左侧分类导航 */
.category-nav {
  width: 100%;
  height: 100%;
  min-height: 280px;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 10px 0;
  position: relative;
  box-sizing: border-box;
}

.category-nav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 36px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.15s ease;
}

.category-nav__item:hover,
.category-nav__item.active {
  background: #fff;
  color: #ff5000;
}

.category-nav__arrow {
  font-size: 12px;
  color: #999;
}

.category-nav__item.active .category-nav__arrow {
  color: #ff5000;
}

/* 二级菜单 */
.category-submenu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 540px;
  min-height: 320px;
  background: #fff;
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.08);
  padding: 16px 20px;
  z-index: 101;
}

.submenu-row {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}

.submenu-title {
  width: 70px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: #333;
  line-height: 1.6;
}

.submenu-links {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.submenu-links a {
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: color 0.15s ease;
}

.submenu-links a:hover {
  color: #ff5000;
}

.submenu-fade-enter-active,
.submenu-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.submenu-fade-enter-from,
.submenu-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* 中间促销区域 */
.promo-area {
  --promo-red: #ff0036;
  --promo-orange: #ff8f00;
  --promo-green: #00c853;
  --promo-bg: #fff;
  --module-bg: #f7f7f7;
  --price-grad: linear-gradient(90deg, #ff5000 0%, #ff8f00 100%);
  --red-grad: linear-gradient(135deg, #ff0036 0%, #ff5000 100%);
  --promo-min-scale: 0.83;
  --promo-ref-w: 9.64;

  width: 100%;
  max-width: 980px;
  aspect-ratio: 980 / 332;
  flex-shrink: 0;
  background: var(--promo-bg);
  border-radius: 12px;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  container-type: inline-size;
  box-sizing: border-box;
}

.promo-top {
  display: flex;
  gap: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px);
  margin-bottom: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
}

/* 左侧轮播图模块 */
.promo-banner {
  width: clamp(calc(482 * 0.83px), calc(482 * 1cqi / 9.64), 482px);
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px);
  flex-shrink: 0;
  border-radius: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  overflow: hidden;
}

.promo-banner :deep(.el-carousel__container) {
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px) !important;
}

.banner-slide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 clamp(calc(20 * 0.83px), calc(20 * 1cqi / 9.64), 20px);
  color: #fff;
}

.banner-content {
  flex: 1;
  min-width: 0;
}

.banner-tag {
  display: inline-flex;
  align-items: center;
  font-size: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  margin-bottom: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  opacity: 0.95;
}

.banner-title {
  font-size: clamp(calc(22 * 0.83px), calc(22 * 1cqi / 9.64), 22px);
  font-weight: 800;
  margin: 0 0 clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  line-height: 1.15;
  white-space: pre-line;
}

.banner-desc {
  font-size: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  opacity: 0.9;
  margin: 0;
}

.banner-img-wrap {
  position: relative;
  flex-shrink: 0;
  margin-left: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
}

.banner-img {
  width: clamp(calc(130 * 0.83px), calc(130 * 1cqi / 9.64), 130px);
  height: clamp(calc(130 * 0.83px), calc(130 * 1cqi / 9.64), 130px);
  object-fit: cover;
  border-radius: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
}

.banner-img__badge {
  position: absolute;
  top: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  right: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  width: clamp(calc(38 * 0.83px), calc(38 * 1cqi / 9.64), 38px);
  height: clamp(calc(38 * 0.83px), calc(38 * 1cqi / 9.64), 38px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ffb6c1, #ff8a65);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 轮播指示点：当前白色长条，其余白色圆点 */
.promo-banner :deep(.el-carousel__indicators--outside) {
  bottom: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
}

.promo-banner :deep(.el-carousel__indicator) {
  padding: 0 clamp(calc(3 * 0.83px), calc(3 * 1cqi / 9.64), 3px);
}

.promo-banner :deep(.el-carousel__indicator .el-carousel__button) {
  width: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  height: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  border-radius: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transition: all 0.25s ease;
}

.promo-banner :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  width: clamp(calc(18 * 0.83px), calc(18 * 1cqi / 9.64), 18px);
  background: #fff;
}

/* 右侧百亿补贴模块 */
.promo-subsidy {
  flex: 1;
  min-width: 0;
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px);
  background: var(--module-bg);
  border-radius: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  padding: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px)
    clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
}

.subsidy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
}

.subsidy-header__title {
  font-size: clamp(calc(14 * 0.83px), calc(14 * 1cqi / 9.64), 14px);
  font-weight: 800;
  color: #333;
}

.subsidy-header__tag {
  font-size: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  font-weight: 700;
  color: #fff;
  background: var(--promo-red);
  padding: clamp(calc(2 * 0.83px), calc(2 * 1cqi / 9.64), 2px)
    clamp(calc(5 * 0.83px), calc(5 * 1cqi / 9.64), 5px);
  border-radius: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
}

.subsidy-grid {
  display: flex;
  justify-content: space-between;
  gap: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
}

.subsidy-card {
  flex: 1;
  min-width: 0;
  text-align: center;
  cursor: pointer;
}

.subsidy-card__img {
  width: clamp(calc(80 * 0.83px), calc(80 * 1cqi / 9.64), 80px);
  height: clamp(calc(80 * 0.83px), calc(80 * 1cqi / 9.64), 80px);
  object-fit: cover;
  border-radius: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  margin: 0 auto clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
}

.subsidy-card__price {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: clamp(calc(2 * 0.83px), calc(2 * 1cqi / 9.64), 2px)
    clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  background: var(--price-grad);
  border-radius: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.subsidy-card__price .price-symbol {
  font-size: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
}

.subsidy-card__price .price-num {
  font-size: clamp(calc(13 * 0.83px), calc(13 * 1cqi / 9.64), 13px);
}

.price-symbol {
  font-size: clamp(calc(11 * 0.83px), calc(11 * 1cqi / 9.64), 11px);
}

.price-num {
  font-size: clamp(calc(16 * 0.83px), calc(16 * 1cqi / 9.64), 16px);
}

/* 特色栏目矩阵 */
.promo-matrix {
  display: flex;
  gap: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px);
}

.matrix-card {
  flex: 1;
  min-width: 0;
  height: clamp(calc(158 * 0.83px), calc(158 * 1cqi / 9.64), 158px);
  background: var(--module-bg);
  border-radius: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  padding: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  cursor: pointer;
  transition: box-shadow 0.15s ease;
  overflow: hidden;
  position: relative;
}

.matrix-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.matrix-card__header {
  display: flex;
  align-items: center;
  gap: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  margin-bottom: clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
}

.matrix-card__title {
  display: inline-flex;
  align-items: center;
  gap: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  font-size: clamp(calc(14 * 0.83px), calc(14 * 1cqi / 9.64), 14px);
  font-weight: 800;
  color: #333;
}

.matrix-card__icon {
  color: var(--promo-green);
  font-size: clamp(calc(14 * 0.83px), calc(14 * 1cqi / 9.64), 14px);
}

.matrix-card--subsidy .matrix-card__title {
  color: var(--promo-green);
}

.matrix-card__badge {
  font-size: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  color: var(--promo-orange);
  background: #fff0e0;
  padding: clamp(calc(1 * 0.83px), calc(1 * 1cqi / 9.64), 1px)
    clamp(calc(5 * 0.83px), calc(5 * 1cqi / 9.64), 5px);
  border-radius: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
}

.matrix-card__badge--red {
  color: #fff;
  background: var(--promo-red);
}

.matrix-card__badge--green {
  color: #fff;
  background: var(--promo-green);
}

.matrix-card__badge--orange {
  color: #fff;
  background: var(--promo-orange);
}

.matrix-card__body {
  font-size: clamp(calc(12 * 0.83px), calc(12 * 1cqi / 9.64), 12px);
  color: #666;
  line-height: 1.6;
}

.matrix-card__body--live {
  display: flex;
  gap: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
}

.live-item {
  position: relative;
  flex: 1;
  min-width: 0;
  border-radius: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  overflow: hidden;
}

.live-item__avatar {
  width: 100%;
  height: clamp(calc(80 * 0.83px), calc(80 * 1cqi / 9.64), 80px);
  object-fit: cover;
  border-radius: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
}

.live-item__badge {
  position: absolute;
  top: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  left: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  padding: clamp(calc(1 * 0.83px), calc(1 * 1cqi / 9.64), 1px)
    clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  font-size: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  font-weight: 700;
  color: #fff;
  background: var(--promo-red);
  border-radius: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px);
  z-index: 1;
}

.live-item__name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(calc(4 * 0.83px), calc(4 * 1cqi / 9.64), 4px)
    clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  font-size: clamp(calc(11 * 0.83px), calc(11 * 1cqi / 9.64), 11px);
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 0 0 clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px)
    clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matrix-card__body--goods {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - clamp(calc(26 * 0.83px), calc(26 * 1cqi / 9.64), 26px));
}

.matrix-card__img {
  width: clamp(calc(110 * 0.83px), calc(110 * 1cqi / 9.64), 110px);
  height: clamp(calc(80 * 0.83px), calc(80 * 1cqi / 9.64), 80px);
  object-fit: cover;
  border-radius: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
}

.matrix-card__price {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  margin-top: clamp(calc(6 * 0.83px), calc(6 * 1cqi / 9.64), 6px);
  padding: clamp(calc(2 * 0.83px), calc(2 * 1cqi / 9.64), 2px)
    clamp(calc(8 * 0.83px), calc(8 * 1cqi / 9.64), 8px);
  background: var(--price-grad);
  border-radius: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.matrix-card__price .price-symbol {
  font-size: clamp(calc(10 * 0.83px), calc(10 * 1cqi / 9.64), 10px);
}

.matrix-card__price .price-num {
  font-size: clamp(calc(13 * 0.83px), calc(13 * 1cqi / 9.64), 13px);
}

/* 右侧个人中心 */
.profile-card {
  width: 100%;
  height: 100%;
  min-height: 310px;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px 12px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 1. 用户信息区 */
.profile-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
}

.profile-header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ff5000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-header__avatar-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.profile-header__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-header__greeting {
  font-size: 16px;
  font-weight: 800;
  color: #222;
  line-height: 1.2;
}

.profile-header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #999;
}

.profile-header__actions span {
  cursor: pointer;
  transition: color 0.15s ease;
}

.profile-header__actions span:hover {
  color: #ff5000;
}

.profile-header__open-shop {
  color: #ff5000 !important;
}

.profile-header__divider {
  color: #e0e0e0;
  cursor: default !important;
}

/* 2. 登录引导区 */
.profile-login-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #e8e8e8;
}

.profile-login-guide__title {
  font-size: 14px;
  font-weight: 700;
  color: #222;
  margin: 0 0 6px;
  line-height: 1.3;
}

.profile-login-guide__desc {
  font-size: 11px;
  color: #999;
  margin: 0 0 12px;
  line-height: 1.4;
}

.profile-login-guide__btn {
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 18px;
  background: #ff5000;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.profile-login-guide__btn:hover {
  background: #e64500;
}

/* 3. 快捷操作区 */
.profile-actions {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #e8e8e8;
}

.profile-actions__item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  padding: 4px 2px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.profile-actions__item:hover {
  background: rgba(255, 80, 0, 0.06);
}

.profile-actions__item .el-icon {
  color: #333;
}

.profile-actions__item span {
  font-size: 10px;
  color: #666;
}

/* 4. 营销活动区 */
.profile-promo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
}

.profile-promo__left {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.profile-promo__title {
  font-size: 12px;
  font-weight: 700;
  color: #222;
}

.profile-promo__desc {
  font-size: 10px;
  color: #999;
}

.profile-promo__btn {
  margin-top: 4px;
  width: fit-content;
  border: none;
  border-radius: 10px;
  background: #ff5000;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.profile-promo__btn:hover {
  background: #e64500;
}

.profile-promo__coin {
  flex-shrink: 0;
  margin-left: 12px;
}

.profile-promo__coin-circle {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffaa00, #ffcc00);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-promo__coin-char {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}

.profile-promo__coin-tag {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 1px 4px;
  background: #ff0036;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 4px;
  line-height: 1.3;
}

/* ===== 为你推荐 ===== */
.recommend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.recommend-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.recommend-header__more {
  font-size: 13px;
  color: #999;
  transition: color 0.15s ease;
}

.recommend-header__more:hover {
  color: var(--color-primary);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

@media (max-width: 1280px) {
  .recommend-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* 1024px ~ 1279px：隐藏左侧分类导航，适配中小桌面 */
@media (max-width: 1279px) {
  .screen-left {
    display: none;
  }
}

/* 768px ~ 1023px：三栏改为上下布局，右侧个人中心自适应 */
@media (max-width: 1023px) {
  .screen-outer {
    flex-direction: column;
    align-items: stretch;
  }
  .screen-center {
    width: 100%;
  }
  .screen-right {
    width: 100%;
  }
  .category-nav {
    height: auto;
  }
  .profile-card {
    height: auto;
    min-height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 12px;
    gap: 0;
  }
  .profile-header {
    flex: 0 0 100%;
    height: auto;
  }
  .profile-login-guide {
    flex: 0 0 100%;
  }
  .profile-actions {
    flex: 0 0 100%;
  }
  .profile-actions__item {
    height: auto;
  }
  .profile-promo {
    flex: 0 0 100%;
  }
  .promo-area {
    max-width: 100%;
  }
}

/* ≤768px：移动端适配 */
@media (max-width: 767px) {
  .main-layout {
    padding: 0 8px 8px;
  }
  .channel-strip {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 4px;
    padding: 8px 0;
    scrollbar-width: none;
  }
  .channel-strip::-webkit-scrollbar {
    display: none;
  }
  .channel-item {
    flex: 0 0 auto;
    font-size: 13px;
    padding: 0 12px;
    height: 32px;
  }
  .promo-area {
    padding: 0 4px;
  }
  .promo-top {
    flex-direction: column;
    height: auto;
  }
  .promo-banner {
    width: 100%;
    height: auto;
  }
  .promo-banner :deep(.el-carousel__container) {
    height: 180px !important;
  }
  .promo-subsidy {
    height: auto;
    padding: 8px;
  }
  .subsidy-card__img {
    width: 60px;
    height: 60px;
  }
  .promo-matrix {
    flex-wrap: wrap;
    height: auto;
  }
  .matrix-card {
    flex: 1 1 calc(50% - 4px);
    min-width: 0;
    height: auto;
    min-height: 120px;
  }
  .profile-card {
    padding: 10px;
  }
  .profile-header {
    height: auto;
  }
  .profile-actions__item {
    padding: 2px;
    height: auto;
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* ≤375px：极小屏适配 */
@media (max-width: 375px) {
  .channel-item {
    font-size: 11px;
    padding: 0 8px;
    height: 28px;
  }
  .promo-banner :deep(.el-carousel__container) {
    height: 140px !important;
  }
  .subsidy-card__img {
    width: 48px;
    height: 48px;
  }
  .profile-card {
    padding: 8px;
  }
  .profile-actions__item {
    padding: 1px;
    gap: 3px;
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
}

/* ===== 响应式 ===== */
/* 主体布局在 1280px~1524px 通过 clamp/container query 实现等比缩放；
   小于 1280px 时通过媒体查询逐级适配。 */
</style>
