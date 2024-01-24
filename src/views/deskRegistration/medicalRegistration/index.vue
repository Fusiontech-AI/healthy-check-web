<template>
  <div class="p-2">
    <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
      label-position="right">
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
            <el-button type="primary" round @click="handleAdd">报到</el-button>
            <el-button type="primary" round @click="handleGj">个检登记</el-button>
            <el-button type="primary" round @click="handleTj">团检登记</el-button>
            <el-button type="primary" round @click="handleAdd">打印导检单</el-button>
            <el-button type="primary" round @click="handleAdd">打印条码</el-button>
            <el-button type="primary" round @click="handleAdd">个转团</el-button>
            <el-button type="primary" round @click="handleAdd">团转个</el-button>
            <el-button round>取消登记</el-button>
            <el-button round>取消报到</el-button>
          </div>
          <div class="flex">
            <div class="flex items-center mr-20px">
              <div class="color_ydy mr-10px"></div>
              条码或导检单已打印
            </div>
            <div class="flex items-center ">
              <div class="color_ydy color_bdj mr-10px"></div>
              体检被冻结
            </div>
          </div>
        </div>
      </template>
      <template #operation="scope">
        <el-button type="primary" link>详情</el-button>
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="primary" link>更多操作</el-button>
          </template>
          <div><el-button type="primary" link>编辑</el-button></div>
          <el-button type="danger" link>删除</el-button>
        </el-popover>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="medicalRegistration" lang="tsx">
const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'name', label: '体检号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '姓名', search: { el: 'input', }, isShow: false, slot: 'xm' },
  { prop: 'name', label: '性别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '体检类型', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '业务类别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '档案号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '单位', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '终检日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '体检状态', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '人员类别', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '任务', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '支付日期', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
  { prop: 'name', label: '创建人', search: { el: 'input' }, isShow: false },
  { prop: 'name', label: '回收', search: { el: 'select' }, isShow: false },
  { prop: 'name', label: '体检号' },
  { prop: 'name', label: '档案号' },
  { prop: 'name', label: '证件号' },
  { prop: 'name', label: '业务类别' },
  { prop: 'name', label: '体检类型' },
  { prop: 'name', label: '婚否' },
  { prop: 'name', label: '年龄' },
  { prop: 'name', label: '电话', },
  { prop: 'name', label: '体检日期', },
  { prop: 'name', label: '回收', },
  { prop: 'name', label: '冻结', },
  { prop: 'name', label: '体检状态', },
  { prop: 'name', label: '需要总检', },
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
  { prop: 'name', label: '总检医生', },
  { prop: 'name', label: '总检时间', },
  { prop: 'name', label: '审核医生', },
  { prop: 'name', label: '审核时间', },
  { prop: 'name', label: '完成时间', },
  { prop: 'operation', label: '操作', width: 140, fixed: 'right' }
])
const options = reactive([])
const router = useRouter();
const handleAdd = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/checkRegistration");
}
//个检
const handleGj = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/checkRegistration");
}
//团检
const handleTj = () => {
  router.push("/deskRegistration/medicalRegistration-childPage/groupRegistration");
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
