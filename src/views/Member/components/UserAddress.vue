<script setup>
/**
 * [AI 完成说明]
 * 功能：收货地址管理页面，完整展示查询、新增、修改、删除功能。
 * 关键内容：
 * 1. 进入页面调用 GET /member/address；
 * 2. 新增/修改复用 AddressDialog；
 * 3. 删除前使用 Popconfirm 二次确认；
 * 4. isDefault=0 的地址展示为“默认地址”。
 * 完成者：AI（Codex）
 */
import { onMounted, ref } from 'vue'
import { deleteAddressAPI, getAddressListAPI } from '@/apis/address'
import AddressDialog from '@/components/AddressDialog.vue'

const addressList = ref([])
const loading = ref(false)
const showAddressDialog = ref(false)
const editingAddress = ref(null)

// [AI] 获取最新地址列表，并由页面统一维护列表状态
const getAddressList = async () => {
  loading.value = true
  try {
    const res = await getAddressListAPI()
    if (res.code === '1') {
      addressList.value = res.result
    }
  } catch {
    // HTTP 错误由拦截器统一提示
  } finally {
    loading.value = false
  }
}

// [AI] 新增与修改共用弹窗，传入 null 表示新增
const openAddressDialog = (address = null) => {
  editingAddress.value = address
  showAddressDialog.value = true
}

// [AI] 删除地址成功后重新查询，避免本地状态与服务端不一致
const removeAddress = async (address) => {
  try {
    const res = await deleteAddressAPI(address.id)
    if (res.code !== '1') {
      ElMessage.error(res.msg || '地址删除失败')
      return
    }
    ElMessage.success('地址删除成功')
    await getAddressList()
  } catch {
    // HTTP 错误由拦截器统一提示
  }
}

onMounted(getAddressList)
</script>

<template>
  <div class="address-manage">
    <div class="head">
      <div>
        <h3>收货地址</h3>
        <p>管理下单时使用的收货信息</p>
      </div>
      <el-button type="primary" @click="openAddressDialog()">添加地址</el-button>
    </div>

    <el-skeleton v-if="loading" :rows="5" animated />
    <el-empty v-else-if="!addressList.length" description="还没有收货地址">
      <el-button type="primary" @click="openAddressDialog()">添加第一个地址</el-button>
    </el-empty>
    <ul v-else class="address-list">
      <li v-for="address in addressList" :key="address.id">
        <div class="top-line">
          <div>
            <strong>{{ address.receiver }}</strong>
            <span>{{ address.contact }}</span>
          </div>
          <el-tag v-if="address.isDefault === 0" type="success" size="small">
            默认地址
          </el-tag>
        </div>
        <p class="location">{{ address.fullLocation }} {{ address.address }}</p>
        <p class="extra">
          <span v-if="address.postalCode">邮编：{{ address.postalCode }}</span>
          <span v-if="address.addressTags">标签：{{ address.addressTags }}</span>
        </p>
        <div class="actions">
          <el-button link type="primary" @click="openAddressDialog(address)">修改</el-button>
          <el-popconfirm
            title="确认删除这个收货地址吗？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="removeAddress(address)"
          >
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </li>
    </ul>

    <AddressDialog
      v-model="showAddressDialog"
      :address="editingAddress"
      @saved="getAddressList"
    />
  </div>
</template>

<style scoped lang="scss">
.address-manage {
  padding: 30px 40px 60px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
    border-bottom: 1px solid #f2f2f2;

    h3 {
      color: #333;
      font-size: 22px;
      font-weight: normal;
    }

    p {
      margin-top: 8px;
      color: #999;
    }
  }
}

.address-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding-top: 24px;

  li {
    position: relative;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #fafafa;
    transition: all 0.2s;

    &:hover {
      border-color: $xtxColor;
      background: #fff;
    }
  }

  .top-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;

    strong {
      margin-right: 18px;
      color: #333;
      font-size: 18px;
    }
  }

  .location {
    min-height: 48px;
    margin-top: 16px;
    color: #333;
    line-height: 24px;
  }

  .extra {
    display: flex;
    gap: 18px;
    min-height: 22px;
    color: #999;
    font-size: 13px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
  }
}
</style>
