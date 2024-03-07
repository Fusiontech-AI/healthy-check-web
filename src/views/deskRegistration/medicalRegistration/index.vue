<template>
  <div class="p-2">
    <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :request-api="registerPage"
      label-position="right" :queryParams="queryParams" @selectionChange="selectionChange" height="450">
      <template #searchxm>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input clearable :placeholder="`请输入姓名`" v-model="queryParams.params.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select :filterable="true" clearable :placeholder="`请选择性别`" style="width: 100%;"
                v-model="queryParams.params.gender">
                <el-option v-for="option of sys_user_sex" :key="option.value" :label="option.label"
                  :value="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template #tableHeader>
        <div class="flex justify-between">
          <div>
            <el-button type="primary" round @click="handleBD">报到</el-button>
            <el-button type="primary" round @click="handleGj">个检登记</el-button>
            <el-button type="primary" round @click="handleTj">团检登记</el-button>
            <el-button type="primary" round @click="handleAdd">打印导检单</el-button>
            <el-button type="primary" round @click="handleAdd">打印条码</el-button>
            <el-button type="primary" round @click="handleGToT">个转团</el-button>
            <el-button type="primary" round @click="handleTToG">团转个</el-button>
            <el-button round>取消登记</el-button>
            <el-button round>取消报到</el-button>
          </div>
          <div class="flex">
            <div class="flex items-center mr-20px">
              <div class="color_ydy mr-10px"></div>
              条码或导检单已打印
            </div>
            <div class="flex items-center ">
              <div class="color_ydy color_bdj mr-10px"></div>
              体检被冻结
            </div>
          </div>
        </div>
      </template>

      <template #healthyCheckCode="{ row }">
        <el-button type="primary" link @click="handleXQ(row)">{{ row.healthyCheckCode }}</el-button>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleXQ(row)">详情</el-button>
        <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        <!-- <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="primary" link>更多操作</el-button>
          </template>
<div><el-button type="primary" link>编辑</el-button></div>
<el-button type="danger" link>删除</el-button>
</el-popover> -->
      </template>
    </ProTable>
    <el-dialog v-model="dialogVisible" title="个检转团检" width="30%" :append-to-body="true">
      <SearchForm ref="formRefGToT" :columns="formColumns" :search-param="formValue" :search-col="1" :rules="rules"
        label-position="right">
      </SearchForm>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogGToT">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="medicalRegistration" lang="tsx">
import { registerPage, registerTeamToPerson, registerPersonToTeam, registerDel, registerBatchReport } from '@/api/deskRegistration/medicalRegistration'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";
import { teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const proTableRef = ref<any>()
const teamIdList = ref<any>([]) //单位列表
const teamTaskLists = ref<any>([]) //任务列表
const teamGroupLists = ref<any>([]) //分组列表
const checkedList = ref([])
const dialogVisible = ref(false)
const queryParams = reactive<any>({
  params: {}
})

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data)

}
getTeamIdList()

// 单位改变
const handleTeamChange = async (val: any) => {
  const { rows } = await teamTaskList({ teamId: val })
  teamTaskLists.value = rows
}
// 任务改变
const handleTaskChange = async (val: any) => {
  const { rows } = await teamGroupList({ taskId: val, pagesize: -1, filterProject: 0 }) // 根据任务带出分组列表
  teamGroupLists.value = rows
}

const { sys_user_sex, bus_physical_type, bus_category, bus_healthy_check_status, bus_person_category, bus_personnel_marriage_status } = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_physical_type', 'bus_category', 'bus_healthy_check_status', 'bus_person_category', 'bus_personnel_marriage_status'))

const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  // { prop: 'gender', label: '性别', search: { el: 'select' }, enum: sys_user_sex, isShow: false },
  { prop: 'healthyCheckTimeArr', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }, isShow: false },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false, enum: bus_physical_type },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false, enum: bus_category },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '体检单位', search: { el: 'tree-select', 'check-strictly': true }, isShow: false, fieldNames: { label: 'teamName', value: 'id' }, enum: teamIdList, change: handleTeamChange },
  { prop: 'taskId', label: '任务名称', search: { el: 'select' }, isShow: false, enum: teamTaskLists, fieldNames: { label: 'taskName', value: 'id' }, change: handleTaskChange },
  { prop: 'generalReviewTimeArr', label: '终检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }, isShow: false },
  { prop: 'healthyCheckStatus', label: '体检状态', search: { el: 'select' }, isShow: false, enum: bus_healthy_check_status },
  { prop: 'personCategory', label: '人员类别', search: { el: 'select' }, isShow: false, enum: bus_person_category },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'chargeTimeArr', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }, isShow: false },
  { prop: 'createByName', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'guideSheetReceived', label: '回收', search: { el: 'select' }, isShow: false, enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'healthyCheckCode', label: '体检号' },
  { prop: 'recordCode', label: '档案号', width: 120 },
  { prop: 'credentialNumber', label: '证件号', width: 180 },
  { prop: 'businessCategory', label: '业务类别', enum: bus_category, width: 100 },
  { prop: 'physicalType', label: '体检类型', enum: bus_physical_type, width: 100 },
  { prop: 'name', label: '姓名', },
  { prop: 'marriageStatus', label: '婚否', enum: bus_personnel_marriage_status },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'healthyCheckTime', label: '体检日期', width: 100 },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'freezeStatus', label: '冻结', enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'healthyCheckStatus', label: '体检状态', enum: bus_healthy_check_status, width: 100 },
  { prop: 'needGeneralReview', label: '需要总检', enum: [{ value: '0', label: '需要总检' }, { value: '1', label: '无需总检' }], width: 100 },
  { prop: 'totalAmount', label: '总费用', },
  { prop: 'teamAmount', label: '团费', },
  { prop: 'personAmount', label: '个费', },
  { prop: 'teamName', label: '单位', width: 150 },
  { prop: 'groupName', label: '分组', width: 120 },
  { prop: 'deptName', label: '部门', width: 120 },
  { prop: 'name', label: '备注字段没得', width: 160 },
  { prop: 'introducerName', label: '介绍人', },
  { prop: 'createByName', label: '创建人', },
  { prop: 'registerDoctorName', label: '报到人', },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: 100 },
  { prop: 'generalReviewTime', label: '总检时间', width: 100 },
  { prop: 'auditDoctorName', label: '审核医生', width: 100 },
  { prop: 'auditTime', label: '审核时间', width: 100 },
  { prop: 'finishTime', label: '完成时间', width: 100 },
  { prop: 'operation', label: '操作', width: 140, fixed: 'right' }
])

const router = useRouter();
const handleAdd = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/checkRegistration");
}

//个检登记
const handleGj = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/checkRegistration");
}

//团检登记
const handleTj = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/groupRegistration");
}

//详情
const handleXQ = (row) => {
  if (row.businessCategory == 1) {
    router.push(`/deskRegistration/medicalRegistration-childPage/checkRegistration?id=${row.id}`);
  }
  if (row.businessCategory == 2) {
    router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration?id=${row.id}`);
  }
}



//报到
const handleBD = async () => {
  if (checkedList.value.length == 0) {
    proxy?.$modal.msgWarning("请选择人员");
    return
  }
  await proxy?.$modal.confirm('<span style="font-weight:bold">是否确定进行报到？</span><br/> 报到后可打印指引单和条码')
  registerBatchReport(checkedList.value)
  proxy?.$modal.msgSuccess("操作成功");
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}

//勾选
const selectionChange = (val) => {
  checkedList.value = []
  checkedList.value = val.map(item => item.id)
}

//团转个
const handleTToG = async () => {
  if (checkedList.value.length == 0) return proxy?.$modal.msgWarning("请选择人员操作!");
  await proxy?.$modal.confirm(`是否确认将选中的 <span>${checkedList.value.length}</span> 条数据变更为个检业务？`)
  await registerTeamToPerson({ regIds: checkedList.value })
  proxy?.$modal.msgSuccess("操作成功");
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
const formRefGToT = ref()
const formValue = ref({})
const formColumns = ref<any>([
  { prop: 'teamId', label: '单位名称', search: { el: 'tree-select', 'check-strictly': true }, enum: teamIdList, fieldNames: { label: 'teamName', value: 'id' }, change: handleTeamChange },
  { prop: 'taskId', label: '任务', search: { el: 'select', }, enum: teamTaskLists, fieldNames: { label: 'taskName', value: 'id' }, change: handleTaskChange },
  { prop: 'teamGroupId', label: '分组名称', search: { el: 'select', }, enum: teamGroupLists, fieldNames: { label: 'groupName', value: 'id' }, },
])
const rules = ref<any>({
  teamId: [{ required: true, message: '请选择单位', trigger: 'change' }],
  taskId: [{ required: true, message: '请选择任务', trigger: 'change' }],
})
//个转团
const handleGToT = async () => {
  if (checkedList.value.length == 0) return proxy?.$modal.msgWarning("请选择人员操作!");
  formValue.value = {}
  dialogVisible.value = true
}
//删除
const handleDel = async (row) => {
  await proxy?.$modal.confirm(`是否删除?`)
  await registerDel({ ids: [row.id] })
  proxy?.$modal.msgSuccess("操作成功");
  proTableRef.value?.clearSelection()
  proTableRef.value?.getTableList()
}
const dialogGToT = () => {
  formRefGToT.value?.validate(async (valid, fields) => {
    if (valid) {
      const p = {
        regIds: checkedList.value,
        ...formValue.value
      }
      await registerPersonToTeam(p)
      proxy?.$modal.msgSuccess("操作成功");
      dialogVisible.value = false
      proTableRef.value?.clearSelection()
      proTableRef.value?.getTableList()
    }
  })

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
