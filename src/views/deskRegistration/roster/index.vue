<template>
  <div class="table-box">
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
              <el-input v-model="searchParams.name" clearable :placeholder="`请输入姓名`"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select :filterable="true" v-model="searchParams.gender" clearable :placeholder="`请选择性别`" style="width: 100%;">
                <el-option v-for="option of sys_user_sex" :key="option.dictValue" :label="option.dictLabel" :value="option.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template #tableHeader="{ selectedList }">
        <div class="flex justify-between">
          <div>
            <el-button type="primary" @click="handleMergeArchives(selectedList, 1)">自动合并档案</el-button>
            <el-button type="primary" @click="handleMergeArchives(selectedList, 2)">选择合并档案</el-button>
          </div>
        </div>
      </template>
    </ProTable>
    <el-dialog title="选择合并档案" v-model="showMergeDialog">
      <div class="no-card">
        <ProTable ref="mergeTableRef" highlight-current-row :columns="mergeColumns" :toolButton="false" :data="mergeData" :pagination="false">
        </ProTable>
      </div>
      <div class="w-full flex justify-end mt-18px">
        <el-button @click="showMergeDialog = false">取消</el-button>
        <el-button type="primary" @click="submitMerge">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="roster" lang="tsx">
import _ from 'lodash';
import { ref } from 'vue';
import { getRegisterPage, mergeArchives } from '@/api/deskRegistration/deregistration'
import { dayjs } from 'element-plus';
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type, bus_category, sys_user_sex, bus_personnel_marriage_status, bus_healthy_check_status } = toRefs<any>(proxy?.useDict('bus_physical_type', 'bus_category', 'sys_user_sex', 'bus_personnel_marriage_status', 'bus_healthy_check_status'))
const showMergeDialog = ref(false)
const tableColumns = ref<any>([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'healthyCheckTime', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' }, defaultValue: [dayjs(new Date()).format("YYYY-MM-DD"), dayjs(new Date()).format("YYYY-MM-DD")]  }, isShow: false },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false, enum: bus_physical_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false, enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'phone', label: '电话', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '单位', search: { el: 'input' }, isShow: false },
  { prop: 'taskId', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'recordCode', label: '档案号', width: 120, fixed: 'left' },
  { prop: 'credentialNumber', label: '证件号', width: 170, fixed: 'left' },
  { prop: 'businessCategory', label: '业务类别', width: 100,enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'physicalType', label: '体检类型', width: 100, enum: bus_physical_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'name', label: '姓名' },
  { prop: 'marriageStatus', label: '婚否', enum: bus_personnel_marriage_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'healthyCheckTime', label: '体检日期', width: 100 },
  { prop: 'healthyCheckStatus', label: '体检状态', width: 100, enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'teamName', label: '单位', width: 160},
  { prop: 'groupName', label: '分组', },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: 100 },
  { prop: 'generalReviewTime', label: '总检时间', width: 100 },
  { prop: 'oldRecordCode', label: '旧档案号', width: 100 },
  { prop: 'mergeRecordTime', label: '合并时间', width: 100 },
  { prop: 'mergeRecordByName', label: '合并操作人', width: 100 },
])
const mergeColumns = ref<any>([
  { type: 'radio' },
  { prop: 'recordCode', label: '档案号' },
  { prop: 'healthyCheckCode', label: '体检号' },
  { prop: 'name', label: '姓名' },
  { prop: 'createTime', label: '创建时间' },
])
const proTableRef = ref()
const mergeTableRef = ref()
const mergeData = ref<any>([])

// 合并档案
const handleMergeArchives = (selectedList: any, type: number) => {
  if (selectedList.length < 2) return ElMessage.warning('请至少选择两项进行合并操作！')
  if (type === 1) {
    ElMessageBox.confirm('请确认自动合并档案？', '警告', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    }).then(async () => {
      await mergeArchives({
        isAuto: '0',
        dataList: selectedList.map(({ recordCode }: any) => { return { recordCode } })
      })
      ElMessage({
        message: '合并成功',
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
  } else {
    showMergeDialog.value = true
    mergeData.value = _.cloneDeep(selectedList)
    nextTick(() => {
      mergeTableRef.value.radio = ''
    })
  }

}
// 选择性合并提交
const submitMerge = async () => {
  if (!mergeTableRef.value.radio) return ElMessage.warning('请至少选择一项')
  const dataList = mergeData.value.map((item: any) => {
    if (item.id === mergeTableRef.value.radio) return { recordCode: item.recordCode, isChoose: '0' }
    return { recordCode: item.recordCode }
  })
  await mergeArchives({ dataList })
  ElMessage.success('合并成功！')
  showMergeDialog.value = false
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList()
}

const searchParams = ref({
  name: '',
  gender: '',
})
const getTableList = async (params: any) => {
  const { healthyCheckTime, ...p } = params
  const param = {
    healthyCheckTimeStart: healthyCheckTime?.[0] || '',
    healthyCheckTimeEnd: healthyCheckTime?.[1] || '',
    ...p,
    ...searchParams.value
  }
  return await getRegisterPage(param)
}
</script>
<style scoped lang="scss">
.color_ydy {
  width: 8px;
  height: 8px;
  background-color: purple;
}

.color_bdj {
  background-color: red;
}

:deep(.header-button-lf) {
  width: 100%;
}
</style>
