<template>
  <div class="flex justify-between items-start" v-loading="loading">
    <el-card shadow="hover" class="left">
      <template #header>
        <div class="flex justify-between">
          <span>任务列表</span>
          <el-tooltip class="box-item" content="新增任务" placement="top">
            <div
              class="rounded-full w-[24px] h-[24px] cursor-pointer bg-[#2879FF] flex items-center justify-center text-[14px]"
              @click="handleXZRW">
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
          <CardItem :bus_physical_type="bus_physical_type" :item="item" :activeKey="activeKey"
            @click-item="handleClickItem(item)" />
        </template>
      </div>
    </el-card>

    <el-card shadow="hover" class="right">
      <div class="rwtitle">
        <span>任务详情</span>
        <div>
          <el-button class="button" type="primary" v-if="form.id && preview"
            @click="preview = false; activeName = 'first'" round plain>编辑任务</el-button>
          <el-button class="button" type="" v-if="form.id && !preview"
            @click="preview = true; handleClickItem(form); activeName = 'first'" round plain>取消编辑</el-button>
          <el-button class="button" type="primary" @click="handleBCRW" round plain
            v-if="!preview && (activeName == 'first' || activeName == 'second')">保存任务</el-button>
          <el-button class="button" type="primary" v-if="form.id" @click="handleSCRW" round plain>删除任务</el-button>
          <el-button class="button" type="primary" @click="handleS1" v-if="activeName != 'first'" round
            plain>上一步</el-button>
          <el-button class="button" type="primary" @click="handleX1(false)" v-if="activeName != 'fourth'" round
            plain>下一步</el-button>
        </div>
      </div>
      <div><span>基本信息</span></div>
      <!-- 查询表单 -->
      <SearchForm ref="searchFormRef" :search-param="form" :columns="formColumn" :searchCol="4"
        :show-action-group="false" :rules="rules" :preview="preview" :disabled="activeName != 'first'">
      </SearchForm>
      <div><span>体检项目信息</span></div>
      <el-tabs v-model="activeName" @tab-click="handleClick" :class="{ 'tabsClass': !preview }">
        <el-tab-pane label="分组管理" name="first">
          <Frist :form="form" :preview="preview" />
        </el-tab-pane>
        <el-tab-pane label="套餐/项目选择" name="second">
          <Second :formSecond="formSecond" :preview="preview" :form="form" />
        </el-tab-pane>
        <el-tab-pane label="人员管理" name="third">
          <Third :preview="preview" :form="form" v-if="activeName == 'third'" />
        </el-tab-pane>
        <el-tab-pane label="委托协议" name="fourth">
          <Fourth :preview="preview" :form="form" v-if="activeName == 'fourth'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="taskManagement">
import { debounce, cloneDeep } from 'lodash'
import { teamTaskList, teamInfoList, peisTeamTask, peisTeamTaskUpdate, teamTaskDetail, updateGroupProjectInfo, teamTaskDel, teamTaskVerifyGroupData, teamTaskVerifyGroupPackageData, getTaskItemGroupInfoInfo, teamGroupDel } from '@/api/groupInspectionManagement/taskManagement'
import type { TabsPaneContext } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import Frist from '@/views/groupInspectionManagement/taskManagement/components/frist.vue'
import Second from '@/views/groupInspectionManagement/taskManagement/components/second.vue'
import Third from '@/views/groupInspectionManagement/taskManagement/components/third.vue'
import Fourth from '@/views/groupInspectionManagement/taskManagement/components/fourth.vue'
import CardItem from './components/CardItem.vue';
import {
  teamDeptList
} from '@/api/groupInspectionManagement/unitMsg/index';
import { reactive } from 'vue'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const queryParams = reactive({
  teamId: '',
  times: [],
  taskName: ''
})
const formObj = reactive({
  groupList: [{
    groupPayType: '1',
    groupType: '1',
    gender: '2',
    marriage: '2',
    addPayType: '0',
    itemDiscount: 100,
    addDiscount: 100,
  }],
  signDate: proxy?.$moment().format('YYYY-MM-DD'),
  beginDate: proxy?.$moment().format('YYYY-MM-DD'),
  endDate: proxy?.$moment().format('YYYY-MM-DD'),
})
const loading = ref(false)
const form = ref({ ...formObj });
const searchFormRef = ref()
const teamIdList = ref<any[]>([])
const deptList = ref<any[]>([])
const formSecond = ref([])
const formSecondClone = ref([])
const teamTaskLists = ref([])
const activeName = ref('first')
const preview = ref(false)
const activeKey = ref()

const { bus_physical_type, bus_charge_type, bus_hazardous_factors } = toRefs<any>(proxy?.useDict("bus_physical_type", 'bus_charge_type', 'bus_hazardous_factors'));

//单位change
const dwChange = async (val) => {
  form.value.teamDeptId = ''
  const { rows } = await teamDeptList({ teamId: val, pagesize: -1 })
  deptList.value = rows
}

const formColumn = ref<any[]>([
  {
    label: '任务名称',
    prop: 'taskName',
    search: { el: 'input' },
  },
  {
    label: '团检单位',
    prop: 'teamId',
    search: { el: 'tree-select', checkStrictly: true, },
    enum: teamIdList,
    fieldNames: { label: 'teamName', value: 'id' },
    change: dwChange
  },
  {
    label: '部门',
    prop: 'teamDeptId',
    search: { el: 'select' },
    enum: deptList,
    fieldNames: { label: 'deptName', value: 'id' },
  },
  {
    label: '体检类型',
    prop: 'physicalType',
    enum: bus_physical_type,
    search: { el: 'select' },
    change: (val) => {
      if (val == 'ZYJKTJ' || val == 'FSTJ') {
        //要求当为职业病和放射时分组类型只能是项目
        form.value.groupList.forEach(item => item.groupType = '1')
      }
    }
  },
  {
    label: '签订日期',
    prop: 'signDate',
    search: { el: 'date-picker', valueFormat: "YYYY-MM-DD" },
  },
  {
    label: '开始日期',
    prop: 'beginDate',
    search: { el: 'date-picker', valueFormat: "YYYY-MM-DD" },
  },
  {
    label: '结束日期',
    prop: 'endDate',
    search: { el: 'date-picker', valueFormat: "YYYY-MM-DD" },
  },
  {
    label: '收费类型',
    prop: 'chargeType',
    enum: bus_charge_type,
    search: { el: 'select' },
  },
  {
    label: '联系人姓名',
    prop: 'contactName',
    search: { el: 'input' },
  },
  {
    label: '体检人联系电话',
    prop: 'contactPhone',
    search: { el: 'input' },
  },
  {
    label: '编制人',
    prop: 'preparedName',
    search: { el: 'input' },
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

const validatePhone = (rule, value, callback) => {
  var isMobilePhone = /^1\d{10}$/
  var isFixMob = /^\d{3,4}-\d{7,8}$/
  if (!value) {
    callback()
  } else if (isMobilePhone.test(value) || isFixMob.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确电话号码'))
  }
}
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
  contactPhone: [
    { required: false, message: '', trigger: 'blur' },
    { validator: validatePhone, trigger: 'change' }
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
  try {
    loading.value = true
    const signBeginDate = queryParams.times[0]
    const signEndDate = queryParams.times[1]
    const { rows } = await teamTaskList({ ...queryParams, signEndDate, signBeginDate })
    teamTaskLists.value = rows
  } finally {
    loading.value = false
  }
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
    search: { el: 'tree-select', placeholder: '请选择单位', checkStrictly: true, },
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
  if (tab.props.name == 'second') {
    getSecondDetail()
  }
}
//重置
const handleCz = () => {
  queryParams.teamId = ''
  queryParams.times = []
  queryParams.taskName = ''
}

//bloo判断是否需要跳到下一步,区分保存任务
//下一步
const handleX1 = async (bloo) => {
  try {
    loading.value = true
    searchFormRef.value.validate(async (valid: any, fields: any) => {
      if (valid) {
        if (activeName.value == 'first') {
          if (preview.value) {
            activeName.value = 'second'
            await getSecondDetail()
            return
          }
          form.value.groupList.forEach(item => {
            if (item.isSyncProject1) {
              item.isSyncProject = '0'
            } else {
              item.isSyncProject = '1'
            }
          })
          if (form.value.id) {
            //调用校验接口
            await handleJY1()
            const { data } = await peisTeamTaskUpdate({ ...form.value, id: form.value.id })
            formSecond.value = data.groupList
            !bloo && (activeName.value = 'second')
            bloo && (proxy?.$modal.msgSuccess("操作成功"))
          } else {
            const { data } = await peisTeamTask(form.value)
            formSecond.value = data.groupList
            form.value.groupList = data.groupList
            !bloo && (activeName.value = 'second')
            bloo && (proxy?.$modal.msgSuccess("操作成功"))
            form.value.id = data.taskId
          }
          formSecondClone.value = cloneDeep(formSecond.value)
          //执行列表刷新
          await getTaskList()

          return
        }
        if (activeName.value == 'second') {
          if (preview.value) {
            return activeName.value = 'third'
          }
          //调用校验接口
          await handleJY2()
          if (formSecond.value.length == 0) {
            return activeName.value = 'third'
          }

          formSecond.value.forEach(res => {
            const tjPackageHazardsBoList = []
            res.hazardsBoList.forEach(item => {
              if (item == '14999') {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: res.fs,
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              } else if (item == '15999') {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: res.sw,
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              } else if (item == '13999') {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: res.wl,
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              } else if (item == '11999') {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: res.fc,
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              } else if (item == '12999') {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: res.hx,
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              } else {
                tjPackageHazardsBoList.push({
                  hazardFactorsOther: '',
                  hazardFactorsName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
                  hazardFactorsCode: item
                })
              }
            })
            res.groupHazardsList = tjPackageHazardsBoList
          })
          const p = {
            list: formSecond.value,
            physicalType: form.value.physicalType
          }
          await updateGroupProjectInfo(p)
          !bloo && (activeName.value = 'third')
          bloo && (proxy?.$modal.msgSuccess("操作成功"))
          return
        }
        if (activeName.value == 'third') {
          activeName.value = 'fourth'
          return
        }
      }
    })
  } finally {
    loading.value = false
  }

}
//校验第一步所填数据
const handleJY1 = async () => {
  const arr = form.value.groupList.filter(item => item.id)
  const { data } = await teamTaskVerifyGroupData(arr)
  if (data.isPrompt) {
    await proxy?.$modal.confirm(data.promptMessage)
  }
}
//校验第二步所填数据
const handleJY2 = async () => {
  //过滤出初始化没有标准价格的项
  const list = []
  formSecondClone.value.forEach(item => {
    if (item.actualPrice != null) {
      list.push(item.id)
    }
  })
  const arr = formSecond.value.filter(item => list.includes(item.id))
  const arr1 = arr.map(item => {
    const { id, groupName, itemDiscount, addDiscount, isSyncProject, actualPrice, groupItemList
    } = item
    return {
      id, groupName, itemDiscount, addDiscount, isSyncProject, actualPrice,
      itemList: groupItemList.map(item => item.itemId)
    }
  })
  if (arr1.length != 0) {
    const { data } = await teamTaskVerifyGroupPackageData(arr1)
    if (data.isPrompt) {
      await proxy?.$modal.confirm(data.promptMessage)
    }
  }
}
//上一步
const handleS1 = () => {
  if (activeName.value == 'fourth') {
    activeName.value = 'third'
    return
  }
  if (activeName.value == 'third') {
    if (preview) {
      getSecondDetail()
      return
    }
    activeName.value = 'second'
    return
  }
  if (activeName.value == 'second') {
    activeName.value = 'first'
  }
}
//详情
const handleClickItem = async (row: any) => {
  try {
    loading.value = true
    searchFormRef.value.resetFields()
    activeName.value = 'first'
    activeKey.value = row.id
    const { data } = await teamTaskDetail(row)
    dwChange(data.teamId)
    data.taskId = data.id
    data.groupList.forEach(item => {
      if (item.isSyncProject == '0') {
        item.isSyncProject1 = true
      } else {
        item.isSyncProject1 = false
      }
    })
    form.value = data
    preview.value = true
  } finally {
    loading.value = false
  }
}
//保存任务
const handleBCRW = async () => {
  handleX1(true)
}
//删除任务
const handleSCRW = async () => {
  await proxy?.$modal.confirm('确认要删除此任务吗?')
  await teamTaskDel({ ids: [form.value.id] })
  proxy?.$modal.msgSuccess("操作成功");
  handleGSH()
  getTaskList()
}
//新增任务
const handleXZRW = async () => {
  ((form.value.id) && !preview.value) && await proxy?.$modal.confirm('<span style="font-weight:bold">当前任务未保存，是否确认切换/新增任务？</span><br/> 切换/新增任务后，当前编辑内容将被清空')
  handleGSH()
}
//数据格式化
const handleGSH = () => {
  preview.value = false
  form.value = { ...formObj }
  activeName.value = 'first'
  searchFormRef.value.resetFields()
  activeKey.value = ''
}
//当为详情查看时点击操作上一步或者下一步触发的套餐详情接口
const getSecondDetail = async () => {
  try {
    loading.value = true
    const { data } = await getTaskItemGroupInfoInfo({ id: form.value.id, physicalType: form.value.physicalType })
    formSecond.value = data
    activeName.value = 'second'
  } finally {
    loading.value = false
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

.tabsClass {
  :deep(.el-tabs__item) {
    pointer-events: none !important;
  }
}
</style>
