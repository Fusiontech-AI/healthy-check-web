<template>
  <div>
    <div class="font-bold mb-3"><span></span>任务基础信息</div>
    <el-descriptions :column="3">
      <el-descriptions-item label="任务名称：">1111111111111111111</el-descriptions-item>
      <el-descriptions-item label="任务编号：">18100000000</el-descriptions-item>
      <el-descriptions-item label="单位名称：">Suzhou</el-descriptions-item>
      <el-descriptions-item label="体检类型：">健康体检 </el-descriptions-item>
      <el-descriptions-item label="联系人姓名：">哈哈</el-descriptions-item>
      <el-descriptions-item label="体检人联系电话：">哈哈</el-descriptions-item>
      <el-descriptions-item label="销售负责人：">哈哈</el-descriptions-item>
      <el-descriptions-item label="编制人：">哈哈</el-descriptions-item>
      <el-descriptions-item label="审核状态：">哈哈</el-descriptions-item>
    </el-descriptions>
    <div class="font-bold mb-3"><span></span>审核结论</div>
    审核结论：<el-select v-model="auditValue" placeholder="请选择">
      <el-option label="通过" value="1"></el-option>
      <el-option label="不通过" value="0"></el-option>
    </el-select>
    <div class="flex justify-center mt-4">
      <el-button @click="hanldeClose">取消</el-button>
      <el-button type="primary" @click="hanldeClose">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const auditValue = ref('')
const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>()
const hanldeClose = () => {
  emit('closeDialog')
}
</script>

<style scoped></style>
