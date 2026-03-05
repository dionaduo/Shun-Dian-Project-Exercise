<template>
  <div class="product-section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <span class="more" @click="handleViewAll">查看全部 ></span>
    </div>
    <div class="dev-mode-tip" v-if="isDevMode">
      <span>🔧 开发模式 - 使用模拟数据</span>
    </div>

    <!-- 轮播图区域（如果有） -->
    <div class="carousel-container" v-if="showCarousel && carouselList.length > 0">
      <div class="carousel-wrapper" ref="carouselRef">
        <div
            class="carousel-slides"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
              class="carousel-slide"
              v-for="(item, index) in carouselList"
              :key="item.id || index"
              @click="handleCarouselClick(item)"
          >
            <img :src="item.imgUrl" :alt="item.name" @error="handleImageError">
          </div>
        </div>
      </div>

      <!-- 轮播图控制器 -->
      <button class="carousel-btn prev" @click="prevSlide" v-if="carouselList.length > 1">‹</button>
      <button class="carousel-btn next" @click="nextSlide" v-if="carouselList.length > 1">›</button>

      <!-- 轮播图指示器 -->
      <div class="carousel-dots" v-if="carouselList.length > 1">
        <span
            v-for="(_, index) in carouselList"
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="currentSlide = index"
        ></span>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="product-list-container">
      <div class="product-list" v-if="products.length">
        <ProductCard
            v-for="item in products"
            :key="item.id"
            :item="item"
        />
      </div>
      <div v-else class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'

const props = defineProps({
                            title: {
                              type: String,
                              default: ''
                            },
                            products: {
                              type: Array,
                              default: () => []
                            },
                            carouselList: {
                              type: Array,
                              default: () => []
                            },
                            showCarousel: {
                              type: Boolean,
                              default: false
                            },
                            viewAllPath: {
                              type: String,
                              default: ''
                            }
                          })

const router = useRouter()
const carouselRef = ref(null)
const currentSlide = ref(0)
let autoPlayTimer = null
const isDevMode = false

// 处理查看全部
const handleViewAll = () => {
  if (props.viewAllPath) {
    router.push(props.viewAllPath)
  }
}

// 处理轮播图点击
const handleCarouselClick = (item) => {
  if (item.jumpUrl) {
    // 如果是商品链接，跳转到商品详情
    const match = item.jumpUrl.match(/[?&]id=(\d+)/)
    if (match) {
      router.push(`/product/${match[1]}`)
    } else {
      // 否则跳转到搜索页
      router.push(item.jumpUrl)
    }
  }
}

// 轮播图控制
const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0
      ? props.carouselList.length - 1
      : currentSlide.value - 1
}

const nextSlide = () => {
  currentSlide.value = currentSlide.value === props.carouselList.length - 1
      ? 0
      : currentSlide.value + 1
}

// 自动播放
const startAutoPlay = () => {
  if (props.carouselList.length <= 1) return
  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, 5000)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x200/cccccc/666666?text=图片加载失败'
}

onMounted(() => {
  if (props.showCarousel) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})
</script>

<style scoped>
.product-section {
  width: 100%;
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.dev-mode-tip {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 8px 16px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  display: inline-block;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 15px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  position: relative;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #e74c3c;
  border-radius: 2px;
}

.more {
  font-size: 14px;
  color: #7f8c8d;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.3s;
}

.more:hover {
  color: #e74c3c;
  background: #fef5f4;
}

/* 轮播图样式 */
.carousel-container {
  position: relative;
  width: 100%;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-wrapper {
  width: 100%;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  cursor: pointer;
}

.carousel-slide img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 2;
}

.carousel-btn:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.carousel-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-dots span.active {
  width: 24px;
  border-radius: 4px;
  background: white;
}

/* 商品列表样式 */
.product-list-container {
  overflow-x: auto;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0;
}

.product-list-container::-webkit-scrollbar {
  height: 4px;
}

.product-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.product-list-container::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.product-list {
  display: flex;
  gap: 20px;
  padding-bottom: 10px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto 10px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>