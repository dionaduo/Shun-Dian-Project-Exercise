import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '用户登录',
      requiresAuth: false
    }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    meta: {
      title: '商品详情',
      requiresAuth: false  // 商品详情页不需要登录
    },
    props: true
  },
  {
    path: '/cart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart.vue'),
    meta: {
      title: '购物车',
      requiresAuth: true  // 购物车需要登录
    }
  }
]

const router = createRouter({
                              history: createWebHistory(),
                              routes,
                              scrollBehavior(to, from, savedPosition) {
                                if (savedPosition) {
                                  return savedPosition
                                } else {
                                  return { top: 0 }
                                }
                              }
                            })

// 检查是否已登录
const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  return !!(token && userInfo)
}

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 顺电商城` : '顺电商城'

  const requiresAuth = to.meta.requiresAuth
  const loggedIn = isAuthenticated()

  // 需要登录但未登录，跳转到登录页
  if (requiresAuth && !loggedIn) {
    next({
           path: '/login',
           query: { redirect: to.fullPath } // 登录后跳回原页面
         })
  }
  // 已登录且访问登录页，跳转到首页
  else if (to.path === '/login' && loggedIn) {
    next('/')
  }
  else {
    next()
  }
})

// 添加路由解析后的守卫，用于处理加入购物车等操作
router.afterEach((to) => {
  // 可以在这里添加一些统计或日志
  console.log('路由跳转:', to.path)
})

export default router