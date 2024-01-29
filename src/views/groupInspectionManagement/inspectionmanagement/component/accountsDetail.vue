<template>
  <div>
    <div class="mb-10px pb-10px">
      <span @click="active = 1" class="mr-10px pb-10px" :class="{ 'active': active == 1 }">收费信息</span>
      <span @click="handleTable" class="pb-10px" :class="{ 'active': active == 2 }">人员明细</span>
    </div>
    <div v-show="active == 1">
      <addForm :addForm="detailInfo" :preview="preview" :taskoptions="taskoptions"></addForm>
    </div>
    <div v-show="active == 2">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
        :toolButton="false">
        <template #姓名="scope">
          <div class="name_info">
            <span>{{ scope.row.username }}</span>
            <span class="fujian">复</span>
          </div>
        </template>
        <template #体检状态="scope">
          <span class="check_state">{{ scope.row.username }}</span>
        </template>
      </ProTable>
    </div>

  </div>
</template>

<script setup lang="ts">
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { teamSettleDetailList } from "@/api/groupInspection/inspectionclosing";
import useOption from "../hooks/useOptions";
import addForm from './addForm.vue'
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
  }
})

const emit = defineEmits(['handleCancle', 'handleSure']);
const active = ref(1)
// const { category, physicalType, marriageStatus, healthyCheckStatus, needGeneralReview } = useOption()

//获取收费信息数据
const getFormDetail = () => {

}
onMounted(() => {
  getFormDetail()
})
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
    // enum: category
  },
  {
    prop: "physicalType",
    label: "体检类型",
    // enum: physicalType
  },
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "marriageStatus",
    label: "婚否",
    // enum: marriageStatus
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
    // enum: healthyCheckStatus
  },
  {
    prop: "needGeneralReview",
    label: "需要总检",
    // enum: needGeneralReview
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
//点击人员明细
const handleTable = () => {
  active.value = 2
}
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
}
const getTableList = async (params: any) => {
  let newParams = {}
  newParams = { ...params, ...props.ruleForm, id: props.detailInfo.id }
  return teamSettleDetailList(newParams)
};

const optionsName = (arr, value) => {
  let TypeName = ''
  arr.forEach(item => {
    if (item.value == value) {
      TypeName = item.label
    }
  })
  return TypeName
}




</script>

<style scoped>
.name_info {
  position: relative;
}

.fujian {
  position: absolute;
  top: 4px;
  right: -1px;
  width: 16px;
  height: 16px;
  border: 0.5px solid #F75252;
  border-radius: 2px;
  color: #F75252
}

.check_state {
  background: #E2FFF1;
  padding: 0px 4px;
  color: #09C268;
}

.active {
  color: #2879FF;
  border-bottom: 1px solid #2879FF;
}

.InfoItem {
  margin-bottom: 20px;
}

.team {
  display: inline-block;
  width: 100px;
}
</style>