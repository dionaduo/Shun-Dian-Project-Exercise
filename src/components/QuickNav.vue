<template>
  <transition name="fade">
    <div class="quick-nav" v-show="showNav">

      <div class="nav-content" v-show="showNav">
        <h3 class="nav-title">快速导航</h3>
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.id" class="nav-item">
            <a href="javascript:void(0)" @click="scrollToSection(item.id)" class="nav-link">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-name">{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <!-- 添加进度条 -->
        <div class="nav-progress">
          <div class="nav-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showNav = ref(false)
const scrollThreshold = ref(300) // 滚动多少像素后显示导航

// 导航项配置
const navItems = [
  { id: 'new-product', name: '新品推荐', icon: '🆕', section: 'NewProduct' },
  { id: 'hot-sales', name: '热销榜单', icon: '🔥', section: 'HotSales' },
  { id: 'must-buy', name: '必买好物', icon: '⭐', section: 'MustBuyView' },
  { id: 'digital', name: '潮人数码', icon: '📱', section: 'DigitalTrend' },
  { id: 'home-life', name: '生活美家', icon: '🏠', section: 'HomeLife' },
  { id: 'three-meals', name: '一日三餐', icon: '🍚', section: 'ThreeMeals' },
  { id: 'seasonal', name: '春夏秋冬', icon: '🌸', section: 'Seasonal' }
]


// 滚动到指定区域
const scrollToSection = (id) => {
  // 查找对应的DOM元素
  const sections = document.querySelectorAll('.sections-container > div')
  const index = navItems.findIndex(item => item.id === id)

  if (sections[index]) {
    sections[index].scrollIntoView({
                                     behavior: 'smooth',
                                     block: 'start'
                                   })
  }

  // 移动端点击后自动隐藏
  if (window.innerWidth <= 768) {
    showNav.value = false
  }
}
const scrollProgress = ref(0)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  showNav.value = scrollTop > scrollThreshold.value

  // 计算滚动进度
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / scrollHeight) * 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始检查
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.quick-nav {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.nav-toggle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.nav-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.toggle-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

.toggle-text {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.9;
}

.nav-content {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 16px;
  padding: 16px 0;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  padding: 0 16px 12px;
  margin: 0;
  border-bottom: 1px solid #f0f0f0;
}

.nav-list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.nav-item {
  padding: 0;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #fef5f4;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #4a5568;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-link:hover {
  color: #e74c3c;
  transform: translateX(5px);
}

.nav-icon {
  width: 28px;
  font-size: 16px;
  color: #e74c3c;
}

.nav-name {
  flex: 1;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quick-nav {
    right: 15px;
  }

  .nav-toggle {
    width: 50px;
    height: 50px;
  }

  .nav-content {
    right: 60px;
    min-width: 150px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 12px;
  }

  .nav-icon {
    width: 24px;
  }
}

/* 当导航展开时，隐藏折叠按钮的文字 */
.nav-toggle span:last-child {
  font-size: 10px;
  white-space: nowrap;
}

/* 滚动到顶部时的状态 */
.quick-nav.scroll-top .nav-content {
  top: auto;
  bottom: 70px;
  transform: none;
}
/* 添加脉冲动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(231, 76, 60, 0.5);
  }
  100% {
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  }
}

.nav-toggle {
  animation: pulse 2s infinite;
}

.nav-toggle:hover {
  animation: none;
}

/* 导航项悬停效果 */
.nav-item {
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav-item:hover::before {
  transform: translateX(0);
}

/* 添加滚动进度条 */
.nav-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(231, 76, 60, 0.2);
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

.nav-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c, #c0392b);
  transition: width 0.1s linear;
}
</style>