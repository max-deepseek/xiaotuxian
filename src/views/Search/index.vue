<script setup>
/**
 * [AI 完成说明]
 * 功能：商品搜索结果页。
 * 关键内容：
 * 1. 调用 POST /search/all 完成关键词搜索；
 * 2. 支持综合、最新、销量、人气、价格升降序和分页；
 * 3. 使用 requestId 防止慢请求覆盖新结果；
 * 4. 搜索服务异常时展示明确错误状态。
 * 完成者：AI（Codex）
 */
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchGoodsAPI } from '@/apis/search'
import GoodsItem from '@/views/Home/components/GoodsItem.vue'

const route = useRoute()
const keyword = computed(() => String(route.query.keyword || '').trim())
const goodsList = ref([])
const total = ref(0)
const loading = ref(false)
const searchError = ref(false)
const page = ref(1)
const pageSize = 10
const sortField = ref('')
const sortMethod = ref('')
let requestId = 0

const sortOptions = [
  { label: '最新商品', field: 'publishTime' },
  { label: '销量优先', field: 'orderNum' },
  { label: '人气优先', field: 'evaluateNum' }
]

const isDefaultSort = computed(() => !sortField.value)
const isPriceSort = computed(() => sortField.value === 'price')

// [AI] 按当前关键词、排序和页码获取结果，并忽略过期请求
const getSearchResult = async () => {
  if (!keyword.value) {
    requestId++
    loading.value = false
    goodsList.value = []
    total.value = 0
    searchError.value = false
    return
  }

  const currentRequest = ++requestId
  loading.value = true
  searchError.value = false
  try {
    const res = await searchGoodsAPI({
      page: page.value,
      pageSize,
      keyword: keyword.value,
      sortField: sortField.value,
      sortMethod: sortMethod.value
    })
    if (currentRequest !== requestId) return

    if (res.code === '1') {
      goodsList.value = res.result.pageData.items
      total.value = res.result.pageData.counts
    } else {
      goodsList.value = []
      total.value = 0
      searchError.value = true
    }
  } catch {
    if (currentRequest === requestId) {
      goodsList.value = []
      total.value = 0
      searchError.value = true
    }
  } finally {
    if (currentRequest === requestId) {
      loading.value = false
    }
  }
}

const changeSort = (field, method = 'desc') => {
  sortField.value = field
  sortMethod.value = method
  page.value = 1
  getSearchResult()
}

const togglePriceSort = () => {
  const nextMethod = isPriceSort.value && sortMethod.value === 'asc' ? 'desc' : 'asc'
  changeSort('price', nextMethod)
}

const changePage = (currentPage) => {
  page.value = currentPage
  getSearchResult()
}

watch(keyword, () => {
  page.value = 1
  sortField.value = ''
  sortMethod.value = ''
  getSearchResult()
}, { immediate: true })
</script>

<template>
  <div class="search-page">
    <div class="container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品搜索</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="search-summary">
        <template v-if="keyword">
          “{{ keyword }}” 共找到
          <strong>{{ total }}</strong>
          件商品
        </template>
        <template v-else>请输入关键词搜索商品</template>
      </div>

      <div class="sort-bar">
        <button
          type="button"
          :class="{ active: isDefaultSort }"
          @click="changeSort('', '')"
        >
          综合
        </button>
        <button
          v-for="option in sortOptions"
          :key="option.field"
          type="button"
          :class="{ active: sortField === option.field }"
          @click="changeSort(option.field)"
        >
          {{ option.label }}
        </button>
        <button
          type="button"
          class="price-sort"
          :class="{ active: isPriceSort }"
          @click="togglePriceSort"
        >
          价格
          <span class="arrows">
            <i :class="{ active: isPriceSort && sortMethod === 'asc' }">▲</i>
            <i :class="{ active: isPriceSort && sortMethod === 'desc' }">▼</i>
          </span>
        </button>
      </div>

      <div class="result-panel">
        <div v-if="loading" class="loading">
          <el-skeleton :rows="5" animated />
        </div>
        <el-empty
          v-else-if="searchError"
          description="搜索服务暂时不可用，请稍后重试"
        />
        <el-empty
          v-else-if="!goodsList.length"
          :description="keyword ? '没有找到相关商品' : '请输入关键词后搜索'"
        />
        <div v-else class="goods-list">
          <GoodsItem
            v-for="goods in goodsList"
            :key="goods.id"
            :goods="goods"
          />
        </div>
      </div>

      <div v-if="total > pageSize" class="pagination">
        <el-pagination
          :current-page="page"
          :total="total"
          :page-size="pageSize"
          background
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-page {
  padding-top: 20px;

  > .container {
    padding: 25px 30px 50px;
    background: #fff;
  }
}

.search-summary {
  padding: 24px 0 18px;
  color: #666;
  font-size: 16px;

  strong {
    color: $priceColor;
    font-size: 20px;
  }
}

.sort-bar {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 18px;
  border: 1px solid #f0f0f0;
  background: #fafafa;

  button {
    height: 32px;
    margin-right: 8px;
    padding: 0 18px;
    border: 1px solid transparent;
    background: transparent;
    color: #666;
    cursor: pointer;

    &:hover,
    &.active {
      border-color: $xtxColor;
      background: #fff;
      color: $xtxColor;
    }
  }
}

.arrows {
  display: inline-flex;
  flex-direction: column;
  margin-left: 6px;
  vertical-align: middle;

  i {
    color: #bbb;
    font-size: 8px;
    font-style: normal;
    line-height: 9px;

    &.active {
      color: $xtxColor;
    }
  }
}

.result-panel {
  min-height: 420px;
  padding: 20px 0;
}

.loading {
  padding: 30px;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
</style>
