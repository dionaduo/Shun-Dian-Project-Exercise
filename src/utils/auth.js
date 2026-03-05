// utils/auth.js

/**
 * 检查用户是否已登录
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    return !!(token && userInfo)
}

/**
 * 获取当前用户信息
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    try {
        const userInfo = localStorage.getItem('userInfo')
        return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
        console.error('解析用户信息失败:', error)
        return null
    }
}

/**
 * 获取token
 * @returns {string|null}
 */
export const getToken = () => {
    return localStorage.getItem('token')
}

/**
 * 退出登录
 */
export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // 触发storage事件，通知其他标签页
    window.dispatchEvent(new Event('storage'))
}

/**
 * 需要登录的页面重定向
 * @param {Object} router - Vue Router实例
 * @param {Object} route - 当前路由
 */
export const requireAuth = (router, route) => {
    if (!isAuthenticated()) {
        router.push({
                        path: '/login',
                        query: { redirect: route.fullPath }
                    })
        return false
    }
    return true
}