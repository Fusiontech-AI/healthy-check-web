<template>
  <div>
    <SearchForm ref="addInfoRef" :columns="addColumns" :search-param="addInfo" :search-col="2" :rules="addRules"
      :preview="isPreview">
    </SearchForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addColumn } from '../rowColumns'

const props = defineProps({
  addInfo: {
    type: Object,
    default: {}
  },
  isPreview: {
    type: Boolean,
    default: false
  }
})

const addInfoRef = ref(null)
const addColumns = ref<any>(addColumn)


const addRules = {
  sampleCode: [{ required: true, message: '请输入样本编码', trigger: 'blur' }],
  sampleName: [{ required: true, message: '请输入样本名称', trigger: 'blur' }],
  sampleCategory: [{ required: true, message: '请输入所属类别', trigger: 'blur' }],
  sampleType: [{ required: true, message: '请输入标本类型', trigger: 'blur' }],
  barCodeType: [{ required: true, message: '请输入条码类型', trigger: 'blur' }],
  printSort: [{ pattern: /^[1-9]\d*$/, message: '请输入1-9999的正整数', trigger: 'blur' }]
}

watch(() => props.addInfo.printApplyFlag, (newVal) => {
  addColumns.value.forEach(item => {
    if (item.label == '申请单份数') {
      item.isShowSearch = props.addInfo.printApplyFlag == '0'
    }
  });

}, { immediate: true })

defineExpose({ addInfoRef })



</script>

<style scoped></style>