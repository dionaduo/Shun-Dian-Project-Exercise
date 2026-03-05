<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :carouselList="carouselList"
      :showCarousel="true"
      viewAllPath="/seasonal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'
import { mapProductItem, mapCarouselList } from '../utils/productMapper'

const products = ref([])
const carouselList = ref([])
const plateName = ref('春夏秋冬')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 春夏秋冬板块（id=7）
      const seasonalView = result.views.find(view => view.id === 7)

      if (seasonalView) {
        plateName.value = seasonalView.name || '春夏秋冬'

        // 商品列表
        if (seasonalView.goodsList) {
          products.value = seasonalView.goodsList.map(mapProductItem)
        }

        // 轮播图
        const carouselItems = [
          ...(seasonalView.platePicList || []),
          ...(seasonalView.wheelSeedingList || [])
        ]
        carouselList.value = mapCarouselList(carouselItems)
      }
    }
  } catch (error) {
    console.error('获取春夏秋冬数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>