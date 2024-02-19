<template>
  <div class="flex justify-between items-start">
    <el-card shadow="hover" class="left">
      <template #header>
        <div class="flex justify-between">
          <span>任务列表</span>
          <el-tooltip class="box-item" content="新增任务" placement="top">
            <div class="rounded-full w-[24px] h-[24px] cursor-pointer bg-[#2879FF] flex items-center justify-center text-[14px]">
              <el-icon color="#fff">
                <Plus />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
      </template>
      <SearchForm :search-param="queryParams" :columns="basicInfoColumn" :searchCol="1" :show-action-group="false">
        <template #gjc>
          <div class="flex gap-2">
            <el-input v-model="queryParams.taskName" placeholder="输入关键词搜索" suffix-icon="Search" />
            <el-button class="button" :icon="RefreshRight" @click="handleCz" />
          </div>
        </template>
      </SearchForm>

      <div class="left-view ">
        <template v-for="item in teamTaskLists" :key="item.id">
          <CardItem :bus_physical_type="bus_physical_type" :item="item" :activeKey="activeKey" @click-item="handleClickItem(item)" />
        </template>
      </div>
    </el-card>

    <el-card shadow="hover" class="right">
      <div class="rwtitle">
        <span>任务详情</span>
        <div>
          <el-button class="button" type="primary">编辑任务</el-button>
          <el-button class="button" type="">取消编辑</el-button>
          <el-button class="button" type="primary">保存任务</el-button>
          <el-button class="button" type="primary">删除任务</el-button>
          <el-button class="button" type="primary" @click="handleS1">上一步</el-button>
          <el-button class="button" type="primary" @click="handleX1">下一步</el-button>
        </div>
      </div>
      <div><span>基本信息</span></div>
      <!-- 查询表单 -->
      <SearchForm ref="searchFormRef" :search-param="form" :columns="formColumn" :searchCol="4" :show-action-group="false" :rules="rules">
      </SearchForm>
      <div><span>体检项目信息</span></div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分组管理" name="first">
          <Frist :form="form" />
        </el-tab-pane>
        <el-tab-pane label="套餐/项目选择" name="second">
          <Second :formSecond="formSecond" />
        </el-tab-pane>
        <el-tab-pane label="人员管理" name="third">
          <Third />
        </el-tab-pane>
        <el-tab-pane label="委托协议" name="fourth">
          <Fourth />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="taskManagement">
import { debounce } from 'lodash'
import { teamTaskList, teamInfoList, peisTeamTask, peisTeamTaskUpdate, teamTaskDetail, updateGroupProjectInfo } from '@/api/groupInspectionManagement/taskManagement'
import type { TabsPaneContext } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import Frist from '@/views/groupInspectionManagement/taskManagement/components/frist.vue'
import Second from '@/views/groupInspectionManagement/taskManagement/components/second.vue'
import Third from '@/views/groupInspectionManagement/taskManagement/components/third.vue'
import Fourth from '@/views/groupInspectionManagement/taskManagement/components/fourth.vue'
import CardItem from './components/CardItem.vue';

const form = reactive<any>({
  groupList: [{
    groupPayType: '1'
  }]
});
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const queryParams = reactive({
  teamId: '',
  times: [],
  taskName: ''
})
const searchFormRef = ref()
const teamIdList = ref<any[]>([])
const formSecond = ref([])
const teamTaskLists = ref<any[]>([])
const activeName = ref('first')
const activeKey = ref<number>()

const { bus_physical_type, bus_charge_type } = toRefs<any>(proxy?.useDict("bus_physical_type", 'bus_charge_type'));

const formColumn = ref<any[]>([
  {
    label: '任务名称',
    prop: 'taskName',
    search: { el: 'input' },
  },
  {
    label: '团检单位',
    prop: 'teamId',
    search: { el: 'tree-select' },
    enum: teamIdList,
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    label: '体检类型',
    prop: 'physicalType',
    enum: bus_physical_type,
    search: { el: 'select' }
  },
  {
    label: '签订日期',
    prop: 'signDate',
    search: { el: 'date-picker' },
  },
  {
    label: '开始日期',
    prop: 'beginDate',
    search: { el: 'date-picker' },
  },
  {
    label: '结束日期',
    prop: 'endDate',
    search: { el: 'date-picker' },
  },
  {
    label: '收费类型',
    prop: 'chargeType',
    enum: bus_charge_type,
    search: { el: 'select' },
  },
  {
    label: '销售负责人',
    prop: 'saleHead',
    search: { el: 'input' },
  },
  {
    label: '是否审核',
    prop: 'isReview',
    enum: [
      {
        label: '是',
        value: '0',
      },
      {
        label: '否',
        value: '1',
      },
    ],
    search: { el: 'select' },
  },
]);

const rules = ref({
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ],
  teamId: [
    { required: true, message: '请选择团检单位', trigger: 'change' },
  ],
  physicalType: [
    { required: true, message: '请选择体检类型', trigger: 'change' },
  ],
  signDate: [
    { required: true, message: '请选择签订日期', trigger: 'change' },
  ],
  chargeType: [
    { required: true, message: '请选择收费类型', trigger: 'change' },
  ],
  isReview: [
    { required: true, message: '请选择是否审核', trigger: 'change' },
  ],
})
//获得单位
const getList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data) || []
}
getList()
//任务列表
const getTaskList = async () => {
  const signBeginDate = queryParams.times[0]
  const signEndDate = queryParams.times[1]
  const { rows } = await teamTaskList({ ...queryParams, signEndDate, signBeginDate })
  teamTaskLists.value = rows
}
getTaskList()
//监听
watch(queryParams, (newV) => {
  getRemote()
})
const getRemote = debounce(() => {
  getTaskList()
}, 500)
const basicInfoColumn = reactive<any[]>([
  {
    prop: 'teamId',
    label: '',
    search: { el: 'tree-select' },
    enum: teamIdList,
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    prop: 'times',
    label: '',
    search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'gjc',
    label: '',
    search: {},
    slot: 'gjc'
  },
])
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
//重置
const handleCz = () => {
  queryParams.teamId = ''
  queryParams.times = []
  queryParams.taskName = ''
}
//下一步
const handleX1 = async () => {
  searchFormRef.value.validate(async (valid: any, fields: any) => {
    if (valid) {
      if (activeName.value == 'first') {
        if (form.id) {
          const { data } = await peisTeamTaskUpdate(form)
          formSecond.value = data
          activeName.value = 'second'
        } else {
          const { data } = await peisTeamTask(form)
          formSecond.value = data
          activeName.value = 'second'
        }
        return
      }
      if (activeName.value == 'second') {
        const { data } = await updateGroupProjectInfo(formSecond.value)
        activeName.value = 'third'
        return
      }
    }
  })

}
//上一步
const handleS1 = () => {
  if (activeName.value == 'fourth') {
    activeName.value = 'third'
  }
  if (activeName.value == 'third') {
    activeName.value = 'second'
  }
  if (activeName.value == 'second') {
    activeName.value = 'first'
  }
}
//详情
const handleClickItem = async (row: any) => {
  activeName.value = 'first'
  activeKey.value = row.id
  const { data } = await teamTaskDetail(row)
  for (const key in data) {
    form[key] = data[key]
  }
}
</script>

<style scoped lang="scss">
.left-view {
  height: calc(100vh - 320px);
  overflow-y: auto;
}

.container-tj {
  display: flex;
  justify-content: space-between;
}

.right {
  flex: 1;
  margin-left: 10px;

  .rwtitle {
    display: flex;
    justify-content: space-between;
  }
}

.left {
  width: 350px;
}

:deep(.form-search) {
  padding: 0;
}
</style>
