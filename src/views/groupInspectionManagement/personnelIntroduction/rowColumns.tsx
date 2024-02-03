import { useDict } from '@/utils/dict';
const {
  bus_physical_type,
  bus_charge_type,
  sys_user_sex,
  bus_healthy_check_status,
  bus_duty_status,
  bus_credential_type,
  bus_personnel_marriage_status,
  bus_case_card_type,
  bus_job_code,
  bus_tj_check_type,
  bus_hazardous_factors
} = toRefs<any>(
  useDict(
    'bus_physical_type',
    'bus_charge_type',
    'sys_user_sex',
    'bus_healthy_check_status',
    'bus_duty_status',
    'bus_credential_type',
    'bus_personnel_marriage_status',
    'bus_case_card_type',
    'bus_job_code',
    'bus_tj_check_type',
    'bus_hazardous_factors'
  )
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
    prop: 'groupTitle',
    label: '单位分组 ',
    search: { span: 3 }
  },
  {
    prop: 'teamId',
    label: '单位名称',
    search: { el: 'select' }
  },
  {
    prop: 'taskId',
    label: '任务名称',
    search: { el: 'select' }
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    search: { el: 'select' },
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'dutyStatus',
    label: '在岗状态',
    search: { el: 'select' },
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'teamGroupId',
    label: '分组名称',
    search: { el: 'select' }
  },
  {
    prop: 'hazardFactor',
    label: '危害因素',
    search: { el: 'select', props: { multiple: true } },
    enum: bus_hazardous_factors,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'otherFc',
    label: '其他粉尘',
    search: { el: 'input' }
  },
  {
    prop: 'otherHxys',
    label: '其他化学因素',
    search: { el: 'input' }
  },
  {
    prop: 'otherSwys',
    label: '其他生物因素',
    search: { el: 'input' }
  },
  {
    prop: 'otherWlys',
    label: '其他物理因素',
    search: { el: 'input' }
  },
  {
    prop: 'otherFsxys',
    label: '其他放射性因素',
    search: { el: 'input' }
  },
  {
    prop: 'infoTitle',
    label: '基础信息 ',
    search: { span: 3 }
  },
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'input' }
  },
  {
    prop: 'credentialType',
    label: '证件类型',
    search: { el: 'select' },
    enum: bus_credential_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'credentialNumber',
    label: '证件号',
    search: { el: 'input' }
  },
  {
    prop: 'gender',
    label: '性别',
    search: { el: 'select' },
    enum: sys_user_sex,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'birthday',
    label: '出生日期',
    search: { el: 'date-picker' }
  },
  {
    prop: 'age',
    label: '年龄',
    search: { el: 'input' }
  },
  {
    prop: 'marriageStatus',
    label: '婚否',
    search: { el: 'select' },
    enum: bus_personnel_marriage_status,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'nation',
    label: '民族',
    search: { el: 'input' }
  },
  {
    prop: 'phone',
    label: '联系电话',
    search: { el: 'input' }
  },
  {
    prop: 'contactAddress',
    label: '联系地址',
    search: { el: 'input' }
  },
  {
    prop: 'contactEmail',
    label: '联系邮箱',
    search: { el: 'input' }
  },
  {
    prop: 'caseCardType',
    label: '个案卡类别',
    search: { el: 'select' },
    enum: bus_case_card_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'jobCode',
    label: '工种名称',
    search: { el: 'select' },
    enum: bus_job_code,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    prop: 'otherJobName',
    label: '其他工种名称',
    search: { el: 'input' }
  },
  {
    prop: 'contactSeniority',
    label: '接害工龄',
    search: { el: 'input' }
  },
  {
    prop: 'seniority',
    label: '总工龄',
    search: { el: 'input' }
  },
  {
    prop: 'checkType',
    label: '检查类型',
    search: { el: 'select' },
    enum: bus_tj_check_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  }
];

// 导入数据配置项
export const importColumn = [
  {
    type: 'index',
    label: '序号',
    width: 60,
    fixed: 'left'
  },
  {
    prop: 'serialNumber',
    label: '流水号',
    fixed: 'left'
  },
  {
    prop: 'name',
    label: '姓名',
    fixed: 'left'
  },
  {
    prop: 'age',
    label: '年龄'
  },
  {
    prop: 'gender',
    label: '性别',
    enum: sys_user_sex, 
    fieldNames: { label: 'dictLabel', value: 'dictValue' } 
  },
  {
    prop: 'credentialNumber',
    label: '证件号码',
    width: 160
  },
  {
    prop: 'addTime',
    label: '添加时间',
    width: 120
  },
  {
    prop: 'teamName',
    label: '单位名称',
    width: 130
  },
  {
    prop: 'taskName',
    label: '任务名称',
    width: 120
  },
  {
    prop: 'teamGroupId',
    label: '所属分组',
    width: 120
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
