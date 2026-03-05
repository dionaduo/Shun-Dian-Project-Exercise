// api/plate.js
import { getMockPlateContent, getMockProductById } from './mock'

// 是否使用模拟数据（可以设置为环境变量）
const USE_MOCK = false // 改为false则使用真实API，true使用模拟数据

/**
 * 获取板块内容数据（带备用方案）
 * @returns {Promise}
 */
export const getPlateContent = async () => {
    // 如果使用模拟数据，直接返回
    if (USE_MOCK) {
        console.log('使用模拟数据 - getPlateContent')
        return getMockPlateContent().result
    }

    try {
        const response = await fetch('/api/api/app/shundian/plateContent/getPcPlateContent', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.code === 200) {
            return data.result
        } else {
            throw new Error(data.message || '获取数据失败')
        }
    } catch (error) {
        console.error('API请求失败，使用模拟数据:', error)
        // 请求失败时返回模拟数据
        return getMockPlateContent().result
    }
}

/**
 * 根据板块ID获取板块数据
 * @param {Array} views - 所有板块视图
 * @param {number} viewId - 板块ID
 * @returns {Object} 板块数据
 */
export const getViewById = (views, viewId) => {
    return views?.find(view => view.id === viewId) || null
}

/**
 * 根据板块名称获取板块数据
 * @param {Array} views - 所有板块视图
 * @param {string} viewName - 板块名称
 * @returns {Object} 板块数据
 */
export const getViewByName = (views, viewName) => {
    return views?.find(view => view.name === viewName) || null
}