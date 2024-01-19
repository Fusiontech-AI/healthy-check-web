<template>
  <div>
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button round type="primary" @click="openDrawer('新增', '')">新增部门</el-button>
        <el-button round plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)"> 批量删除 </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <!-- 添加或修改科室对话框 -->
    <el-drawer v-model="showDrawer" :title="drawerTitle" direction="rtl" :before-close="handleClose">
      <SearchForm :search-param="formValue" :columns="departColumn" :searchCol="1" :rules="departRules"> </SearchForm>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup name="UnitMsgUnitDepartMsg">
import {reactive} from 'vue';
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue';
import { departColumnsBasic, departColumnBasic } from '../data'

const showDrawer = ref<any>(false)
const drawerTitle = ref('标题')
const columns = reactive<any>(departColumnsBasic)

const formValue = ref<any>()

const departColumn = ref<any>(departColumnBasic)

const openDrawer = (flag, row)=>{
   showDrawer.value = true
   drawerTitle.value = '新增部门'
}

const batchDelete  = () => {}

const handleSubmit  =() => {}

const handleClose = ()=>{
    showDrawer.value = false
}

const getTableList = async (params: any) => {
    // const data = await listDept(params);
    const data = {
        rows:[
            {f1:'11',f2:'总务科',f3:'小丽',f4:'武汉市第一医院',f5:'2021-7-26 17:99'}
        ],
        total:1
    }
    return {
      data: { list: data?.rows, total: data?.total, pageNum: 1, pageSize: 10 },
    };
  };
</script>
