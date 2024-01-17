<template>
  <div class="m-2 unit-wrap">
    <div class="w-full flex">
      <div class="w-[220px] px-[10x]">
        <div class="flex justify-between mt-[10px]">
          <div class="font-bold">单位列表</div>
          <div class="add-circle w-[24px] h-[24px] cursor-pointer bg-[#2879FF] flex items-center justify-center">
            <el-icon color="#fff">
              <Plus />
            </el-icon>
          </div>
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
          <!-- :highlight-current="true" -->
        </div>
      </div>
      <div class="line ml-[8px]"></div>
      <div class="flex-1">
        <div class="right-top h-[50px] flex justify-between items-center ml-[10px]">
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
          <component :is="tabList[activeTab]?.component" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="groupUnitMsg">
import { ref, onMounted, markRaw} from 'vue';
import { CircleClose,Plus} from "@element-plus/icons-vue";
import UnitMsg from './components/UnitMsg.vue'
import UnitDepartMsg from './components/UnitDepartMsg.vue'
import {teamInfoList} from '@/api/groupInspectionManagement/unitMsg/index'

interface Tree {
  [key: string]: any
}
const basciInfoRef = ref()

const unitName = ref<any>() //单位搜索
const selectTreeNodeName = ref()//选中单位名称
const treeData = ref<any>([]);//单位列表数据
const treeRef = ref()

const activeTab = ref<any>(0)

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

const tabList = markRaw<any>([
  { label: '单位列表', key: 0, component: UnitMsg, ref: basciInfoRef },
  { label: '单位部门信息维护', key: 1, component: UnitDepartMsg },
])

// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
}

// 单位树节点点击
const handleNodeClick = (data:any) => {
  selectTreeNodeName.value = data.teamName
};

// 清空所选单位
const handleClearSelectTreeNodeName = ()=>{
  selectTreeNodeName.value = null
  nextTick(() => {
    treeRef.value?.setCheckedKeys([])
  })
}

const handleSave = () => {
  basciInfoRef.value?.validate()
}

const handleCancle = () => {
  basciInfoRef.value?.clearValidate()
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.teamName.includes(value)
}
</script>
<style lang="scss" scoped>
.unit-wrap {
  height: calc(100vh - 110px);
  border-radius: 4px;
  background: #FFFFFF;
  box-shadow: 0px 0px 16px 0px rgba(128, 146, 181, 0.1);
  overflow-y: auto;
}
.line{
  height: calc(100vh - 110px);
  width: 1px;
  background: #E8E8E8;
}
.line2{
  height: 1px;
  width: 100%;
  background: #E8E8E8;
}
.active-tab-btn {
  height: 30px;
  border-radius: 93px;
  // padding: 4px 10px;
  background: #F1F5FB;
  color: #2879FF;
}
.add-circle{
  border-radius: 10px;
}
::v-deep(.unit-tree .el-tree-node.is-current>.el-tree-node__content){
  color:#2879FF !important
}
</style>
