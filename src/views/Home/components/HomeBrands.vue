<script setup>
/**
 * [AI 完成说明]
 * 功能：首页热门品牌展示。
 * 关键内容：调用热门品牌接口，处理加载中、加载失败和空列表状态。
 * 完成者：AI（Codex）
 */
import { onMounted, ref } from 'vue'
import { getBrandAPI } from '@/apis/home'
import HomePanel from './HomePanel.vue'

const brandList = ref([])
const loading = ref(true)
const loadFailed = ref(false)

// [AI] 获取10个热门品牌，业务状态不是1时展示失败状态
const getBrandList = async () => {
  try {
    const res = await getBrandAPI(10)
    if (res.code === '1') {
      brandList.value = res.result
    } else {
      loadFailed.value = true
    }
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(getBrandList)
</script>

<template>
  <HomePanel title="热门品牌" sub-title="品质品牌 放心之选">
    <template #main>
      <el-skeleton v-if="loading" :rows="3" animated class="brand-loading" />
      <el-empty
        v-else-if="loadFailed"
        description="热门品牌加载失败，请稍后重试"
        :image-size="80"
      />
      <ul v-else class="brand-list">
        <li v-for="brand in brandList" :key="brand.id">
          <img :src="brand.picture" :alt="brand.name" />
          <div class="info">
            <p class="name">{{ brand.name }}</p>
            <p class="english">{{ brand.nameEn }}</p>
            <p class="desc">{{ brand.desc }}</p>
            <p class="place">{{ brand.place }}</p>
          </div>
        </li>
      </ul>
    </template>
  </HomePanel>
</template>

<style scoped lang="scss">
.brand-loading {
  padding: 10px 0 30px;
}

.brand-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-bottom: 30px;

  li {
    min-width: 0;
    padding: 18px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    background: #fafafa;
    text-align: center;
    transition: all 0.3s;

    &:hover {
      border-color: $xtxColor;
      background: #fff;
      transform: translateY(-3px);
      box-shadow: 0 4px 14px rgb(0 0 0 / 8%);
    }

    img {
      width: 100%;
      height: 150px;
      object-fit: contain;
      background: #fff;
      border-radius: 4px;
    }
  }

  .info {
    min-width: 0;
    padding-top: 12px;
  }

  .name {
    font-size: 18px;
    color: #333;
  }

  .english,
  .desc,
  .place {
    margin-top: 6px;
    overflow: hidden;
    color: #999;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .english {
    color: $xtxColor;
  }
}
</style>
