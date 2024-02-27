import useOptions from "./hooks/useOptions";
const { optionsType, optionsSample, optionsCode, optionsPrint, optionsApply, itemType } = useOptions()
export const addColumn: any = [
  {
    prop: 'sampleCode',
    label: '样本编码',
    search: {
      el: 'input',
    }
  },
  {
    prop: 'sampleName',
    label: '样本名称',
    search: {
      el: 'input',
    }
  },
  {
    prop: 'sampleCategory',
    label: '所属类别',
    search: {
      el: 'select',
    },
    enum: optionsType
  },
  {
    prop: 'sampleType',
    label: '标本类型',
    search: {
      el: 'select',
    },
    enum: optionsSample
  },
  {
    prop: 'barCodeType',
    label: '条码类型',
    search: {
      el: 'select',
    },
    enum: optionsCode
  },
  {
    prop: 'printSort',
    label: '打印顺序',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'printNumber',
    label: '打印份数',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'printFlag',
    label: '是否打印',
    search: {
      el: 'select',
    },
    enum: optionsPrint
  },
  {
    prop: 'printApplyFlag',
    label: '打印申请单',
    search: {
      el: 'select',
    },
    enum: optionsApply
  },
  {
    prop: 'printApplyNumber',
    label: '申请单份数',
    search: {
      el: 'input',
    },
  },
  {
    prop: 'remark',
    label: '备注',
    search: {
      el: 'input',
    },
  }
]

