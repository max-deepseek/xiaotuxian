/**
 * [AI 完成说明]
 * 功能：封装小兔鲜购物车相关请求。
 * 关键内容：登录购物车的新增、查询、删除、合并，以及本次新增的
 * 单品数量/选中状态修改和全选/取消全选。
 * 完成者：AI（Codex）
 */
import httpInstance from "@/utils/http"

// [AI] 加入购物车：请求体只需要 SKU id 和购买数量
export const insertCartAPI = ({ skuId, count }) => {
  return httpInstance({
    url: '/member/cart',
    method: 'POST',
    data: {
      skuId,
      count
    }
  })
}

// [AI] 获取服务端最新购物车列表
export const findNewCartListAPI = () => {
  return httpInstance({
    url: '/member/cart'
  })
}

// [AI] 删除购物车商品，后端要求通过请求体传递 SKU id 数组
export const delCartAPI = (ids) => {
  return httpInstance({
    url: '/member/cart',
    method: 'DELETE',
    data: {
      ids
    }
  })
}

// [AI] 登录后将本地购物车合并到服务端
export const mergeCartAPI = (data) => {
  return httpInstance({
    url: '/member/cart/merge',
    method: 'POST',
    data
  })
}

/**
 * [AI] 修改单个购物车商品的数量或选中状态。
 * 文档要求路径参数使用 SKU id；请求体传哪个字段就只更新哪个字段。
 */
export const updateCartItemAPI = (skuId, data) => {
  return httpInstance({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data
  })
}

/**
 * [AI] 修改购物车全选/取消全选。
 * 关键内容：必须同时传 selected 和当前购物车中的 SKU id 集合。
 */
export const updateAllCartAPI = ({ selected, ids }) => {
  return httpInstance({
    url: '/member/cart/selected',
    method: 'PUT',
    data: {
      selected,
      ids
    }
  })
}
