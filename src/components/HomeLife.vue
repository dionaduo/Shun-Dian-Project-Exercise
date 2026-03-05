<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :carouselList="carouselList"
      :showCarousel="true"
      viewAllPath="/home-life"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'
import { mapProductItem, mapCarouselList } from '../utils/productMapper'

const products = ref([])
const carouselList = ref([])
const plateName = ref('生活美家')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 生活美家板块（id=6）
      const homeView = result.views.find(view => view.id === 6)

      if (homeView) {
        plateName.value = homeView.name || '生活美家'

        // 商品列表
        if (homeView.goodsList) {
          products.value = homeView.goodsList.map(mapProductItem)
        }

        // 轮播图
        const carouselItems = [
          ...(homeView.platePicList || []),
          ...(homeView.wheelSeedingList || [])
        ]
        carouselList.value = mapCarouselList(carouselItems)
      }
    }
  } catch (error) {
    console.error('获取生活美家数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>