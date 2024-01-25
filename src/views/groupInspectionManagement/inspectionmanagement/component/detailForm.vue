<template>
  <div>
    <el-dialog v-if="dialogVisible" title="dialogTitle" width="30%" :show-close="false">
      <template #header>
        <div class="my-header">
          <h4>{{ dialogTitle }}</h4>
          <el-icon color="#F75252" class="no-inherit" :size="20" @click="handleCancle">
            <Close></Close>
          </el-icon>
        </div>
      </template>
      <div v-if="dialogTitle == '团检收费'">
        <span @click="index = 1">收费信息</span>
        <span @click="handleTable">人员明细</span>
      </div>

      <div v-show="index == 1">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">单位名称:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">任务:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">批次号:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">结算时间:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">实收金额:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="InfoItem">
              <span class="team">支付方式:</span>
              <span>{{ ruleFormDetail }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="index == 2">
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
        <div v-if="dialogTitle != '团检收费'">
          <span style="margin-right:40px">
            累计人数:{{ }}
          </span>
          <span style="margin-right:40px">
            分组金额:{{ }}
          </span>
          <span style="margin-right:40px">
            加项金额:{{ }}
          </span>
          <span style="margin-right:40px">
            单位应收金额 :{{ }}
          </span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取消</el-button>
          <el-button type="primary" @click="handleSure">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  dialogTitle: {
    type: String
  },
  detailInfo: {
    type: Object,
  }
})

const emit = defineEmits(['handleCancle', 'handleSure']);
const index = props.dialogTitle == '团检收费' ? ref(1) : ref(0)
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
    fixed: "left",
  },
  {
    prop: "unitAmount",
    label: "档案号",
  },
  {
    prop: "personCount",
    label: "证件号",
  },
  {
    prop: "groupAmount",
    label: "业务类别",
  },
  {
    prop: "groupPayType",
    label: "体检类型",
  },
  {
    prop: "addPersonCount",
    label: "姓名",
  },
  {
    prop: "addAmount",
    label: "婚否",
  },
  {
    prop: "addItemPayType",
    label: "年龄",
  },
  {
    prop: "addItemPayType",
    label: "电话",
  },
  {
    prop: "addItemPayType",
    label: "体检日期",
  },
  {
    prop: "addItemPayType",
    label: "体检状态",
  },
  {
    prop: "addItemPayType",
    label: "需要总检",
  },
  {
    prop: "addItemPayType",
    label: "人员费别",
  },
  {
    prop: "addItemPayType",
    label: "总费用",
  },
  {
    prop: "addItemPayType",
    label: "团费",
  },
  {
    prop: "addItemPayType",
    label: "个费",
  },
  {
    prop: "addItemPayType",
    label: "单位",
  },
  {
    prop: "addItemPayType",
    label: "分组",
  },
  {
    prop: "addItemPayType",
    label: "部门",
  },
  {
    prop: "addItemPayType",
    label: "介绍人",
  },
  {
    prop: "addItemPayType",
    label: "创建人",
  },
  {
    prop: "addItemPayType",
    label: "报到人",
  },
  {
    prop: "addItemPayType",
    label: "总检医生",
  },
  {
    prop: "addItemPayType",
    label: "总检时间",
  },
  {
    prop: "addItemPayType",
    label: "审核医生",
  },
  {
    prop: "addItemPayType",
    label: "审核时间",
  },
  {
    prop: "addItemPayType",
    label: "完成时间",
  },
  {
    prop: "addItemPayType",
    label: "扣费时间",
  },
])
//点击人员明细
const handleTable = () => {
  index.value = 2
  proTable.value.getTableList()
}
const dataCallback = (data: any) => {
  if (props.dialogTitle == '团检收费') {
    return {
      list: data.list,
      /* total: data.total,
      pageNum: data.pageNum,
      pageSize: data.pageSize */
    }
  } else {
    return {
      list: data.list,
      total: data.total,
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }
  }
}
const getTableList = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  // const { data } = await groupList(newParams)
  return
};
const handleCancle = () => {
  emit('handleCancle')
}
const handleSure = async () => {
  emit('handleSure')
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
</style>