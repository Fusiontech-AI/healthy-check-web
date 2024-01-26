<template>
  <div>
    <SearchForm ref="addInfoRef" :columns="addColumns" :search-param="addInfo" :search-col="2" :rules="addRules"
      :preview="isPreview">
    </SearchForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addColumn } from "../rowColumns";
import useOptions from "../hooks/useOptions";
const { optionsUnit,
  optionsResultType,
  optionsResultGetWay,
  optionsKS,
  optionsSuitSex,
  optionsEnterSummary,
  optionsEnterReport } = useOptions()
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
const addRules = reactive({
  basicProjectCode: [{ required: true, message: '请输入项目编码', trigger: 'blur' }],
  basicProjectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  ksId: [{ required: true, message: '请输入所属科室', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
  resultType: [{ required: true, message: '请输入结果类型', trigger: 'blur' }],
  resultGetWay: [{ required: true, message: '请输入结果获取', trigger: 'blur' }],
  projectSort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

defineExpose({ addInfoRef })

</script>

<style scoped></style>