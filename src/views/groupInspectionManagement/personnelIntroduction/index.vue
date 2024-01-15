<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="6">
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
            <div
              v-for="item in 20"
              :key="item"
              class="h-[120px] w-full bg-gray-100 hover:bg-sky-200 p-2 flex flex-col justify-between mb-2 cursor-pointer"
            >
              <div class="flex justify-between items-center"><span>体检任务：2023年职业病体检</span><span>健</span></div>
              <div class="flex justify-between items-center"><span>单位：胖胖乐有限公司</span><span>待审</span></div>
              <div class="flex justify-between items-center"><span>签订日期：2023-8-21</span><span>未通过</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="content">
          <div class="flex justify-end">
            <el-button type="primary">下载模板</el-button>
            <el-button type="primary">批量导出</el-button>
            <el-button type="primary" @click="batchImportDialog = true">批量导入</el-button>
            <el-button type="warning" @click="handleAdd()">新增</el-button>
          </div>
          <div>
            <div class="my-2 ">
              <div class="font-bold"><span></span>基本信息</div>
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
              <div class="font-bold"><span></span>人员信息</div>
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
.list_card {
  height: calc(100vh - 255px);
  overflow: auto;
}

.content {
  height: calc(100vh - 90px);
  overflow: auto;
}
</style>
