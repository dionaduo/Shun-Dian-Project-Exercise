<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :carouselList="carouselList"
      :showCarousel="true"
      viewAllPath="/hot"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'
import { mapProductItem, mapCarouselList } from '../utils/productMapper'

const products = ref([])
const carouselList = ref([])
const plateName = ref('热销榜单')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 热销榜单板块（id=4）
      const hotSalesView = result.views.find(view => view.id === 4)

      if (hotSalesView) {
        plateName.value = hotSalesView.name || '热销榜单'

        // 商品列表
        if (hotSalesView.goodsList) {
          products.value = hotSalesView.goodsList.map(mapProductItem)
        }

        // 轮播图
        if (hotSalesView.wheelSeedingList) {
          carouselList.value = mapCarouselList(hotSalesView.wheelSeedingList)
        }
      }
    }
  } catch (error) {
    console.error('获取热销榜单数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>