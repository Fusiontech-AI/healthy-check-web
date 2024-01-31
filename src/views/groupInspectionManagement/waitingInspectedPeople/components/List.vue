<template>
  <div>
    <ProTable
      :columns="tableColumns"
      :toolButton="false"
      :request-api="getTableList"
      label-position="right"
      :searchCol="4"
      :highlight-current-row="true"
      row-key="id"
      :dataCallback="dataCallback"
    >
      <template #taskName="scope">
        <div class="text-[#5a9cf8] cursor-pointer" @click="handleDetail( scope.row.taskName)">{{ scope.row.taskName || '--' }}</div>
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" :disabled="!scope.isSelected" @click="batchChangeGroup(scope.selectedListIds)">批量换组 </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link @click="changeGroup( scope.row)">换组</el-button>
      </template>
    </ProTable>

    <el-dialog v-model="showDialog" title="人员换组" width="35%" :before-close="handleClose">
      <SearchForm
        ref="departFormRef"
        :search-param="formValue"
        :columns="departColumn"
        :searchCol="1"
        :rules="departRules"
        style="background: transparent; padding: 18px 30px;"
      >
        <template #taskName>
          <el-select v-model="formValue.taskName" placeholder="请选择" @change="handleTaskNameChange">
            <el-option v-for="item in taskOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template #groupName>
          <el-select v-model="formValue.groupName" placeholder="请选择">
            <el-option v-for="item in groupOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </SearchForm>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="projectCompletionStatus" lang="tsx">
import { ref } from 'vue';
import { changGroupColumnsBasic } from '../data'
import { registerPage } from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'

const emits = defineEmits(['goTo'])

const showDialog = ref<boolean>(false)

const formValue = ref<any>({})
const departColumn = ref<any>(changGroupColumnsBasic)
const departRules = ref<any>([])

const taskOption = ref<any>([{label:'1',value:'1'}]) //任务名称
const groupOption = ref<any>([{label:'1',value:'1'}])//分组名称

const tableColumns = ref([
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'f1', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'f2', label: '体检单位', search: { el: 'select', }, isShow: false },
  { prop: 'taskName', label: '任务名称', search: { el: 'select'}, isShow: false },
  { prop: 'f4', label: '体检号/姓名', search: { el: 'input' }, isShow: false },
  { prop: 'f5', label: '身份证', search: { el: 'input' }, isShow: false },
  { prop: 'taskName', label: '任务名称', fixed: 'left' },
  { prop: 'healthyCheckCode', label: '体检号' },
  { prop: 'name', label: '姓名'},
  { prop: 'gender', label: '性别' },
  { prop: 'age', label: '年龄' },
  { prop: 'credentialNumber', label: '身份证号' },
  { prop: 'phone', label: '电话' },
  { prop: 'physicalType', label: '体检类型' },
  { prop: 'teamName', label: '单位名称'},
  { prop: 'groupName', label: '所属分组' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 100 }
])

const getTableList = async (params: any) =>{
  // healthyCheckStatus:'0'
  const data = await registerPage({...params})
  return {data}
}

// 批量换组
const batchChangeGroup = (ids:any) => {
  showDialog.value = true
}

// 表格行换组
const changeGroup = (ids) => {
  showDialog.value = true
}

const handleClose = ()=> {
  showDialog.value = false
}

// 确定
const handleSubmit = ()=>{

}

const handleTaskNameChange = ()=>{

}

// 查看详情
const handleDetail = ()=>{
    emits('goTo','Detail',{id:'123'})
}

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
  };
};
</script>
<style scoped lang="scss"></style>
