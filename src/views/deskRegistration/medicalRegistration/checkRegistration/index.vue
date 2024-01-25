<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs bg-white" @tab-click="handleClick">
      <el-tab-pane label="个检登记" name="first">
        <Register />
      </el-tab-pane>
      <el-tab-pane label="替检登记" name="second">
        <TiJianRegister />
      </el-tab-pane>
      <el-tab-pane label="体检档案" name="third">Role</el-tab-pane>
      <el-tab-pane label="报告领取方式" name="fourth">
        <ReportReceivingMethod />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="checkRegistration" lang="ts">
import Register from '@/views/deskRegistration/medicalRegistration/checkRegistration/components/register.vue'
import TiJianRegister from '@/views/deskRegistration/medicalRegistration/checkRegistration/components/tiJianRegister.vue'
import ReportReceivingMethod from '@/views/deskRegistration/medicalRegistration/checkRegistration/components/reportReceivingMethod.vue'
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style scoped lang="scss">
:deep(.el-tabs__header) {
  margin-bottom: 0;
}
</style>
