// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    // 购物车数据
    const cartItems = ref([])

    // 加载购物车数据
    const loadCart = () => {
        try {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                cartItems.value = JSON.parse(savedCart)
            }
        } catch (error) {
            console.error('加载购物车失败:', error)
        }
    }

    // 保存购物车数据
    const saveCart = () => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems.value))
        } catch (error) {
            console.error('保存购物车失败:', error)
        }
    }

    // 添加商品到购物车
    const addToCart = (item) => {
        // 检查是否已存在相同商品
        const existingItem = cartItems.value.find(
            cartItem => cartItem.goodsId === item.goodsId &&
                JSON.stringify(cartItem.specs) === JSON.stringify(item.specs)
        )

        if (existingItem) {
            // 更新数量
            existingItem.quantity += item.quantity
            if (existingItem.quantity > existingItem.stock) {
                existingItem.quantity = existingItem.stock
            }
        } else {
            // 添加新商品
            cartItems.value.push({
                                     ...item,
                                     id: Date.now() + Math.random()
                                 })
        }

        saveCart()
    }

    // 移除商品
    const removeFromCart = (itemId) => {
        const index = cartItems.value.findIndex(item => item.id === itemId)
        if (index > -1) {
            cartItems.value.splice(index, 1)
            saveCart()
        }
    }

    // 更新数量
    const updateQuantity = (itemId, quantity) => {
        const item = cartItems.value.find(item => item.id === itemId)
        if (item) {
            item.quantity = Math.max(1, Math.min(quantity, item.stock))
            saveCart()
        }
    }

    // 切换选中状态
    const toggleSelected = (itemId) => {
        const item = cartItems.value.find(item => item.id === itemId)
        if (item) {
            item.selected = !item.selected
            saveCart()
        }
    }

    // 全选/取消全选
    const toggleSelectAll = (selected) => {
        cartItems.value.forEach(item => {
            item.selected = selected
        })
        saveCart()
    }

    // 清空购物车
    const clearCart = () => {
        cartItems.value = []
        saveCart()
    }

    // 计算属性
    const totalPrice = computed(() => {
        return cartItems.value
            .filter(item => item.selected)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    const selectedCount = computed(() => {
        return cartItems.value
            .filter(item => item.selected)
            .reduce((sum, item) => sum + item.quantity, 0)
    })

    const isAllSelected = computed(() => {
        return cartItems.value.length > 0 &&
            cartItems.value.every(item => item.selected)
    })

    // 初始化加载
    loadCart()

    return {
        cartItems,
        totalPrice,
        selectedCount,
        isAllSelected,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelected,
        toggleSelectAll,
        clearCart
    }
})