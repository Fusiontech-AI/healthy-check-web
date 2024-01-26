<template>
  <el-card>
    <div class="unit-page-wrap">
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
              <div class="flex items-center">
                <div class="text-[#3F4755]" style="white-space: nowrap">当前选择：</div>
                <span class="text-[#2879FF]">{{ selectTreeNodeName || '--' }}</span>
                <span v-if="selectTreeNodeName" @click="handleClearSelectTreeNodeName" class="flex items-center cursor-pointer px-[8px]">
                  <el-icon color="#2879FF">
                    <CircleClose />
                  </el-icon>
                </span>
              </div>
            </el-alert>
          </div>
          <div><el-input v-model="unitName" placeholder="单位搜索" clearable /></div>
          <div class="mt-[10px]">
            <el-tree
              v-loading="treeLoading"
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
          <div class="line" style="position: absolute;"></div>
          <div class="right-top ml-[10px] h-[50px] flex justify-between items-center">
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
            <div class="pr-[10px]">
              <el-button type="danger" round v-if="activeTab===0 && selectTreeNodeId" @click="handleDelete"> 删除单位 </el-button>
              <el-button round @click="handleCancle" v-if="!editFlag">取消</el-button>
              <el-button type="primary" round @click="handleSave" v-if="!editFlag"> 保存单位 </el-button>
              <el-button type="primary" round @click="handleEdit" v-if="editFlag"> 编辑单位 </el-button>
            </div>
          </div>
          <div class="line2"></div>
          <div class="mt-[10px] px-[10px]">
            <component
              ref="basciInfoRef"
              :is="tabList[activeTab]?.component"
              :data="unitFormData"
              @getData="handleGetData"
              :id="selectTreeNodeId"
              :editFlag="editFlag"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script lang="ts" setup name="groupUnitMsg">
import { ref, onMounted, markRaw} from 'vue';
import { CircleClose,Plus} from "@element-plus/icons-vue";
import UnitMsg from './components/UnitMsg.vue'
import UnitDepartMsg from './components/UnitDepartMsg.vue'
import { teamInfoList, queryTeamInfoById, addTeamInfo, editTeamInfo,deleteTeamInfo } from '@/api/groupInspectionManagement/unitMsg/index'
import { to } from "await-to-js";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

interface Tree {
  [key: string]: any
}
const basciInfoRef = ref()

const unitName = ref<any>() //单位搜索
const selectTreeNodeName = ref()//选中单位名称
const selectTreeNodeId = ref()//选中单位名称
const treeData = ref<any>([]);//单位列表数据
const treeRef = ref()

const activeTab = ref<any>(0)
const unitFormData = ref<any>()
const unitBasicFormData = ref<any>()
const editFlag = ref<boolean>(true)

const lastTreeData = ref<any>()
const treeLoading = ref<boolean>(false)

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
  treeLoading.value = true
  const {data} = await teamInfoList({})
  lastTreeData.value = data?.[data.length -1]
  treeData.value = proxy?.handleTree<any>(data)
  treeLoading.value = false
}

// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
}

// 单位树节点点击
const handleNodeClick =async (data:any) => {
  editFlag.value = true
  selectTreeNodeName.value = data.teamName
  selectTreeNodeId.value = data?.id
  const { data: response } = await queryTeamInfoById(data?.id)
  unitFormData.value = {...response,teamLevel:String(response?.teamLevel),parentId:String(response?.parentId)}
};

// 新增单位
const handleAddUnit = ()=> {
  editFlag.value = false
  resetUnitForm()
}

// 清空所选单位
const handleClearSelectTreeNodeName = ()=>{
  editFlag.value = true
  resetUnitForm()
}

// 重置单位列表表单状态
 const resetUnitForm = ()=>{
    selectTreeNodeId.value = null
    selectTreeNodeName.value = null
    treeRef.value?.setCurrentKey(null)
    unitFormData.value = {}
    nextTick(() =>{
      basciInfoRef.value?.resetFields()
    })
 }

// 获取单位列表数据
const handleGetData = (data: any) => {
  unitBasicFormData.value = data
}
// 编辑
const handleEdit = ()=> {
 if(!selectTreeNodeId.value) {
  return ElMessage.warning('请先选择一个体检单位，再进行编辑！')
 }
 editFlag.value = false
}
// 删除单位
const handleDelete =async () => {
  if(!selectTreeNodeId.value){
    return ElMessage.warning('请选择要删除的单位！')
  }
  const [err] = await to(proxy?.$modal.confirm('删除后该单位/部门不支持维护任务','是否确定删除该单位及下方单位/部门？') as any);
  if(!err){
    await deleteTeamInfo([selectTreeNodeId.value])
    ElMessage.success('删除成功！')
    await getTeamInfoList()
    editFlag.value = true
    resetUnitForm()
  }
}
// 保存
const handleSave =async () => {
  let unitFormData = await basciInfoRef.value?.submitData()
  unitFormData = {...unitFormData,enterpriseSize:Number(unitFormData?.enterpriseSize)}
  const service = unitFormData?.id ? editTeamInfo : addTeamInfo
  await service(unitFormData)
  proxy?.$modal.msgSuccess(unitFormData?.id?'编辑单位成功':'新增单位成功');
  await getTeamInfoList()
  editFlag.value = !editFlag.value
  treeRef.value?.setCurrentKey(lastTreeData.value?.id)
  handleNodeClick(lastTreeData.value)
}

// 取消
const handleCancle = () => {
  editFlag.value= !editFlag.value
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
