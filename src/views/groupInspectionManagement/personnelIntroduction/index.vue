<template>
  <div class="text-[14px]">
    <el-row>
      <el-col :span="5">
        <div class="bg-#fff rounded-4px">
          <div class="p-10px">
            <el-tree-select
              v-model="searchParam.teamId"
              class="w-full"
              placeholder="请输入单位"
              filterable
              clearable
              :data="teamIdList"
              node-key="id"
              :props="{ label: 'teamName' }"
              check-strictly
              @change="getTeamTaskData"
            >
            </el-tree-select>
            <el-date-picker
              class="my-2"
              v-model="searchParam.dateValue"
              type="daterange"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%;"
              @change="getTeamTaskData"
            />
            <div class="flex items-center">
              <el-input placeholder="请输入任务名称" v-model="searchParam.taskName" @input="updateInput"></el-input>
              <el-button @click="reset" :icon="RefreshRight" style="padding: 8px;margin-left: 10px;"></el-button>
            </div>
          </div>
          <el-scrollbar class="list_card" height="calc(100vh - 238px)">
            <div v-loading="teamTaskLoading">
              <template v-if="teamTaskList && teamTaskList.length !== 0">
                <el-card
                  shadow="hover"
                  v-for="item in teamTaskList"
                  :key="item"
                  class="card_item"
                  :class="isActiveId == item.id ? 'active' : ''"
                  @click="clickTeamTask(item)"
                >
                  <div class="flex justify-between items-center">
                    <span class="tetx-[#141C28]">{{ item.taskName }}</span>
                    <div class="flex">
                      <!-- <span class="ml-auto px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#2175FF]">放</span> -->
                      <span class="ml-1 px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">{{
                        bus_physical_type?.find((val: any) => val.dictValue == item.physicalType)?.label?.substring(0,1)
                      }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center my-2 text-[12px] text-[#89919F]">
                    <span>{{ item.teamName }}</span>
                  </div>
                  <div class="flex justify-between items-center text-[12px] text-[#89919F]">
                    <span>{{ item.signDate }}</span>
                    <span v-if="item.reviewResult == '0'" class="text-#FF8400">待审</span>
                    <span v-if="item.reviewResult == '1'" class="text-#09C268">通过</span>
                    <span v-if="item.reviewResult == '2'" class="text-#F75252">驳回</span>
                  </div>
                </el-card>
              </template>
              <el-empty v-else description="无数据" />
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="19">
        <el-card class="content">
          <div class="flex justify-end">
            <el-button round type="primary" plain @click="importTemplate">下载模板</el-button>
            <el-button round type="primary" plain @click="batchExport">批量导出</el-button>
            <el-button round type="primary" plain @click="batchImportDialog = true">批量导入</el-button>
            <el-button round type="primary" style="padding: 5px 40px; " @click="handleAdd()">新增</el-button>
          </div>
          <div class="no-card">
            <div class="my-2 ">
              <div class="font-bold card_title"><span></span>基本信息</div>
            </div>
            <SearchForm ref="formRef" :columns="formColumns" :search-param="activeTeamTaskInfo" :search-col="3" :disabled="true"></SearchForm>
          </div>
          <div class="divider"></div>
          <div>
            <div class="my-2">
              <div class="font-bold card_title"><span></span>人员信息</div>
            </div>
            <div class="my-2"><span class="text-red">*</span> 请根据当前任务所选体检类型，下载对应模板后再上传</div>
            <div class="no-card">
              <ProTable
                ref="proTableRef"
                :columns="tableColumns"
                :toolButton="false"
                :request-api="queryTaskRegisterExportById"
                :init-param="initParam"
                :request-auto="false"
              >
                <template #operation="{row}">
                  <el-button type="primary" link @click="viewPersonDetail(row)">查看</el-button>
                  <el-button type="danger" link @click="handleDel(row)">删除</el-button>
                </template>
              </ProTable>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer v-model="addDrawer" title="新增团检人员" size="60%">
      <add-drawer @closeDialog="addDrawer = false" :teamIdList="teamIdList"></add-drawer>
    </el-drawer>
    <el-dialog title="批量导入" v-model="batchImportDialog" width="55%">
      <batch-import
        :is-show-dialog="batchImportDialog"
        :team-task-info="activeTeamTaskInfo"
        @close-dialog="batchImportDialog = false; proTableRef?.getTableList()"
      ></batch-import>
    </el-dialog>
    <el-dialog title="人员信息详情" v-model="showPersonDialog" width="45%">
      <el-scrollbar height="550px" class="no-card">
        <SearchForm ref="formRef" :columns="personColumns" :search-param="personInfo" :search-col="2" :preview="true"></SearchForm>
        <!-- <Grid ref="gridRef" :gap="20" :cols="2">
          <GridItem :span="1" v-for="item in personColumns " :key="item.label">
            <div class="flex text-[14px] text-[#141C28] ml-4">
              <span class="w-[120px] text-[#89919F]">{{ item.label }}：</span>
              <span class="flex-1">{{ item.value }}</span>
            </div>
          </GridItem>
        </Grid> -->
      </el-scrollbar>
      <div class="flex justify-end mt-4">
        <el-button round @click="showPersonDialog = false">取消</el-button>
        <el-button round type="primary" @click="showPersonDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import _ from 'lodash';
import { formInfoColumns, tableColumn, personColumn } from './rowColumns'
import AddDrawer from './components/AddDrawer.vue'
import BatchImport from './components/BatchImport.vue'
import { getRegisterById, getTeamTaskList, queryTaskReviewRegister, deleteTaskRegister, queryTaskRegisterExportById } from '@/api/groupInspection/taskAudit';
import { teamInfoList } from '@/api/groupInspection/inspectionclosing';
import { RefreshRight } from '@element-plus/icons-vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {bus_physical_type} = toRefs<any>(proxy?.useDict('bus_physical_type'))
const proTableRef = ref()
const formColumns = ref<any>(formInfoColumns)
const tableColumns = ref<any>(tableColumn)
const personColumns = ref<any>(personColumn)
const searchParam = ref<any>({
  teamId: '',
  dateValue: [],
  taskName: ''
})
const isActiveId = ref('')
const formRef = ref<any>(null)
const addDrawer = ref<boolean>(false) // 新增弹框显示隐藏
const showPersonDialog = ref<boolean>(false) // 人员信息弹窗显示隐藏
const batchImportDialog = ref<boolean>(false) // 批量导入弹框显示隐藏
const personInfo = ref({})

// 查看人员详情
const viewPersonDetail = async(row:any) => {
  showPersonDialog.value = true
  const {data} = await getRegisterById(row.id)
  personInfo.value = data
}

// 删除
const handleDel = async(row:any) => {
  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
    roundButton: true
  }).then(async () => {
    await deleteTaskRegister(row.id)
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    proTableRef.value?.getTableList()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}
/** 批量导出 */
const batchExport = () => {
  
}
/** 下载模板操作 */
const importTemplate = () => {
  proxy?.download("/peis/teamTask/exportRegisterTemplate", {
    taskId: isActiveId.value,
    templateType: activeTeamTaskInfo.value.physicalType
  }, `人员导入模版.xlsx`);
}

// 新增打开抽屉弹框
const handleAdd = () => {
  addDrawer.value = true
}
const reset = () => {
  searchParam.value = {}
  getTeamTaskData()
}

// 点击任务卡片获取右侧数据
const clickTeamTask = (row: any) => {
  if (!row.id) return
  isActiveId.value = row.id
  activeTeamTaskInfo.value = { ...row, chargeType: String(row.chargeType) }// 基础信息
  initParam.taskId = row.id
}

// 团检任务基本信息
const activeTeamTaskInfo = ref<any>({})
// 获取左侧团检任务列表
const teamTaskList = ref<any>([])
const teamTaskLoading = ref<boolean>(false)
const initParam = reactive({ taskId: '' })
const getTeamTaskData = async () => {
  try {
    teamTaskLoading.value = true
    const {dateValue, ...p} = searchParam.value
    const { rows } = await getTeamTaskList({
      ...p,
      pagesize: -1,
      signBeginDate: dateValue?.[0],
      signEndDate: dateValue?.[1]
    })
    teamTaskLoading.value = false
    teamTaskList.value = rows
    clickTeamTask(isActiveId.value ? activeTeamTaskInfo.value : rows?.[0])
  } catch (error) {
    teamTaskLoading.value = false
  }
}
getTeamTaskData()
const updateInput = _.debounce(getTeamTaskData, 200) // 防抖

const teamIdList = ref<any>()
// 获取单位接口
const getteamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data)
}
getteamIdList()
</script>

<style scoped lang="scss">
.el-card {

  // border-radius: 0px;
  &.is-always-shadow {
    box-shadow: none
  }
}

.list_card {
  // height: calc(100vh - 255px);
  // overflow: auto;
  padding: 0 10px;

  .card_item {
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
  height: calc(100vh - 105px);
  overflow: auto;
}

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
</style>
