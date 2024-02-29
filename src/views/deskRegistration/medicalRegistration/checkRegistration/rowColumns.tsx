import { useDict } from '@/utils/dict';
const {
  bus_physical_type,
  sys_user_sex,
  bus_check_status,
  bus_credential_type,
  bus_personnel_marriage_status,
  bus_tj_check_type,
  bus_cost_type,
  bus_person_category,
  bus_pay_type,
  bus_pay_status,
  bus_pay_mode,
  bus_combination_project_type,
  bus_nation
} = toRefs<any>(
  useDict(
    'bus_physical_type',
    'sys_user_sex',
    'bus_check_status',
    'bus_credential_type',
    'bus_personnel_marriage_status',
    'bus_tj_check_type',
    'bus_cost_type',
    'bus_person_category',
    'bus_pay_type',
    'bus_pay_status',
    'bus_pay_mode',
    'bus_combination_project_type',
    'bus_nation'
  )
);
const formInfoColumns = (teamIdList, zjlxChange, zjhInput) => [
  {
    slot: 'credentialImage',
    search: { span: 24 }
  },
  {
    prop: 'patientId',
    label: '患者ID',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'credentialType',
    label: '证件类型',
    search: { el: 'select' },
    enum: bus_credential_type,
    change: zjlxChange
  },
  {
    prop: 'recordCode',
    label: '档案号',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'credentialNumber',
    label: '证件号',
    search: { el: 'input' },
    input: zjhInput
  },
  {
    prop: 'healthyCheckCode',
    label: '体检号',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'input' }
  },
  {
    prop: 'birthday',
    label: '出生日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' }, disabled: true }
  },
  {
    prop: 'nation',
    label: '民族',
    search: { el: 'select' },
    enum: bus_nation
  },
  {
    prop: 'age',
    label: '年龄',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'personCategory',
    label: '人员类别',
    search: { el: 'select' },
    enum: bus_person_category
  },
  {
    prop: 'gender',
    label: '性别',
    search: { el: 'select', disabled: true },
    enum: sys_user_sex
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    search: { el: 'select' },
    enum: bus_physical_type
  },
  {
    prop: 'marriageStatus',
    label: '婚否',
    search: { el: 'select' },
    enum: bus_personnel_marriage_status
  },
  {
    prop: 'phone',
    label: '联系电话',
    search: { el: 'input' }
  },
  {
    prop: 'costType',
    label: '费别',
    search: { el: 'select' },
    enum: bus_cost_type
  },
  {
    prop: 'payType',
    label: '付费类型',
    search: { el: 'select' },
    enum: bus_pay_type
  },
  {
    prop: 'status',
    label: '状态',
    search: { el: 'select', disabled: true },
    enum: [
      {
        label: '正常',
        value: '0'
      },
      {
        label: '取消登记',
        value: '1'
      }
    ]
  },
  {
    prop: 'remark',
    label: '备注',
    search: { el: 'input' }
  },
  {
    prop: 'healthyReserveTime',
    label: '预约日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'reserveTimeArr',
    label: '预约时间',
    search: {
      el: 'time-picker',
      props: {
        'is-range': true,
        'range-separator': '至',
        'start-placeholder': '开始时间',
        'end-placeholder': '结束时间',
        valueFormat: 'HH:mm:ss',
        format: 'HH:mm'
      }
    },
    slot: 'reserveTimeArr'
  },
  {
    prop: 'birthday1',
    label: '报到时间',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' }, span: 24, disabled: true }
  },
  {
    prop: 'checkType',
    label: '检查类型',
    search: { el: 'select', span: 24 },
    enum: bus_tj_check_type
  },
  {
    prop: 'teamId',
    label: '单位',
    enum: teamIdList,
    search: { el: 'tree-select', checkStrictly: true, span: 24 },
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    prop: 'contactAddress',
    label: '联系地址',
    search: { el: 'input', span: 24 }
  },
  {
    prop: 'contactEmail',
    label: '联系邮箱',
    search: { el: 'input', span: 24 }
  }
];
const validatePhone = (rule, value, callback) => {
  var isMobilePhone = /^1\d{10}$/;
  var isFixMob = /^\d{3,4}-\d{7,8}$/;
  if (!isMobilePhone.test(value) && !isFixMob.test(value)) {
    return callback(new Error('请输入正确联系电话'));
  }
  callback();
};
const checkIDCard = (rule, value, callback) => {
  const IDCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!IDCardReg.test(value)) {
    return callback(new Error('身份证号格式不正确'));
  }
  callback();
};
const formRules = {
  credentialType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  credentialNumber: [
    { required: true, message: '请输入证件号', trigger: 'blur' },
    { validator: checkIDCard, trigger: 'change' },
    { validator: checkIDCard, trigger: 'blur' }
  ],
  birthday: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  physicalType: [{ required: true, message: '请选择体检类型', trigger: 'change' }],
  checkType: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { validator: validatePhone, trigger: 'change' },
    { validator: validatePhone, trigger: 'blur' }
  ]
};

const tableColumns = [
  { type: 'selection' },
  { type: 'index', label: '序列', width: 60 },
  { prop: 'combinProjectName', label: '项目名称' },
  { prop: 'projectType', label: '项目类型', enum: bus_combination_project_type },
  { prop: 'standardAmount', label: '原金额（元）', width: 120 },
  { prop: 'discount', label: '折扣（%）' },
  { prop: 'receivableAmount', label: '折后应收（元）', width: 130 },
  { prop: 'payStatus', label: '结算状态', enum: bus_pay_status },
  { prop: 'payMode', label: '支付方式', enum: bus_pay_mode },
  { prop: 'checkStatus', label: '检查状态', enum: bus_check_status },
  { prop: 'operation', label: '操作' }
];
export { formInfoColumns, formRules, tableColumns };
