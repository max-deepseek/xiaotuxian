/**
 * [AI 完成说明]
 * 功能：统一管理购物车数据，并在登录状态下同步服务端购物车。
 * 关键内容：
 * 1. 未登录时直接修改 Pinia 本地持久化数据；
 * 2. 登录时调用单品修改或全选接口，再拉取服务端最新列表；
 * 3. AI 在本轮补充了数量修改、单选、全选/取消全选的服务端同步。
 * 完成者：AI（Codex）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import {
  insertCartAPI,
  findNewCartListAPI,
  delCartAPI,
  updateCartItemAPI,
  updateAllCartAPI
} from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
  
  const userStore = useUserStore()
  // 登录状态计算属性
  const isLogin = computed(() => userStore.userInfo.token)
  // 1. 定义state - cartList
  const cartList = ref([])

  // 更新购物车列表
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    // [AI] 无论新增、删除、修改，最终都以服务端列表为唯一数据源
    cartList.value = res.result
  }

  // 2. 定义action - addCart
  const addCart = async (goods) => {
    const {skuId,count} = goods
    if (isLogin.value){
      await insertCartAPI({ skuId, count })
      const res = await findNewCartListAPI()
      cartList.value = res.result 
  } else {
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        item.count++
      } else {
        cartList.value.push(goods)
      }
  }

  }

  // 删除购物车
    // 删除购物车
    const delCart = async (skuId) => {
      if (isLogin.value) {
        // 调用接口实现接口购物车中的删除功能
        await delCartAPI([skuId])
        await updateNewList()
      } else {
        // 思路：
        // 1. 找到要删除项的下标值 - splice
        // 2. 使用数组的过滤方法 - filter
        const idx = cartList.value.findIndex((item) => skuId === item.skuId)
        cartList.value.splice(idx, 1)
      }
    }

  /**
   * [AI] 修改单个商品的数量或选中状态。
   * 登录时使用 PUT /member/cart/{skuId}；未登录时直接更新本地商品。
   */
  const updateCart = async (skuId, data) => {
    const item = cartList.value.find((cartItem) => cartItem.skuId === skuId)
    if (!item) return

    if (isLogin.value) {
      const res = await updateCartItemAPI(skuId, data)
      if (res.code !== '1') {
        await updateNewList()
        const error = new Error(res.msg || '购物车修改失败')
        error.isBusinessError = true
        throw error
      }
      await updateNewList()
    } else {
      Object.assign(item, data)
    }
  }

  // [AI] 单选：登录后同步服务端，未登录时更新本地 selected
  const singleCheck = (skuId, selected) => {
    return updateCart(skuId, { selected })
  }

  // [AI] 修改数量：登录后同步服务端，避免刷新页面后数量丢失
  const updateCount = (skuId, count) => {
    return updateCart(skuId, { count })
  }

  // [AI] 全选/取消全选：登录时传 selected 和全部 SKU id
  const allCheck = async (selected) => {
    if (isLogin.value) {
      const res = await updateAllCartAPI({
        selected,
        ids: cartList.value.map(item => item.skuId)
      })
      if (res.code !== '1') {
        await updateNewList()
        const error = new Error(res.msg || '购物车全选状态修改失败')
        error.isBusinessError = true
        throw error
      }
      await updateNewList()
    } else {
      cartList.value.forEach(item => {
        item.selected = selected
      })
    }
  }


  // 是否全选计算属性
  // [AI] 空购物车不应被判定为“已全选”
  const isAll = computed(() => {
    return cartList.value.length > 0 && cartList.value.every((item) => item.selected)
  })

  // 3. 已选择数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
  // 4. 已选择商品价钱合计
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

  // 新增计算属性，给模板用
  const allCount = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.count, 0)
  })
  const allPrice = computed(() => {
    return cartList.value.reduce((sum, item) => sum + item.count * item.price, 0)
  })

  // 退出登录清空购物车
  const clearCart = () => {
    cartList.value = []
  }

  return {
    cartList,
    addCart,
    delCart,
    allCount,
    allPrice,
    singleCheck,
    updateCount,
    isAll,
    allCheck,
    selectedCount,
    selectedPrice,
    clearCart,
    updateNewList
  }
}, {
  persist: true,
})
