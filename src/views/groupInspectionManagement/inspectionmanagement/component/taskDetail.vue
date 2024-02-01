<template>
  <div v-loading="loading">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
      :toolButton="false">
      <template #name="{ row }">
        {{ row.name }}
        <span class="fujian" v-if="row.checkType == 21">复</span>
      </template>
    </ProTable>
    <div class="clearfix">
      <el-row>
        <el-col :span="6">
          <div>累计人数:
            <span class="num_color">{{ taskGroupStatistics.totalPeople }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>分组金额:
            <span class="num_color">{{ taskGroupStatistics.groupAmount }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>加项金额:
            <span class="num_color">{{ taskGroupStatistics.addAmount }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>单位应收金额:
            <span class="num_color">{{ taskGroupStatistics.teamReceiveAmount }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { teamSettleTaskGroupDetailList, teamSettleTaskGroupStatistics } from "@/api/groupInspection/inspectionclosing";
import useOption from "../hooks/useOptions";
const props = defineProps({
  detailInfo: {
    type: Object,
  },
  taskoptions: {
    type: Array
  },
  preview: {
    type: Boolean
  },
  ruleForm: {
    type: Object
  },
})

const emit = defineEmits(['handleCancle', 'handleSure']);
const { category, physicalType, marriageStatus, healthyCheckStatus, needGeneralReview } = useOption()

// 获取table实例
const proTable = ref()
const columns = reactive([
  {
    prop: "healthyCheckCode",
    label: "体检号",
  },
  {
    prop: "recordCode",
    label: "档案号",
  },
  {
    prop: "credentialNumber",
    label: "证件号",
  },
  {
    prop: "businessCategory",
    label: "业务类别",
    enum: category
  },
  {
    prop: "physicalType",
    label: "体检类型",
    enum: physicalType
  },
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "marriageStatus",
    label: "婚否",
    enum: marriageStatus
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
    prop: "healthyCheckStatus",
    label: "体检状态",
    tag: true,
    enum: healthyCheckStatus,
    fieldNames: { label: 'label', value: 'label' }
  },
  {
    prop: "needGeneralReview",
    label: "需要总检",
    enum: needGeneralReview
  },
  /* {
    prop: "groupName",
    label: "人员费别",
  }, */
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
    prop: "teamName",
    label: "单位",
  },
  {
    prop: "groupName",
    label: "分组",
  },
  {
    prop: "deptName",
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
  },
  {
    prop: "teamSettleTime",
    label: "扣费时间",
  },
])
const taskGroupStatistics = ref({}) //统计数据
const loading = ref(false)
const dataCallback = (data: any) => {
  loading.value = false
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}
const getTableList = async (params: any) => {
  loading.value = true
  let newParams = {}
  newParams = { ...params, ...props.ruleForm, teamGroupId: props.detailInfo.id }
  return teamSettleTaskGroupDetailList(newParams)
};
//统计数据
const getStatistics = async () => {
  const { data } = await teamSettleTaskGroupStatistics({ ...props.ruleForm, teamGroupId: props.detailInfo.id })
  taskGroupStatistics.value = data
}
getStatistics()


</script>

<style scoped>
.fujian {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 16px;
  height: 16px;
  line-height: 1;
  border: 0.5px solid #F75252;
  border-radius: 2px;
  color: #F75252
}

.check_state {
  background: #E2FFF1;
  padding: 0px 4px;
  color: #09C268;
}


.InfoItem {
  margin-bottom: 20px;
}

.team {
  display: inline-block;
  width: 100px;
}

.num_color {
  color: #FF8400;
}
</style>