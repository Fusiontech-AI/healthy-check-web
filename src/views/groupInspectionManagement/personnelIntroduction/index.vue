<template>
  <div class="text-[14px]">
    <el-row>
      <el-col :span="5">
        <el-card>
          <el-select class="w-full my-2" placeholder="请输入">
            <el-option label="全部" value=""></el-option>
          </el-select>
          <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          <div class="flex items-center my-2">
            <el-input placeholder="请输入关键字"></el-input>
            <el-button>重置</el-button>
          </div>
          <div class="list_card">
            <el-card shadow="hover" v-for="item in 20" :key="item" class="card_item" :class="isActive == item?'active':''">
              <div class="flex justify-between items-center">
                <span class="tetx-[#141C28]">2023年职业病体检</span>
                <div class="flex">
                  <span class="ml-auto px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">放</span>
                  <span class="ml-1 px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">健</span>
                </div>
              </div>
              <div class="flex justify-between items-center my-2 text-[12px] text-[#89919F]"><span>胖胖乐有限公司</span></div>
              <div class="flex justify-between items-center text-[12px] text-[#89919F]">
                <span>2023-8-21</span><span class="text-red">未通过</span>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="content">
          <div class="flex justify-end">
            <el-button type="primary">下载模板</el-button>
            <el-button type="primary">批量导出</el-button>
            <el-button type="primary" @click="batchImportDialog = true">批量导入</el-button>
            <el-button type="warning" @click="handleAdd()">新增</el-button>
          </div>
          <div>
            <div class="my-2 ">
              <div class="font-bold card_title"><span></span>基本信息</div>
            </div>
            <SearchForm
              ref="formRef"
              :columns="formColumns"
              :search-param="formValue"
              :search-col="3"
              :rules="rules"
              :disabled="true"
            >
            </SearchForm>
          </div>
          <div class="divider"></div>
          <div>
            <div class="my-2">
              <div class="font-bold card_title"><span></span>人员信息</div>
            </div>
            <div class="my-2"><span class="text-red">*</span> 请根据当前任务所选体检类型，下载对应模板后再上传</div>
            <div class="table-box">
              <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]">
                <template #operation="scope">
                  <el-button type="primary" link>查看</el-button>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </ProTable>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer v-model="addDrawer" title="新增团检人员" size="70%">
      <add-drawer @closeDialog="addDrawer = false"></add-drawer>
    </el-drawer>
    <el-dialog title="批量导入" v-model="batchImportDialog">
      <batch-import></batch-import>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { formInfoColumns, personInforColumns, } from './rowColumns'
import AddDrawer from './components/AddDrawer.vue'
import BatchImport from './components/BatchImport.vue'

const formColumns = ref<any>(formInfoColumns)
const tableColumns = ref<any>(personInforColumns)
const isActive = ref(1)
const dateValue = ref('')
const formRef = ref<any>(null)
const formValue = ref<any>({}) // 基本信息绑定的值
const addDrawer = ref<boolean>(false) // 新增弹框显示隐藏
const batchImportDialog = ref<boolean>(false) // 批量导入弹框显示隐藏
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})

// 新增打开抽屉弹框
const handleAdd = ()=>{
  addDrawer.value = true
}
</script>

<style scoped lang="scss">
.el-card {
  // border-radius: 0px;
  &.is-always-shadow {
    box-shadow: none
  }
}
.list_card {
  height: calc(100vh - 240px);
  overflow: auto;
  .card_item {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-style: solid;
    border-color: #E6EAEF;
    border-radius: 4px;
    border-width: 0px 0px 1px 0px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }
    &.active {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }
    .el-checkbox.el-checkbox--large {
      height: auto;
    }
  }
}

.content {
  height: calc(100vh - 90px);
  overflow: auto;
}
.card_title {
    display: flex;
    align-items: center;
    span {
      width: 4px;
      height: 16px;
      margin-right: 4px;
      border-radius: 2px;
      font-weight: bold;
      background: #FF8F33;
    }
  }
</style>
