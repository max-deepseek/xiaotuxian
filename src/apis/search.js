import httpInstance from '@/utils/http'

/**
 * 获取商品搜索结果
 * @param {object} params
 * @param {number} params.page 当前页
 * @param {number} params.pageSize 每页数量
 * @param {string} params.keyword 搜索关键词
 * @param {string} params.sortField 排序字段
 * @param {string} params.sortMethod 排序规则
 */
export const searchGoodsAPI = (params) => {
  return httpInstance({
    url: '/search/all',
    method: 'POST',
    data: params
  })
}
