import { useDict } from '@/utils/dict';
const { sys_user_sex, bus_credential_type, bus_receive_way } = toRefs<any>(useDict('sys_user_sex', 'bus_credential_type', 'bus_receive_way'));
const tijianColumns = (zjlxChange) => [
  {
    prop: 'replaceName',
    label: '替检人姓名',
    search: { el: 'input' }
  },
  {
    prop: 'replaceCredentialType',
    label: '替检人证件类型',
    search: { el: 'select' },
    enum: bus_credential_type,
    change: zjlxChange
  },
  {
    prop: 'replaceCredentialNumber',
    label: '替检人证件号',
    search: { el: 'input' },
    slot: 'zjh'
  },
  {
    prop: 'replacePhone',
    label: '替检人电话',
    search: { el: 'input' }
  },
  {
    prop: 'replaceBirthday',
    label: '替检人生日',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' }, disabled: true }
  },
  {
    prop: 'replaceGender',
    label: '替检人性别',
    search: { el: 'select', disabled: true },
    enum: sys_user_sex
  },
  {
    prop: 'replaceAge',
    label: '替检人年龄',
    search: { el: 'input', disabled: true }
  }
];
const tijianColumnsY = [
  {
    prop: 'name',
    label: '原体检人姓名',
    search: { el: 'input' }
  },
  {
    prop: 'credentialType',
    label: '原体检人证件类型',
    search: { el: 'select' },
    enum: bus_credential_type
  },
  {
    prop: 'credentialNumber',
    label: '原体检人证件号',
    search: { el: 'input' }
  },
  {
    prop: 'phone',
    label: '原体检人电话',
    search: { el: 'input' }
  },
  {
    prop: 'birthday',
    label: '原体检人生日',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' }, disabled: true }
  },
  {
    prop: 'gender',
    label: '原体检人性别',
    search: { el: 'select', disabled: true },
    enum: sys_user_sex
  },
  {
    prop: 'age',
    label: '原体检人年龄',
    search: { el: 'input', disabled: true }
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
const tijianRules = {
  replaceCredentialType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  replaceCredentialNumber: [
    { required: true, message: '请输入证件号', trigger: 'blur' },
    { validator: checkIDCard, trigger: 'change' },
    { validator: checkIDCard, trigger: 'blur' }
  ],
  replaceBirthday: [{ required: true, message: '请选择替检人出生日期', trigger: 'change' }],
  replaceName: [{ required: true, message: '请输入替检者姓名', trigger: 'blur' }],
  replaceAge: [{ required: true, message: '请输入替检人年龄', trigger: 'blur' }],
  replaceGender: [{ required: true, message: '请选择替检人性别', trigger: 'change' }],
  replacePhone: [
    { required: true, message: '请输入替检人电话', trigger: 'blur' },
    { validator: validatePhone, trigger: 'change' },
    { validator: validatePhone, trigger: 'blur' }
  ]
};
const baogaoRules = {
  receiveWay: [{ required: true, message: '请选择领取方式', trigger: 'change' }],
  recipient: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
  postAddress: [{ required: true, message: '请输入邮寄地址', trigger: 'blur' }],
  receiptPhone: [
    { required: true, message: '请输入收件电话', trigger: 'blur' },
    { validator: validatePhone, trigger: 'change' },
    { validator: validatePhone, trigger: 'blur' }
  ]
};

const baogaoColumns = [
  {
    prop: 'receiveWay',
    label: '领取方式',
    search: { el: 'select' },
    enum: bus_receive_way
  },
  {
    prop: 'recipient',
    label: '收件人',
    search: { el: 'input' }
  },
  {
    prop: 'receiptPhone',
    label: '收件电话',
    search: { el: 'input' }
  },
  {
    prop: 'postAddress',
    label: '邮寄地址',
    search: { el: 'input' }
  }
];
export { tijianColumns, tijianRules, tijianColumnsY, baogaoRules, baogaoColumns };
