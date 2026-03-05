// utils/productMapper.js

/**
 * 映射商品数据
 * @param {Object} item - 原始商品数据
 * @returns {Object} 标准化的商品数据
 */
export const mapProductItem = (item) => {
    return {
        id: item.id,
        goodsId: item.goodsId,
        title: item.goodsName || '商品',
        subTitle: item.bn || '',
        price: item.price || 0,
        imageUrl: item.imgUrl || '',
        hasPromotion: (item.pmList?.length > 0),
        isNew: item.isNew === 1
    }
}

/**
 * 映射轮播图数据
 * @param {Array} list - 原始轮播图列表
 * @returns {Array} 标准化的轮播图数据
 */
export const mapCarouselList = (list) => {
    if (!list || !Array.isArray(list)) return []

    return list.map(item => ({
        id: item.id,
        name: item.name || '',
        imgUrl: item.imgUrl || '',
        jumpUrl: item.jumpUrl || item.pcUrl || ''
    }))
}