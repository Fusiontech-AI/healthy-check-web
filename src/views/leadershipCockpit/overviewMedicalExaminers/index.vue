<template>
  <div>
    <ProTable ref="proTable" row-key="id" :searchCol="4" :columns="columns" :request-api="getUserTreeList"
      :request-auto="false" :toolButton="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="flex justify-between w-full mt-10px">
          <el-button type="primary ml-10px">导出excel</el-button>
          <el-button type="primary mr-10px">统计说明</el-button>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { reactive } from 'vue';
// 表格配置项
const columns = reactive([
  {
    prop: "username",
    label: "体检号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入体检号" },
    },
  },
  {
    prop: "username",
    label: "姓名",
    isShow: false,
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
    enum: [],
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
    enum: [],
  },
  {
    prop: "username",
    label: "档案号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入档案号" },
    },
  },
  {
    prop: "username",
    label: "身份证号",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入身份证号" },
    },
  },
  {
    prop: "username",
    label: "单位",
    isShow: false,
    search: {
      el: "input",
      props: { placeholder: "请输入单位" },
    },
  },
  {
    prop: "username",
    label: "体检状态",
    isShow: false,
    search: {
      el: "select",
      props: { placeholder: "请选择体检状态" },
    },
    enum: [],
  },
  {
    prop: "username",
    label: "体检团体",
  },
  {
    prop: "username",
    label: "总人数",
  },
  {
    prop: "base",
    label: "金额（元）",
    _children: [
      { prop: "username", label: "总金额合计", width: 110 },
      { prop: "username", label: "平均金额", width: 100 },
      { prop: "username", label: "个人金额合计", width: 100 },
      { prop: "username", label: "团体金额合计", width: 100 },
    ]
  },
  {
    prop: "gender",
    label: "性别",
    isFilterEnum: false,
    enum: [],
    search: {
      el: "select",
      props: { placeholder: "请输入性别查询", filterable: true, reserveKeyword: true }
    },
    _children: [
      { prop: "username", label: "男性", width: 110 },
      { prop: "username", label: "女性", width: 100 },
    ]
  },
  {
    prop: "idCard", label: "指引单",
    _children: [
      { prop: "username", label: "未回收", width: 110 },
      { prop: "username", label: "已回收", width: 100 },
    ]
  },
  {
    prop: "email", label: "总检",
    _children: [
      { prop: "username", label: "未总检", width: 110 },
      { prop: "username", label: "已总检", width: 100 },
    ]
  },
  {
    prop: "address", label: "打印报告",
    _children: [
      { prop: "username", label: "未打印", width: 110 },
      { prop: "username", label: "已打印", width: 100 },
    ]
  }
]);
const getUserTreeList = () => {

}

</script>

<style scoped>
:deep(.header-button-lf) {
  width: 100%;
}
</style>