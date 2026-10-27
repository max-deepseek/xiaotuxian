// 封装所有和用户相
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
 * 获取登录短信验证码
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
 * 手机验证码登录
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
