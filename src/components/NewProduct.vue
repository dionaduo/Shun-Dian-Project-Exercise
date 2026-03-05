<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :showCarousel="false"
      viewAllPath="/new"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent, getViewByName } from '../api/plate'
import { mapProductItem } from '../utils/productMapper'

const products = ref([])
const plateName = ref('新品推荐')

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 新品推荐板块（id=1 或 name="新品推荐"）
      const newArrivalView = getViewByName(result.views, '新品推荐') ||
          result.views.find(v => v.id === 1)

      if (newArrivalView?.goodsList) {
        plateName.value = newArrivalView.name || '新品推荐'
        products.value = newArrivalView.goodsList.map(mapProductItem)
      }
    }
  } catch (error) {
    console.error('获取新品推荐数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>