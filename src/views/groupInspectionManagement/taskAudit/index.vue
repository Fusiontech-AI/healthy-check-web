<template>
  <div class="table-box">
    <!-- <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          <el-input class="mt-2" placeholder="请输入关键字"></el-input>
          <el-radio-group v-model="activeName" class="mt-2">
            <el-radio-button label="1" class="w-[50%]">待审批</el-radio-button>
            <el-radio-button label="2">已审批</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="18">
          <component is="el-input"></component>
        </el-col>
      </el-row>
    </el-card> -->
    <!-- <pro-table ref="proTable" :columns="columns" ></pro-table> -->
    <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="false" :toolButton="true" :search-col="3" ></ProTable>
  </div>
</template>

<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";

const dateValue = ref('')
const activeName = ref('1')

// 表格配置项
const columns = reactive<ColumnProps<any>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "username", label: "用户姓名", search: {el: 'input', props: { placeholder: "请输入性别查询", filterable: true, remote: true, reserveKeyword: true, }}},
  {
    prop: "gender",
    label: "性别",
    sortable: true,
    isFilterEnum: false,
    enum: [],
    search: {
      el: "select",
      props: { placeholder: "请输入性别查询", filterable: true, remote: true, reserveKeyword: true, }
    },
    render: scope => <>{scope.row.gender === 1 ? "男" : "女"}</>
  },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    sortable: true,
    tag: true,
    enum: [],
    search: { el: "tree-select" },
    fieldNames: { label: "userLabel", value: "userStatus" }
  },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" }
]);
</script>

<style scoped></style>
