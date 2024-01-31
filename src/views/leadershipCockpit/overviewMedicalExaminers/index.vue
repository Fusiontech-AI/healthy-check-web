<template>
  <div>
    <ProTable ref="proTable" row-key="id" :searchCol="4" :columns="columns" :request-api="getUserTreeList"
      :data-callback="dataCallback" :toolButton="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="flex justify-between w-full mt-10px">
          <el-button type="primary" class="ml-10px" @click="handleExport">导出excel</el-button>
          <el-button type="primary" class="mr-10px" @click="handleDescription">统计说明</el-button>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { reactive } from 'vue';
import { dailyPhysicalOverview, dailyPhysicalOverviewExport } from '@/api/leadershipCockpit/overviewMedicalExaminers'
import { teamInfoList } from "@/api/groupInspection/inspectionclosing";
import { downloadMethod } from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 获取下拉列表
const { sys_user_sex, bus_physical_type, bus_healthy_check_status } = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_physical_type', 'bus_healthy_check_status'))
const param = ref({})  //查询参数
const teamIdList = ref<any>([])  //单位列表
// 获取单位-任务接口
const getteamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data)
}
getteamIdList()
// 表格配置项
const columns = reactive([
  {
    prop: "healthyCheckCode",
    label: "体检号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入体检号" },
    },
  },
  {
    prop: "name",
    label: "姓名",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入姓名" },
    },
  },
  {
    prop: "gender",
    label: "性别",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择性别" },
    },
    enum: sys_user_sex
  },
  {
    prop: "data",
    label: "体检日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: {
        type: "daterange",
        valueFormat: "YYYY-MM-DD",
      },
      defaultValue: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
  },
  {
    prop: "physicalType",
    label: "体检类型",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择体检类型" },
    },
    enum: bus_physical_type
  },
  {
    prop: "recordCode",
    label: "档案号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入档案号" },
    },
  },
  {
    prop: "credentialNumber",
    label: "身份证号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入身份证号" },
    },
  },
  {
    prop: "teamId",
    label: "单位",
    isShow: false,
    enum: teamIdList,
    search: {
      el: 'tree-select',
    },
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    prop: "healthyCheckStatus",
    label: "体检状态",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择体检状态" },
    },
    enum: bus_healthy_check_status
  },
  {
    prop: "teamName",
    label: "体检团体",
  },
  {
    prop: "totalNum",
    label: "总人数",
  },
  {
    prop: "amount",
    label: "金额（元）",
    _children: [
      { prop: "totalAmount", label: "总金额合计", width: 110 },
      { prop: "avgAmount", label: "平均金额", width: 100 },
      { prop: "totalPersonalAmount", label: "个人金额合计", width: 100 },
      { prop: "totalTeamAmount", label: "团体金额合计", width: 100 },
    ]
  },
  {
    prop: "gender",
    label: "性别",
    _children: [
      { prop: "manCount", label: "男性", width: 110 },
      { prop: "womanCount", label: "女性", width: 100 },
    ]
  },
  {
    prop: "guideSheet", label: "指引单",
    _children: [
      { prop: "noRecycledGuideSheet", label: "未回收", width: 110 },
      { prop: "recycledGuideSheet", label: "已回收", width: 100 },
    ]
  },
  {
    prop: "checked", label: "总检",
    _children: [
      { prop: "noChecked", label: "未总检", width: 110 },
      { prop: "hasChecked", label: "已总检", width: 100 },
    ]
  },
  {
    prop: "printReport", label: "打印报告",
    _children: [
      { prop: "noPrintReport", label: "未打印", width: 110 },
      { prop: "hasPrintReport", label: "已打印", width: 100 },
    ]
  }
]);
const getUserTreeList = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.beginDate = params.data[0] ? params.data[0] : null
  newParams.endDate = params.data[1] ? params.data[1] : null
  param.value = { ...newParams }
  return dailyPhysicalOverview(newParams)
}
const dataCallback = (data: any) => {
  return {
    list: [data],
    total: data.totalNum
  }
}
//导出excel
const handleExport = async () => {
  const data = await dailyPhysicalOverviewExport(param.value)
  downloadMethod({ data }, `每日体检者概览_${new Date().getTime()}.xlsx`)
}

//统计说明
const handleDescription = () => {
  ElMessageBox.alert('时间统计规则：个检以当日的【登记时间】、团检以当日的【报道时间】为为统计口径。<br/>费用统计规则：个检无论会否缴费、团检无论是否收费均计算在内，因为个检、团队费用核算有另外口径，在此不做统计。', '说明', {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true
  })
}


</script>

<style scoped>
:deep(.header-button-lf) {
  width: 100%;
}
</style>