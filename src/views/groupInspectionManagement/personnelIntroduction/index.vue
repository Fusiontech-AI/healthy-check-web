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
            <el-button type="primary">批量导入</el-button>
            <el-button type="warning">新增</el-button>
          </div>
          <div>
            <div class="my-2 ">
              <div class="font-bold card_title"><span></span>基本信息</div>
            </div>
            <el-form :model="formValue" :rules="rules" :disabled="false" :label-width="80">
              <Grid ref="gridRef" :gap="12" :cols="3">
                <GridItem v-for="(item, index) in formColumns" :key="item.prop" :index="index">
                  <el-form-item :label="item.label" :prop="item.prop">
                    <SearchFormItem :column="item" :search-param="formValue" />
                  </el-form-item>
                </GridItem>
              </Grid>
            </el-form>
            <SearchForm
              :columns="formColumns"
              :search-param="formValue"
              :search-col="3"
              :actionOption="{showSubmitButton: true, submitOption: {btnText: '11'}}"
            >
              <!-- <template #formAction> 11111 </template> -->
            </SearchForm>
          </div>
          <div>
            <div class="my-2">
              <div class="font-bold card_title"><span></span>人员信息</div>
            </div>
            <div class="my-2"><span class="text-red">*</span> 请根据当前任务所选体检类型，下载对应模板后再上传</div>
            <div class="table-box">
              <!-- :tableFormActionOption="{showSubmitButton: true, submitOption: {btnText: '11'}}" -->
              <ProTable
                :columns="personInforColumns"
                :toolButton="false"
                :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
                :showActionGroup="true"
                :actionOption="{showSubmitButton: true, submitOption: {btnText: '11'}}"
              >
                <!-- <template #formAction> 11111 </template> -->
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
  </div>
</template>

<script setup lang="tsx">
import { ref, provide, reactive } from "vue";
import Grid from "@/components/Grid/index.vue";
// import { ArrowUpBold } from "@element-plus/icons-vue/dist/types";
const isActive = ref(1)
const dateValue = ref('')
const formValue = ref({
})
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})
// 人员信息表格Columns
const personInforColumns = ref<any>([
  {
    prop: "gender",
    label: "性别",
    // 字典数据（本地数据）
    // enum: genderType,
    // 字典请求不带参数
    // enum: getUserGender,
    // 字典请求携带参数
    enum: ()=> {
      return {data: [{ label: '男', value: '1' }, { label: '女', value: '0' }]}
    },
    search: { el: "select", props: { filterable: true} },
    // fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  { type: 'index', label: "序号", fixed: 'left' },
  { prop: 'name', label: "姓名", fixed: 'left' },
  { prop: 'name', label: "性别" },
  { prop: 'name', label: "年龄" },
  { prop: 'name', label: "身份证号", width: 150 },
  { prop: 'name', label: "项目分组", },
  { prop: 'name', label: "在岗类型", },
  { prop: 'name', label: "体检状态", },
  { prop: 'operation', label: "操作", width: 120, fixed: "right" },
])
const formColumns = ref<any>([
  {
    prop: "name",
    label: "任务名称",
    search: { el: 'input' }
  },
  {
    prop: "name",
    label: "团检单位",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true } },
  },
  {
    prop: "name",
    label: "体检类型",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true } },
  },
  {
    prop: "name",
    label: "签订日期",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: "date", valueFormat: "YYYY-MM-DD" } },
  },
  {
    prop: "name",
    label: "开始日期",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: "date", valueFormat: "YYYY-MM-DD" } },
  },
  {
    prop: "name",
    label: "结束日期",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: "date", valueFormat: "YYYY-MM-DD" } },
  },
  {
    prop: "name",
    label: "收费类型",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { type: "date", valueFormat: "YYYY-MM-DD" } },
  },
  {
    prop: "name",
    label: "是否审核",
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true } },
  },
])
// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
// const enumMap = ref(new Map<string, { [key: string]: any }[]>());
// enumMap.value.set('name', [{ label: '男', value: '1' }, { label: '女', value: '0' }])
// provide("enumMap", enumMap)
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
