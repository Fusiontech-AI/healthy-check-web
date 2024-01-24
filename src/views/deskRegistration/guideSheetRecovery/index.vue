<template>
  <div class="flex p-10px">
    <div class="w-500px">
      <el-card shadow="hover">
        <template #header>
          <div>
            体检人员信息
          </div>
        </template>
        <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="2" :rules="rules"
          :disabled="false" label-position="right">
          <template #searchimg>
            <div class="flex justify-around mb-10px">
              <ImageUpload :isShowTip="false">
                <template #txt>
                  <div class="absolute top-60%">身份证识别</div>
                </template>
              </ImageUpload>
              <ImageUpload :isShowTip="false">
                <template #txt>
                  <div class="absolute top-60%">人脸采集</div>
                </template>
              </ImageUpload>
            </div>
          </template>
        </SearchForm>
      </el-card>
    </div>
    <div class="flex-1 ml10px">
      <el-card shadow="hover">
        <div>体检号:
          <el-input v-model="value" clearable :placeholder="`请输入`" style="width: 200px;"></el-input>
          <el-button type="primary" round class="ml10px">查询</el-button>
          <el-button type="primary" round>电子存档</el-button>
          <el-button type="danger" round>撤销</el-button>
          <el-button type="primary" round>回收</el-button>
        </div>
        <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
          :pagination="false">
          <template #operation="scope">
            <el-button type="danger" round>删除</el-button>
          </template>
        </ProTable>
      </el-card>
    </div>
  </div>
</template>
<script setup name="guideSheetRecovery" lang="ts">
import ImageUpload from '@/components/ImageUpload'
const formColumns = reactive<any>([
  {
    slot: 'img',
    search: { span: 24 }
  },
  {
    prop: 'name',
    label: '患者ID',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '证件类型',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '档案号',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '身份证号',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '体检号',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '出生日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '民族',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '年龄',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '人员类别',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '性别',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '体检类型',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '婚否',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '联系电话',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '总检',
    search: { el: 'select', span: 24 }
  },
  {
    prop: 'name',
    label: '是否邮寄',
    search: { el: 'select', span: 24 }
  },
  {
    prop: 'name',
    label: '收件人',
    search: { el: 'input', span: 24 }
  },
  {
    prop: 'name',
    label: '收件电话',
    search: { el: 'input', span: 24 }
  },
  {
    prop: 'name',
    label: '邮寄地址',
    search: { el: 'input', span: 24 }
  },
])
const formValue = ref<any>({ name: '1' }) // 基本信息绑定的值
const value = ref('')
const options = reactive([])
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})

const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'name', label: '序列' },
  { prop: 'name', label: '项目名称' },
  { prop: 'name', label: '项目类型' },
  { prop: 'name', label: '原金额（元）' },
  { prop: 'name', label: '折扣（%）' },
  { prop: 'name', label: '折后应收（元）' },
  { prop: 'name', label: '结算状态' },
  { prop: 'name', label: '支付方式' },
  { prop: 'name', label: '单位金额' },
  { prop: 'name', label: '个人金额' },
  { prop: 'name', label: '检查状态' },
  { prop: 'operation', label: '操作' },
])

</script>
<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 120px
}
</style>


