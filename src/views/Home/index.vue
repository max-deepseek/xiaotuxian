<script setup>
/**
 * [AI 修改说明]
 * 功能：首页组件组合。
 * 关键内容：AI 在人气推荐后接入热门品牌模块。
 * 完成者：AI（Codex）
 */
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
import HomeBrands from './components/HomeBrands.vue'
import HomeProduct from './components/HomeProduct.vue'
import Homepanel from './components/HomePanel.vue'
</script>

<template>
  <div class="container">
  <HomeCategory />
  <HomeBanner />
  </div>
  <HomeNew />
  <HomeHot />
  <HomeBrands />
  <Homepanel></Homepanel>
  <homeProduct />
</template>
