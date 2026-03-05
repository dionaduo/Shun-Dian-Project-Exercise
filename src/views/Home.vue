<template>
  <div class="home">
    <Header/>

    //这是在远程分支上修改的内容

    //这是在本地修改的内容

    <main class="main-content">
      <aside class="category-sidebar">
        <ul class="category-menu">
          <li v-for="cat in categories" :key="cat.id">
            <a :href="cat.url">{{ cat.name }}</a>
          </li>
        </ul>
      </aside>

      <div class="content-area">
        <Carousel :banners="banners"/>
      </div>
    </main>

    <div class="sections-container">
      <!-- 为每个组件添加ref属性，方便导航定位 -->
      <div ref="newProductRef">
        <NewProduct/>
      </div>
      <div ref="hotSalesRef">
        <HotSales/>
      </div>
      <div ref="mustBuyRef">
        <MustBuyView/>
      </div>
      <div ref="digitalRef">
        <DigitalTrend/>
      </div>
      <div ref="homeLifeRef">
        <HomeLife/>
      </div>
      <div ref="threeMealsRef">
        <ThreeMeals/>
      </div>
      <div ref="seasonalRef">
        <Seasonal/>
      </div>
    </div>

    <!-- 快速导航组件 -->
    <QuickNav />

    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Carousel from '../components/Carousel.vue'
import QuickNav from '../components/QuickNav.vue' // 导入快速导航组件
import NewProduct from '../components/NewProduct.vue'
import MustBuyView from '../components/MustBuyView.vue'
import HotSales from '../components/HotSales.vue'
import DigitalTrend from '../components/DigitalTrend.vue'
import HomeLife from '../components/HomeLife.vue'
import ThreeMeals from '../components/ThreeMeals.vue'
import Seasonal from '../components/Seasonal.vue'
import { getPlateContent } from '../api/plate'

const categories = [
  { id: 1, name: '手机通讯', url: '/search?catId=1' },
  { id: 2, name: '大家电', url: '/search?catId=2' },
  { id: 3, name: '智能/娱乐', url: '/search?catId=3' },
  { id: 4, name: '办公设备', url: '/search?catId=4' },
  { id: 5, name: '电脑设备', url: '/search?catId=5' },
  { id: 6, name: '数码/航拍', url: '/search?catId=6' },
  { id: 7, name: '厨房小家电', url: '/search?catId=7' },
  { id: 8, name: '个护/健康', url: '/search?catId=8' },
  { id: 9, name: '生活电器', url: '/search?catId=9' }
]

const banners = ref([])

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    const result = await getPlateContent()
    if (result?.pcBannerList) {
      banners.value = result.pcBannerList.map(item => ({
        id: item.id,
        imgUrl: item.imgUrl,
        jumpUrl: item.pcUrl || item.jumpUrl
      }))
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.main-content {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  gap: 20px;
}

.category-sidebar {
  flex: 0 0 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 15px 0;
  height: fit-content;
}

.category-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-menu a {
  display: block;
  padding: 12px 20px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}

.category-menu a:hover {
  background: #fef5f4;
  color: #e74c3c;
  border-left-color: #e74c3c;
}

.content-area {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 400px;
}

.sections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 为每个板块添加一些间距 */
.sections-container > div {
  margin-bottom: 20px;
}

.sections-container > div:last-child {
  margin-bottom: 0;
}
</style>
