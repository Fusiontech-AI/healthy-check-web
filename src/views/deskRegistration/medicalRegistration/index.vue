<template>
  <div class="p-2">
    <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :request-api="registerPage"
      label-position="right" :queryParams="queryParams" @selectionChange="selectionChange">
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
      <template #teamId>
        <el-tree-select v-model="queryParams.params.teamId" :data="teamIdList" check-strictly
          :props="{ label: 'teamName', value: 'id' }" filterable clearable @change="handleChange" />
      </template>
      <template #tableHeader>
        <div class="flex justify-between">
          <div>
            <el-button type="primary" round @click="handleBD">报到</el-button>
            <el-button type="primary" round @click="handleGj">个检登记</el-button>
            <el-button type="primary" round @click="handleTj">团检登记</el-button>
            <el-button type="primary" round @click="handleAdd">打印导检单</el-button>
            <el-button type="primary" round @click="handleAdd">打印条码</el-button>
            <el-button type="primary" round @click="handleAdd">个转团</el-button>
            <el-button type="primary" round @click="handleAdd">团转个</el-button>
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
        <el-button type="primary" link>{{ row.healthyCheckCode }}</el-button>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleXQ(row)">详情</el-button>
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="primary" link>更多操作</el-button>
          </template>
          <div><el-button type="primary" link>编辑</el-button></div>
          <el-button type="danger" link>删除</el-button>
        </el-popover>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="medicalRegistration" lang="tsx">
import { registerPage } from '@/api/deskRegistration/medicalRegistration'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const proTableRef = ref<any>()
const teamIdList = ref<any>([]) //单位列表
const teamTaskLists = ref<any>([]) //任务列表
const checkedList = ref([])
const queryParams = reactive<any>({
  params: {}
})

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  const { rows } = await teamTaskList({ pageSize: -1 })
  teamIdList.value = proxy?.handleTree<any>(data)
  teamTaskLists.value = rows
}
getTeamIdList()

const { sys_user_sex, bus_physical_type, bus_category, bus_healthy_check_status, bus_person_category, bus_personnel_marriage_status } = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_physical_type', 'bus_category', 'bus_healthy_check_status', 'bus_person_category', 'bus_personnel_marriage_status'))
const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  // { prop: 'gender', label: '性别', search: { el: 'select' }, enum: sys_user_sex, isShow: false },
  { prop: 'healthyCheckTimeArr', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false, enum: bus_physical_type },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false, enum: bus_category },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '体检单位', search: { el: 'select', }, isShow: false, slot: 'teamId' },
  { prop: 'generalReviewTimeArr', label: '终检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'healthyCheckStatus', label: '体检状态', search: { el: 'select' }, isShow: false, enum: bus_healthy_check_status },
  { prop: 'personCategory', label: '人员类别', search: { el: 'select' }, isShow: false, enum: bus_person_category },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'taskId', label: '任务名称', search: { el: 'select' }, isShow: false, enum: teamTaskLists, fieldNames: { label: 'taskName', value: 'id' } },
  { prop: 'chargeTimeArr', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'createByName', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'guideSheetReceived', label: '回收', search: { el: 'select' }, isShow: false, enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'healthyCheckCode', label: '体检号' },
  { prop: 'recordCode', label: '档案号' },
  { prop: 'credentialNumber', label: '证件号' },
  { prop: 'businessCategory', label: '业务类别', enum: bus_category },
  { prop: 'physicalType', label: '体检类型', enum: bus_physical_type },
  { prop: 'name', label: '姓名', },
  { prop: 'marriageStatus', label: '婚否', enum: bus_personnel_marriage_status },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', },
  { prop: 'healthyCheckTime', label: '体检日期', },
  { prop: 'guideSheetReceived', label: '回收', enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'freezeStatus', label: '冻结', enum: [{ value: '0', label: '是' }, { value: '1', label: '否' }] },
  { prop: 'healthyCheckStatus', label: '体检状态', enum: bus_healthy_check_status },
  { prop: 'needGeneralReview', label: '需要总检', enum: [{ value: '0', label: '需要总检' }, { value: '1', label: '无需总检' }] },
  { prop: 'totalAmount', label: '总费用', },
  { prop: 'teamAmount', label: '团费', },
  { prop: 'personAmount', label: '个费', },
  { prop: 'teamName', label: '单位', },
  { prop: 'groupName', label: '分组', },
  { prop: 'deptName', label: '部门', },
  { prop: 'name', label: '备注字段没得', },
  { prop: 'introducerName', label: '介绍人', },
  { prop: 'createByName', label: '创建人', },
  { prop: 'registerDoctorName', label: '报到人', },
  { prop: 'generalReviewDoctorName', label: '总检医生', },
  { prop: 'generalReviewTime', label: '总检时间', },
  { prop: 'auditDoctorName', label: '审核医生', },
  { prop: 'auditTime', label: '审核时间', },
  { prop: 'finishTime', label: '完成时间', },
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
  router.push(`/deskRegistration/medicalRegistration-childPage/checkRegistration?id=${row.id}`);
}

// 单位改变
const handleChange = async (val: any) => {
  const { rows } = await teamTaskList({ teamId: val })
  teamTaskLists.value = rows
  tableColumns.value = tableColumnsBasic(teamTaskLists, bus_physical_type)
  queryParams.value.taskId = null
}

//报到
const handleBD = async () => {
  if (checkedList.value.length == 0) {
    proxy?.$modal.msgWarning("请选择人员");
    return
  }
  await proxy?.$modal.confirm('<span style="font-weight:bold">是否确定进行报到？</span><br/> 报到后可打印指引单和条码')

}

//勾选
const selectionChange = (val) => {
  checkedList.value = []
  checkedList.value = val.map(item => item.id)
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
