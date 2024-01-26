<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="bg-[#fff]">
          <div class="p-[10px]">
            <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
            <el-input class="mt-2" placeholder="请输入关键字"></el-input>
            <div class="tabs">
              <span :class="activeName == '1' ? 'active' : ''" @click="activeName = '1'">待审批</span>
              <span :class="activeName == '2' ? 'active' : ''" @click="activeName = '2'">已审批</span>
            </div>
            <div class="divider"></div>
            <div class="flex justify-between items-center">
              <el-checkbox v-model="checked" size="large">全选</el-checkbox>
              <el-button type="primary" round size="small" @click="handleBatchAudit">批量审核</el-button>
            </div>
          </div>
          <el-scrollbar class="left_list" height="calc(100vh - 294px)">
            <el-card shadow="hover" v-for="item in 20" :key="item" class="list_card" :class="isActive == item ? 'active' : ''">
              <div class="flex items-center">
                <el-checkbox v-model="checked" size="large" />
                <span class="ml-2 text-[#141C28]">2023-06-13</span>
                <span class="ml-auto px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">职</span>
              </div>
              <div class="flex justify-between items-center text-[12px] mt-[8px]">
                <span class="text-[#89919F] flex-1">宜宾市翠屏区金秋湖镇人民政府1111111宾市翠屏区金秋湖镇人民宾市翠屏区金秋湖镇人民</span>
                <span class="text-[#FF8400] ml-1">待审</span>
              </div>
            </el-card>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="19">
        <el-scrollbar height="calc(100vh - 105px)">
          <div class="content">
            <div class="flex justify-end">
              <el-button round>委托协议预览</el-button>
              <el-button round type="primary" @click="showDrawer = true">任务审核</el-button>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>任务基础信息</div>
                <el-button
                  link
                  class="mr-2"
                  @click="basicTaskInforShow = !basicTaskInforShow"
                  :icon="basicTaskInforShow ? ArrowUpBold : ArrowDownBold"
                />
              </div>
              <el-collapse-transition>
                <Grid ref="gridRef" v-show="basicTaskInforShow" :gap="20" :cols="2">
                  <GridItem :span="1" v-for="item in basicInforList" :key="item.label">
                    <div class="flex text-[14px] text-[#141C28]">
                      <span class="w-[120px] text-[#89919F] ml-[30px]">{{ item.label }}</span>
                      <span class="flex-1">{{ item.value }}</span>
                    </div>
                  </GridItem>
                </Grid>
              </el-collapse-transition>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>任务分组</div>
                <el-button link class="mr-2" @click="taskGroupShow = !taskGroupShow" :icon="taskGroupShow ? ArrowUpBold : ArrowDownBold" />
              </div>
              <el-collapse-transition>
                <div v-show="taskGroupShow" class="no-card">
                  <ProTable :columns="taskGroupingColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]">
                    <template #operation="scope">
                      <el-button type="primary" link @click="showGroupDialog = true">查看</el-button>
                    </template>
                  </ProTable>
                </div>
              </el-collapse-transition>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>人员列表</div>
                <el-button link class="mr-2" @click="personListShow = !personListShow" :icon="personListShow ? ArrowUpBold : ArrowDownBold" />
              </div>
              <el-collapse-transition>
                <div v-show="personListShow" class="no-card">
                  <ProTable :columns="personnelListColumns" :toolButton="false" :data="[{ name: 11 }]">
                    <template #operation="scope">
                      <el-button type="primary" link @click="showPersonDialog = true">查看</el-button>
                    </template>
                  </ProTable>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-drawer v-model="showDrawer" title="任务审核" size="50%">
      <audit-dialog @closeDialog="showDrawer = false"></audit-dialog>
    </el-drawer>
    <el-dialog title="分组详情" v-model="showGroupDialog" width="70%">
      <group-details></group-details>
      <div class="flex justify-end mt-4">
        <el-button round @click="showGroupDialog = false">取消</el-button>
        <el-button round type="primary" @click="showGroupDialog = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="人员信息详情" v-model="showPersonDialog" width="45%">
      <div class="h-[550px] overflow-auto">
        <Grid ref="gridRef" :gap="20" :cols="2">
          <GridItem :span="1" v-for="item in personColumns " :key="item.label">
            <div class="flex text-[14px] text-[#141C28] ml-4">
              <span class="w-[120px] text-[#89919F]">{{ item.label }}：</span>
              <span class="flex-1">{{ item.value }}</span>
            </div>
          </GridItem>
        </Grid>
      </div>
      <div class="flex justify-end mt-4">
        <el-button round @click="showPersonDialog = false">取消</el-button>
        <el-button round type="primary" @click="showPersonDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import AuditDialog from './components/AuditDialog.vue'
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";
import GroupDetails from "./components/GroupDetails.vue";
import { taskGroupingColumn, personnelListColumn, personColumn } from './rowColumns'
const dateValue = ref('')
const activeName = ref('1')
const checked = ref()
const isActive = ref(1)
const showDrawer = ref(false) // 审核任务抽屉
const basicTaskInforShow = ref(true) // 基础任务信息折叠展示
const taskGroupShow = ref(true) // 任务分组折叠展示
const personListShow = ref(true) // 人员列表折叠展示
const auditValue = ref('1')
const showGroupDialog = ref(false) // 任务分组弹框显示
const showPersonDialog = ref(false) // 人员信息弹框显示
const basicInforList = ref([
  {
    label: '任务名称：',
    value: '18100000000'
  },
  {
    label: '任务编号：',
    value: '18100000000'
  },
  {
    label: '单位名称：',
    value: '18100000000'
  },
  {
    label: '体检类型：',
    value: '健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检'
  },
  {
    label: '联系人姓名：',
    value: '哈哈'
  },
  {
    label: '体检人联系电话：',
    value: '哈哈'
  },
  {
    label: '销售负责人：',
    value: '哈哈'
  },
  {
    label: '编制人：',
    value: '哈哈'
  },
  {
    label: '审核状态：',
    value: '哈哈'
  },
])
const personColumns = ref(personColumn)
const taskGroupingColumns = ref<any>(taskGroupingColumn) // 任务分组Columns
const personnelListColumns = ref<any>(personnelListColumn) // 人员列表Columns
// 批量审核
const handleBatchAudit = () => {
  ElMessageBox(
    {
      title: '是否确定审核所选的x条数据？',
      message: () => {
        return <>
          <div>审核结论：<el-radio-group v-model={auditValue.value} class="ml-4">
            <el-radio label="1" size="large">通过</el-radio>
            <el-radio label="2" size="large">不通过</el-radio>
          </el-radio-group>
          </div>
        </>
      },
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>

<style scoped lang="scss">
.el-card {

  // border-radius: 0px;
  &.is-always-shadow {
    box-shadow: none
  }
}

.tabs {
  display: flex;
  margin: 10px 0;
  font-size: 14px;
  color: #3F4755;

  span {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 93px;
    cursor: pointer;

    &:hover {
      background: #F1F5FB;
    }

    &.active {
      background: #F1F5FB;
      color: #2879FF;
    }
  }
}

.left_list {
  // height: calc(100vh - 300px);
  // overflow: auto;
  padding: 0 10px;
  .list_card {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-style: solid;
    border-color: #E6EAEF;
    border-radius: 4px;
    border-width: 0px 0px 1px 0px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }

    &.active {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }

    .el-checkbox.el-checkbox--large {
      height: auto;
    }
  }
}

.content {
  // height: calc(100vh - 105px);
  // overflow: auto;
  font-size: 14px;
  background: #fff;
  padding: 10px;
  border-left: 1px solid #E8E8E8;

  .card_title {
    display: flex;
    align-items: center;

    span {
      width: 4px;
      height: 16px;
      margin-right: 4px;
      border-radius: 2px;
      font-weight: bold;
      background: #FF8F33;
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  margin: 8px 0;
  background: #E8E8E8;
}
</style>
