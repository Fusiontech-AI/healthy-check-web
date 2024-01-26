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
            <el-button type="primary" round>再次登记</el-button>
          </div>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="deregistration" lang="tsx">
import { ref } from 'vue';
const tableColumns = ref([
  { type: 'selection', },
  { prop: 'name', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'name', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '业务类别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '回收', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '单位', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '终检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '体检状态', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '体检类别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '人员类别', search: { el: 'select' }, isShow: false },
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
  { prop: 'name', label: '回收', },
  { prop: 'name', label: '冻结', },
  { prop: 'name', label: '体检状态', width: 100 },
  { prop: 'name', label: '需要总检', width: 100 },
  { prop: 'name', label: '总费用', },
  { prop: 'name', label: '团费', },
  { prop: 'name', label: '个费', },
  { prop: 'name', label: '单位', },
  { prop: 'name', label: '分组', },
  { prop: 'name', label: '部门', },
  { prop: 'name', label: '备注', },
  { prop: 'name', label: '介绍人', },
  { prop: 'name', label: '创建人', },
  { prop: 'name', label: '报到人', },
  { prop: 'name', label: '总检医生', width: 100 },
  { prop: 'name', label: '总检时间', width: 100 },
  { prop: 'name', label: '审核医生', width: 100 },
  { prop: 'name', label: '审核时间', width: 100 },
  { prop: 'name', label: '完成时间', width: 100 },
  { prop: 'name', label: '取消登记时间', width: 120 },
])
const options = ref<any>([])

</script>
<style scoped lang="scss">
</style>
