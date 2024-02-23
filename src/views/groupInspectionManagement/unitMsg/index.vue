<template>
  <el-card :body-style="{ padding:'0px !important' }">
    <div class="unit-page-wrap">
      <el-row :gutter="8">
        <el-col :span="5">
          <div class="ml-[10px] mr-[2px]">
            <div class="flex justify-between mt-[10px]">
              <div class="font-bold text-level-base">单位列表</div>
              <el-tooltip class="box-item" content="新增单位" placement="top">
                <div
                  class="rounded-full w-[24px] h-[24px] cursor-pointer bg-[#2879FF] flex items-center justify-center text-[14px]"
                  @click="handleAddUnit"
                >
                  <el-icon color="#fff">
                    <Plus />
                  </el-icon>
                </div>
              </el-tooltip>
            </div>

            <div class="my-[10px]">
              <div class="flex alert-select">
                <div class="text-[#3F4755] whitespace-nowrap">当前选择：</div>
                <div :title="selectTreeNodeName" class="text-[#2879FF] text-ellipsis">{{ selectTreeNodeName || '--' }}</div>
                <span v-if="selectTreeNodeName" @click="handleClearSelectTreeNodeName" class="flex items-center cursor-pointer px-[8px]">
                  <el-icon color="#2879FF">
                    <CircleClose />
                  </el-icon>
                </span>
              </div>
            </div>
            <div><el-input v-model="unitName" placeholder="请输入单位名称搜索" clearable /></div>
            <div class="mt-[10px]">
              <el-tree
                v-loading="treeLoading"
                ref="treeRef"
                class="unit-tree"
                :filter-node-method="filterNode"
                :data="treeData"
                :props="{ label: 'teamName' }"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="line" style="position: absolute"></div>
          <div class="right-top ml-[10px] h-[50px] flex justify-between items-center">
            <div class="flex items-center">
              <div
                v-for="(item, index) in tabList"
                :key="index"
                :class="[
                  item.key === activeTab ? 'active-tab-btn' : '',
                  'cursor-pointer py-[4px] px-[10px]',
                ]"
                @click="handleClickTab(item)"
              >
                {{ item.label }}
              </div>
            </div>
            <div class="pr-[10px]" v-if="activeTab==0">
              <el-button round v-if="activeTab === 0 && selectTreeNodeId" @click="handleDelete"> 删除 </el-button>
              <el-button round @click="handleCancle" v-if="!editFlag">取消</el-button>
              <el-button type="primary" round @click="handleSave" v-if="!editFlag"> 保存 </el-button>
              <el-button type="primary" round @click="handleEdit" v-if="editFlag"> 编辑 </el-button>
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
import { ref, onMounted, markRaw } from 'vue';
import { CircleClose, Plus } from '@element-plus/icons-vue';
import UnitMsg from './components/UnitMsg.vue';
import UnitDepartMsg from './components/UnitDepartMsg.vue';
import {
  teamInfoList,
  addTeamInfo,
  editTeamInfo,
  deleteTeamInfo,
} from '@/api/groupInspectionManagement/unitMsg/index';
import { to } from 'await-to-js';
import { cloneDeep } from 'lodash'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

interface Tree {
  [key: string]: any;
}
const basciInfoRef = ref();

const unitName = ref<any>(); //单位搜索
const selectTreeNodeName = ref(); //选中单位名称
const selectTreeNodeId = ref(); //选中单位名称
const selectTreeNodeRow = ref(); //选中单位名称
const treeData = ref<any>([]); //单位列表树数据
const originalUnitData = ref<any>([]); //单位列表原数据
const treeRef = ref();

const activeTab = ref<any>(0);
const unitFormData = ref<any>();
const unitBasicFormData = ref<any>();
const editFlag = ref<boolean>(true);

const lastTreeData = ref<any>();
const treeLoading = ref<boolean>(false);

const tabList = markRaw<any>([
  { label: '单位列表', key: 0, component: UnitMsg, ref: basciInfoRef },
  { label: '单位部门信息维护', key: 1, component: UnitDepartMsg },
]);

watch(unitName, (val) => {
  treeRef.value?.filter(val);
});

onMounted(() => {
  getTeamInfoList();
});

// 获取左侧单位树数据
const getTeamInfoList = async () => {
  treeLoading.value = true;
  const { data } = await teamInfoList({});
  originalUnitData.value = cloneDeep(data);
  lastTreeData.value = data?.[data.length - 1];
  treeData.value = proxy?.handleTree<any>(data);
  treeLoading.value = false;
};

// 切换tab
const handleClickTab = (tab: any) => {
  activeTab.value = tab.key;
};

// 单位树节点点击
const handleNodeClick = async (data: any) => {
  editFlag.value = true;
  selectTreeNodeName.value = data.teamName;
  selectTreeNodeId.value = data?.id;
  selectTreeNodeRow.value = data;
};

// 新增单位
const handleAddUnit = () => {
  editFlag.value = false;
  resetUnitForm();
};

// 清空所选单位
const handleClearSelectTreeNodeName = () => {
  editFlag.value = true;
  resetUnitForm();
};

// 重置单位列表表单状态
const resetUnitForm = () => {
  selectTreeNodeId.value = null;
  selectTreeNodeName.value = null;
  unitName.value = null;
  treeRef.value?.setCurrentKey(null);
  unitFormData.value = {};
  nextTick(() => {
    basciInfoRef.value?.resetFields();
  });
};

// 获取单位列表数据
const handleGetData = (data: any) => {
  unitBasicFormData.value = data;
};
// 编辑
const handleEdit = () => {
  if (!selectTreeNodeId.value) {
    return ElMessage.warning('请先选择一个体检单位，再进行编辑！');
  }
  editFlag.value = false;
};
// 删除单位
const handleDelete = async () => {
  if (!selectTreeNodeId.value) {
    return ElMessage.warning('请选择要删除的单位！');
  }
  const [err] = await to(
    proxy?.$modal.confirm(
      '删除后该单位不支持维护任务',
      '是否确定删除该单位及下方单位？',
      'error'
    ) as any
  );
  if (!err) {
    await deleteTeamInfo([selectTreeNodeId.value]);
    ElMessage.success('删除成功！');
    await getTeamInfoList();
    editFlag.value = true;
    resetUnitForm();
  }
};
// 保存
const handleSave = async () => {
  let unitFormData = await basciInfoRef.value?.submitData();
  if (unitFormData) {
    unitFormData = { ...unitFormData, enterpriseSize: Number(unitFormData?.enterpriseSize) };
    const service = unitFormData?.id ? editTeamInfo : addTeamInfo;
    await service(unitFormData);
    proxy?.$modal.msgSuccess(unitFormData?.id ? '编辑单位成功' : '新增单位成功');
    await getTeamInfoList();
    editFlag.value = !editFlag.value;
    if (!unitFormData.id) {
      // 新增节点-选中新增数据
      treeRef.value?.setCurrentKey(lastTreeData.value?.id);
      handleNodeClick(lastTreeData.value);
      //更新当前选择字段
      selectTreeNodeName.value = lastTreeData.value?.teamName
    } else {
      // 编辑节点-选中当前数据
      treeRef.value?.setCurrentKey(selectTreeNodeId.value);
      await handleNodeClick(selectTreeNodeRow.value);
      //更新当前选择字段
      selectTreeNodeName.value = originalUnitData.value?.filter((item:any) => item.id === selectTreeNodeId.value)?.[0]?.teamName
    }
  }
};

// 取消
const handleCancle = () => {
  editFlag.value = !editFlag.value;
  basciInfoRef.value?.clearValidate();
  !selectTreeNodeId.value&&resetUnitForm();
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.teamName.includes(value);
};
</script>

<style lang="scss" scoped>
@import './index.scss';

.text-ellipsis {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
