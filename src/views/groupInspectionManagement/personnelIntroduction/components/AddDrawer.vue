<template>
  <div class="text-[14px] h-full flex flex-col justify-between no-card">
    <div>
      <SearchForm ref="formRef" :columns="unitGroupColumns" :search-param="formValue" :rules="rules">
        <template #groupTitleComponent>
          <div class="font-bold card_title"><span></span>单位分组</div>
        </template>
        <template #infoTitleComponent>
          <div class="font-bold card_title"><span></span>基础信息</div>
        </template>
      </SearchForm>
    </div>
    <div class="flex justify-end mt-4">
      <el-button @click="hanldeClose">取消</el-button>
      <el-button type="primary" @click="hanldeClose">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { unitGroupColumn } from '../rowColumns'
const unitGroupColumns = ref<any>(unitGroupColumn)
const formValue = ref({})
const formRef = ref()
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})

const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>()
const hanldeClose = () => {
  emit('closeDialog')
}
</script>

<style scoped lang="scss">
.card_title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}
</style>
