<template>
  <div>
    <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
      label-position="right" :searchCol="4">
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
                <el-option v-for="option of options" :key="option.value" :label="option.name"
                  :value="option.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template #tableHeader="scope">
        <div class="flex justify-between">
          <div>
            <el-button type="primary" round @click="showDialog = true">自动合并档案</el-button>
            <el-button type="primary" round @click="showDialog = true">选择合并档案</el-button>
          </div>
        </div>
      </template>
    </ProTable>
    <el-dialog title="选择合并档案" v-model="showDialog">
      <div class="no-card">
        <ProTable :columns="recordColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]" :pagination="false"></ProTable>
      </div>
      <div class="w-full flex justify-center mt-18px">
        <el-button round @click="showDialog = false">取消</el-button>
        <el-button type="primary" round @click="showDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="roster" lang="tsx">
import { reactive, ref } from 'vue';
const showDialog = ref(false)
const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'name', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'name', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '业务类别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '电话', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '单位', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '体检号', fixed: 'left' },
  { prop: 'name', label: '档案号', fixed: 'left' },
  { prop: 'name', label: '证件号', fixed: 'left' },
  { prop: 'name', label: '业务类别', width: 100 },
  { prop: 'name', label: '体检类型', width: 100 },
  { prop: 'name', label: '姓名' },
  { prop: 'name', label: '婚否' },
  { prop: 'name', label: '年龄' },
  { prop: 'name', label: '电话', },
  { prop: 'name', label: '体检日期', width: 100 },
  { prop: 'name', label: '体检状态', width: 100 },
  { prop: 'name', label: '单位', },
  { prop: 'name', label: '分组', },
  { prop: 'name', label: '总检医生', width: 100 },
  { prop: 'name', label: '总检时间', width: 100 },
  { prop: 'name', label: '旧档案号', width: 100 },
  { prop: 'name', label: '合并时间', width: 100 },
  { prop: 'name', label: '合并操作人', width: 100 },
])
const recordColumns = ref([
  { type: 'selection', },
  { prop: 'name', label: '档案号' },
  { prop: 'name', label: '体检号' },
  { prop: 'name', label: '姓名' },
  { prop: 'name', label: '创建时间' },
])
const options = ref<any>([])

</script>
<style scoped lang="scss">
.color_ydy {
  width: 8px;
  height: 8px;
  background-color: purple;
}

.color_bdj {
  background-color: red;
}

:deep(.header-button-lf) {
  width: 100%;
}
</style>
