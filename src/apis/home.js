/**
 * [AI 完成说明]
 * 功能：封装首页轮播图、新鲜好物、人气推荐、热门品牌和楼层商品接口。
 * 关键内容：AI 新增 GET /home/brand?limit=10 热门品牌接口。
 * 完成者：AI（Codex）
 */
import httpInstance from '@/utils/http'

/**
 * @description: 获取banner图
 * @param {*}
 * @return {*}
 */
export function getBannerAPI (params = {}) {
  // 默认为1 商品为2
  const { distributionSite = '1' } = params
  return httpInstance({
    url: '/home/banner',
    params: {
      distributionSite
    }
  })
}
/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
  return httpInstance({
    url:'/home/new'
  })
}

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
  return httpInstance({
    url: '/home/hot',
    method: 'get'
  })
}

/**
 * [AI] 获取热门品牌
 * @param {*} limit 品牌数量
 * @return {*}
 */
export const getBrandAPI = (limit = 10) => {
  return httpInstance({
    url: '/home/brand',
    params: {
      limit
    }
  })
}

/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}
