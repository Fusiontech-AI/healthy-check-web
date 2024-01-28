<template>
  <div>
    <div v-if="dialogIndex == 1" class="mb-10px pb-10px">
      <span @click="active = 1" class="mr-10px pb-10px" :class="{ 'active': active == 1 }">收费信息</span>
      <span @click="handleTable" class="pb-10px" :class="{ 'active': active == 2 }">人员明细</span>
    </div>
    <div v-show="active == 1">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">单位名称:</span>
            <span>{{ optionsName(teamIdList, detailInfo.teamId) }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">任务:</span>
            <span>{{ optionsName(taskoptions, detailInfo.teamTaskId) }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">批次号:</span>
            <span>{{ detailInfo.chargeNumber }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">结算时间:</span>
            <span>{{ detailInfo.settleTime }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">实收金额:</span>
            <span>{{ detailInfo.receivedAmount }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="InfoItem">
            <span class="team">支付方式:</span>
            <span>{{ optionsName(payTypeList, detailInfo.payType) }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="active == 2 || dialogIndex == 2">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
        :requestAuto="false" :toolButton="false">
        <!-- Expand -->
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
import useOption from "../hooks/useOptions";
const props = defineProps({
  detailInfo: {
    type: Object,
  },
  dialogIndex: {
    type: Number
  },
  taskoptions: {
    type: Array
  }
})

const emit = defineEmits(['handleCancle', 'handleSure']);
const active = ref(1)
const { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList } = useOption()

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
    prop: "groupName",
    label: "体检号",
  },
  {
    prop: "groupName",
    label: "档案号",
  },
  {
    prop: "groupName",
    label: "证件号",
  },
  {
    prop: "groupName",
    label: "业务类别",
  },
  {
    prop: "groupName",
    label: "体检类型",
  },
  {
    prop: "groupName",
    label: "姓名",
  },
  {
    prop: "groupName",
    label: "婚否",
  },
  {
    prop: "groupName",
    label: "年龄",
  },
  {
    prop: "groupName",
    label: "电话",
  },
  {
    prop: "groupName",
    label: "体检日期",
  },
  {
    prop: "groupName",
    label: "体检状态",
  },
  {
    prop: "groupName",
    label: "需要总检",
  },
  {
    prop: "groupName",
    label: "人员费别",
  },
  {
    prop: "groupName",
    label: "总费用",
  },
  {
    prop: "groupName",
    label: "团费",
  },
  {
    prop: "groupName",
    label: "个费",
  },
  {
    prop: "groupName",
    label: "单位",
  },
  {
    prop: "groupName",
    label: "分组",
  },
  {
    prop: "groupName",
    label: "部门",
  },
  {
    prop: "groupName",
    label: "介绍人",
  },
  {
    prop: "groupName",
    label: "创建人",
  },
  {
    prop: "groupName",
    label: "报到人",
  },
  {
    prop: "groupName",
    label: "总检医生",
  },
  {
    prop: "groupName",
    label: "总检时间",
  },
  {
    prop: "groupName",
    label: "审核医生",
  },
  {
    prop: "groupName",
    label: "审核时间",
  },
  {
    prop: "groupName",
    label: "完成时间",
  },
  {
    prop: "groupName",
    label: "扣费时间",
  },
])
//点击人员明细
const handleTable = () => {
  active.value = 2
  proTable.value.getTableList()
}
const dataCallback = (data: any) => {
  return {
    list: data.list,
    /* total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize */
  };
}
const getTableList = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  // const { data } = await groupList(newParams)
  return
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