// 管理用户数据相关

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, loginByCodeAPI } from '@/apis/user'
import { mergeCartAPI } from '@/apis/cart'
import { useCartStore } from './cartStore'

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  // 1. 定义管理用户数据的state
  const userInfo = ref({})

  // 登录成功后统一合并购物车并同步服务端购物车
  const completeLogin = async (result) => {
    userInfo.value = result
    try {
      await mergeCartAPI(cartStore.cartList.map(item => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count
      })))
      await cartStore.updateNewList()
    } catch (error) {
      userInfo.value = {}
      throw error
    }
  }

  const getLoginResult = (res) => {
    if (res.code !== '1' || !res.result?.token) {
      const error = new Error(res.msg || '登录失败')
      error.isBusinessError = true
      throw error
    }
    return res.result
  }

  // 2. 定义获取接口数据的action函数
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password })
    await completeLogin(getLoginResult(res))
  }

  // 手机验证码登录
  const getUserInfoByCode = async ({ mobile, code }) => {
    const res = await loginByCodeAPI({ mobile, code })
    await completeLogin(getLoginResult(res))
  }

   // 退出时清除用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
  }

  // 3. 以对象的格式把state和action return
  return {
    userInfo,
    getUserInfo,
    getUserInfoByCode,
    clearUserInfo
  }
}, {
  persist: true,
})
