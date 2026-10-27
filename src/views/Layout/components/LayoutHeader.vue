<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import HeaderCart from './HeaderCart.vue'

const CategoryStore = useCategoryStore()
const route = useRoute()
const router = useRouter()
const searchText = ref('')

watch(() => route.query.keyword, (value) => {
  if (route.name === 'search') {
    searchText.value = String(value || '')
  }
}, { immediate: true })

const search = () => {
  const keyword = searchText.value.trim()
  if (!keyword) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({
    path: '/search',
    query: { keyword }
  })
}
</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>
      <ul class="app-header-nav">
        <li class="home" v-for="item in CategoryStore.categoryList" :key = "item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search" @click="search"></i>
        <input
          v-model="searchText"
          type="text"
          placeholder="搜一搜"
          aria-label="搜索商品"
          @keyup.enter="search"
        >
        <button type="button" @click="search">搜索</button>
      </div>
      <!-- 头部购物车 -->
       <HeaderCart />
    </div>
  </header>
</template>


<style scoped lang='scss'>
.app-header {
  background: #fff;

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
    }
  }

  .app-header-nav {
    width: 820px;
    display: flex;
    padding-left: 40px;
    position: relative;
    z-index: 998;
  
    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;
  
      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
  
        &:hover {
          color: $xtxColor;
          border-bottom: 1px solid $xtxColor;
        }
      }
  
      .active {
        color: $xtxColor;
        border-bottom: 1px solid $xtxColor;
      }
    }
  }

  .search {
    width: 210px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    display: flex;
    align-items: center;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
      cursor: pointer;
    }

    input {
      flex: 1;
      min-width: 0;
      padding-left: 5px;
      color: #666;
    }

    button {
      width: 42px;
      height: 26px;
      margin-right: 2px;
      border: 0;
      border-radius: 3px;
      background: $xtxColor;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
