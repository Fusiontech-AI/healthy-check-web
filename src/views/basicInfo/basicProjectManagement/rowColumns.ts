import useOptions from "./hooks/useOptions";
const { optionsUnit,
  optionsResultType,
  optionsResultGetWay,
  optionsKS,
  optionsSuitSex,
  optionsEnterSummary,
  optionsEnterReport } = useOptions()
export const addColumn: any = [
  {
    prop: 'basicProjectCode',
    label: '项目编码',
    search: {
      el: 'input',
    }
  },
  {
    prop: 'basicProjectName',
    label: '项目名称',
    search: {
      el: 'input',
    }
  },
  {
    prop: 'basicSimpleName',
    label: '项目简称',
    search: {
      el: 'input',
    }
  },
  {
    prop: 'ksId',
    label: '所属科室',
    search: {
      el: 'select',
    },
    enum: optionsKS
  },
  {
    prop: 'unit',
    label: '计量单位',
    search: {
      el: 'select',
    },
    enum: optionsUnit
  },
  {
    prop: 'resultType',
    label: '结果类型',
    search: {
      el: 'select',
    },
    enum: optionsResultType
  },
  {
    prop: 'resultGetWay',
    label: '结果获取',
    search: {
      el: 'select',
    },
    enum: optionsResultGetWay
  },
  {
    prop: 'suitSex',
    label: '适用性别',
    search: {
      el: 'select',
    },
    enum: optionsSuitSex
  },
  {
    prop: 'defaultValue',
    label: '默认值',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'projectSort',
    label: '排序',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'enterSummary',
    label: '进入小结',
    search: {
      el: 'select',
    },
    enum: optionsEnterSummary
  },
  {
    prop: 'enterReport',
    label: '进入报告',
    search: {
      el: 'select',
    },
    enum: optionsEnterReport
  },
  {
    prop: 'lisCode',
    label: 'LIS编码',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'pacsCode',
    label: 'PACS编码',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'hisCode',
    label: 'HIS编码',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'zybCode',
    label: '职业病编码',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'status',
    label: '是否启用',
    search: {
      el: 'switch',
      props: {
        'active-value': '0',
        'inactive-value': '1'
      }
    },
    enum: [
      { label: '正常', value: '0' },
      { label: '停用', value: '1' }
    ]
  },
]

export const batchEditColumn: any = [
  {
    prop: 'sex',
    label: '适用性别',
    search: {
      el: 'select',
    },
    enum: optionsSuitSex
  },
  {
    prop: 'ageStart',
    label: '年龄最低值',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'ageEnd',
    label: '年龄最高值',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'healthRefer',
    label: '健康参考值',
  },
  {
    prop: 'careerRefer',
    label: '职业参考区间',
  },
]