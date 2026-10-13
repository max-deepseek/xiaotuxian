<template>
  <h1>测试Element Plus按需引入</h1>
  <el-button type="primary" @click="testMsg">点我弹出提示</el-button>
</template>

<script setup>
const testMsg = () => {
  ElMessage.success('按需引入成功！')
}
</script>

