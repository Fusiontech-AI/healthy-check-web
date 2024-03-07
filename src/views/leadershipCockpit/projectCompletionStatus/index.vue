<template>
  <div>
    <ProTable
      :columns="tableColumns"
      :toolButton="false"
      :data="dataSourse"
      label-position="right"
      :searchCol="4"
      :highlight-current-row="true"
      row-key="id"
      @row-click="rowClick"
      class="leadershipCockpit-pms-table"
      row-class-name="hoverPointer"
    >
      <template #searchxm>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input clearable :placeholder="`请输入姓名`"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select :filterable="true" clearable :placeholder="`请选择性别`" style="width: 100%;">
                <el-option v-for="option of sys_user_sex" :key="option.dictValue" :label="option.dictLabel" :value="option.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </ProTable>
    <el-dialog v-model="showDrawer" title="详情" width="70%" :before-close="handleClose">
      <DetailTabel :dataSourse="tabList.dataSourse" :tableColumns="tabList.columns" />
    </el-dialog>
  </div>
</template>

<script setup name="projectCompletionStatus" lang="tsx">
import { ref } from 'vue';
import DetailTabel from './components/Table.vue'
import {itemListColumn} from './data'
import moment from 'moment'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const showDrawer = ref<boolean>(false)
const activeName = ref<any>('1')

// 获取下拉列表
const { bus_physical_type, sys_user_sex, bus_healthy_check_status } = toRefs<any>(proxy?.useDict( 'bus_physical_type', 'sys_user_sex', 'bus_healthy_check_status' ))

const dataSourceDetail = [
    {
        f1:'测试数据',
        f2:'测试数据'
    }
]
const tabList = ref<any>({
    label:'体检项目列表',
        value:'1',
        dataSourse:dataSourceDetail,
        columns:itemListColumn
})


const handleClose = ()=>{
    showDrawer.value = false
}

const dataSourse = ref<any>([
    {id:'1',f8:'20140920',f9:'F100001',f10:'42090902002020',f11:'团检',f12:'职业病体检'},
    {id:'2',f8:'20140920',f9:'F100001',f10:'42090902002020',f11:'团检',f12:'职业病体检'},
    {id:'3',f8:'20140920',f9:'F100001',f10:'42090902002020',f11:'团检',f12:'职业病体检'},
    {id:'4',f8:'20140920',f9:'F100001',f10:'42090902002020',f11:'团检',f12:'职业病体检'},
])

const rowClick = ()=>{
    showDrawer.value = true
}

const tableColumns = ref([
  { prop: 'f1', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'f2', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'f3', label: '体检日期',
   search: {
    el: 'date-picker',
    props: { type: 'daterange', valueFormat: "YYYY-MM-DD" },
    defaultValue: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
   },
    isShow: false },
  { prop: 'f4', label: '体检类型', search: { el: 'select' }, enum: bus_physical_type, isShow: false },
  { prop: 'f5', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'f6', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'f7', label: '体检状态', search: { el: 'select' }, enum: bus_healthy_check_status, isShow: false },
  { prop: 'f8', label: '体检号', fixed: 'left' },
  { prop: 'f9', label: '档案号', fixed: 'left' },
  { prop: 'f10', label: '证件号', fixed: 'left' },
  { prop: 'f11', label: '业务类别', width: 100 },
  { prop: 'f12', label: '体检类型', width: 100 },
  { prop: 'name', label: '姓名' },
  { prop: 'name', label: '婚否' },
  { prop: 'name', label: '年龄' },
  { prop: 'name', label: '电话', },
  { prop: 'name', label: '体检日期', width: 100 },
  { prop: 'name', label: '体检状态', width: 100 },
])
const options = ref<any>([])
</script>
<style lang="scss">
.leadershipCockpit-pms-table .hoverPointer:hover .el-table__cell {
  cursor: pointer !important;
}
</style>
