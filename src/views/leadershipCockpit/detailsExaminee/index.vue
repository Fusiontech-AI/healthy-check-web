<template>
  <div>
    <ProTable ref="proTable" row-key="id" :searchCol="4" :columns="columns" :request-api="getList" :request-auto="false"
      :toolButton="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="flex justify-end w-full mt-10px">
          <el-button type="primary mr-10px">统计说明</el-button>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { reactive } from 'vue'
// 表格配置项
const columns = reactive([
  {
    prop: "username",
    label: "体检号",
    search: {
      el: "input",
      props: { placeholder: "请输入体检号" },
    },
  },
  {
    prop: "username",
    label: "档案号",
  },
  {
    prop: "username",
    label: "身份证号",
  },
  {
    prop: "base",
    label: "业务类别",
  },
  {
    prop: "base",
    label: "体检类型",
  },
  {
    prop: "username",
    label: "姓名",
    search: {
      el: "input",
      props: { placeholder: "请输入姓名" },
    },
  },
  {
    prop: "username",
    label: "性别",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择性别" },
    },
    enum: []
  },
  {
    prop: "data",
    label: "体检日期",
    isShow: false,
    search: {
      el: "date-picker",
      props: { type: "daterange", valueFormat: "YYYY-MM-DD" },
      defaultValue: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
  },
  {
    prop: "username",
    label: "体检类型",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择体检类型" },
    },
    enum: []
  },
  {
    prop: "username",
    label: "档案号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请填写档案号" },
    },
  },
  {
    prop: "username",
    label: "身份证号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请填写档案号" },
    },
  },
  {
    prop: "username",
    label: "单位",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请填写档案号" },
    },
  },
  {
    prop: "username",
    label: "体检状态",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请填写体检状态" },
    },
    enum: []
  },
  {
    prop: "username",
    label: "婚否",
  },
  {
    prop: "username",
    label: "年龄",
  },
  {
    prop: "username",
    label: "电话",
  },
  {
    prop: "username",
    label: "体检日期",
  },
  {
    prop: "username",
    label: "回收",
  },
  {
    prop: "username",
    label: "冻结",
  },
  {
    prop: "username",
    label: "体检状态",
  },
  {
    prop: "username",
    label: "需要总检",
  },
  {
    prop: "username",
    label: "总费用",
  },
  {
    prop: "username",
    label: "团费",
  },
  {
    prop: "username",
    label: "个费",
  },
  {
    prop: "username",
    label: "已收费",
  },
  {
    prop: "username",
    label: "未收费",
  },
  {
    prop: "username",
    label: "单位",
  },
  {
    prop: "username",
    label: "分组",
  },
  {
    prop: "username",
    label: "部门",
  },
  {
    prop: "username",
    label: "介绍人",
  },
  {
    prop: "username",
    label: "创建人",
  },
  {
    prop: "username",
    label: "报到人",
  },
  {
    prop: "username",
    label: "总检医生",
  },
  {
    prop: "username",
    label: "总检时间",
  },
  {
    prop: "username",
    label: "审核医生",
  },
  {
    prop: "username",
    label: "审核时间",
  },
  {
    prop: "username",
    label: "完成时间",
  }
]);
const getList = () => {

}

</script>

<style scoped>
:deep(.header-button-lf) {
  width: 100%;
}
</style>