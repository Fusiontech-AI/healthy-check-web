<template>
  <el-card class="m-1">
    <el-row :gutter="8">
      <el-col :span="5">
        <div class="flex justify-between mt-[10px]">
          <div class="font-bold">单位列表</div>
          <el-tooltip class="box-item" content="新增单位" placement="top">
            <div class="add-circle w-[24px] h-[24px] cursor-pointer bg-[#2879FF] flex items-center justify-center" @click="handleAddUnit">
              <el-icon color="#fff">
                <Plus />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
        <div class="my-[10px]">
          <el-alert type="info" center :closable="false" :show-icon="false" style="border:none">
            <template #title>
              <div class="flex items-center">
                <span class="text-[#3F4755]">当前选择：</span>
                <span class="text-[#2879FF]">{{ selectTreeNodeName || '--' }}</span>
                <span v-if="selectTreeNodeName" @click="handleClearSelectTreeNodeName" class="flex items-center cursor-pointer px-[8px]">
                  <el-icon color="#2879FF">
                    <CircleClose />
                  </el-icon>
                </span>
              </div>
            </template>
          </el-alert>
        </div>
        <div><el-input v-model="unitName" placeholder="单位搜索" clearable /></div>
        <div class="mt-[10px]">
          <el-tree
            ref="treeRef"
            class="unit-tree"
            :filter-node-method="filterNode"
            :data="treeData"
            :props="{label:'teamName'}"
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="19">
        <div class="flex">
          <div>
            <el-divider direction="vertical" style="height: 100%;" />
          </div>
          <div class="flex-1">
            <div class="right-top h-[50px] flex justify-between items-center">
              <div class="flex items-center">
                <div
                  v-for="(item,index) in tabList"
                  :key="index"
                  :class="[item.key===activeTab?'active-tab-btn':'','cursor-pointer py-[4px] px-[10px]']"
                  @click="handleClickTab(item)"
                >
                  {{ item.label }}
                </div>
              </div>
              <div class="pr-[20px]">
                <el-button round @click="handleCancle">取消</el-button>
                <el-button type="primary" round @click="handleSave">保存</el-button>
              </div>
            </div>
            <div class="line2"></div>
            <div class="mt-[10px] px-[10px]">
              <component ref="basciInfoRef" :is="tabList[activeTab]?.component" :data="unitFormData" @getData="handleGetData" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script lang="ts" setup name="groupUnitMsg">
import { ref, onMounted, markRaw} from 'vue';
import { CircleClose,Plus} from "@element-plus/icons-vue";
import UnitMsg from './components/UnitMsg.vue'
import UnitDepartMsg from './components/UnitDepartMsg.vue'
import { teamInfoList, queryTeamInfoById } from '@/api/groupInspectionManagement/unitMsg/index'

interface Tree {
  [key: string]: any
}
const basciInfoRef = ref()

const unitName = ref<any>() //单位搜索
const selectTreeNodeName = ref()//选中单位名称
const treeData = ref<any>([]);//单位列表数据
const treeRef = ref()

const activeTab = ref<any>(0)
const unitFormData = ref<any>()

const tabList = markRaw<any>([
  { label: '单位列表', key: 0, component: UnitMsg, ref: basciInfoRef },
  { label: '单位部门信息维护', key: 1, component: UnitDepartMsg },
])

watch(unitName, (val) => {
  treeRef.value?.filter(val)
})

onMounted(() => {
  getTeamInfoList()
});

// 获取左侧单位树数据
const getTeamInfoList =async () =>{
 const {data} = await teamInfoList({})
 treeData.value = data
}

// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
}

// 单位树节点点击
const handleNodeClick =async (data:any) => {
  selectTreeNodeName.value = data.teamName
  const { data: response } = await queryTeamInfoById(data?.id)
  unitFormData.value = response
};

// 新增单位
const handleAddUnit = ()=> {
  handleClearSelectTreeNodeName()
}

// 清空所选单位
const handleClearSelectTreeNodeName = ()=>{
  selectTreeNodeName.value = null
  resetUnitForm()
}

// 重置单位列表表单状态
 const resetUnitForm = ()=>{
    treeRef.value?.setCurrentKey(null)
    unitFormData.value = {}
    basciInfoRef.value?.resetFields()
 }

// 获取单位列表数据
const handleGetData = (data: any) => {
}

// 保存
const handleSave = () => {
   basciInfoRef.value?.submitData()
}

// 取消
const handleCancle = () => {
  basciInfoRef.value?.clearValidate()
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.teamName.includes(value)
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
