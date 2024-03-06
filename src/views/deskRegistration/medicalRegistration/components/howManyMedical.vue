<template>
  <div>
    体检人员信息 <span v-if="num && formValue.credentialNumber">（第{{ num }}次）</span>
  </div>
</template>

<script setup name="howManyMedical" lang="ts">
import { registerGetPeTimes } from '@/api/deskRegistration/medicalRegistration'
const props = defineProps({
  formValue: {
    type: Object,
    default: () => { },
  },
})
const num = ref()
const getNum = async () => {
  const { credentialType, credentialNumber } = props.formValue
  const p = {
    credentialType,
    credentialNumber
  }
  const { data } = await registerGetPeTimes(p)
  num.value = data
}
defineExpose({ getNum })
</script>

<style scoped lang="scss"></style>
