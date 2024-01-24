<template>
  <div>
    <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="4" :rules="rules"
      :disabled="false" label-position="right">
    </SearchForm>
    <el-button round type="primary" class="float-right">保存</el-button>
  </div>
</template>
<script setup name="reportReceivingMethod" lang="ts">
const formColumns = reactive([
  {
    prop: 'name', label: '领取方式', search: { el: 'select' },
  },
  {
    prop: 'name', label: '收件人', search: { el: 'input' },
  },
  {
    prop: 'zjh', label: '收件电话', search: { el: 'input' },
  },
  {
    prop: 'name', label: '邮寄地址', search: { el: 'input' },
  },
])
const formValue = ref<any>({ name: '1' }) // 基本信息绑定的值
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})
</script>
