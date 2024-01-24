<template>
  <div>
    <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="4" :rules="rules"
      :disabled="false" label-position="right">
      <template #zjh>
        <div class="flex">
          <el-input v-model="input" placeholder="请输入" />
          <el-button round type="primary" class="ml10px">读取</el-button>
        </div>
      </template>
    </SearchForm>
    <el-button round type="primary" class="float-right">保存</el-button>
  </div>
</template>
<script setup name="groupRegistrationCheckRegistration" lang="ts">
const formColumns = reactive([
  {
    prop: 'name', label: '替检者姓名', search: { el: 'input' },
  },
  {
    prop: 'name', label: '替检人证件类型', search: { el: 'select' },
  },
  {
    prop: 'zjh', label: '替检者证件号', search: { el: 'input' }, slot: 'zjh',
  },
  {
    prop: 'name', label: '替检者电话', search: { el: 'input' },
  },
])
const input = ref('')
const formValue = ref<any>({ name: '1' }) // 基本信息绑定的值
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})
</script>
