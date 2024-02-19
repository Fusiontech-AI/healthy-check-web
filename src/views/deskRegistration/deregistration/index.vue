<template>
  <div>
    <ProTable
      ref="proTableRef"
      :columns="tableColumns"
      :toolButton="false"
      :request-api="getTableList"
      label-position="right"
      :searchCol="4"
      rowKey="id"
    >
      <template #searchxm>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="searchParams.name" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select v-model="searchParams.gender" :filterable="true" clearable placeholder="请选择性别" style="width: 100%;">
                <el-option v-for="option of sys_user_sex" :key="option.dictValue" :label="option.dictLabel" :value="option.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button type="primary" round :disabled="!isSelected" @click="handleReRegister(selectedListIds)">再次登记</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="deregistration" lang="tsx">
import { ref } from 'vue';
import { getRegisterPage, reRegistration } from "@/api/deskRegistration/deregistration";
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type, bus_category, bus_personnel_marriage_status, bus_healthy_check_status, needGeneralReview, sys_user_sex, bus_person_category } = toRefs<any>(proxy?.useDict('bus_physical_type', 'bus_category', 'bus_personnel_marriage_status', 'bus_healthy_check_status', 'needGeneralReview', 'sys_user_sex', 'bus_person_category'))
import { dayjs } from 'element-plus';
const tableColumns = ref<any>([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'healthyCheckTime', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD", clearable: true }}, isShow: false },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }], search: { el: 'select' }, isShow: false },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '单位', search: { el: 'select' }, isShow: false },
  { prop: 'generalReviewTime', label: '总检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD", clearable: true } }, isShow: false },
  { prop: 'healthyCheckStatus', label: '体检状态', search: { el: 'select' }, isShow: false },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'taskId', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'chargeTime', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD", clearable: true } }, isShow: false },
  { prop: 'createByName', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'personCategory', label: '人员类别', enum: bus_person_category, search: { el: 'select' }, isShow: false },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'recordCode', label: '档案号', fixed: 'left' },
  { prop: 'credentialNumber', label: '证件号', fixed: 'left', width: 180 },
  { prop: 'businessCategory', label: '业务类别', width: 100, enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'physicalType', label: '体检类型', width: 100, enum: bus_physical_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'name', label: '姓名' },
  { prop: 'marriageStatus', label: '婚否', enum: bus_personnel_marriage_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'healthyCheckTime', label: '体检日期', width: 100 },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }] },
  { prop: 'freezeStatus', label: '冻结', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }] },
  { prop: 'healthyCheckStatus', label: '体检状态', width: 100, enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'needGeneralReview', label: '需要总检', width: 100, enum: needGeneralReview, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'totalAmount', label: '总费用', },
  { prop: 'teamAmount', label: '团费', },
  { prop: 'personAmount', label: '个费', },
  { prop: 'teamName', label: '单位', },
  { prop: 'groupName', label: '分组', },
  { prop: 'deptName', label: '部门', },
  { prop: 'name', label: '备注', },
  { prop: 'introducerName', label: '介绍人', },
  { prop: 'createByName', label: '创建人', },
  { prop: 'registerDoctorName', label: '报到人', },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: 100 },
  { prop: 'generalReviewTime', label: '总检时间', width: 100 },
  { prop: 'auditDoctorName', label: '审核医生', width: 100 },
  { prop: 'auditTime', label: '审核时间', width: 100 },
  { prop: 'finishTime', label: '完成时间', width: 100 },
  { prop: 'cancelRegisterTime', label: '取消登记时间', width: 120 },
])
const proTableRef = ref()
const searchParams = ref({
  name: '',
  gender: '',
  // healthyCheckTime: [dayjs(new Date()).format("YYYY-MM-DD"), dayjs(new Date()).format("YYYY-MM-DD")]
})
const handleReRegister = (ids: any) => {
  console.log(ids);
  if (ids.length == 0) return ElMessage({ type: 'warning', message: '请先选择一项' })
  ElMessageBox.confirm('请确认再次登记？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning'
  }).then(async () => {
    await reRegistration(ids)
    ElMessage({
      message: '登记成功',
      type: 'success',
    })
    proTableRef.value?.clearSelection();
    proTableRef.value?.getTableList()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}
const getTableList = async (params: any) => {
  const { healthyCheckTime,chargeTime,generalReviewTime, ...p } = params
  const param = {
    status: '1',
    healthyCheckTimeStart: healthyCheckTime?.[0] || '',
    healthyCheckTimeEnd: healthyCheckTime?.[1] || '',
    chargeTimeStart: chargeTime?.[0] || '',
    chargeTimeEnd: chargeTime?.[1] || '',
    generalReviewTimeStart: generalReviewTime?.[0] || '',
    generalReviewTimeEnd: generalReviewTime?.[1] || '',
    ...p,
    ...searchParams.value
  }
  return await getRegisterPage(param)
}
</script>
<style scoped lang="scss"></style>
