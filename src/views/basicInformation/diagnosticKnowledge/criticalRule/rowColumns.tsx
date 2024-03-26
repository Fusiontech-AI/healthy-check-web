/**
 * 规则详情页 结果维护
 *
 */
// 基本信息
export const infoFiled = [
  {
    prop: 'basicProjectName',
    label: '项目名称'
  },
  {
    prop: 'basicProjectCode',
    label: '项目ID'
  },
  {
    prop: 'unit',
    label: '单位'
  },
  {
    prop: 'ksId',
    label: '所属科室',
    search: {
      el: 'select',
    },
    enum: [],
    fieldNames: { label: 'ksName', value: 'id' },
  },
  {
    prop: 'resultType',
    label: '结果类型',
    search: {
      el: 'select',
    },
    enum: [
      {label: '数字', value: '0'},
      {label: '文本', value: '1'},
    ]
  },
  // {
  //   prop: 'name',
  //   label: '适用体检类型'
  // },
  {
    prop: 'suitSex',
    label: '性别控制',
    search: {
      el: 'select',
    },
    enum: [
      {label: '男', value: '0'},
      {label: '女', value: '1'},
      {label: '不限', value: '2'},
    ]
  },
  // {
  //   prop: 'name',
  //   label: '年龄控制'
  // }
];
// 表格配置项
export const tableColumn = [
  {
    type: 'expand',
    fixed: 'left',
    width: 45,
    isShowSearch: false
  },
  {
    prop: 'name',
    label: '规则描述',
    search: {
      el: 'input'
    },
    width: 100
  },
  {
    prop: 'jymc',
    label: '诊断建议',
    width: 120,
    isShowSearch: false
  },
  {
    prop: 'zdjyId',
    label: '诊断建议',
    search: {
      el: 'select'
    },
    enum: [],
    fieldNames: { label: 'jymc', value: 'id' },
    width: 120,
    isShow: false
  },
  {
    prop: 'resultType',
    label: '结果类型',
    search: {
      el: 'select'
    },
    enum: [
      { label: '正常', value: '1' },
      { label: '异常', value: '2' }
    ],
    width: 100
  },
  {
    prop: 'recommendDeptCode',
    label: '推荐就诊科室',
    search: {
      el: 'input'
    },
    width: 120
  },
  {
    prop: 'crisisType',
    label: '是否危急值',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
    width: 100
  },
  {
    prop: 'crisisDeal',
    label: '危急值措施',
    search: {
      el: 'input'
    },
    width: 120
  },
  {
    prop: 'privacyType',
    label: '是否隐私',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
    width: 100
  },
  {
    prop: 'summaryType',
    label: '项目名称进入小结',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
    width: 120
  },
  {
    prop: 'diagnosisType',
    label: '项目名称进入诊断',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
    width: 120
  },
  {
    prop: 'followType',
    label: '是否随访',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
    width: 100
  },
  {
    prop: 'keyWords',
    label: '匹配关键词',
    search: {
      el: 'input'
    },
    width: 120
  },
  {
    prop: 'logicType',
    label: '逻辑符号',
    search: {
      el: 'select'
    },
    enum: [
      // { label: '且', value: 'AND' },
      // { label: '或', value: 'XOR' }
    ],
    width: 120
  },
  {
    prop: 'importance',
    label: '重要程度逻辑符号',
    search: {
      el: 'select'
    },
    enum: [
      { label: '非常重要', value: '1' },
      { label: '重要', value: '2' },
      { label: '一般', value: '3' },
      { label: '正常', value: '4' }
    ],
    width: 120
  },
  {
    prop: 'priority',
    label: '优先级',
    search: {
      el: 'input',
      disabled: true
    },
    width: 120
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: '180',
    isShowSearch: false
  }
];

// 新增表单配置项目
export const addDialogField = [
  {
    prop: 'infoTitle',
    label: '',
    search: {
      span: 2
    }
  },
  {
    prop: 'name',
    label: '规则名称',
    search: {
      el: 'input'
    },
  },
  {
    prop: 'zdjyId',
    label: '诊断建议',
    search: {
      el: 'select'
    },
    enum: [],
    fieldNames: { label: 'jymc', value: 'id' },
  },
  {
    prop: 'logicType',
    label: '逻辑符号',
    search: {
      el: 'select'
    },
    enum: [],
  },
  {
    prop: 'dealTitle',
    label: '',
    search: {
      span: 2
    }
  },
  {
    prop: 'recommendDeptCode',
    label: '临床处理科室',
    search: {
      el: 'tree-select',
      'default-expand-all': true
    },
    enum: [],
    fieldNames: { label: 'deptName', value: 'deptId' }
  },
  {
    prop: 'followType',
    label: '体检科随访',
    search: {
      el: 'select'
    },
    enum: [
      { label: '是', value: '1' },
      { label: '否', value: '2' }
    ],
  }
]
// 新增弹窗规则校验
export const addRule = {
  name: [{ required: true, message: '请输入规则描述', trigger: 'blur' }],
  zdjyId: [{ required: false, message: '请选择诊断建议', trigger: 'change' }],
  resultType: [{ required: true, message: '请选择结果类型', trigger: 'change' }],
  recommendDeptCode: [{ required: false, message: '请选择临床处理科室', trigger: 'blur' }],
  crisisType: [{ required: true, message: '请选择是否危急值', trigger: 'change' }],
  crisisDeal: [{ required: true, message: '请输入危急值措施', trigger: 'blur' }],
  privacyType: [{ required: true, message: '请选择是否隐私', trigger: 'change' }],
  summaryType: [{ required: true, message: '请选择项目名称进入小结', trigger: 'change' }],
  diagnosisType: [{ required: true, message: '请选择项目名称进入诊断', trigger: 'change' }],
  followType: [{ required: true, message: '请选择体检科随访', trigger: 'change' }],
  keyWords: [{ required: true, message: '请输入匹配关键词', trigger: 'blur' }],
  logicType: [{ required: true, message: '请选择逻辑符号', trigger: 'change' }],
  importance: [{ required: true, message: '请选择重要程度逻辑符号', trigger: 'change' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }],
};

// 表格子项里面的表单配置项
export const subitemField = [
  {
    label: '条件描述',
    prop: 'name',
    search: { el: 'input' }
  },
  {
    label: '参数类型',
    prop: 'variableType',
    search: { el: 'select' },
    enum: [
      { label: '数值', value: '1' },
      { label: '字符', value: '2' }
    ]
  },
  {
    label: '参数名称',
    prop: 'variableName',
    search: { el: 'select' },
    enum: []
  },
  {
    label: '条件',
    prop: 'relationType',
    search: { el: 'select' },
    enum: []
  },
  {
    label: '结果',
    prop: 'referenceValue',
    search: { el: 'select', props: {
      'allow-create': true,
    } },
    enum: []
  },
  {
    label: '逻辑符号',
    prop: 'logicType',
    search: { el: 'select' },
    enum: []
  },
  {
    label: '优先级',
    prop: 'priority',
    search: { el: 'input', disabled: true }
  }
];

// 表格子项里面的表单规则校验
export const subitemRule = {
  name: [{ required: true, message: '请输入条件描述', trigger: 'blur' }],
  variableType: [{ required: true, message: '请输入参数类型', trigger: 'change' }],
  variableName: [{ required: true, message: '请输入参数名称', trigger: 'change' }],
  relationType: [{ required: true, message: '请输入条件', trigger: 'change' }],
  referenceValue: [{ required: true, message: '请输入结果', trigger: 'change' }],
  logicType: [{ required: true, message: '请输入逻辑符号', trigger: 'change' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }]
};
