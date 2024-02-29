export const tableColumnStyleObj = { //payStatus缴费状态,healthyCheckStatus体检状态,physicalType体检类型,businessCategory业务类别,checkType检查类型,dutyStatus在岗状态,checkStatus检查状态
  'payStatus': {
    0: {
      label: '未缴费',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
    1: {
      label: '已缴费',
      color: '#21CDE4',
      background: '#DEF9FC'
    },
    2: {
      label: '申请退费中',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
    3: {
      label: '已退费',
      color: '#38D497',
      background: '#DDFAEC'
    },
    4: {
      label: '部分已收',
      color: '#E5EFFF',
      background: '#E5EFFF'
    },
  },
  'healthyCheckStatus': {
    0: {
      label: '预约',
      color: '#2175FF',
      background: '#E5EFFF'
    },
    1: {
      label: '登记',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
    2: {
      label: '科室分检',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
    3: {
      label: '分检完成',
      color: '#21CDE4',
      background: '#DEF9FC'
    },
    4: {
      label: '待总检',
      color: '#F96E6E',
      background: '#FFEBEB'
    },
    5: {
      label: '已终检',
      color: '#38D497',
      background: '#DDFAEC'
    }
  },
  'physicalType': {
    JKTJ: {
      label: '健康体检',
      color: '#38D497',
      background: '#DDFAEC'
    },
    ZYJKTJ: {
      label: '职业健康体检',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
    FSTJ: {
      label: '放射体检',
      color: '#2175FF',
      background: '#E5EFFF'
    },
    LNRTJ: {
      label: '老年人体检',
      color: '#159DFF',
      background: '#E1F2FF'
    },
    RZTJ: {
      label: '入职体检',
      color: '#F96E6E',
      background: '#FFEBEB'
    },
    XSTJ: {
      label: '学生体检',
      color: '#21CDE4',
      background: '#DEF9FC'
    }
  },
  'businessCategory': {
    1: {
      label: '个检',
      color: '#2175FF',
      background: '#E5EFFF'
    },
    2: {
      label: '团检',
      color: '#FFA81C',
      background: '#FFF3E0'
    }
  },
  'checkType': {
    0: {
      label: '检查项目',
      color: '#2175FF',
      background: '#E5EFFF'
    },
    1: {
      label: '化验项目',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
    2: {
      label: '功能项目',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
  },
  'dutyStatus': {
    1: {
      label: '上岗前',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
    2: {
      label: '在岗期间',
      color: '#21CDE4',
      background: '#DEF9FC'
    },
    3: {
      label: '离岗时',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
    4: {
      label: '离岗后',
      color: '#2175FF',
      background: '#E1ECFF'
    },
    5: {
      label: '应急健康检查',
      color: '#159DFF',
      background: '#E1F2FF'
    },
    6: {
      label: '应急照射',
      color: '#F96E6E',
      background: '#FFEBEB'
    },
    7: {
      label: '事故照射',
      color: '#DDFAEC',
      background: '#DDFAEC'
    },
  },
  'checkStatus': {
    0: {
      label: '未检查',
      color: '#FFA81C',
      background: '#FFF3E0'
    },
    1: {
      label: '已检查',
      color: '#38D497',
      background: '#DDFAEC'
    },
    2: {
      label: '弃捡',
      color: '#F96E6E',
      background: '#FFEBEB'
    },
    3: {
      label: '未保存',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
    4: {
      label: '延期',
      color: '#8A7AFF',
      background: '#EFEDFF'
    },
  }
}
export const stylePropArr = Object.keys(tableColumnStyleObj)