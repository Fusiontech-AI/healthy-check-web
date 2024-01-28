<template>
  <div class="closing">
    <el-card class="box-card" shadow="never">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default"
        status-icon>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单位名称" prop="teamId">
              <el-tree-select v-model="ruleForm.teamId" :data="options" filterable clearable remote :loading="loading"
                placeholder="请选择单位名称" :remote-method="remoteMethod"
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
              <el-button type="primary" @click="searchForm(ruleFormRef)"> 查询 </el-button>
              <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div class="title">
        <div>任务信息</div>
      </div>
      <div class="payment">
        <div class="task_btn">
          <el-button type="primary" @click="taskDiscount">任务折扣</el-button>
          <el-button type="primary" @click="sealAccount">封账</el-button>
          <el-button type="primary" @click="releaseAccount">解除封账</el-button>
        </div>
        <div class="task_info">
          <el-row>
            <el-col :span="6">
              <div>累计人数:{{}}</div>
            </el-col>
            <el-col :span="6">
              <div>分组金额:{{ }}</div>
            </el-col>
            <el-col :span="6">
              <div>加项金额:{{ }}</div>
            </el-col>
            <el-col :span="6">
              <div>单位应收金额:{{ }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <ProTable ref="proTableTask" :columns="columnsTask" :request-api="getTableList" :data-callback="dataCallbackTask"
        :toolButton="false">
        <!-- :requestAuto="false" -->
        <!-- Expand -->
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" @click="details('1', scope.row)">明细</el-button>
        </template>
      </ProTable>


      <div class="title" style="margin-top: 20px;">
        <div style="width: 200px;">结账信息</div>
      </div>

      <ProTable ref="proTableAccounts" :columns="columnsAccounts" :request-api="getTableListAccounts" :requestAuto="false"
        :data-callback="dataCallbackAccounts" :toolButton="false">
        <!-- 表格操作 -->
        <template #tableHeader="scope">
          <div class="payment">
            <div class="payment_btn">
              <el-button type="primary" @click="closingAudit(scope.selectedListIds)"
                :disabled="!scope.isSelected">结账审核</el-button>
              <el-button type="primary" @click="cancellationAccount(scope.selectedListIds)"
                :disabled="!scope.isSelected">结账作废</el-button>
            </div>
            <div class="payment_info">
              <el-row>
                <el-col :span="12">
                  <div>已结金额:{{}}</div>
                </el-col>
                <el-col :span="12">
                  <div>余额:{{ }}</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
        <template #status="{ row }">
          <span :class="{ abandon: row.status == '2' }">{{ optionsName(statusList, row.status) }}</span>
        </template>
        <template #checkStatus="{ row }">
          <span :class="[{ 'to_reviewed': row.checkStatus == 0 }, { 'reviewed': row.checkStatus == 1 }]">{{
            optionsName(checkStatusList,
              row.checkStatus) }}</span>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" text @click="details('2', row)">详情</el-button>
          <el-button type="primary" text @click="cancellation(row)">作废</el-button>
          <el-button type="primary" text @click="deleteInvoice(row)" :disabled="row.status != 2">删除</el-button>
        </template>
      </ProTable>
    </el-card>

    <!-- 详情 -->
    <el-dialog v-model="dialogVisible" v-if="dialogVisible" :title="dialogTitle" style="width: 900px;
height: 698px;">
      <detailForm :detailInfo="detailInfo" :dialogIndex="dialogIndex" :taskoptions="taskoptions" :preview="isPreview">
      </detailForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogDiscount" title="团检折扣" width="30%">
      <div>
        <h5>应收金额:</h5>
        <el-form :model="discountForm" label-position="left">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实收金额">
                <el-input v-model="discountForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优惠金额">
                <el-input v-model="discountForm.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="discountCancle">取消</el-button>
          <el-button type="primary" @click="discountSure">
            确定
          </el-button>
        </span>
      </template>

    </el-dialog>

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
        <span class="dialog-footer" v-if="operationType != 6">
          <el-button @click="operationDeter = false" round>取消</el-button>
          <el-button type="primary" @click="operationSure" round>
            确定
          </el-button>
        </span>
        <span class="dialog-footer" v-else>
          <el-button @click="handleRejectOrPass(false)" round>驳回</el-button>
          <el-button type="primary" @click="handleRejectOrPass(true)" round>
            通过
          </el-button>
        </span>
      </template>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { onMounted } from 'vue'
import detailForm from './component/detailForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { Search } from '@element-plus/icons-vue'
import { teamInfoList, teamTaskList, teamSettleList, addTeamSettle, teamInvoice, teamInvalidSettle, teamInvalidInvoice, deleteTeamSettle, teamSettleCheckReject, teamSettleCheckPass } from "@/api/groupInspection/inspectionclosing";
import useOption from "./hooks/useOptions";


onMounted(() => {
  // getDict()
})
const { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList } = useOption()
const { proxy } = getCurrentInstance() as ComponentInternalInstance
/* interface RuleForm {
  teamId: string
  year: string
} */
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
const taskoptions = ref([])

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
    const { data } = await teamInfoList({ phoneticCode: query })
    data.forEach(item => {
      item.label = item.teamName
      item.value = item.id
    })
    getTreeselect(data)
  } else {
    getTreeselect(teamIdList.value)
  }
  loading.value = false
}
const taskLoading = ref(false)
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
const searchForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      proTableTask.value?.getTableList();
      proTableAccounts.value?.getTableList();
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
const taskInfo = ref({})
const detailInfo = ref({})
// 表格配置项
const columnsTask = reactive([
  {
    prop: "groupName",
    label: "分组名称",
  },
  {
    prop: "unitAmount",
    label: "单位应收金额",
  },
  {
    prop: "personCount",
    label: "累计人数",
  },
  {
    prop: "groupAmount",
    label: "分组金额",
  },
  {
    prop: "groupPayType",
    label: "分组支付方式",
    enum: [
      { label: '个人', value: '0' },
      { label: '单位', value: '1' }
    ],
  },
  {
    prop: "addPersonCount",
    label: "加项人数",
  },
  {
    prop: "addAmount",
    label: "加项金额",
  },
  {
    prop: "addItemPayType",
    label: "加项支付方式",
  },
  {
    prop: "operation",
    label: "操作",
  },

]);
const dataCallbackTask = (data: any) => {
  taskInfo.value = data
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
//获取任务信息列表
const getTableList = async (params: any) => {
  let newParams = { ...params }
  ruleForm.teamId && (newParams.teamId = ruleForm.teamId);
  ruleForm.teamTaskId && (newParams.teamTaskId = ruleForm.teamTaskId);
  // return await teamSettleList(newParams)
};
//任务折扣弹框
const dialogDiscount = ref(false)
const discountForm = reactive({})
//任务折扣的方法
const taskDiscount = () => {
  dialogDiscount.value = true
}
const discountCancle = () => {
  dialogDiscount.value = false
}
const discountSure = () => {
  dialogDiscount.value = false
}

const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //封账1,解封2,结账作废3,作废4,删除5

//操作确定
const operationSure = async () => {
  switch (operationType.value) {
    case 1: {
      //代码块; 
      break;
    }
    case 2: {
      //代码块; 
      break;
    }
    case 3: {
      //代码块; 
      await teamInvalidSettle({ ids: InvalidSettleIds.value, ...ruleForm })
      ElMessage.success('结账作废成功')
      proTableAccounts.value?.clearSelection()
      proTableAccounts.value?.getTableList()
      break;
    }
    case 4: {
      //代码块; 
      await teamInvalidSettle({ ids: InvalidSettleId.value, ...ruleForm })
      ElMessage.success('结账作废成功')
      proTableAccounts.value?.clearSelection()
      proTableAccounts.value?.getTableList()
      break;
    }
    case 5: {
      //代码块; 
      await deleteTeamSettle({ ids: deleteInvoiceId.value, ...ruleForm })
      ElMessage.success('删除成功')
      proTableAccounts.value?.getTableList()
      break;
    }

  }
  operationDeter.value = false
}

//封账
const sealAccount = () => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录?'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 1
}
//解封
const releaseAccount = () => {
  operationDeter.value = true
  operationTitle.value = '是否确定进行解封操作？'
  operationInfo.value = '解除封账后将可继续进行结账操作'
  operationType.value = 2
}





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
  },
  {
    prop: "teamTaskId",
    label: "任务名称",
    enum: taskoptions
  },
  {
    prop: "receivedAmount",
    label: "实收金额",
  },
  {
    prop: "printInvoice",
    label: "是否打印发票",
    enum: printInvoiceList
  },
  {
    prop: "invoiceNumber",
    label: "发票号",
  },
  {
    prop: "settleOfficer",
    label: "结算人",
    width: 150
  },
  {
    prop: "settleTime",
    label: "结算时间",
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
    prop: "status",
    label: "状态",
    enum: statusList

  },
  {
    prop: "checkStatus",
    label: "审核状态",
    enum: checkStatusList
  },
  {
    prop: "operation",
    fixed: "right",
    width: 250,
    label: "操作",
  },
]);
const dataCallbackAccounts = (data: any) => {
  accountsInfo.value = data
  return {
    list: data.list,
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

// 结账作废ids
const InvalidSettleIds = ref([])
// 作废id
const InvalidSettleId = ref([])
// 删除id
const deleteInvoiceId = ref('')
// 结账审核id
const closingAuditIds = ref('')
//结账审核
const closingAudit = (params) => {
  operationDeter.value = true
  operationTitle.value = '结账审核'
  operationInfo.value = '请选择结账审核结果'
  operationType.value = 6
  closingAuditIds.value = [...params]
}
const handleRejectOrPass = async (type) => {
  if (type) {
    await teamSettleCheckPass({ ...ruleForm, ids: closingAuditIds.value })
    ElMessage.success('审核通过 成功')
  } else {
    await teamSettleCheckReject({ ...ruleForm, ids: closingAuditIds.value })
    ElMessage.success('审核驳回成功')
  }
  operationDeter.value = false
  proTableAccounts.value?.clearSelection()
  proTableAccounts.value?.getTableList()
}
//结账作废
const cancellationAccount = (params) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 3
  InvalidSettleIds.value = [...params]
}
//作废
const cancellation = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 4
  InvalidSettleId.value = [row.id]
}
//删除
const deleteInvoice = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定删除记录？'
  operationInfo.value = '删除记录后，该记录将不可恢复'
  operationType.value = 5
  deleteInvoiceId.value = [row.id]
}
//


//详情弹框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogIndex = ref(-1)
const isPreview = ref(false)
const details = (title: any, row: any) => {
  detailInfo.value = row
  dialogVisible.value = true
  isPreview.value = true
  if (title == '1') {
    dialogTitle.value = "分组明细"
    dialogIndex.value = 2

  } else {
    dialogTitle.value = "团检收费详情"
    dialogIndex.value = 1
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
    border-left: 6px solid #409eff;
    margin-bottom: 20px;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
  }

  .payment {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .task_btn {
      width: 300px;
    }

    .task_info {
      width: 800px
    }

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


  :deep(.sealAccountClass.el-dialog) {
    width: 400px;
    height: 176px;
    border-radius: 20px;
    background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 27%);

    :deep(.el-dialog__header) {
      border-bottom: none;
    }

    :deep(.el-dialog__headerbtn) {
      top: 1px;

    }
  }

  .no-inherit {
    margin-right: 10px;
    vertical-align: middle;
  }


}
</style>

