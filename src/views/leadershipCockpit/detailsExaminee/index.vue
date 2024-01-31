<template>
  <div>
    <ProTable ref="proTable" row-key="id" :searchCol="4" :columns="columns" :request-api="getList"
      :data-callback="dataCallback" :toolButton="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="flex justify-end w-full mt-10px">
          <el-button type="primary mr-10px" @click="handleDescription">统计说明</el-button>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { reactive } from 'vue'
import { registerPage, teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers'
import { teamInfoList } from "@/api/groupInspection/inspectionclosing";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 获取下拉列表
const { bus_category, bus_physical_type, sys_user_sex, bus_healthy_check_status, bus_marriage_status, bus_need_general_review } = toRefs<any>(proxy?.useDict('bus_category', 'bus_physical_type', 'sys_user_sex', 'bus_healthy_check_status', 'bus_marriage_status', 'bus_need_general_review'))

const teamIdList = ref<any>([])  //单位列表
const groupList = ref<any>([])  //单位平铺列表
// 获取单位,分组接口
const getteamIdList = async () => {
  const { data } = await teamInfoList({})
  const { rows } = await teamGroupList({})
  teamIdList.value = proxy?.handleTree<any>(data)
  groupList.value = rows
}
getteamIdList()
// 表格配置项
const columns = reactive([
  {
    prop: "healthyCheckCode",
    label: "体检号",
    search: {
      el: "input",
      props: { placeholder: "请输入体检号" },
    },
  },
  {
    prop: "recordCode",
    label: "档案号",
  },
  {
    prop: "credentialNumber",
    label: "身份证号",
  },
  {
    prop: "businessCategory",
    label: "业务类别",
    enum: bus_category
  },
  {
    prop: "physicalType",
    label: "体检类型",
    enum: bus_physical_type
  },
  {
    prop: "name",
    label: "姓名",
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
    prop: "CheckTime",
    label: "体检日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" },
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
      props: { placeholder: "请填写档案号" },
    },
  },
  {
    prop: "credentialNumber",
    label: "身份证号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请填写档案号" },
    },
  },
  {
    prop: "teamId",
    label: "单位",
    search: {
      el: "tree-select",
    },
    enum: teamIdList,
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    prop: "healthyCheckStatus",
    label: "体检状态",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请填写体检状态" },
    },
    enum: bus_healthy_check_status
  },
  {
    prop: "marriageStatus",
    label: "婚否",
    // enum: bus_marriage_status
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "phone",
    label: "电话",
  },
  {
    prop: "healthyCheckTime",
    label: "体检日期",
  },
  {
    prop: "guideSheetReceived",
    label: "回收",
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' },
    ]
  },
  {
    prop: "freezeStatus",
    label: "冻结",
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' },
    ]
  },
  {
    prop: "healthyCheckStatus",
    label: "体检状态",
    isShow: true,
    enum: bus_healthy_check_status
  },
  {
    prop: "needGeneralReview",
    label: "需要总检",
    // enum: bus_need_general_review
  },
  {
    prop: "totalAmount",
    label: "总费用",
  },
  {
    prop: "teamAmount",
    label: "团费",
  },
  {
    prop: "personAmount",
    label: "个费",
  },
  {
    prop: "paidTotalAmount",
    label: "已收费",
  },
  {
    prop: "unPaidTotalAmount",
    label: "未收费",
  },
  {
    prop: "teamGroupId",
    label: "分组",
    enum: groupList,
    fieldNames: { label: 'groupName', value: 'id' }
  },
  {
    prop: "teamDeptId",
    label: "部门",
  },
  {
    prop: "introducerName",
    label: "介绍人",
  },
  {
    prop: "createByName",
    label: "创建人",
  },
  {
    prop: "registerDoctorName",
    label: "报到人",
  },
  {
    prop: "generalReviewDoctorName",
    label: "总检医生",
  },
  {
    prop: "generalReviewTime",
    label: "总检时间",
  },
  {
    prop: "auditDoctorName",
    label: "审核医生",
  },
  {
    prop: "auditTime",
    label: "审核时间",
  },
  {
    prop: "finishTime",
    label: "完成时间",
  }
]);
const getList = (params: any) => {
  let newParams = { ...params }
  newParams.healthyCheckTimeStart = params.CheckTime[0] ? params.CheckTime[0] : null
  newParams.healthyCheckTimeEnd = params.CheckTime[1] ? params.CheckTime[1] : null
  return registerPage(newParams)
}
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize

  }
}

//统计说明
const handleDescription = () => {
  ElMessageBox.alert("时间统计规则：个检以当日的【登记时间】、团检以当日的【报道时间】为为统计口径。<br/>费用统计规则：个检无论会否缴费、团检无论是否收费均计算在内，因为个检、团队费用核算有另外口径，在此不做统计。", '说明',
    {
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