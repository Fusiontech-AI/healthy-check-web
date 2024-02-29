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
  bus_hazardous_factors,
  bus_category,
  bus_marriage_status,
  bus_need_general_review,
  bus_cost_type
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
    'bus_hazardous_factors',
    'bus_category',
    'bus_marriage_status',
    'bus_need_general_review',
    'bus_cost_type'
  )
);
// 人员基本信息表单配置项
export const formInfoColumns: any = [
  {
    prop: 'taskName',
    label: '任务名称',
    search: {
      el: 'input',
      required: true
    }
  },
  {
    prop: 'teamName',
    label: '团检单位',
    enum: [],
    search: { el: 'select', required: true, props: { filterable: true, disabled: false } }
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' },
    search: { el: 'select', required: true, props: { filterable: true } }
  },
  {
    prop: 'signDate',
    label: '签订日期',
    search: { el: 'date-picker', required: true, props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
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
    search: { el: 'select', required: true, props: { type: 'date' } }
  },
  {
    prop: 'isReview',
    label: '是否审核',
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' }
    ],
    search: { el: 'select', required: true, props: { filterable: true } }
  }
];

// 人员信息表格配置
export const tableColumn: any = [
  { type: 'index', label: '序号', fixed: 'left', width: 70 },
  { prop: 'name', label: '姓名', fixed: 'left' },
  { prop: 'gender', label: '性别', enum: sys_user_sex, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'age', label: '年龄' },
  { prop: 'credentialNumber', label: '身份证号', width: 170 },
  { prop: 'groupName', label: '项目分组', width: 120  },
  { prop: 'dutyStatus', label: '在岗类型',width: 120, enum: bus_duty_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'healthyCheckStatus', label: '体检状态', width: 120, enum: bus_healthy_check_status, fieldNames: { label: 'dictLabel', value: 'dictValue' } },
  { prop: 'operation', label: '操作', width: 120, fixed: 'right' }
];

// 新增团检人员
export const unitGroupColumn = ({teamIdList}:any) => {
  return [
    {
      prop: 'groupTitle',
      label: '单位分组 ',
      enum: [],
      search: { span: 3 }
    },
    {
      prop: 'teamId',
      label: '单位名称',
      enum: teamIdList,
      fieldNames: { label: 'teamName', value: 'id' },
      search: { el: 'tree-select', props: { 'check-strictly': true, 'node-key': 'id',label: 'teamName' }}
    },
    {
      prop: 'taskId',
      label: '任务名称',
      enum: [],
      fieldNames: { label: 'taskName', value: 'id' },
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
      enum: bus_duty_status,
      fieldNames: { label: 'dictLabel', value: 'dictValue' }
    },
    {
      prop: 'teamGroupId',
      label: '分组名称',
      enum: [],
      fieldNames: { label: 'groupName', value: 'id' },
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
};

export const rules = {
  teamId: [{ required: true, message: '请选择单位名称', trigger: 'change' }],
  taskId: [{ required: true, message: '请选择任务名称', trigger: 'change' }],
  physicalType: [{ required: true, message: '请选择体检类型', trigger: 'change' }],
  dutyStatus: [{ required: true, message: '请选择在岗状态', trigger: 'change' }],
  teamGroupId: [{ required: false, message: '请选择分组名称', trigger: 'change' }],
  hazardFactor: [{ required: true, message: '请选择危害因素', trigger: 'change' }],
  otherFc: [{ required: true, message: '请输入其他粉尘', trigger: 'blur' }],
  otherHxys: [{ required: true, message: '请输入其他化学因素', trigger: 'blur' }],
  otherSwys: [{ required: true, message: '请输入其他生物因素', trigger: 'blur' }],
  otherWlys: [{ required: true, message: '请输入其他物理因素', trigger: 'blur' }],
  otherFsxys: [{ required: true, message: '请输入其他放射性因素', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  credentialType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  credentialNumber: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  marriageStatus: [{ required: true, message: '请选择婚否', trigger: 'change' }],
  nation: [{ required: false, message: '请输入民族', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  contactAddress: [{ required: false, message: '请输入联系地址', trigger: 'blur' }],
  contactEmail: [{ required: false, message: '请输入联系邮箱', trigger: 'blur' }],
  caseCardType: [{ required: true, message: '请选择个案卡类别', trigger: 'change' }],
  jobCode: [{ required: true, message: '请选择工种名称', trigger: 'change' }],
  otherJobName: [{ required: true, message: '请输入其他工种名称', trigger: 'blur' }],
  contactSeniority: [{ required: true, message: '请输入接害工龄', trigger: 'blur' }],
  seniority: [{ required: true, message: '请输入总工龄', trigger: 'blur' }],
  checkType: [{ required: true, message: '请选择检查类型', trigger: 'change' }]
};

// 导入数据配置项
export const importColumn = [
  {
    type: 'index',
    label: '序号',
    width: 60,
    fixed: 'left'
  },
  // {
  //   prop: 'serialNumber',
  //   label: '流水号',
  //   fixed: 'left'
  // },
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
    prop: 'healthyCheckCode'
  },
  {
    label: '档案号',
    prop: 'recordCode'
  },
  {
    label: '证件号',
    prop: 'credentialNumber'
  },
  {
    label: '业务类别',
    prop: 'businessCategory',
    search: { el: 'select' },
    enum: bus_category,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '体检类型',
    prop: 'physicalType',
    search: { el: 'select' },
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '婚否',
    prop: 'marriageStatus',
    search: { el: 'select' },
    enum: bus_marriage_status,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '年龄',
    prop: 'age'
  },
  {
    label: '电话',
    prop: 'phone'
  },
  {
    label: '体检日期',
    prop: 'healthyCheckTime'
  },
  {
    label: '体检状态',
    prop: 'healthyCheckStatus',
    search: { el: 'select' },
    enum: bus_healthy_check_status,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '需要总检',
    prop: 'needGeneralReview',
    search: { el: 'select' },
    enum: bus_need_general_review,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '人员费别',
    prop: 'costType',
    search: { el: 'select' },
    enum: bus_cost_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '总费用（元）',
    prop: 'totalAmount'
  },
  {
    label: '团费（元）',
    prop: 'teamAmount'
  },
  {
    label: '个费（元）',
    prop: 'personAmount'
  },
  {
    label: '单位',
    prop: 'teamName'
  },
  {
    label: '分组',
    prop: 'groupName'
  },
  {
    label: '部门',
    prop: 'deptName'
  },
  {
    label: '介绍人',
    prop: 'introducerName'
  },
  {
    label: '创建人',
    prop: 'createByName'
  },
  {
    label: '报到人',
    prop: 'registerDoctorName'
  },
  {
    label: '总检医生',
    prop: '18100000000'
  },
  {
    label: '总检时间',
    prop: 'generalReviewDoctorName'
  },
  {
    label: '审核医生',
    prop: 'auditDoctorName'
  },
  {
    label: '审核时间',
    prop: 'auditTime'
  },
  {
    label: '预约日期',
    prop: 'healthyCheckTime'
  },
  {
    label: '完成时间',
    prop: 'finishTime'
  }
];
