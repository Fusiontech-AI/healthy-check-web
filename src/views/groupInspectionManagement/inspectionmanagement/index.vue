<template>
  <div class="closing">
    <el-card class="box-card" shadow="never">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default"
        status-icon>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单位名称" prop="teamId">
              <el-select v-model="ruleForm.teamId" filterable remote reserve-keyword placeholder="请选择单位名称"
                :remote-method="remoteMethod" :loading="loading" style="width: 240px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称" prop="year">
              <el-select v-model="ruleForm.year" placeholder="请选择任务名称">
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
      <div class="payment">
        <div class="payment_btn">
          <el-button type="primary" @click="closingAudit">结账审核</el-button>
          <el-button type="primary" @click="cancellationAccount">结账作废</el-button>
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
      <ProTable ref="proTableAccounts" :columns="columnsAccounts" :request-api="getTableListAccounts"
        :data-callback="dataCallbackAccounts" :toolButton="false">
        <!-- :requestAuto="false" -->
        <!-- 表格操作 -->
        <template #状态="scope">
          <span :class="{ abandon: scope.row == '1' }">{{ scope.row.username }}</span>
        </template>
        <template #审核状态="scope">
          <span :class="[scope.row == '待审核' ? 'to_reviewed' : 'reviewed']">{{ scope.row.username }}</span>
        </template>
        <template #operation="scope">
          <el-button type="primary" @click="details('2', scope.row)">详情 |</el-button>
          <el-button type="primary" @click="cancellation(scope.row)">作废 |</el-button>
          <el-button type="primary" @click="deleteInvoice(scope.row)">删除</el-button>
        </template>
      </ProTable>
    </el-card>

    <detailForm ref="detailFormRef" :dialogTitle="dialogTitle" :detailInfo="detailInfo" :dialogVisible="dialogVisible"
      @handleCancle="dialogVisible = false" @handleSure="dialogVisible = false">
    </detailForm>

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
        <span class="dialog-footer">
          <el-button @click="operationDeter = false" round>取消</el-button>
          <el-button type="primary" @click="operationSure" round>
            确定
          </el-button>
        </span>
      </template>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// import type { FormInstance, FormRules } from 'element-plus'
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { onMounted } from 'vue'
import detailForm from './component/detailForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { Search } from '@element-plus/icons-vue'


onMounted(() => {
  // getDict()
})

/* interface RuleForm {
  teamId: string
  year: string
} */
//获取表单实例
const ruleFormRef = ref()
const ruleForm = reactive({
  teamId: '',
  year: '',
})
const rules = reactive({
  teamId: [
    { required: true, message: '请选择单位名称', trigger: 'blur' },
  ],
  year: [
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

const remoteMethod = (query: any) => {
  loading.value = true
  // 调用接口
}


//获取单位名称及任务名称下拉列表
const getDict = async () => {
  remoteMethod('')
};
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
  ruleForm.year && (newParams.year = ruleForm.year);
  // const { data } = await groupList(newParams)
  const data = {
    list: [{ groupName: '111' }]
  }
  return data
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
const operationSure = () => {
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
      break;
    }
    case 4: {
      //代码块; 
      break;
    }
    case 5: {
      //代码块; 
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
  {
    prop: "groupName",
    label: "收费批次流水号",
  },
  {
    prop: "unitAmount",
    label: "单位名称",
  },
  {
    prop: "personCount",
    label: "任务名称",
  },
  {
    prop: "groupAmount",
    label: "实收金额",
  },
  {
    prop: "groupPayType",
    label: "是否打印发票",
    enum: [
      { label: '个人', value: '0' },
      { label: '单位', value: '1' }
    ],
  },
  {
    prop: "addPersonCount",
    label: "发票号",
  },
  {
    prop: "addAmount",
    label: "结算人",
  },
  {
    prop: "addItemPayType",
    label: "结算时间",
  },
  {
    prop: "addItemPayType",
    label: "支付方式",
  },
  {
    prop: "addItemPayType",
    label: "录入时间",
  },
  {
    prop: "addItemPayType",
    label: "状态",
  },
  {
    prop: "addItemPayType",
    label: "审核状态",
  },
  {
    prop: "operation",
    fixed: "right",
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
  ruleForm.year && (newParams.year = ruleForm.year);
  // const { data } = await groupList(newParams)
  const data = {
    list: [{}]
  }
  return data
};

//结账审核
const closingAudit = () => {

}
//结账作废
const cancellationAccount = () => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 3
}
//作废
const cancellation = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 4
}
//删除
const deleteInvoice = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定删除记录？'
  operationInfo.value = '删除记录后，该记录将不可恢复'
  operationType.value = 5
}
//


//详情弹框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const details = (title: any, row: any) => {
  detailInfo.value = row
  dialogVisible.value = true
  if (title == '1') {
    dialogTitle.value = "分组明细"

  } else {
    dialogTitle.value = "团检收费"
  }
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

