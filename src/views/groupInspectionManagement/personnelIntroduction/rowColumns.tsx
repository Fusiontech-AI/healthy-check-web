// 人员基本信息表单配置项
export const formInfoColumns: any = [
  {
    prop: 'name',
    label: '任务名称',
    search: {
      el: 'input',
      // render: () => {
      //   return <el-button>11</el-button>;
      // }
    },
  },
  {
    prop: 'name',
    label: '团检单位',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true, disabled: false } }
  },
  {
    prop: 'name',
    label: '体检类型',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'name',
    label: '签订日期',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'name',
    label: '开始日期',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'name',
    label: '结束日期',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'name',
    label: '收费类型',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'name',
    label: '是否审核',
    enum: [{ label: '单位1', value: '1' }],
    search: { el: 'select', props: { filterable: true } }
  }
];

// 人员信息表格配置
export const tableColumn: any = [
  { type: 'index', label: '序号', fixed: 'left', width: 70 },
  {
    prop: 'name',
    label: '姓名',
    fixed: 'left',
    enum: [
      { label: 'aaa', value: '1' },
      { label: 'bbb', value: '1' }
    ]
  },
  { prop: 'name', label: '性别' },
  { prop: 'name', label: '年龄' },
  { prop: 'name', label: '身份证号', width: 150 },
  { prop: 'name', label: '项目分组' },
  { prop: 'name', label: '在岗类型' },
  { prop: 'name', label: '体检状态' },
  { prop: 'operation', label: '操作', width: 120, fixed: 'right' }
];

// 单位分组
export const unitGroupColumn = [
  {
    prop: 'name',
    label: '单位名称',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '任务名称',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '体检类型',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '在岗状态',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '分组名称',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '危害因素',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '其他粉尘',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '其他化学因素',
    search: { el: 'input' }
  }
];

// 基础信息
export const basicsInfoColumn = [
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '证件类型',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '证件号',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '性别',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '出生日期',
    search: { el: 'select' }
  },
  {
    prop: 'name',
    label: '年龄',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '婚否',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '民族',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '联系电话',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '联系地址',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '联系邮箱',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '个案卡类别',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '工种名称',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '其他工种名称',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '接害工龄',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '总工龄',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '检查类型',
    search: { el: 'input' }
  }
];

// 导入数据配置项
export const importColumn = [
  {
    type: 'index',
    label: '序号'
  },
  {
    prop: 'name',
    label: '流水号'
  },
  {
    prop: 'name',
    label: '姓名'
  },
  {
    prop: 'name',
    label: '年龄'
  },
  {
    prop: 'name',
    label: '性别'
  },
  {
    prop: 'name',
    label: '证件号码'
  },
  {
    prop: 'name',
    label: '添加时间'
  }
];

// 人员信息Columns
export const personColumn: any = [
  {
    label: '体检号',
    value: '18100000000'
  },
  {
    label: '档案号',
    value: '18100000000'
  },
  {
    label: '证件号',
    value: '18100000000'
  },
  {
    label: '业务类别',
    value: '团检'
  },
  {
    label: '体检类型',
    value: '职业病体检'
  },
  {
    label: '姓名',
    value: '11'
  },
  {
    label: '婚否',
    value: '未婚'
  },
  {
    label: '年龄',
    value: '18'
  },
  {
    label: '电话',
    value: '18100000000'
  },
  {
    label: '体检日期',
    value: '18100000000'
  },
  {
    label: '体检状态',
    value: '18100000000'
  },
  {
    label: '需要总检',
    value: '18100000000'
  },
  {
    label: '人员费别',
    value: '18100000000'
  },
  {
    label: '总费用（元）',
    value: '18100000000'
  },
  {
    label: '团费（元）',
    value: '18100000000'
  },
  {
    label: '个费（元）',
    value: '18100000000'
  },
  {
    label: '单位',
    value: '18100000000'
  },
  {
    label: '分组',
    value: '18100000000'
  },
  {
    label: '部门',
    value: '18100000000'
  },
  {
    label: '介绍人',
    value: '18100000000'
  },
  {
    label: '创建人',
    value: '18100000000'
  },
  {
    label: '报到人',
    value: '18100000000'
  },
  {
    label: '总检医生',
    value: '18100000000'
  },
  {
    label: '总检时间',
    value: '18100000000'
  },
  {
    label: '审核医生',
    value: '18100000000'
  },
  {
    label: '审核时间',
    value: '18100000000'
  },
  {
    label: '预约日期',
    value: '18100000000'
  },
  {
    label: '完成时间',
    value: '18100000000'
  },
]