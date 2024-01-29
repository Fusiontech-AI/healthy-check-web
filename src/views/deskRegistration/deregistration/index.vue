<template>
  <div>
    <ProTable :columns="tableColumns" :toolButton="false" :request-api="getTableList" label-position="right"
      :searchCol="4">
      <template #searchxm>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input clearable :placeholder="`请输入姓名`"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select :filterable="true" clearable :placeholder="`请选择性别`" style="width: 100%;">
                <el-option v-for="option of options" :key="option.value" :label="option.name"
                  :value="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template #tableHeader="scope">
        <div class="flex justify-between">
          <div>
            <el-button type="primary" round>再次登记</el-button>
          </div>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="deregistration" lang="tsx">
import { ref } from 'vue';
import { getRegisterPage } from "@/api/deskRegistration/deregistration";
import { dayjs } from 'element-plus';
const tableColumns = ref<any>([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'healthyCheckTime', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD", }, defaultValue: [dayjs(new Date()).format("YYYY-MM-DD"), dayjs(new Date()).format("YYYY-MM-DD")] } },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }], search: { el: 'select' }, isShow: false },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '单位', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '终检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'healthyCheckStatus', label: '体检状态', search: { el: 'select' }, isShow: false },
  { prop: 'checkType', label: '体检类别', search: { el: 'select' }, isShow: false },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'taskId', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'createBy', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'status', label: '人员类别', enum: [{ label: '正常', value: '0' }, { label: '否', value: '取消登记' }], search: { el: 'select' }, isShow: false },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'recordCode', label: '档案号', fixed: 'left' },
  { prop: 'credentialNumber', label: '证件号', fixed: 'left' },
  { prop: 'businessCategory', label: '业务类别', width: 100 },
  { prop: 'physicalType', label: '体检类型', width: 100 },
  { prop: 'name', label: '姓名' },
  { prop: 'marriageStatus', label: '婚否' },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', },
  { prop: 'healthyCheckTime', label: '体检日期', width: 100 },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }] },
  { prop: 'freezeStatus', label: '冻结', enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }] },
  { prop: 'healthyCheckStatus', label: '体检状态', width: 100 },
  { prop: 'needGeneralReview', label: '需要总检', width: 100 },
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
const options = ref<any>([])

const getTableList = async (params: any) => {
  const { healthyCheckTime, ...p } = params
  const param = {
    healthyCheckTimeStart: healthyCheckTime?.[0],
    healthyCheckTimeEnd: healthyCheckTime?.[1],
    ...p
  }
  console.log(params);

  // const { rows } = await getRegisterPage(param)
  // console.log(rows);
}
</script>
<style scoped lang="scss"></style>
