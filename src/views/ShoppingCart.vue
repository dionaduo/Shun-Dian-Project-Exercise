<template>
  <div class="shopping-cart-page">
    <Header />

    <div class="container">
      <h1 class="page-title">购物车</h1>

      <!-- 购物车内容 -->
      <div class="cart-content" v-if="cartItems.length > 0">
        <!-- 购物车商品列表 -->
        <div class="cart-items">
          <div class="cart-header">
            <label class="checkbox-all">
              <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="handleToggleSelectAll"
              />
              全选
            </label>
            <div class="header-info">
              <span>商品信息</span>
              <span>单价</span>
              <span>数量</span>
              <span>小计</span>
              <span>操作</span>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <label class="item-checkbox">
              <input
                  type="checkbox"
                  :checked="item.selected"
                  @change="() => toggleSelected(item.id)"
              />
            </label>

            <div class="item-content">
              <div class="item-image" @click="goToProductDetail(item.goodsId)">
                <img
                    :src="item.imgUrl"
                    :alt="item.goodsName"
                    @error="handleImageError"
                />
              </div>

              <div class="item-info" @click="goToProductDetail(item.goodsId)">
                <h3 class="item-name">{{ item.goodsName }}</h3>
                <p class="item-specs">{{ formatSpecs(item.specs) }}</p>
              </div>

              <div class="item-price">¥{{ formatPrice(item.price) }}</div>

              <div class="item-quantity">
                <div class="quantity-control">
                  <button
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                  >
                    -
                  </button>
                  <input
                      type="number"
                      :value="item.quantity"
                      @change="(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)"
                      min="1"
                      :max="item.stock"
                  />
                  <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.quantity >= item.stock"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="item-total">¥{{ formatPrice(item.price * item.quantity) }}</div>

              <div class="item-actions">
                <button @click="removeFromCart(item.id)" class="remove-btn">删除</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 结算区域 -->
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-item">
              <span>已选择 {{ selectedCount }} 件商品</span>
              <span>总价：<strong class="total-price">¥{{ formatPrice(totalPrice) }}</strong></span>
            </div>
            <button
                class="checkout-btn"
                @click="proceedToCheckout"
                :disabled="selectedCount === 0"
            >
              去结算 ({{ selectedCount }})
            </button>
          </div>
        </div>
      </div>

      <!-- 空购物车 -->
      <div class="empty-cart" v-else>
        <div class="empty-icon">🛒</div>
        <p class="empty-text">购物车还是空的</p>
        <router-link to="/" class="continue-shopping">继续逛逛</router-link>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useCartStore } from '../store/cart'
import { requireAuth } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 计算属性
const cartItems = computed(() => cartStore.cartItems)
const totalPrice = computed(() => cartStore.totalPrice)
const selectedCount = computed(() => cartStore.selectedCount)
const isAllSelected = computed(() => cartStore.isAllSelected)

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  return !!token
}

// 跳转到登录页
const redirectToLogin = () => {
  router.push({
                path: '/login',
                query: { redirect: route.fullPath }
              })
}

// 处理全选
const handleToggleSelectAll = () => {
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }
  cartStore.toggleSelectAll(!isAllSelected.value)
}

// 切换选中状态
const toggleSelected = (itemId) => {
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }
  cartStore.toggleSelected(itemId)
}

// 更新数量
const updateQuantity = (itemId, quantity) => {
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }
  cartStore.updateQuantity(itemId, quantity)
}

// 移除商品
const removeFromCart = (itemId) => {
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }

  if (confirm('确定要删除这个商品吗？')) {
    cartStore.removeFromCart(itemId)
  }
}

// 跳转到商品详情
const goToProductDetail = (goodsId) => {
  router.push(`/product/${goodsId}`)
}

// 跳转到结算页
const proceedToCheckout = () => {
  if (!checkLoginStatus()) {
    redirectToLogin()
    return
  }

  if (selectedCount.value === 0) return

  const selectedItems = cartItems.value.filter(item => item.selected)
  router.push({
                path: '/checkout',
                query: {
                  items: JSON.stringify(selectedItems.map(item => ({
                    id: item.id,
                    goodsId: item.goodsId,
                    quantity: item.quantity,
                    specs: item.specs
                  })))
                }
              })
}

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// 格式化规格
const formatSpecs = (specs) => {
  if (!specs) return '默认规格'
  if (typeof specs === 'object') {
    return Object.values(specs).join(' / ')
  }
  return specs
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/100x100/cccccc/666666?text=图片'
}

// 加载购物车数据时检查登录状态
onMounted(() => {
  if (!checkLoginStatus()) {
    redirectToLogin()
  }
  if (!requireAuth(router, route)) {

  }
})
</script>

<style scoped>
.shopping-cart-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-width: 100%;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.cart-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.checkbox-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.header-info {
  display: flex;
  flex: 1;
  justify-content: space-around;
  margin-left: 50px;
  font-weight: bold;
  color: #666;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-checkbox {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.item-content {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 20px;
}

.item-image {
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 2;
  min-width: 200px;
}

.item-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.item-specs {
  font-size: 14px;
  color: #999;
}

.item-price, .item-total {
  width: 100px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #e4393c;
}

.item-quantity {
  width: 120px;
  text-align: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-control button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.quantity-control input {
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}

.item-actions {
  width: 80px;
  text-align: center;
}

.remove-btn {
  color: #e4393c;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  padding: 20px;
  background: #f8f8f8;
  border-top: 1px solid #eee;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 16px;
  color: #666;
}

.total-price {
  font-size: 24px;
  color: #e4393c;
}

.checkout-btn {
  padding: 15px 40px;
  background: #e4393c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background: #c03033;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 20px;
  color: #666;
  margin-bottom: 30px;
}

.continue-shopping {
  display: inline-block;
  padding: 12px 30px;
  background: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background: #004494;
}

@media (max-width: 768px) {
  .cart-header, .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-info, .item-content {
    width: 100%;
    margin-left: 0;
    margin-top: 15px;
  }

  .cart-summary {
    flex-direction: column;
    gap: 20px;
  }
}
</style>