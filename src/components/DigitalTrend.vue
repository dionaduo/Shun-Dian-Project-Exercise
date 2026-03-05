<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :carouselList="carouselList"
      :showCarousel="true"
      viewAllPath="/digital"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'
import { mapProductItem, mapCarouselList } from '../utils/productMapper'

const products = ref([])
const carouselList = ref([])
const plateName = ref('潮人数码')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 潮人数码板块（id=5）
      const digitalView = result.views.find(view => view.id === 5)

      if (digitalView) {
        plateName.value = digitalView.name || '潮人数码'

        // 商品列表
        if (digitalView.goodsList) {
          products.value = digitalView.goodsList.map(mapProductItem)
        }

        // 轮播图（合并platePicList和wheelSeedingList）
        const carouselItems = [
          ...(digitalView.platePicList || []),
          ...(digitalView.wheelSeedingList || [])
        ]
        carouselList.value = mapCarouselList(carouselItems)
      }
    }
  } catch (error) {
    console.error('获取潮人数码数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>