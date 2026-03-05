// utils/sign.js
// 如果需要MD5库，先安装：npm install md5
import md5 from 'md5'

/**
 * 生成签名
 * @param {string} goodsId - 商品ID
 * @param {string} cityId - 城市ID
 * @param {string} timestamp - 时间戳
 * @returns {string} MD5签名
 */
export const generateSign = (goodsId, cityId, timestamp) => {
    const str = goodsId + cityId + timestamp
    return md5(str)
}

// 如果不想安装库，可以使用浏览器原生API（异步）
export const generateSignBrowser = async (goodsId, cityId, timestamp) => {
    const str = goodsId + cityId + timestamp
    const msgBuffer = new TextEncoder().encode(str)
    const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}