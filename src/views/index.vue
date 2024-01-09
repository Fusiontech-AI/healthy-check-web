<template>
  <vue3-pro-table ref="proTable" title="用户列表" :request="getList" :columns="columns" :search="searchConfig"
    :pagination="paginationConfig" @selectionChange="handleSelectionChange">
    <!-- 工具栏 -->
    <template #toolbar>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name: 'userAdd' })">创建账号</el-button>
      <el-button type="danger" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </template>

    <!-- 展开行 -->
    <template #expand="{ row }">
      {{ row.userEmail }}
    </template>

    <!-- 状态 -->
    <template #status="{ row }">
      <el-tag :type="+row.status === 1 ? 'success' : 'info'">{{
        +row.status === 1 ? "启用" : "停用"
      }}</el-tag>
    </template>

    <!-- 表格操作栏 -->
    <template #page-operate="{ row }">
      <el-button type="text" @click="
        $router.push({
          name: 'userEdit',
          params: {
            id: row.id,
          },
        })
        ">编辑</el-button>

      <el-button v-if="+row.status === 1" type="text" @click="setUserStatus(row, 0)">停用</el-button>

      <el-button v-else type="text" @click="setUserStatus(row, 1)">启用</el-button>
    </template>

    <!-- 操作栏头部 -->
    <template #th-operate>
      <el-input />
    </template>
  </vue3-pro-table>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from "vue";
// import { getUserList } from "src/api/xxx";
export default defineComponent({
  setup() {
    const state = reactive({
      // 表格列配置，大部分属性跟el-table-column配置一样
      columns: [
        { label: "", type: "expand", tdSlot: "expand" },
        { label: "全选", type: "selection" },
        { label: "序号", type: "index" },
        { label: "账户名称", prop: "nickName", sortable: true },
        { label: "账号", prop: "userEmail", },
        {
          label: "状态",
          prop: "status",
          tdSlot: "status",
          filters: [
            { text: "启用", value: 1 },
            { text: "禁用", value: 0 },
          ],
        },
        { label: "创建时间", prop: "createTime", align: "right" },
        { label: "最后修改时间", prop: "updateTime" },
        {
          label: "操作",
          labelSlot: "th-operate",
          fixed: "right",
          width: 180,
          align: "center",
          tdSlot: "page-operate",
        },
      ],
      // 搜索配置
      searchConfig: {
        labelWidth: "90px",
        inputWidth: "100%",
        fields: [
          // {
          //   type: "text",
          //   label: "账户名称",
          //   name: "nickName",
          //   defaultValue: "abc",
          // },
          {
            type: "textarea",
            label: "描述",
            name: "description",
          },
          {
            label: "状态",
            name: "status",
            type: "select",
            defaultValue: 1,
            options: [
              {
                name: "已发布",
                value: 1,
              },
              {
                name: "未发布",
                value: 0,
              },
            ],
          },
          {
            label: "性别",
            name: "sex",
            type: "radio",
            options: [
              {
                name: "男",
                value: 1,
              },
              {
                name: "女",
                value: 0,
              },
            ],
          },
          {
            label: "城市",
            name: "city",
            type: "radio-button",
            options: [
              {
                name: "北京",
                value: "bj",
              },
              {
                name: "上海",
                value: "sh",
              },
              {
                name: "广州",
                value: "gz",
              },
              {
                name: "深圳",
                value: "sz",
              },
            ],
          },
          {
            label: "爱好",
            name: "hobby",
            type: "checkbox",
            defaultValue: ["吃饭"],
            options: [
              {
                name: "吃饭",
                value: "吃饭",
              },
              {
                name: "睡觉",
                value: "睡觉",
              },
              {
                name: "打豆豆",
                value: "打豆豆",
              },
            ],
            transform: (val) => val.join(","),
          },
          {
            label: "水果",
            name: "fruit",
            type: "checkbox-button",
            options: [
              {
                name: "苹果",
                value: "苹果",
              },
              {
                name: "香蕉",
                value: "香蕉",
              },
              {
                name: "橘子",
                value: "橘子",
              },
              {
                name: "葡萄",
                value: "葡萄",
              },
            ],
            transform: (val) => val.join(","),
          },
          {
            label: "日期",
            name: "date",
            type: "date",
          },
          {
            label: "时间",
            name: "datetime",
            type: "datetime",
            defaultValue: "2020-10-10 8:00:00",
          },
          {
            label: "日期范围",
            name: "daterange",
            type: "daterange",
            trueNames: ["startDate", "endDate"],
            style: { width: "360px" },
          },
          {
            label: "时间范围",
            name: "datetimerange",
            type: "datetimerange",
            trueNames: ["startTime", "endTime"],
            style: { width: "360px" },
            defaultValue: ["2020-10-10 9:00:00", "2020-10-11 18:30:00"],
          },
          {
            label: "数量",
            name: "num",
            type: "number",
            min: 0,
            max: 10,
          },
        ],
      },
      // 分页配置
      paginationConfig: {
        layout: "total, prev, pager, next, sizes", // 分页组件显示哪些功能
        pageSize: 5, // 每页条数
        pageSizes: [5, 10, 20, 50],
      },
    });

    // 请求函数
    const getList = async (params) => {
      // params是从组件接收的，包含分页和搜索字段。
      // const { data } = await getUserList(params);

      // 必须要返回一个对象，包含data数组和total总数
      // return {
      //   data: data.list,
      //   total: +data.total,
      // };
      return {

      }
    };

    // 选择
    const handleSelectionChange = (arr) => {
      console.log(arr);
    };

    const proTable = ref(null);

    // 刷新
    const refresh = () => {
      proTable.value.refresh();
    };

    return {
      ...toRefs(state),
      getList,
      handleSelectionChange,
      proTable,
      refresh,
    };
  },
});
</script>
