<template>
  <div>
    <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="4" :rules="rules"
      :disabled="false" label-position="right">
    </SearchForm>
    <el-button type="primary" class="float-right" @click="handleBc">保存</el-button>
  </div>
</template>

<script setup name="groupRegistrationReportReceivingMethod" lang="ts">
import { baogaoColumns, baogaoRules } from './rowColumns'
import { changeReportReceiveWay } from '@/api/deskRegistration/medicalRegistration'
const props = defineProps({
  formValue: {
    type: Object,
    default: () => { },
  }
})
const formColumns = reactive(baogaoColumns)
// const formValue = ref<any>({}) // 基本信息绑定的值
const rules = reactive(baogaoRules)
const formRef = ref()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const handleBc = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      const { receiveWay, recipient, receiptPhone, postAddress } = props.formValue
      const p = {
        registerId: props.formValue.id,
        receiveWay,
        recipient, receiptPhone, postAddress
      }
      await changeReportReceiveWay(p)
      proxy?.$modal.msgSuccess("操作成功");
    }
  })
}
</script>
