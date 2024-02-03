<template>
  <div class="closing">
    <el-card class="box-card" shadow="never">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default"
        status-icon>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单位名称" prop="teamId">
              <el-tree-select v-model="ruleForm.teamId" :data="options" filterable clearable remote :loading="loading"
                placeholder="请搜索单位名称" :remote-method="remoteMethod"
                :props="{ value: 'value', label: 'label', children: 'children' }" value-key="id" check-strictly
                @change="teamIdChange" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称" prop="teamTaskId">
              <el-select v-model="ruleForm.teamTaskId" placeholder="请选择任务名称" v-loading="taskLoading">
                <el-option v-for="item in taskoptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="searchForm(ruleFormRef)" round> 查询 </el-button>
              <el-button @click="resetForm(ruleFormRef)" round>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div class="title">
        <div class="title_name">任务信息</div>
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
      <ProTable ref="proTableTask" :columns="columnsTask" :request-api="getTableListTask" :data-callback="dataCallback"
        :requestAuto="false" :toolButton="false">
        <!-- Expand -->
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" @click="details('明细', scope.row)" text>明细</el-button>
        </template>
      </ProTable>

      <div class="title">
        <div style="width: 200px;">结账信息</div>
      </div>
      <ProTable ref="proTableAccounts" :columns="columnsAccounts" :request-api="getTableListAccounts"
        :data-callback="dataCallbackAccounts" :requestAuto="false" :toolButton="false">
        <!-- 表格操作 -->
        <template #tableHeader="scope">
          <div class="payment">
            <div class="payment_btn">
              <el-button type="primary" @click="Add(ruleFormRef)" round>新增结账</el-button>
              <el-button type="primary" :disabled="!scope.isSelected" @click="handelInvoice(scope.selectedListIds)"
                round>开票</el-button>
              <el-button type="primary" :disabled="!scope.isSelected" @click="ticketInvalid(scope.selectedListIds)"
                round>发票作废</el-button>
              <el-button type="primary" :disabled="!scope.isSelected" @click="cancellationAccount(scope.selectedListIds)"
                round>结账作废</el-button>
            </div>
            <div class="payment_info">
              <el-row>
                <el-col :span="12">
                  <div>已结金额:
                    <span class="num_color">{{ teamSettleStatistics.settledAmount }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div>余额:
                    <span class="num_color">{{ teamSettleStatistics.balance }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
        <template #statusName="{ row }">
          <span :class="{ abandon: row.statusName == '废弃' }">{{ row.statusName }}</span>
        </template>
        <template #checkStatusName="{ row }">
          <span
            :class="[{ 'to_reviewed': row.checkStatusName == '待审核' }, { 'reviewed': row.checkStatusName == '已审核' }]">{{
              row.checkStatusName
            }}</span>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" text @click="details('详情', row)">详情</el-button>
          <el-button type="primary" text @click="makeInvoice(row)">开票</el-button>
          <el-button type="primary" text @click="cancellation(row)">作废</el-button>
          <el-button type="primary" text @click="deleteInvoice(row)" :disabled="row.status != 2">删除</el-button>
        </template>
      </ProTable>
    </el-card>

    <!-- 详情 -->
    <el-dialog v-model="dialogVisible" v-if="dialogVisible" :title="dialogTitle" style="width: 900px;
height: 698px;">
      <!-- 任务信息分组明细 -->
      <taskDetail v-if="dialogTitle == '分组明细'" :detailInfo="detailInfo" :taskoptions="taskoptions" :ruleForm="ruleForm"
        :preview="isPreview">
      </taskDetail>
      <!-- 结账信息人员明细 -->
      <accountsDetail v-else :detailInfo="detailInfo" :taskoptions="taskoptions" :ruleForm="ruleForm"
        :preview="isPreview">
      </accountsDetail>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" round>取消</el-button>
          <el-button type="primary" @click="dialogVisible = false" round> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增 -->
    <el-drawer v-model="drawer" direction="rtl" :size="738" class="drawer">
      <template #header>
        <h4>团检收费</h4>
      </template>
      <template #default>
        <div>
          <addFormComponent ref="addRef" :preview="isPreview" :taskoptions="taskoptions" :addForm="addForm">
          </addFormComponent>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick(addRef.addFormRef)" round>取消</el-button>
          <el-button type="primary" @click="confirmClick(addRef.addFormRef)" round>确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 确认操作 -->
    <el-dialog v-model="operationDeter" width="30%" class="sealAccountClass">
      <template #header>
        <div class="my-header">
          <el-icon color="#F75252" class="no-inherit" :size="20">
            <WarningFilled></WarningFilled>
          </el-icon>
          <span>{{ operationTitle }}</span>
        </div>
      </template>
      <div>
        {{ operationInfo }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="operationDeter = false" round>取消</el-button>
          <el-button type="primary" @click="operationSure" round> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { onMounted } from 'vue'
import taskDetail from './component/taskDetail.vue'
import accountsDetail from './component/accountsDetail.vue'
import addFormComponent from './component/addForm.vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import useOption from "./hooks/useOptions";
import { teamInfoList, teamTaskList, teamSettleList, addTeamSettle, teamInvoice, teamInvalidSettle, teamInvalidInvoice, deleteTeamSettle, teamSettleTaskGroupList, teamSettleTaskGroupStatistics, teamSettleAmountStatistics } from "@/api/groupInspection/inspectionclosing";

onMounted(() => {
  getDict()
})
const { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList, payType } = useOption()
const { proxy } = getCurrentInstance() as ComponentInternalInstance

//获取表单实例
const ruleFormRef = ref()
const ruleForm = reactive({
  teamId: '',
  teamTaskId: '',
})
const rules = reactive({
  teamId: [
    { required: true, message: '请选择单位名称', trigger: 'blur' },
  ],
  teamTaskId: [
    {
      required: true,
      message: '请选择任务名称',
      trigger: 'change',
    },
  ],
})
const options = ref([])
const loading = ref(false)
const taskLoading = ref(false) //任务下拉加载
const taskoptions = ref([])  //任务下拉列表,联动单位名称
const taskGroupStatistics = ref({})   //任务信息总计数据
const teamSettleStatistics = ref({})   //体检单位结账金额统计

/** 查询单位名称下拉树结构 */
const getTreeselect = async (data) => {
  options.value = []
  const menu = proxy?.handleTree<MenuOptionsType>(data)
  options.value = JSON.parse(JSON.stringify(menu))
}
// 获取远程单位列表
const remoteMethod = async (query: any) => {
  loading.value = true
  if (query) {
    const { data } = await teamInfoList({ teamName: query })
    data.forEach(item => {
      item.label = item.teamName
      item.value = item.id
    })
    getTreeselect(data)
  } else {
    getTreeselect(teamIdList.value)
    // options.value = teamIdList.value
  }
  loading.value = false
}
// 单位值变化
const teamIdChange = async (value: any) => {
  ruleForm.teamTaskId = ''
  if (!value) return taskoptions.value = []
  taskLoading.value = true
  const { rows } = await teamTaskList({ teamId: value })
  rows.forEach(item => {
    item.label = item.taskName
    item.value = item.id
  })
  taskoptions.value = rows
  taskLoading.value = false
}

//获取单位名称及任务名称下拉列表
const getDict = async () => {
  remoteMethod('')
};
const searchForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      proTableTask.value?.getTableList();
      proTableAccounts.value?.getTableList();
      const { data } = await teamSettleTaskGroupStatistics({ ...ruleForm })
      taskGroupStatistics.value = data
      const res = await teamSettleAmountStatistics({ ...ruleForm })
      teamSettleStatistics.value = res.data
    } else {
    }
  })

}
const resetForm = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
}



//任务信息ProTable 实例
const proTableTask = ref();
//表格列表返回数据
const detailInfo = ref({})
// 表格配置项
const columnsTask = reactive([
  {
    prop: "groupName",
    label: "分组名称",
  },
  {
    prop: "teamReceiveAmount",
    label: "单位应收金额",
  },
  {
    prop: "totalPeople",
    label: "累计人数",
  },
  {
    prop: "groupAmount",
    label: "分组金额",
  },
  {
    prop: "groupPayType",
    label: "分组支付方式",
    // enum: payType
  },
  {
    prop: "addPeople",
    label: "加项人数",
  },
  {
    prop: "addAmount",
    label: "加项金额",
  },
  {
    prop: "addPayType",
    label: "加项支付方式",
    // enum: payType
  },
  {
    prop: "operation",
    label: "操作",
  },

]);
const dataCallback = (data: any) => {
  return {
    list: data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
//获取任务信息列表
const getTableListTask = async (params: any) => {
  let newParams = { ...params }
  ruleForm.teamId && (newParams.teamId = ruleForm.teamId);
  ruleForm.teamTaskId && (newParams.teamTaskId = ruleForm.teamTaskId);
  return teamSettleTaskGroupList(newParams)
};




//结账信息ProTable 实例
const proTableAccounts = ref();
// 表格配置项
const accountsInfo = ref({})

const columnsAccounts = reactive([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "chargeNumber",
    label: "收费批次流水号",
  },
  {
    prop: "teamId",
    label: "单位名称",
    enum: teamIdList,
    width: 150
  },
  {
    prop: "teamTaskId",
    label: "任务名称",
    enum: taskoptions,
    width: 150
  },
  {
    prop: "receivedAmount",
    label: "实收金额",
  },
  {
    prop: "printInvoice",
    label: "是否打印发票",
    // enum: printInvoiceList,
  },
  {
    prop: "invoiceNumber",
    label: "发票号",
  },
  {
    prop: "settleOfficer",
    label: "结算人",
  },
  {
    prop: "settleTime",
    label: "结算时间",
    width: 150
  },
  {
    prop: "payType",
    label: "支付方式",
    enum: payTypeList
  },
  {
    prop: "createTime",
    label: "录入时间",
  },
  {
    prop: "statusName",
    label: "状态",
    // enum: statusList
  },
  {
    prop: "checkStatusName",
    label: "审核状态",
    // enum: checkStatusList
  },
  {
    prop: "operation",
    fixed: "right",
    width: 300,
    label: "操作",
  },

]);
const dataCallbackAccounts = (data: any) => {
  accountsInfo.value = data
  return {
    list: data,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
//获取结账信息列表
const getTableListAccounts = async (params: any) => {
  let newParams = { ...params }
  ruleForm.teamId && (newParams.teamId = ruleForm.teamId);
  ruleForm.teamTaskId && (newParams.teamTaskId = ruleForm.teamTaskId);
  return teamSettleList(newParams)
};

// 新增抽屉
const addRef = ref()
//抽屉中的表单数据
const addForm = ref({})
const isPreview = ref(false)
const drawer = ref(false)
//新增结账
const Add = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      addForm.value = { ...ruleForm, settleTime: moment().format('YYYY-MM-DD HH:mm:ss') }
      drawer.value = true
      isPreview.value = false
      await nextTick()
      addRef.value.addFormRef.clearValidate()
    } else {
      ElMessage.warning('请选择单位名称及任务名称')
    }
  })

}
//取消新增结账
const cancelClick = async (Ref: any) => {
  drawer.value = false
}
//确定新增结账
const confirmClick = async (Ref: any) => {
  if (!Ref) return
  await Ref.validate(async (valid: any, fields: any) => {
    if (valid) { //校验通过
      drawer.value = false
      await addTeamSettle({ ...addForm.value })
      ElMessage.success('新增成功')
      drawer.value = false
      proTableAccounts.value?.getTableList()
    } else {

    }
  })
}


const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //结账作废1,作废2,删除3
// 结账作废ids
const InvalidSettleIds = ref([])
// 作废id
const InvalidSettleId = ref([])
// 删除id
const deleteInvoiceId = ref('')

//操作确定
const operationSure = async () => { //结账作废1,作废2,删除3
  switch (operationType.value) {
    case 1: {
      //代码块;
      await teamInvalidSettle({ ids: InvalidSettleIds.value, ...ruleForm })
      ElMessage.success('结账作废成功')
      proTableAccounts.value?.clearSelection()
      proTableAccounts.value?.getTableList()
      break;
    }
    case 2: {
      //代码块;
      await teamInvalidSettle({ ids: InvalidSettleId.value, ...ruleForm })
      ElMessage.success('结账作废成功')
      proTableAccounts.value?.clearSelection()
      proTableAccounts.value?.getTableList()
      break;
    }
    case 3: {
      //代码块;
      await deleteTeamSettle({ ids: deleteInvoiceId.value, ...ruleForm })
      ElMessage.success('删除成功')
      proTableAccounts.value?.getTableList()
      break;
    }
  }
  operationDeter.value = false
}
//开票(表格上方)
const handelInvoice = async (params) => {
  await teamInvoice({ ids: params, ...ruleForm })
  ElMessage.success('开票成功')
  proTableAccounts.value?.clearSelection()
  proTableAccounts.value?.getTableList()
}
//发票作废
const ticketInvalid = async (params) => {
  await teamInvalidInvoice({ ids: params, ...ruleForm })
  ElMessage.success('发票作废成功')
  proTableAccounts.value?.clearSelection()
  proTableAccounts.value?.getTableList()
}
//结账作废
const cancellationAccount = (params) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 1
  InvalidSettleIds.value = [...params]
}

//开票
const makeInvoice = async (row: any) => {
  await teamInvoice({ ids: row.id, ...ruleForm })
  ElMessage.success('开票成功')
  proTableAccounts.value?.clearSelection()
  proTableAccounts.value?.getTableList()
}
//作废
const cancellation = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 2
  InvalidSettleId.value = [row.id]
}
//删除
const deleteInvoice = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定删除记录？'
  operationInfo.value = '删除记录后，该记录将不可恢复'
  operationType.value = 3
  deleteInvoiceId.value = [row.id]
}



//明细弹框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const details = (title: any, row: any) => {
  detailInfo.value = row
  dialogVisible.value = true
  isPreview.value = true
  if (title == '明细') {
    dialogTitle.value = "分组明细"
  } else {
    dialogTitle.value = "团检收费详情"
  }
}

//获取名字
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

<style scoped lang="scss">
.closing {
  padding: 20px;
  background-color: #f1f1f1;

  .box-card {
    margin-bottom: 10px;
  }

  .title {
    border-left: 6px solid #FF8F33;
    margin-bottom: 20px;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;

    .title_name {
      width: 100px;
    }

    .clearfix {
      width: 800px
    }
  }

  .payment {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .payment_btn {
      width: 400px;
    }

    .payment_info {
      width: 300px
    }
  }

  .abandon {
    color: #FF8400;
  }

  .to_reviewed {
    color: #FF8400;
  }

  .reviewed {
    color: #09C268;
  }


  :deep(.el-drawer) {
    background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 12%);
    border-radius: 20px 0px 0px 20px;
  }

  :deep(.sealAccountClass.el-dialog) {
    width: 400px;
    height: 176px;
    border-radius: 20px;
    background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 27%);
  }

  :deep(.el-dialog__header) {
    border-bottom: none
  }

  :deep(.el-dialog__headerbtn) {
    top: 1px;

  }

  :deep(.header-button-lf) {
    width: 100%;
  }

  .no-inherit {
    margin-right: 10px;
    vertical-align: middle;
  }

  .dialog-footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .num_color {
    color: #FF8400;
  }

}
</style>
