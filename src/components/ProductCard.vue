<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-img">
      <img
          :src="item.imageUrl"
          :alt="item.title"
          @error="handleImageError"
          loading="lazy"
      />
      <!-- 促销标签 -->
      <div class="promotion-tag" v-if="item.hasPromotion">促销</div>
      <!-- 新品标签 -->
      <div class="new-tag" v-if="item.isNew">新品</div>
    </div>
    <div class="product-info">
      <h3 class="title">{{ item.title }}</h3>
      <p class="desc">{{ item.subTitle }}</p>
      <div class="price-row">
        <p class="price">¥{{ formatPrice(item.price) }}</p>
        <p class="original-price" v-if="item.originalPrice">¥{{ formatPrice(item.originalPrice) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
                            item: {
                              type: Object,
                              required: true
                            }
                          })

const router = useRouter()

const goToDetail = () => {
  if (props.item.goodsId) {
    router.push(`/product/${props.item.goodsId}`)
  }
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x180/cccccc/666666?text=图片加载失败'
}
</script>

<style scoped>
.product-card {
  min-width: 220px;
  width: 220px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.product-img {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.08);
}

/* 标签样式 */
.promotion-tag, .new-tag {
  position: absolute;
  top: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  z-index: 1;
}

.promotion-tag {
  left: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
}

.new-tag {
  right: 10px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.product-info {
  padding: 16px 12px;
}

.title {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc {
  font-size: 13px;
  color: #95a5a6;
  margin: 0 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
  margin: 0;
}

.original-price {
  font-size: 13px;
  color: #bdc3c7;
  text-decoration: line-through;
  margin: 0;
}
</style>