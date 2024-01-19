<template>
  <div>
    <ProTable ref="proTableRef" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button round type="primary" @click="openDrawer('add', '')">新增部门</el-button>
        <el-button round plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)"> 批量删除 </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('edit', scope.row)">编辑</el-button>
        <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <!-- 添加或修改科室对话框 -->
    <el-drawer v-model="showDrawer" :title="drawerTitle" direction="rtl" :before-close="handleClose">
      <SearchForm ref="departFormRef" :search-param="formValue" :columns="departColumn" :searchCol="1" :rules="departRules">
        <template #teamId>
          <el-select v-model="formValue.teamId" placeholder="请选择" @change="handleChangeTeamId">
            <el-option v-for="item in teamIdOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template #deptNo>
          <el-input placeholder="请输入" v-model="formValue.deptNo"></el-input>
        </template>
      </SearchForm>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup name="UnitMsgUnitDepartMsg">
import {reactive} from 'vue';
import {set} from 'lodash';
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue';
import { departColumnsBasic, departColumnBasic, departRulesBasic } from '../data'
import { teamDeptList,teamInfoList,getDeptNoById,addTeamDept,editTeamDept, deleteTeamDept  } from '@/api/groupInspectionManagement/unitMsg/index'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const departRules = departRulesBasic
const props = defineProps({
  id: {
    type: String,
    default:''
  }
})

const showDrawer = ref<any>(false)
const drawerTitle = ref('标题')
const columns = reactive<any>(departColumnsBasic)
const formValue = ref<any>({})

const proTableRef = ref()
const departColumn = ref<any>(departColumnBasic)
const departFormRef = ref()
const teamIdOption = ref()

const initFormData = {
  id: undefined,
  teamId:'',
  deptNo:'',
  deptName:'',
  deptManager:''
}

watch(()=>props.id, (id)=> {
  if(id){
    nextTick(async () => {
    proTableRef.value?.getTableList()
    getDict()
  })
  }
},
{
  immediate:true
})

// 批量删除
const batchDelete = (row: any) => {
  handleDelete(row);
};

// 表格删除
const handleDelete = async (row: any) => {
  const _ids = Array.isArray(row) ? row : [row.id];
  await proxy?.$modal.confirm('是否确认删除该数据?');
  await deleteTeamDept(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  proTableRef.value!.clearSelection()
  proTableRef.value?.getTableList()
  handleClose()
};

const openDrawer = async (flag:any, row:any)=>{
   showDrawer.value = true
   let departCode = ''
   if(props.id){
    const {msg} = await getDeptNoById(props.id) //根据上级单位获取部门编码
    departCode = msg
   }
   switch(flag){
    case 'add':
      drawerTitle.value = '新增部门'
      Object.assign(formValue.value,{teamId: props.id,deptNo:departCode})
      break
    case 'edit':
      drawerTitle.value = '编辑部门'
      Object.assign(formValue.value,row)
      break
   }
}

const handleSubmit =async () => {
  await departFormRef.value.validate()
  const service = formValue.value?.id?editTeamDept : addTeamDept
  await service(formValue.value)
  ElMessage.success(formValue.value?.id?'编辑成功':'新增成功')
  proTableRef.value?.getTableList()
  handleClose()
}

// 关闭弹框
const handleClose = ()=>{
  formValue.value = initFormData
  departFormRef.value?.resetFields()
  showDrawer.value = false
}

const getTableList = async (params: any) => {
  let res:any = {}
  if(props.id){
     res = await teamDeptList({...params,teamId:props.id});
  }
  return {
    data: { list: res?.rows, total: res?.total },
  };
};

// 根据上级单位获取部门编码
const handleChangeTeamId =async (val:any)=>{
  if(val) {
    const {msg} = await getDeptNoById(val)
    Object.assign(formValue.value,{deptNo:msg})
  }
}

// 获取字典
const getDict =async ()=> {
  const {data} = await teamInfoList({})
  const dictData = data?.map((dict:any) => ({label:dict.teamName,value:dict.id}))
  teamIdOption.value = dictData;
  departColumn.value?.forEach(async(item:any,index:any) => {
    if(item.label==='上级单位'){
      set(departColumn.value,`[${index}].enum`,dictData)
    }
  })
}
</script>
