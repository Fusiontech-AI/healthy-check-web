export const basciSearchFields = [
  {
    label: '单位',
    name: 'unit',
    component: 'el-input',
    placeholder: '请输入单位',
  },
  {
    label: '任务',
    name: 'task',
    component: 'el-input',
    placeholder: '请输入任务',
  },
  {
    label: '体检号',
    name: 'peCode',
    component: 'el-input',
    placeholder: '请输入体检号',
  },
  {
    label: '报道日期',
    name: 'reportDate',
    component: 'el-date-picker',
    prop: {
      type: 'daterange',
      format: 'YYYY-MM-DD',
      startPlaceholder: '请选择开始日期',
      endPlaceholder: '请选择结束日期',
    },
  },
  {
    label: '体检状态',
    name: 'peStatus',
    component: 'el-select',
    dict: [{ label: '状态', value: '1' }],
  },
  {
    label: '姓名',
    name: 'name',
    component: 'el-input',
    placeholder: '请输入',
  },
  {
    label: '性别',
    name: 'gender',
    component: 'el-input',
    placeholder: '请输入',
  },
  {
    label: '身份证号',
    name: 'idCard',
    component: 'el-input',
    placeholder: '请输入',
  },
];
