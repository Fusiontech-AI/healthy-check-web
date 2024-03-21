<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs bg-white" @tab-click="handleClick">
      <el-tab-pane label="团检登记" name="first">
        <Register ref="register" />
      </el-tab-pane>
      <el-tab-pane label="替检登记" name="second" v-if="register?.formValue.id">
        <TiJianRegister :formValue="register?.formValue" :getDetail="register?.getDetail" />
      </el-tab-pane>
      <el-tab-pane label="体检档案" name="third" v-if="register?.formValue.id">
        <MedicalExaminationFile :formValue="register?.formValue" v-if="activeName == 'third'" />
      </el-tab-pane>
      <el-tab-pane label="报告领取方式" name="fourth" v-if="register?.formValue.id">
        <ReportReceivingMethod :formValue="register?.formValue" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="groupRegistration" lang="ts">
import Register from '@/views/deskRegistration/medicalRegistration/groupRegistration/register.vue'
import TiJianRegister from '@/views/deskRegistration/medicalRegistration/components/tiJianRegister.vue'
import MedicalExaminationFile from '@/views/deskRegistration/medicalRegistration/components/medicalExaminationFile.vue'
import ReportReceivingMethod from '@/views/deskRegistration/medicalRegistration/components/reportReceivingMethod.vue'
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const register = ref()
const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.props.name
}

</script>

<style scoped lang="scss">
:deep(.el-tabs__header) {
  margin-bottom: 0;
}
</style>
