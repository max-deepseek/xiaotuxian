/**
 * [AI 完成说明]
 * 功能：用户登录、短信验证码和猜你喜欢接口。
 * 关键内容：AI 新增 GET /login/code（发送验证码）和
 * POST /login/code（手机验证码登录）两个方法。
 * 完成者：AI（Codex）
 */
import httpInstance from '@/utils/http'

export const loginAPI = ({ account, password }) => {
  return httpInstance({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password
    }
  })
}

/**
 * [AI] 获取登录短信验证码
 * @param {string} mobile 手机号
 */
export const getLoginCodeAPI = (mobile) => {
  return httpInstance({
    url: '/login/code',
    method: 'GET',
    params: {
      mobile
    }
  })
}

/**
 * [AI] 手机验证码登录
 * @param {object} params
 * @param {string} params.mobile 手机号
 * @param {string} params.code 验证码
 */
export const loginByCodeAPI = ({ mobile, code }) => {
  return httpInstance({
    url: '/login/code',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

export const getLikeListAPI = ({ limit = 4 }) => {
  return httpInstance({
    url:'/goods/relevant',
    params: {
      limit 
    }
  })
}
