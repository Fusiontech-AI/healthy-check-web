<template>
  <div>
    <SearchForm ref="addFormRef" :columns="addColumns" :search-param="addForm" :search-col="2" :rules="addRules"
      :preview="preview">
      <template #payTypeComponent>
        <el-form-item label="支付方式" prop="payType">
          <el-radio-group v-model="addForm.payType" class="ml-4" v-if="!preview">
            <el-radio v-for="(item, index) in radioList" :key="'ra' + index" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
          <span v-else>{{ optionsName(radioList, addForm.payType) }}</span>
        </el-form-item>
      </template>
    </SearchForm>
  </div>
</template>

<script setup lang="ts">
import useOption from "../hooks/useOptions";
const { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList } = useOption()
import { ref, reactive } from 'vue'
const props = defineProps({
  preview: {
    type: Boolean,
    default: false
  },
  taskoptions: {
    type: Array,
    default: []
  },
  addForm: {
    type: Object,
    default: () => {

    }
  }
})
const addFormRef = ref(null)
const addColumns = reactive([
  {
    prop: 'teamId',
    label: '单位名称',
    search: {
      el: 'select',
    },
    enum: teamIdList
  },
  {
    prop: 'teamTaskId',
    label: '任务',
    search: {
      el: 'select',
    },
    enum: props.taskoptions
  },
  {
    prop: 'name',
    label: '批次号',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'settleTime',
    label: '结算时间',
    search: {
      el: 'date-picker',
      props: {
        'value-format': 'YYYY-MM-DD HH:mm:ss',
        type: 'date'
      }
    }
  },
  {
    prop: 'receivedAmount',
    label: '实收金额',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'payType',
    label: '支付方式',
    search: {
      span: props.preview ? 1 : 2
    }
  },

])
const addRules = reactive({
  settleTime: [
    { required: true, message: '请选择结算时间', trigger: 'blur' },
  ],
  receivedAmount: [
    { required: true, message: '请填写实收金额', trigger: 'blur' },
  ]
})
//支付方式
const radioList = reactive([
  { label: '微信', value: '1' },
  { label: '支付宝', value: '2' },
  { label: '现金', value: '3' },
  { label: '银行卡', value: '4' },
])
// 得出支付方式
const optionsName = (arr, value) => {
  let TypeName = ''
  arr.forEach(item => {
    if (item.value == value) {
      TypeName = item.label
    }
  })
  return TypeName
}
defineExpose({ addFormRef })

</script>

<style scoped>
:deep(.form-search) {
  background-color: transparent;
}
</style>