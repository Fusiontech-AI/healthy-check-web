<template>
  <div class="flex p-10px">
    <div class="w-500px">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              体检人员信息
            </div>
            <div>
              <el-button round type="primary">新增</el-button>
              <el-button round>清空</el-button>
            </div>
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
              <div class="mt30px z-999 w-50px">
                <div class="mb30px">
                  <el-button type="primary" round>拍照</el-button>
                </div>
                <el-button type="primary" round>删除</el-button>
              </div>
            </div>
          </template>
          <template #jhgl>
            <div class="flex">
              <el-input v-model="formValue['name']" clearable :placeholder="`请输入`"></el-input>
              <span class="mx20px">年</span>
              <el-input v-model="formValue['name']" clearable :placeholder="`请输入`"></el-input>
              <span class="mx20px">月</span>
            </div>
          </template>
          <template #zgl>
            <div class="flex">
              <el-input v-model="formValue['name']" clearable :placeholder="`请输入`"></el-input>
              <span class="mx20px">年</span>
              <el-input v-model="formValue['name']" clearable :placeholder="`请输入`"></el-input>
              <span class="mx20px">月</span>
            </div>
          </template>
        </SearchForm>
      </el-card>
    </div>
    <div class="flex-1 ml10px">
      <el-card shadow="hover">
        <div class="flex justify-between items-center">
          <div>
            团检详情
            缴费状态：已收
          </div>
          <div>
            <el-select v-model="value" placeholder="请选择" class="w-240px mr10px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button round type="primary">暂存</el-button>
            <el-button round type="primary">报到</el-button>
            <el-button round>返回</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="mt10px">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <span>已选项目</span>
              <span> 检验xx项/共xx项</span>
              <span>原金额 ：980.00</span>
              <span>应收金额 ：980.00</span>
              <span>已缴金额 ：980.00</span>
              <span>未缴金额 ：980.00</span>
            </div>
            <div>
              <el-button round type="danger">删除</el-button>
              <el-button round type="primary" @click="handleGjJx">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>个人加项
              </el-button>
              <el-button round type="primary" @click="handleTjJx">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>团体加项
              </el-button>
            </div>
          </div>
        </template>
        <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
          :pagination="false">
          <template #operation="scope">
            <el-button type="danger" round>删除</el-button>
          </template>
        </ProTable>
      </el-card>
    </div>
    <SelectXmItem ref="selectXmItemGj" />
    <SelectXmItem ref="selectXmItemTj" title="团体加项" />
  </div>
</template>
<script setup name="groupRegistrationRegister" lang="ts">
import SelectXmItem from '@/views/deskRegistration/medicalRegistration/components/selectXmItem.vue'
import ImageUpload from '@/components/ImageUpload'
import { formInfoColumns } from '@/views/deskRegistration/medicalRegistration/groupRegistration/rowColumns.tsx'
const formColumns = ref<any>(formInfoColumns)
import type { TabsPaneContext } from 'element-plus'
const formValue = ref<any>({ name: '1' }) // 基本信息绑定的值
const value = ref('')
const options = reactive([])
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const selectXmItemGj = ref(null)
const selectXmItemTj = ref(null)
//个人加项
const handleGjJx = () => {
  selectXmItemGj.value.handleDrawerChange()
}
//团体加项
const handleTjJx = () => {
  selectXmItemTj.value.handleDrawerChange()
}
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


