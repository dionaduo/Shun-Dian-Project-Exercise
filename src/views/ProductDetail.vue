<template>
  <div class="product-detail-page">
    <Header />

    <div class="container" v-if="product">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span> > </span>
        <router-link :to="`/category/${product.topCatId}`">{{ product.topCatName || '商品分类' }}</router-link>
        <span> > </span>
        <span class="current">{{ product.goodsName }}</span>
      </div>

      <!-- 商品详情主体 -->
      <div class="product-detail">
        <!-- 商品图片展示区（带放大镜） -->
        <div class="product-images">
          <div class="main-image-container">
            <div
                class="main-image"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
                ref="mainImageRef"
            >
              <img
                  :src="currentImage"
                  :alt="product.goodsName"
                  @error="handleImageError"
                  ref="imageRef"
              />
              <!-- 放大镜遮罩 -->
              <div
                  class="magnifier"
                  v-show="showMagnifier"
                  :style="magnifierStyle"
              ></div>
            </div>

            <!-- 放大后的图片 -->
            <div
                class="magnified-image"
                v-show="showMagnifier"
                ref="magnifiedImageRef"
            >
              <img
                  :src="currentImage"
                  :alt="product.goodsName"
                  :style="magnifiedImageStyle"
              />
            </div>

            <!-- 视频标识 -->
            <div class="video-tag" v-if="product.videoUrl">
              <span>▶ 商品视频</span>
            </div>
          </div>

          <!-- 缩略图列表（悬停切换） -->
          <div class="thumbnail-images" v-if="product.picList && product.picList.length > 1">
            <img
                v-for="(img, index) in product.picList"
                :key="img.id || index"
                :src="img.picUrl"
                :class="{ active: currentImageIndex === index }"
                @mouseenter="switchImage(index)"
                @error="$event.target.src = 'https://via.placeholder.com/80x80/cccccc/666666?text=图片'"
            />
          </div>
        </div>

        <!-- 商品信息区 -->
        <div class="product-info">
          <h1 class="product-title">{{ product.goodsName }}</h1>

          <!-- 价格区域 -->
          <div class="product-price">
            <div class="current-price">
              <span class="label">售价</span>
              <span class="price">¥{{ formatPrice(product.price) }}</span>
            </div>
            <div class="market-price" v-if="product.goodsMktprice && product.goodsMktprice > product.price">
              <span class="label">市场价</span>
              <span class="price">¥{{ formatPrice(product.goodsMktprice) }}</span>
            </div>
          </div>

          <!-- 促销信息 -->
          <div class="promotion-info" v-if="product.pmList && product.pmList.length > 0">
            <div class="promotion-item" v-for="(pm, index) in product.pmList" :key="index">
              <span class="promotion-tag">{{ pm.pmTag || '促销' }}</span>
              <span class="promotion-desc">{{ pm.pmInfo || pm.specName }}</span>
              <span class="promotion-time" v-if="pm.endDate">至 {{ pm.endDate }}</span>
            </div>
          </div>

          <!-- 商品元信息 -->
          <div class="product-meta">
            <div class="meta-item">
              <span class="label">商品编号：</span>
              <span class="value">{{ product.serialNumber || product.bn }}</span>
            </div>
            <div class="meta-item">
              <span class="label">库存：</span>
              <span class="value" :class="{ 'out-of-stock': product.stock <= 0 }">
                {{ product.stock > 0 ? `${product.stock}件` : '缺货' }}
              </span>
            </div>
            <div class="meta-item" v-if="product.totalBuyCount">
              <span class="label">累计购买：</span>
              <span class="value">{{ product.totalBuyCount }}件</span>
            </div>
            <div class="meta-item" v-if="product.cellectCount !== undefined">
              <span class="label">收藏：</span>
              <span class="value">{{ product.cellectCount }}人</span>
            </div>
          </div>

          <!-- 配送信息 -->
          <div class="delivery-info">
            <div class="delivery-item">
              <span class="label">运费：</span>
              <span class="value">{{ freightAmount > 0 ? `¥${freightAmount}` : '免运费' }}</span>
            </div>
            <div class="delivery-item" v-if="inHourShop">
              <span class="label">配送：</span>
              <span class="value tag">小时达</span>
            </div>
          </div>

          <!-- 商品简介 -->
          <div class="product-description" v-if="product.description">
            <p class="description-text">{{ product.description }}</p>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-selector">
            <span class="label">数量：</span>
            <div class="counter">
              <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1 || product.stock <= 0"
              >-</button>
              <input
                  type="number"
                  v-model.number="quantity"
                  min="1"
                  :max="product.stock"
                  :disabled="product.stock <= 0"
              />
              <button
                  @click="increaseQuantity"
                  :disabled="quantity >= product.stock || product.stock <= 0"
              >+</button>
            </div>
            <span class="stock-info" v-if="product.stock > 0">库存{{ product.stock }}件</span>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button
                class="add-to-cart-btn"
                @click="handleAddToCart"
                :disabled="product.stock <= 0 || isAddingToCart"
            >
              <span v-if="isAddingToCart">添加中...</span>
              <span v-else>加入购物车</span>
            </button>
            <button
                class="buy-now-btn"
                @click="handleBuyNow"
                :disabled="product.stock <= 0 || isBuyingNow"
            >
              <span v-if="isBuyingNow">处理中...</span>
              <span v-else>立即购买</span>
            </button>
          </div>

          <!-- 服务承诺 -->
          <div class="service-promise" v-if="product.serviceIntro">
            <div class="service-title">服务承诺：</div>
            <div class="service-content" v-html="product.serviceIntro"></div>
          </div>
        </div>
      </div>

      <!-- 商品详情选项卡 -->
      <div class="product-tabs">
        <div class="tabs-header">
          <button
              v-for="tab in tabs"
              :key="tab.name"
              :class="{ active: activeTab === tab.name }"
              @click="activeTab = tab.name"
          >
            {{ tab.label }}
            <span v-if="tab.name === 'evaluate' && product.evaluateCount">({{ product.evaluateCount }})</span>
          </button>
        </div>

        <div class="tabs-content">
          <!-- 商品详情 -->
          <div v-show="activeTab === 'detail'" class="tab-pane">
            <div class="detail-content" v-html="product.details"></div>
          </div>

          <!-- 规格参数 -->
          <div v-show="activeTab === 'specs'" class="tab-pane">
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-key">商品名称</span>
                <span class="spec-value">{{ product.goodsName }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">商品编号</span>
                <span class="spec-value">{{ product.serialNumber }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">商品毛重</span>
                <span class="spec-value">以实际称重为准</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">商品产地</span>
                <span class="spec-value">中国大陆</span>
              </div>
            </div>
          </div>

          <!-- 商品评价 -->
          <div v-show="activeTab === 'evaluate'" class="tab-pane">
            <div class="evaluate-summary" v-if="product.evaluateCount > 0">
              <div class="evaluate-stats">
                <span class="evaluate-count">用户评价({{ product.evaluateCount }})</span>
                <span class="evaluate-rating">好评率 {{ calculateRating }}%</span>
              </div>
            </div>

            <div class="evaluate-list" v-if="evaluateList.length > 0">
              <div class="evaluate-item" v-for="item in evaluateList" :key="item.id">
                <div class="evaluate-header">
                  <img :src="item.photo" class="user-avatar" @error="handleAvatarError" />
                  <span class="user-name">{{ item.userName }}</span>
                  <span class="evaluate-stars">{{ '★'.repeat(item.stars) }}</span>
                  <span class="evaluate-date">{{ formatDate(item.createDate) }}</span>
                </div>
                <div class="evaluate-content">
                  <p class="evaluate-text">{{ item.evaluate }}</p>
                </div>
              </div>
            </div>

            <div v-else class="no-evaluate">暂无评价</div>
          </div>
        </div>
      </div>

      <!-- 购物指南 -->
      <div class="shopping-guide" v-if="shoppingGuideList.length > 0">
        <h3 class="guide-title">购物指南</h3>
        <div class="guide-list">
          <div class="guide-item" v-for="guide in shoppingGuideList" :key="guide.titleId">
            <img :src="guide.imgUrl" :alt="guide.title" />
            <p>{{ guide.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="container loading-state" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载商品信息...</p>
    </div>

    <!-- 错误状态 -->
    <div class="container error-state" v-else>
      <div class="error-icon">😕</div>
      <p class="error-message">{{ errorMessage || '商品不存在或已下架' }}</p>
      <router-link to="/" class="back-home">返回首页</router-link>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { getProductDetail } from '../api/product'
import { useCartStore } from '../store/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 状态
const product = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)
const activeTab = ref('detail')
const isAddingToCart = ref(false)
const isBuyingNow = ref(false)

// 放大镜相关
const showMagnifier = ref(false)
const magnifierPosition = ref({ x: 0, y: 0 })
const mainImageRef = ref(null)
const imageRef = ref(null)
const magnifiedImageRef = ref(null)

// 规格选择
const selectedSpecs = ref({})

// 从product中提取的数据
const freightAmount = computed(() => product.value?.freightAmount || 0)
const inHourShop = computed(() => product.value?.inHourShop || false)
const evaluateList = computed(() => product.value?.evaluateList || [])
const shoppingGuideList = computed(() => product.value?.shoppingGuideList || [])

// 当前显示的图片
const currentImage = computed(() => {
  if (!product.value) return ''
  if (product.value.picList && product.value.picList.length > 0) {
    return product.value.picList[currentImageIndex.value]?.picUrl || product.value.goodsImg
  }
  return product.value.goodsImg
})

// 放大镜样式（遮罩位置）
const magnifierStyle = computed(() => {
  if (!imageRef.value) return {}

  const magnifierSize = 150 // 放大镜大小
  const rect = imageRef.value.getBoundingClientRect()

  // 计算放大镜位置，确保不超出图片边界
  let left = magnifierPosition.value.x - magnifierSize / 2
  let top = magnifierPosition.value.y - magnifierSize / 2

  // 边界限制
  left = Math.max(0, Math.min(left, rect.width - magnifierSize))
  top = Math.max(0, Math.min(top, rect.height - magnifierSize))

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${magnifierSize}px`,
    height: `${magnifierSize}px`,
    display: showMagnifier.value ? 'block' : 'none'
  }
})

// 放大后的图片样式
const magnifiedImageStyle = computed(() => {
  if (!imageRef.value || !showMagnifier.value) return {}

  const scale = 2.5 // 放大倍数
  const rect = imageRef.value.getBoundingClientRect()

  // 计算放大镜中心在图片中的比例位置
  const centerX = magnifierPosition.value.x / rect.width
  const centerY = magnifierPosition.value.y / rect.height

  return {
    transform: `scale(${scale})`,
    transformOrigin: `${centerX * 100}% ${centerY * 100}%`,
    transition: 'transform 0.1s ease'
  }
})

// 计算好评率
const calculateRating = computed(() => {
  if (!evaluateList.value.length) return 0
  const totalStars = evaluateList.value.reduce((sum, item) => sum + item.stars, 0)
  const maxStars = evaluateList.value.length * 5
  return Math.round((totalStars / maxStars) * 100)
})

const tabs = [
  { name: 'detail', label: '商品详情' },
  { name: 'specs', label: '规格参数' },
  { name: 'evaluate', label: '商品评价' }
]

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  return !!token
}

// 跳转到登录页
const redirectToLogin = () => {
  router.push({
                path: '/login',
                query: { redirect: route.fullPath }
              })
}

// 获取商品数据
const fetchProduct = async () => {
  const goodsId = route.params.id
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await getProductDetail(goodsId)

    if (result) {
      // 合并goodsView和productView的数据
      product.value = {
        ...result.goodsView,
        ...result.productView,
        id: result.goodsView?.id || result.productView?.id,
        goodsId: result.goodsView?.id,
        skuId: result.productView?.id,
        price: result.productView?.price || result.goodsView?.price,
        stock: result.productView?.store || result.goodsView?.stock,
        goodsName: result.goodsView?.goodsName || result.productView?.name,
        goodsImg: result.goodsView?.goodsImg || result.productView?.goodsPic,
        picList: result.goodsView?.picList || [],
        evaluateList: result.evaluateList || [],
        shoppingGuideList: result.shoppingGuideList || [],
        freightAmount: result.freightAmount,
        inHourShop: result.inHourShop,
        serviceIntro: result.goodsView?.serviceIntro,
        details: result.goodsView?.details,
        description: result.goodsView?.description,
        serialNumber: result.goodsView?.serialNumber || result.productView?.bn,
        topCatId: result.goodsView?.topCatId,
        topCatName: result.goodsView?.topCatName,
        totalBuyCount: result.goodsView?.totalBuyCount,
        cellectCount: result.goodsView?.cellectCount,
        evaluateCount: result.goodsView?.evaluateCount,
        goodsMktprice: result.goodsView?.goodsMktprice,
        pmList: result.goodsView?.pmList || result.productView?.pmList
      }

      // 重置状态
      quantity.value = 1
      currentImageIndex.value = 0
      activeTab.value = 'detail'
    } else {
      throw new Error('商品数据为空')
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    errorMessage.value = error.message || '加载失败，请稍后重试'
    product.value = null
  } finally {
    loading.value = false
  }
}

// 图片处理
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=图片加载失败'
}

const handleAvatarError = (event) => {
  event.target.src = 'https://via.placeholder.com/40x40/cccccc/666666?text=用户'
}

// 切换图片（悬停触发）
const switchImage = (index) => {
  currentImageIndex.value = index
  // 切换图片时隐藏放大镜
  showMagnifier.value = false
}

// 放大镜事件
const handleMouseMove = (event) => {
  if (!imageRef.value || !mainImageRef.value) return

  const rect = imageRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 确保放大镜在图片范围内
  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    showMagnifier.value = true
    magnifierPosition.value = {x, y}
  } else {
    showMagnifier.value = false
  }
}

const handleMouseLeave = () => {
  showMagnifier.value = false
}

// 数量控制
const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 处理加入购物车
const handleAddToCart = async () => {
  if (!product.value || product.value.stock <= 0) return

  // 检查登录状态
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }

  isAddingToCart.value = true

  try {
    const cartItem = {
      id: Date.now(),
      goodsId: product.value.goodsId,
      goodsName: product.value.goodsName,
      imgUrl: product.value.goodsImg,
      price: product.value.price,
      quantity: quantity.value,
      stock: product.value.stock,
      selected: true,
      specs: selectedSpecs.value
    }

    await cartStore.addToCart(cartItem)
    alert('成功加入购物车')
  } catch (error) {
    console.error('加入购物车失败:', error)
    alert('加入购物车失败，请重试')
  } finally {
    isAddingToCart.value = false
  }
}

// 处理立即购买
const handleBuyNow = () => {
  if (!product.value || product.value.stock <= 0) return

  // 检查登录状态
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }

  isBuyingNow.value = true

  try {
    router.push({
                  path: '/checkout',
                  query: {
                    goodsId: product.value.goodsId,
                    quantity: quantity.value,
                    specs: JSON.stringify(selectedSpecs.value)
                  }
                })
  } catch (error) {
    console.error('跳转结算失败:', error)
  } finally {
    isBuyingNow.value = false
  }
}

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 监听路由参数变化
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchProduct()
  }
})

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

/* 面包屑导航 */
.breadcrumb {
  padding: 15px 0;
  color: #666;
  font-size: 14px;
}

.breadcrumb a {
  color: #0056b3;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .current {
  color: #999;
}

/* 商品详情主体 */
.product-detail {
  display: flex;
  gap: 30px;
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 商品图片区 - 修复放大镜样式 */
.product-images {
  flex: 1;
  max-width: 850px; /* 原图(400px) + 放大图(400px) + gap(20px) + 一些余量 */
}

.main-image-container {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  gap: 20px;
}

.main-image {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  cursor: crosshair;
  flex-shrink: 0;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 放大镜遮罩 */
.magnifier {
  position: absolute;
  border: 2px solid #fff;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 10;
  backdrop-filter: blur(2px);
}

/* 放大后的图片容器 */
.magnified-image {
  width: 400px;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.magnified-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 视频标识 */
.video-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 5;
}

/* 缩略图样式 */
.thumbnail-images {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  margin-top: 10px;
}

.thumbnail-images img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.thumbnail-images img:hover {
  transform: scale(1.05);
  border-color: #ff9900;
}

.thumbnail-images img.active {
  border-color: #e4393c;
  box-shadow: 0 2px 8px rgba(228, 57, 60, 0.3);
}

/* 商品信息区 */
.product-info {
  flex: 1;
}

.product-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

/* 价格区域 */
.product-price {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.current-price .label {
  font-size: 14px;
  color: #999;
  margin-right: 10px;
}

.current-price .price {
  font-size: 28px;
  color: #e4393c;
  font-weight: bold;
}

.market-price .label {
  font-size: 14px;
  color: #999;
  margin-right: 10px;
}

.market-price .price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

/* 促销信息 */
.promotion-info {
  margin-bottom: 15px;
}

.promotion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.promotion-tag {
  background: #e4393c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.promotion-desc {
  color: #e4393c;
  font-size: 14px;
}

.promotion-time {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

/* 商品元信息 */
.product-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .label {
  color: #999;
  font-size: 14px;
  width: 70px;
}

.meta-item .value {
  color: #333;
  font-size: 14px;
}

.meta-item .value.out-of-stock {
  color: #e4393c;
}

/* 配送信息 */
.delivery-info {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
  padding: 10px 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.delivery-item {
  display: flex;
  align-items: center;
}

.delivery-item .label {
  color: #999;
  font-size: 14px;
  margin-right: 8px;
}

.delivery-item .value.tag {
  background: #4caf50;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 商品简介 */
.product-description {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.description-text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}

/* 数量选择 */
.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.quantity-selector .label {
  color: #666;
  font-size: 14px;
  width: 60px;
}

.counter {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.counter button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.counter button:hover:not(:disabled) {
  background: #f5f5f5;
}

.counter button:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.counter input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}

.stock-info {
  color: #999;
  font-size: 14px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.add-to-cart-btn, .buy-now-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background: #ff9900;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #e68a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 153, 0, 0.2);
}

.buy-now-btn {
  background: #e4393c;
  color: white;
}

.buy-now-btn:hover:not(:disabled) {
  background: #c03033;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(228, 57, 60, 0.2);
}

.add-to-cart-btn:disabled, .buy-now-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 服务承诺 */
.service-promise {
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.service-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.service-content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.service-content :deep(p) {
  margin: 5px 0;
}

.service-content :deep(a) {
  color: #0056b3;
  text-decoration: none;
}

.service-content :deep(a:hover) {
  text-decoration: underline;
}

/* 商品选项卡 */
.product-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}

.tabs-header button {
  padding: 12px 25px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tabs-header button:hover {
  color: #e4393c;
}

.tabs-header button.active {
  color: #e4393c;
  border-bottom-color: #e4393c;
  font-weight: bold;
}

.tab-pane {
  min-height: 300px;
}

/* 商品详情内容 */
.detail-content {
  line-height: 1.8;
}

.detail-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

/* 规格参数 */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.spec-item {
  display: flex;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

.spec-key {
  width: 100px;
  color: #999;
}

.spec-value {
  flex: 1;
  color: #333;
}

/* 商品评价 */
.evaluate-summary {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.evaluate-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.evaluate-count {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.evaluate-rating {
  color: #ff9900;
  font-weight: bold;
}

.evaluate-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.evaluate-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.evaluate-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  color: #333;
}

.evaluate-stars {
  color: #ff9900;
  margin-left: 10px;
}

.evaluate-date {
  margin-left: auto;
  color: #999;
  font-size: 12px;
}

.evaluate-text {
  color: #666;
  line-height: 1.6;
}

.no-evaluate {
  text-align: center;
  padding: 50px;
  color: #999;
}

/* 购物指南 */
.shopping-guide {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
}

.guide-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.guide-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.guide-item {
  flex: 0 0 200px;
  text-align: center;
}

.guide-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.guide-item p {
  color: #666;
  font-size: 14px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e4393c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.error-message {
  color: #e4393c;
  font-size: 18px;
  margin-bottom: 30px;
}

.back-home {
  display: inline-block;
  padding: 12px 30px;
  background: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.back-home:hover {
  background: #004494;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-image-container {
    flex-direction: column;
  }

  .magnified-image {
    width: 100%;
    height: 300px;
    margin-top: 10px;
  }

  .main-image {
    width: 100%;
  }

  .product-images {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .magnified-image {
    display: none; /* 小屏幕隐藏放大图 */
  }

  .product-detail {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .product-price {
    flex-direction: column;
    gap: 10px;
  }

  .product-meta {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
  }

  .tabs-header button {
    padding: 12px 15px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .evaluate-header {
    flex-wrap: wrap;
  }

  .evaluate-date {
    margin-left: 0;
    width: 100%;
  }
}
</style>