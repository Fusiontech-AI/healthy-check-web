<template>
  <div>
    <ProForm ref="addInfoRef" :model="addInfo" :rules="addRules" :isPreview="isPreview" :fields="addFileds"
      :collapse="collapse" :col-count="2"></ProForm>

    <configuration ref="configurationRef" :configurationInfo="addInfo" :isPreview="isPreview"></configuration>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { optionsKS, optionsSuitSex, getOption, getList, getTypeList, optionsCheckType, optionsSpecimenNeedFlag, optionsSampleType, optionsProjectType, optionsFinancialType, optionsOutFlag, optionsSpecimenType } from "../hooks/useOptions";
import configuration from "./configuration.vue";
import ProForm from "./form.vue";
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

const addInfoRef = ref()


onMounted(() => {
  getList()
  getTypeList() //科室
})
const addRules = {
  combinProjectCode: [{ required: true, message: '请输入组合项目编码', trigger: 'blur' }],
  combinProjectName: [{ required: true, message: '请输入组合项目名称', trigger: 'blur' }],
  checkType: [{ required: true, message: '请输入检查类型', trigger: 'blur' }],
  ksId: [{ required: true, message: '请输入所属科室', trigger: 'blur' }],
  specimenNeedFlag: [{ required: true, message: '请输入是否需要标本', trigger: 'blur' }],
  standardAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  projectType: [{ required: true, message: '请输入项目类型', trigger: 'blur' }],
}

const addFileds = ref([
  {
    label: '组合项目编码',
    name: 'combinProjectCode',
    component: 'Input',
  },
  {
    label: '组合项目名称',
    name: 'combinProjectName',
    component: 'Input',
  },
  {
    label: '项目简称',
    name: 'combinSimpleName',
    component: 'Input',
  },
  {
    label: '项目拼音码',
    name: 'pySimpleCode',
    component: 'Input',
  },
  {
    label: '检查类型',
    name: 'checkType',
    component: 'Select',
    dict: optionsCheckType
  },
  {
    label: '所属科室',
    name: 'ksId',
    component: 'Select',
    dict: optionsKS
  },
  {
    label: '是否需要标本',
    name: 'specimenNeedFlag',
    component: 'Select',
    dict: optionsSpecimenNeedFlag
  },
  {
    label: '所属标本',
    name: 'specimenType',
    component: 'Select',
    dict: optionsSpecimenType
  },
  {
    label: '样本类型',
    name: 'sampleType',
    component: 'Select',
    dict: optionsSampleType
  },
  {
    label: '金额',
    name: 'standardAmount',
    component: 'Input',
  },
  {
    label: '项目最低折扣率',
    name: 'discount',
    component: 'Input',
  },
])

const collapse = ref([
  {
    label: 'LIS编码',
    name: 'lisCode',
    component: 'Input',
  },
  {
    label: 'PACS编码',
    name: 'pacsCode',
    component: 'Input',
  },
  {
    label: 'HIS编码',
    name: 'hisCode',
    component: 'Input',
  },
  {
    label: '职业病编码',
    name: 'zybCode',
    component: 'Input',
  },
  {
    label: '排序',
    name: 'projectSort',
    component: 'Input',
  },
  {
    label: '适应性别',
    name: 'suitSex',
    component: 'Select',
    dict: optionsSuitSex
  },
  {
    label: '项目类型',
    name: 'projectType',
    component: 'Select',
    dict: optionsProjectType
  },
  {
    label: '财务类别',
    name: 'financialType',
    component: 'Select',
    dict: optionsFinancialType
  },
  {
    label: '是否外送',
    name: 'outFlag',
    component: 'Select',
    dict: optionsOutFlag
  },
  {
    label: '外送回调地址',
    name: 'outAddress',
    component: 'Input',
  },
  {
    label: '当日预约上限',
    name: 'useLimit',
    component: 'Input',
  },
  {
    label: '是否进入隐私报告',
    name: 'privacyFlag',
    component: 'Select',
    dict: optionsOutFlag
  },
  {
    label: '是否进入指引单',
    name: 'guideFlag',
    component: 'Select',
    dict: optionsOutFlag
  },
  {
    label: '是否进入工作站',
    name: 'workerFlag',
    component: 'Select',
    dict: optionsOutFlag
  },
  {
    label: '指引单提示信息',
    name: 'guideNotice',
    component: 'Textarea',
    colCount: '1',
    'show-word-limit': true,
    maxlength: 20
  },
  {
    label: '项目临床意义',
    name: 'projectClinicalMean',
    component: 'Textarea',
    colCount: '1',
    'show-word-limit': true,
    maxlength: 100
  },
  {
    label: '项目描述',
    name: 'projectDescribe',
    component: 'Textarea',
    colCount: '1',
    'show-word-limit': true,
    maxlength: 100
  },
  {
    label: '组合项目状态',
    name: 'status',
    component: 'Switch',
    'active-value': '0',
    'active-label': '正常',
    'inactive-value': '1',
    'inactive-label': '停用',
  },
])

const configurationRef = ref(null)
// 监听是否需要标本,所属标本联动
watch(() => props.addInfo.specimenNeedFlag, (newVal) => {
  console.log('newVal', newVal);
  addFileds.value.forEach(item => {
    if (item.label == '所属标本') {
      item.disabled = newVal == 1 ? true : false
    }
  })
  if (newVal == 1) {
    props.addInfo.specimenType = null
  }
}, {
  immediate: true
})
//监听是否外送,外送回调地址联动
watch(() => props.addInfo.outFlag, (newVal) => {
  collapse.value.forEach(item => {
    if (item.label == '外送回调地址') {
      item.disabled = newVal == 1 ? true : false
    }
  })
  if (newVal == 1) {
    props.addInfo.outAddress = null
  }
}, {
  immediate: true
})

defineExpose({ addInfoRef, configurationRef })



</script>

<style scoped></style>