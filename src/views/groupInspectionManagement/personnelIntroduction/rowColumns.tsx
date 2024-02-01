import { useDict } from '@/utils/dict';
const { bus_physical_type, bus_charge_type, sys_user_sex, bus_healthy_check_status, bus_duty_status } = toRefs<any>(
  useDict('bus_physical_type', 'bus_charge_type', 'sys_user_sex', 'bus_healthy_check_status', 'bus_duty_status')
);
// 人员基本信息表单配置项
export const formInfoColumns: any = [
  {
    prop: 'taskName',
    label: '任务名称',
    search: {
      el: 'input'
    }
  },
  {
    prop: 'teamName',
    label: '团检单位',
    enum: [],
    search: { el: 'select', props: { filterable: true, disabled: false } }
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' },
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'signDate',
    label: '签订日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'beginDate',
    label: '开始日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'endDate',
    label: '结束日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'chargeType',
    label: '收费类型',
    enum: bus_charge_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' },
    search: { el: 'select', props: { type: 'date' } }
  },
  {
    prop: 'isReview',
    label: '是否审核',
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' }
    ],
    search: { el: 'select', props: { filterable: true } }
  }
];

// 人员信息表格配置
export const tableColumn: any = [
  { type: 'index', label: '序号', fixed: 'left', width: 70 },
  { prop: 'name', label: '姓名', fixed: 'left' },
  { prop: 'gender', label: '性别', enum: sys_user_sex, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'age', label: '年龄' },
  { prop: 'credentialNumber', label: '身份证号', width: 150 },
  { prop: 'groupName', label: '项目分组' },
  { prop: 'dutyStatus', label: '在岗类型', enum: bus_duty_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'healthyCheckStatus', label: '体检状态', enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
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
  }
];
