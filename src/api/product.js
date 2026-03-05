// api/product.js
import { generateSign } from '../utils/sign'
import { getMockProductById } from './mock'

// 是否使用模拟数据（可以设置为环境变量）
const USE_MOCK = false // 改为false则使用真实API，true使用模拟数据

/**
 * 获取商品详情（带备用方案）
 * @param {string|number} goodsId - 商品ID
 * @param {string} cityId - 城市ID，默认524
 * @returns {Promise}
 */
export const getProductDetail = async (goodsId, cityId = '524') => {
    // 如果使用模拟数据，直接返回
    if (USE_MOCK) {
        console.log('使用模拟数据 - getProductDetail', goodsId)
        const mockResult = getMockProductById(goodsId)
        return mockResult.result
    }

    const timestamp = Date.now().toString()

    // 生成签名：goodsId + cityId + timestamp
    const sign = generateSign(goodsId, cityId, timestamp)

    const params = new URLSearchParams({
                                           cityId,
                                           goodsId: goodsId.toString(),
                                           timestamp,
                                           sign
                                       })

    try {
        const response = await fetch('/api/api/app/happinesswebsite/goods/goodsDetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-mall-code': 'SD001',
                'x-platform': 'pc',
                'Accept': 'application/json, text/plain, */*'
            },
            body: params,
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.code === 200) {
            return data.result
        } else {
            throw new Error(data.message || '获取商品详情失败')
        }
    } catch (error) {
        console.error('API请求失败，使用模拟数据:', error)
        // 请求失败时返回模拟数据
        const mockResult = getMockProductById(goodsId)
        return mockResult.result
    }
}