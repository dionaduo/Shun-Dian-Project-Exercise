<template>
  <div class="carousel-container">
    <div class="carousel-wrapper">
      <div
        class="carousel-slides"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(slide, index) in bannerList"
          :key="slide.id"
          class="carousel-slide"
        >
          <div
            class="slide-content"
            @click="handleSlideClick(slide)"
            style="cursor: pointer;"
          >
            <div class="slide-text">
              <h2 class="slide-title">{{ slide.name }}</h2>
              <p class="slide-subtitle">{{ slide.description || '精彩活动' }}</p>
              <div class="slide-brands">
                <span
                  v-if="slide.labelName"
                  class="brand-tag"
                >
                  {{ slide.labelName }}
                </span>
              </div>
            </div>
            <div class="slide-image">
              <img
                v-if="slide.imgUrl"
                :src="slide.imgUrl"
                :alt="slide.name"
                @error="handleImageError"
              />
              <div v-else class="image-placeholder">
                <div class="camera-img">📷</div>
                <div class="action-cam-img">🎥</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        class="carousel-btn prev"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        class="carousel-btn next"
        @click="nextSlide"
        aria-label="Next slide"
      >
        ›
      </button>

      <div class="carousel-dots">
        <button
          v-for="(slide, index) in bannerList"
          :key="slide.id"
          class="carousel-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import pcListData from '../pcList.json'

// 定义props
const props = defineProps({
  interval: {
    type: Number,
    default: 5000
  },
  autoPlay: {
    type: Boolean,
    default: true
  }
})

// 从pcList.json中获取轮播图数据
const bannerList = computed(() => {
  return pcListData.result?.pcBannerList || []
})

// 响应式数据
const currentSlide = ref(0)
let slideInterval = null

// 方法定义
const startAutoPlay = () => {
  stopAutoPlay()
  if (props.autoPlay && bannerList.value.length > 1) {
    slideInterval = setInterval(() => {
      nextSlide()
    }, props.interval)
  }
}

const stopAutoPlay = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

const nextSlide = () => {
  if (bannerList.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % bannerList.value.length
  }
}

const prevSlide = () => {
  if (bannerList.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + bannerList.value.length) % bannerList.value.length
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 处理轮播图点击事件
const handleSlideClick = (slide) => {
  if (slide.pcUrl) {
    // 构造完整的URL
    const baseUrl = 'https://www.sundan.com'
    const fullUrl = baseUrl + slide.pcUrl
    window.open(fullUrl, '_blank')
  }
}

// 图片加载错误处理
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4='
}

// 监听数据变化
watch(bannerList, (newList) => {
  if (newList.length > 0 && currentSlide.value >= newList.length) {
    currentSlide.value = 0
  }
  if (props.autoPlay) {
    startAutoPlay()
  }
})

// 生命周期钩子
onMounted(() => {
  if (props.autoPlay && bannerList.value.length > 0) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})

// 暴露方法给父组件
defineExpose({
  nextSlide,
  prevSlide,
  goToSlide
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
  border-radius: 4px;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
}

.slide-content {
  min-height: 500px;
  color: black;
}

.slide-text {
  flex: 0 0 50%;
  padding-right: 40px;
}

.slide-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 1.2;
}

.slide-subtitle {
  font-size: 28px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.slide-brands {
  display: flex;
  gap: 15px;
}

.brand-tag {
  display: inline-block;
  padding: 8px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  backdrop-filter: blur(5px);
}

.slide-image {
  flex: 0 0 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.slide-image img {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  gap: 40px;
  align-items: center;
}

.camera-img, .action-cam-img {
  font-size: 120px;
  opacity: 0.8;
}

.action-cam-img {
  font-size: 100px;
  margin-top: 30px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 10;
}

.carousel-btn:hover {
  background-color: rgba(0, 0, 0, 0.5);
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
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0;
}

.carousel-dot.active {
  background-color: white;
  transform: scale(1.2);
}

.carousel-dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .slide-content {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
  }

  .slide-text {
    padding-right: 0;
    margin-bottom: 40px;
  }

  .slide-title {
    font-size: 36px;
  }

  .slide-subtitle {
    font-size: 22px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .carousel-btn.prev {
    left: 10px;
  }

  .carousel-btn.next {
    right: 10px;
  }
}
</style>
