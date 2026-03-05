<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :carouselList="carouselList"
      :showCarousel="true"
      viewAllPath="/three-meals"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'
import { mapProductItem, mapCarouselList } from '../utils/productMapper'

const products = ref([])
const carouselList = ref([])
const plateName = ref('一日三餐')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 一日三餐板块（id=8）
      const mealView = result.views.find(view => view.id === 8)

      if (mealView) {
        plateName.value = mealView.name || '一日三餐'

        // 商品列表
        if (mealView.goodsList) {
          products.value = mealView.goodsList.map(mapProductItem)
        }

        // 轮播图
        const carouselItems = [
          ...(mealView.platePicList || []),
          ...(mealView.wheelSeedingList || [])
        ]
        carouselList.value = mapCarouselList(carouselItems)
      }
    }
  } catch (error) {
    console.error('获取一日三餐数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>