/**
 * [AI 完成说明]
 * 功能：封装商品详情、SKU 库存和热榜商品接口。
 * 关键内容：AI 新增 GET /goods/stock/{id}，用于按 SKU 查询最新价格与库存。
 * 完成者：AI（Codex）
 */
import httpInstance from '@/utils/http'


export const getDetail = (id) => {
  return httpInstance({
    url: '/goods',
    params: {
      id
    }
  })
}

/**
 * [AI] 获取指定 SKU 的最新价格和库存
 * @param {string|number} id SKU id
 */
export const getGoodsStockAPI = (id) => {
  return httpInstance({
    url: `/goods/stock/${id}`
  })
}

/**
 * 获取热榜商品
 * @param {Number} id - 商品id
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜
 * @param {Number} limit - 获取个数
 */
export const fetchHotGoodsAPI = ({ id, type, limit = 3 }) => {
  return httpInstance({
    url:'/goods/hot',
    params:{
      id, 
      type, 
      limit
    }
  })
}
