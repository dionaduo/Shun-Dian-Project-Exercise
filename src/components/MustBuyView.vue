<template>
  <BaseProductList
      :title="plateName"
      :products="products"
      :showCarousel="false"
      viewAllPath="/mustbuy"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseProductList from './BaseProductList.vue'
import { getPlateContent } from '../api/plate'

const products = ref([])
const plateName = ref('必买好物')

// 从jumpUrl中提取商品ID
const extractGoodsId = (url) => {
  if (!url) return null
  const match = url.match(/[?&]id=(\d+)/)
  return match ? match[1] : null
}

const fetchData = async () => {
  try {
    const result = await getPlateContent()

    if (result?.views) {
      // 必买好物板块（id=2）
      const mustBuyView = result.views.find(view => view.id === 2)

      if (mustBuyView) {
        plateName.value = mustBuyView.name || '必买好物'

        // 必买好物使用 platePicList 数据
        if (mustBuyView.platePicList?.length > 0) {
          products.value = mustBuyView.platePicList.map((item, index) => ({
            id: item.id || index,
            goodsId: extractGoodsId(item.jumpUrl) || `temp_${index}`,
            title: item.name || `推荐商品 ${index + 1}`,
            subTitle: '精选推荐',
            price: 0,
            imageUrl: item.imgUrl,
            hasPromotion: false,
            isNew: false
          }))
        }
      }
    }
  } catch (error) {
    console.error('获取必买好物数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>