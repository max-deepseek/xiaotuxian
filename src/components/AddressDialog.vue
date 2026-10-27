<script setup>
/**
 * [AI 完成说明]
 * 功能：新增和编辑收货地址的复用弹窗。
 * 关键内容：
 * 1. 表单字段与接口文档保持一致；
 * 2. 通过 address.id 判断当前是新增还是修改；
 * 3. 使用 isDefault=0 表示默认地址，isDefault=1 表示非默认地址；
 * 4. 保存成功后通知父组件重新获取地址列表。
 * 完成者：AI（Codex）
 */
import { nextTick, reactive, ref, watch } from 'vue'
import { addAddressAPI, updateAddressAPI } from '@/apis/address'

const visible = defineModel({ type: Boolean, default: false })
const props = defineProps({
  address: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['saved'])

const formRef = ref(null)
const submitting = ref(false)
const defaultAddress = ref(true)
const form = reactive({
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  fullLocation: '',
  address: '',
  postalCode: '',
  addressTags: ''
})

const rules = {
  receiver: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  provinceCode: [
    { required: true, message: '请输入省份编码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '省份编码应为6位数字', trigger: 'blur' }
  ],
  cityCode: [
    { required: true, message: '请输入城市编码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '城市编码应为6位数字', trigger: 'blur' }
  ],
  countyCode: [
    { required: true, message: '请输入区县编码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '区县编码应为6位数字', trigger: 'blur' }
  ],
  fullLocation: [
    { required: true, message: '请输入省、市、区完整名称', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// [AI] 每次打开弹窗时，根据“新增/编辑”状态重置表单，避免复用旧数据
const fillForm = () => {
  const address = props.address
  Object.assign(form, {
    receiver: address?.receiver || '',
    contact: address?.contact || '',
    provinceCode: address?.provinceCode || '',
    cityCode: address?.cityCode || '',
    countyCode: address?.countyCode || '',
    fullLocation: address?.fullLocation || '',
    address: address?.address || '',
    postalCode: address?.postalCode || '',
    addressTags: address?.addressTags || ''
  })
  defaultAddress.value = address ? address.isDefault === 0 : true
  nextTick(() => formRef.value?.clearValidate())
}

watch([visible, () => props.address], ([isOpen]) => {
  if (isOpen) fillForm()
}, { immediate: true })

// [AI] 提交时统一转换默认地址标记，并按是否存在 id 选择新增或修改接口
const submit = async () => {
  if (submitting.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const payload = {
      ...form,
      isDefault: defaultAddress.value ? 0 : 1
    }
    const res = props.address?.id
      ? await updateAddressAPI(props.address.id, payload)
      : await addAddressAPI(payload)

    if (res.code !== '1') {
      ElMessage.error(res.msg || '地址保存失败')
      return
    }

    ElMessage.success(props.address?.id ? '地址修改成功' : '地址添加成功')
    visible.value = false
    // [AI] 把保存后的地址 id 交给父组件，便于结算页优先选中刚编辑的地址
    emit('saved', res.result?.id)
  } catch {
    // 网络错误由 HTTP 拦截器统一提示
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="address?.id ? '修改收货地址' : '添加收货地址'"
    width="680px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="96px"
      status-icon
    >
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="收货人" prop="receiver">
            <el-input v-model="form.receiver" maxlength="20" placeholder="请输入收货人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="form.contact" maxlength="11" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="省份编码" prop="provinceCode">
            <el-input v-model="form.provinceCode" maxlength="6" placeholder="如 210000" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市编码" prop="cityCode">
            <el-input v-model="form.cityCode" maxlength="6" placeholder="如 210200" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区县编码" prop="countyCode">
            <el-input v-model="form.countyCode" maxlength="6" placeholder="如 210202" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="所在地区" prop="fullLocation">
        <el-input
          v-model="form.fullLocation"
          placeholder="请输入省、市、区名称，如：辽宁省 大连市 中山区"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="2"
          placeholder="请输入街道、门牌号等详细地址"
        />
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="邮政编码">
            <el-input v-model="form.postalCode" maxlength="10" placeholder="选填" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址标签">
            <el-input v-model="form.addressTags" placeholder="如：家里、公司" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="默认地址">
        <el-switch v-model="defaultAddress" />
        <span class="default-tip">开启后下单时优先使用该地址</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        保存地址
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.default-tip {
  margin-left: 12px;
  color: #999;
  font-size: 13px;
}
</style>
