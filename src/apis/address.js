/**
 * [AI 完成说明]
 * 功能：封装小兔鲜收货地址的查询、新增、修改和删除接口。
 * 关键内容：除了原有 path 参数和请求体都严格对齐接口文档外，
 * isDefault 使用 0 表示默认地址、1 表示非默认地址。
 * 完成者：AI（Codex）
 */
import httpInstance from '@/utils/http'

// [AI] 获取当前登录用户的全部收货地址
export const getAddressListAPI = () => {
  return httpInstance({
    url: '/member/address'
  })
}

// [AI] 新增收货地址，data 必须包含完整的地址与行政区划字段
export const addAddressAPI = (data) => {
  return httpInstance({
    url: '/member/address',
    method: 'POST',
    data
  })
}

// [AI] 修改指定收货地址，路径 id 必须是地址 id，而不是用户 id
export const updateAddressAPI = (id, data) => {
  return httpInstance({
    url: `/member/address/${id}`,
    method: 'PUT',
    data: {
      ...data,
      id
    }
  })
}

// [AI] 删除指定收货地址
export const deleteAddressAPI = (id) => {
  return httpInstance({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}
