<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="bg-[#fff]">
          <div class="p-[10px]">
            <el-date-picker v-model="dateValue" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间"
              style="width: 100%;" @change="getTeamTaskData" />
            <el-input class="mt-2" placeholder="请输入关键字" v-model="taskName" @input="updateInput"></el-input>
            <div class="tabs">
              <span :class="isReview == '1' ? 'active' : ''" @click="updateTabs('1')">待审批</span>
              <span :class="isReview == '0' ? 'active' : ''" @click="updateTabs('0')">已审批</span>
            </div>
            <div class="divider"></div>
            <div class="flex justify-between items-center">
              <el-checkbox v-model="allChecked" size="large" @change="handleCheckAllChange">全选</el-checkbox>
              <el-button type="primary" round size="small" @click="handleBatchAudit">批量审核</el-button>
            </div>
          </div>
          <el-scrollbar class="left_list" height="calc(100vh - 294px)">
            <div v-loading="teamTaskLoading">
              <template v-if="teamTaskList && teamTaskList.length !== 0">
                <el-card shadow="hover" v-for="item in teamTaskList" :key="item.id" class="list_card"
                  :class="isActiveId == item.id ? 'active' : ''" @click="clickTeamTask(item)">
                  <div class="flex items-center">
                    <el-checkbox v-model="item.checked" size="large" @click.stop />
                    <span class="ml-2 text-[#141C28]">{{ item?.signDate }}</span>
                    <span class="ml-auto px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">{{
                      bus_physical_type?.find((val: any) => val.dictValue == item.physicalType)?.label?.substring(0,
                        1)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center text-[12px] mt-[8px]">
                    <span class="text-[#89919F] flex-1">{{ item?.taskName }}</span>
                    <span v-if="isReview == '1'" :class="item?.isReview == '0' ? 'text-#09C268' : 'text-#FF8400'"
                      class="ml-1">
                      {{ item?.isReview == '0' ? '已审' : '待审' }}
                    </span>
                    <span v-else :class="item?.reviewResult == '1' ? 'text-#09C268' : 'text-#F75252'">
                      {{ item?.reviewResult == '1' ? '通过' : '驳回' }}
                    </span>
                  </div>
                </el-card>
              </template>
              <el-empty v-else description="无数据" />
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="19">
        <el-scrollbar height="calc(100vh - 105px)">
          <div class="content" v-loading="rightLoading">
            <div class="flex justify-end">
              <el-button round>委托协议预览</el-button>
              <el-button round type="primary" @click="showDrawer = true">任务审核</el-button>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>任务基础信息</div>
                <el-button link class="mr-2" @click="basicTaskInforShow = !basicTaskInforShow"
                  :icon="basicTaskInforShow ? ArrowUpBold : ArrowDownBold" />
              </div>
              <el-collapse-transition>
                <Grid ref="gridRef" v-show="basicTaskInforShow" :gap="20" :cols="2">
                  <GridItem :span="1" v-for="item in basicInforColumn" :key="item.prop">
                    <div class="flex text-[14px] text-[#141C28]">
                      <span class="w-[120px] text-[#89919F] ml-[30px]">{{ item.label }}</span>

                      <span v-if="item.prop === 'isReview'" class="flex-1"
                        :class="basicInfoData?.[item.prop] == '1' ? 'text-#FF8400' : 'text-#09C268'">
                        {{ item.enum.find((val: any) => val.value == basicInfoData?.[item.prop])?.label }}
                      </span>
                      <div v-else>
                        <span v-if="!item.enum" class="flex-1">
                          {{ basicInfoData?.[item.prop] }}
                        </span>
                        <span v-else class="flex-1">
                          {{ item.enum.find((val: any) => val.value == basicInfoData?.[item.prop])?.label }}
                        </span>
                      </div>
                    </div>
                  </GridItem>
                </Grid>
              </el-collapse-transition>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>任务分组</div>
                <el-button link class="mr-2" @click="taskGroupShow = !taskGroupShow"
                  :icon="taskGroupShow ? ArrowUpBold : ArrowDownBold" />
              </div>
              <el-collapse-transition>
                <div v-show="taskGroupShow" class="no-card">
                  <ProTable :columns="taskGroupingColumns" :toolButton="false" :request-api="queryTaskReviewGroup"
                    :init-param="initParam" :request-auto="false">
                    <template #operation="{ row }">
                      <el-button type="primary" link @click="viewGrounDetail(row)">查看</el-button>
                    </template>
                  </ProTable>
                </div>
              </el-collapse-transition>
            </div>
            <div class="divider"></div>
            <div>
              <div class="my-2 flex justify-between items-center">
                <div class="card_title"><span></span>人员列表</div>
                <el-button link class="mr-2" @click="personListShow = !personListShow"
                  :icon="personListShow ? ArrowUpBold : ArrowDownBold" />
              </div>
              <el-collapse-transition>
                <div v-show="personListShow" class="no-card">
                  <ProTable :columns="personnelListColumns" :toolButton="false" :request-api="queryTaskReviewRegister"
                    :init-param="initParam" :request-auto="false">
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
    <el-drawer v-model="showDrawer" title="任务审核" size="50%" @handleClose="auditValue = '1'">
      <audit-dialog :basicInfoData="basicInfoData" :auditValue="auditValue"
        @closeDialog="showDrawer = false; getTeamTaskData()"></audit-dialog>
    </el-drawer>
    <el-dialog title="分组详情" v-model="showGroupDialog" width="70%">
      <group-details :grounDetailItem="grounDetailItem"></group-details>
      <div class="flex justify-end mt-4">
        <el-button round @click="showGroupDialog = false; grounDetailItem = {}">取消</el-button>
        <el-button round type="primary" @click="showGroupDialog = false; grounDetailItem = {}">确定</el-button>
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
import _ from 'lodash';
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import AuditDialog from './components/AuditDialog.vue'
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";
import GroupDetails from "./components/GroupDetails.vue";
import { basicInforColumns, taskGroupingColumn, personnelListColumn, personColumn } from './rowColumns'
import { getTeamTaskList, queryTaskReviewDetail, queryTaskReviewGroup, queryTaskReviewRegister, reviewTask } from "@/api/groupInspection/taskAudit/index";
import dayjs from "dayjs";
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type } = toRefs<any>(proxy?.useDict('bus_physical_type'))

const showDrawer = ref(false) // 审核任务抽屉
const basicTaskInforShow = ref(true) // 基础任务信息折叠展示
const taskGroupShow = ref(true) // 任务分组折叠展示
const personListShow = ref(true) // 人员列表折叠展示
const auditValue = ref('1')
const showPersonDialog = ref(false) // 人员信息弹框显示
const basicInforColumn = ref(basicInforColumns)
const personColumns = ref(personColumn)
const taskGroupingColumns = ref<any>(taskGroupingColumn) // 任务分组Columns
const personnelListColumns = ref<any>(personnelListColumn) // 人员列表Columns

// 批量审核
const allChecked = ref(false)
const handleCheckAllChange = (val: any) => {
  teamTaskList.value.forEach((item: any) => {
    item.checked = val
  })
}
const handleBatchAudit = () => {
  const ids = teamTaskList.value.filter((item: any) => item.checked).map((item: any) => item.id)
  if (ids.length == 0) return ElMessage.warning('请至少选择一项！')
  auditValue.value = '1'
  ElMessageBox(
    {
      title: `是否确定审核所选的${ids.length}条数据？`,
      message: () => {
        return <>
          <div>审核结论：<el-radio-group v-model={auditValue.value} class="ml-4">
            <el-radio label="1" size="large">通过</el-radio>
            <el-radio label="2" size="large">驳回</el-radio>
          </el-radio-group>
          </div>
        </>
      },
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(async () => {
      await reviewTask({ idList: ids, reviewResult: auditValue.value })
      getTeamTaskData()
      ElMessage({
        type: 'success',
        message: '审核成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

// 任务分组查看详情
const showGroupDialog = ref(false) // 任务分组弹框显示
const grounDetailItem = ref()
const viewGrounDetail = (row: any) => {
  showGroupDialog.value = true
  grounDetailItem.value = _.cloneDeep(row)
}

// 任务基础信息
const basicInfoData = ref<any>({})
const getTaskReviewDetail = async (id: string) => {
  if (!id) return basicInfoData.value = {}
  const { data } = await queryTaskReviewDetail(id)
  basicInfoData.value = data
}

// 左侧列表数据展示
// const dateValue = ref<any>([dayjs(new Date()).format("YYYY-MM-DD"), dayjs(new Date()).format("YYYY-MM-DD")]) //时间
const dateValue = ref<any>([]) //时间
const taskName = ref() // 任务名称
const isReview = ref('1') // 是否审核
const teamTaskList = ref<any>([])
const teamTaskLoading = ref(false)
const isActiveId = ref<any>()
const initParam = reactive({ taskId: '' })

const rightLoading = ref(false)
// 点击任务卡片获取右侧数据
const clickTeamTask = (row: any) => {
  if (!row.id) return
  rightLoading.value = true
  isActiveId.value = row.id
  initParam.taskId = row.id
  basicInfoData.value = row  //任务基础信息
  // await getTaskReviewDetail(isActiveId.value) // 获取任务基础信息
  rightLoading.value = false
}
// 查询团检任务管理列表
const getTeamTaskData = async () => {
  try {
    teamTaskLoading.value = true
    const { rows } = await getTeamTaskList({
      taskName: taskName.value,
      signBeginDate: dateValue.value?.[0],
      signEndDate: dateValue.value?.[1],
      isReview: isReview.value
    })
    teamTaskList.value = rows
    teamTaskList.value.forEach((item: any) => { item.checked = false })
    teamTaskLoading.value = false
    allChecked.value = false
    // clickTeamTask(isActiveId.value || rows?.[0]?.id)
    clickTeamTask(isActiveId.value ? basicInfoData.value : rows?.[0])
  } catch (error) {
    teamTaskLoading.value = false
  }
}
getTeamTaskData()

const updateInput = _.debounce(getTeamTaskData, 200) // 防抖
// 切换审核状态
const updateTabs = (val: string) => {
  isReview.value = val
  getTeamTaskData()
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
