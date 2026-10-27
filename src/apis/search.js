/**
 * [AI 完成说明]
 * 功能：封装商品搜索接口。
 * 关键内容：调用 POST /search/all，完整传递分页、关键词、排序字段和排序规则。
 * 完成者：AI（Codex）
 */
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
