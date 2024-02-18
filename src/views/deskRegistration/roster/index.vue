<template>
  <div>
    <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :request-api="getTableList"
      label-position="right" :searchCol="4" @reset="reset">
      <template #searchxm>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="searchParam.name" clearable :placeholder="`请输入姓名`"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select :filterable="true" v-model="searchParam.gender" clearable :placeholder="`请选择性别`"
                style="width: 100%;">
                <el-option v-for="option of sys_user_sex" :key="option.dictValue" :label="option.dictLabel"
                  :value="option.dictValue"></el-option>
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
        <ProTable :columns="recordColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
          :pagination="false"></ProTable>
      </div>
      <div class="w-full flex justify-center mt-18px">
        <el-button round @click="showDialog = false">取消</el-button>
        <el-button type="primary" round @click="showDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="roster" lang="tsx">
import { ref } from 'vue';
import { getRegisterPage } from '@/api/deskRegistration/deregistration'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type, bus_category, sys_user_sex, bus_personnel_marriage_status, bus_healthy_check_status } = toRefs<any>(proxy?.useDict('bus_physical_type', 'bus_category', 'sys_user_sex', 'bus_personnel_marriage_status', 'bus_healthy_check_status'))
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const showDialog = ref(false)
const tableColumns = ref<any>([
  { type: 'selection', },
  { prop: 'healthyCheckCode', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'healthyCheckTime', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'physicalType', label: '体检类型', search: { el: 'select' }, isShow: false, enum: bus_physical_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'businessCategory', label: '业务类别', search: { el: 'select' }, isShow: false, enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'recordCode', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'phone', label: '电话', search: { el: 'input' }, isShow: false },
  { prop: 'teamId', label: '单位', search: { el: 'input' }, isShow: false },
  { prop: 'taskId', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'recordCode', label: '档案号', fixed: 'left' },
  { prop: 'credentialNumber', label: '证件号', fixed: 'left' },
  { prop: 'businessCategory', label: '业务类别', width: 100, enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' }  },
  { prop: 'physicalType', label: '体检类型', width: 100, enum: bus_physical_type, fieldNames: { label: 'dictLabel', value: 'dictValue' }  },
  { prop: 'name', label: '姓名' },
  { prop: 'marriageStatus', label: '婚否', enum: bus_personnel_marriage_status, fieldNames: { label: 'dictLabel', value: 'dictValue' }  },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', },
  { prop: 'healthyCheckTime', label: '体检日期', width: 100 },
  { prop: 'healthyCheckStatus', label: '体检状态', width: 100, enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' }  },
  { prop: 'teamName', label: '单位', },
  { prop: 'groupName', label: '分组', },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: 100 },
  { prop: 'generalReviewTime', label: '总检时间', width: 100 },
  { prop: 'name', label: '旧档案号', width: 100 },
  { prop: 'name', label: '合并时间', width: 100 },
  { prop: 'name', label: '合并操作人', width: 100 },
])
const recordColumns = ref<any>([
  { type: 'selection', },
  { prop: 'name', label: '档案号' },
  { prop: 'name', label: '体检号' },
  { prop: 'name', label: '姓名' },
  { prop: 'name', label: '创建时间' },
])
const searchParam = ref<any>({})
const proTableRef = ref()

const reset = () => {
  searchParam.value = {}
}
const getTableList = async (params: any) => {
  proTableRef.value.pageable = pagination
  const data = await getRegisterPage({ ...params, ...searchParam.value })
  pagination.total = data.total
  return data
}
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
