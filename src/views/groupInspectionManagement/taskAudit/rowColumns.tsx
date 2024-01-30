import { useDict } from '@/utils/dict';
const {
  bus_marriage_status,
  bus_duty_status,
  bus_group_type,
  bus_group_pay_type,
  sys_user_sex,
  bus_healthy_check_status,
  bus_category,
  bus_physical_type
} = toRefs<any>(
  useDict(
    'bus_marriage_status',
    'bus_duty_status',
    'bus_group_type',
    'bus_group_pay_type',
    'sys_user_sex',
    'bus_healthy_check_status',
    'bus_category',
    'bus_physical_type'
  )
);

// 任务基础信息
export const basicInforColumns: any = [
  {
    label: '任务名称：',
    prop: 'taskName'
  },
  {
    label: '任务编号：',
    prop: 'taskNo'
  },
  {
    label: '单位名称：',
    prop: 'teamName'
  },
  {
    label: '体检类型：',
    prop: 'physicalType',
    enum: bus_physical_type
  },
  {
    label: '联系人姓名：',
    prop: 'contactName'
  },
  {
    label: '体检人联系电话：',
    prop: 'contactPhone'
  },
  {
    label: '销售负责人：',
    prop: 'saleHead'
  },
  {
    label: '编制人：',
    prop: 'preparedName'
  },
  {
    label: '审核状态：',
    prop: 'isReview',
    enum: [
      { label: '已审', value: '0' },
      { label: '待审', value: '1' }
    ]
  }
];
// 任务分组Columns
export const taskGroupingColumn: any = [
  { prop: 'groupName', label: '分组名称', width: 120, fixed: 'left' },
  { prop: 'gender', label: '性别' },
  { prop: 'marriage', label: '婚否', enum: bus_marriage_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'dutyStatus', label: '在岗类型', width: 120, enum: bus_duty_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  {
    prop: 'groupType',
    label: '分组类型',
    width: 120,
    enum: bus_group_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  { prop: 'endAge', label: '最大年龄' },
  { prop: 'startAge', label: '最小年龄' },
  { prop: 'allNum', label: '总人数' },
  { prop: 'appointNum', label: '预约人数' },
  { prop: 'checkInNum', label: '报到人数' },
  { prop: 'price', label: '金额（元）' },
  { prop: 'groupPayType', label: '分组支付方式', enum: bus_group_pay_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'itemDiscount', label: '分组折扣' },
  { prop: 'addPayType', label: '加项支付方式', enum: bus_group_pay_type, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'addDiscount', label: '加项折扣' },
  { prop: 'operation', label: '操作', width: 80, fixed: 'right' }
];

// 人员列表Columns
export const personnelListColumn: any = [
  { prop: 'recordCode', label: '档案号', width: 80, fixed: 'left' },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'credentialNumber', label: '身份证号', width: 170, fixed: 'left' },
  { prop: 'name', label: '姓名', width: 80, fixed: 'left' },
  { prop: 'gender', label: '性别', width: 80, enum: sys_user_sex, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'marriageStatus', label: '婚否', enum: bus_marriage_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'groupName', label: '分组名称', width: 100 },
  { prop: 'healthyReserveTime	', label: '预约日期' },
  {
    prop: 'insMark',
    label: '是否总检',
    enum: [
      { label: '待总检', value: '0' },
      { label: '已总检', value: '1' }
    ]
  },
  { prop: 'healthyCheckStatus', label: '体检状态', enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: '1', label: '部门' },
  { prop: '1', label: '开票部门' },
  { prop: '1', label: '其他' },
  { prop: '1', label: '职务' },
  { prop: 'businessCategory', label: '体检类别', enum: bus_category, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: '1', label: '人员类别' },
  { prop: 'operation', label: '操作', width: 80, fixed: 'right' }
];

// 任务人员列表Columns
export const groupPersonColumn: any = [
  { prop: 'name', label: '体检号' },
  { prop: 'name', label: '档案号' },
  { prop: 'name', label: '证件号', width: 180 },
  { prop: 'name', label: '业务类型', width: 120 },
  { prop: 'name', label: '体检类型', width: 120 },
  { prop: 'name', label: '姓名' },
  { prop: 'name', label: '婚否' },
  { prop: 'name', label: '年龄' },
  { prop: 'name', label: '电话' },
  { prop: 'name', label: '体检日期', width: 120 },
  { prop: 'name', label: '体检状态', width: 120 },
  { prop: 'name', label: '需要总检', width: 120 },
  { prop: 'name', label: '人员类别', width: 120 },
  { prop: 'name', label: '总费用' },
  { prop: 'name', label: '团费' },
  { prop: 'name', label: '个费' },
  { prop: 'name', label: '单位' },
  { prop: 'name', label: '分组' },
  { prop: 'name', label: '部门' },
  { prop: 'name', label: '介绍人' },
  { prop: 'name', label: '创建人' },
  { prop: 'name', label: '报到人' },
  { prop: 'name', label: '总检医生', width: 120 },
  { prop: 'name', label: '审核时间', width: 120 },
  { prop: 'name', label: '完成时间', width: 120 }
  // { prop: 'operation', label: "操作", width: 80, fixed: "right" },
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
