import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { insertCartAPI,findNewCartListAPI } from '@/apis/cart'
import useStore from 'element-plus/es/components/table/src/store/index.mjs'

export const useCartStore = defineStore('cart', () => {
  
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  // 1. 定义state - cartList
  const cartList = ref([])


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
  const delCart = (skuId) => {
    const idx = cartList.value.findIndex((item) => skuId === item.skuId)
    if (idx !== -1) {
      cartList.value.splice(idx, 1)
    }
  }

  // 单选功能
  const singleCheck = (skuId, selected) => {
    // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }

  // 全选功能action
  const allCheck = (selected) => {
    // 把cartList中的每一项的selected都设置为当前的全选框状态
    cartList.value.forEach(item => item.selected = selected)
  }


  // 是否全选计算属性
  const isAll = computed(() => cartList.value.every((item) => item.selected))

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

  return {
    cartList,
    addCart,
    delCart,
    allCount,
    allPrice,
    singleCheck,
    isAll,
    allCheck,
    selectedCount,
    selectedPrice
  }
}, {
  persist: true,
})
