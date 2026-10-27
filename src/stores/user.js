/**
 * [AI 完成说明]
 * 功能：管理登录用户信息，并统一处理两种登录方式成功后的购物车合并。
 * 关键内容：AI 新增手机验证码登录、业务状态校验和购物车同步，
 * 登录失败时回滚用户信息。
 * 完成者：AI（Codex）
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, loginByCodeAPI } from '@/apis/user'
import { mergeCartAPI } from '@/apis/cart'
import { useCartStore } from './cartStore'

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore()
  // 1. 定义管理用户数据的state
  const userInfo = ref({})

  // [AI] 登录成功后统一合并购物车并同步服务端购物车
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

  // [AI] 手机验证码登录
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
