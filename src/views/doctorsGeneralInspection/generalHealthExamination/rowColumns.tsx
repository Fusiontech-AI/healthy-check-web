// 体检项目小结
export const projectSummaryColumns: any = [
  {
    type: 'radio',
    label: '单选',
    width: 55,
    fixed: 'left'
  },
  {
    label: '序号',
    type: 'index',
    fixed: 'left',
    width: 55
  },
  {
    label: '项目名称',
    prop: 'combinProjectName',
    fixed: 'left',
    width: 120
  },
  {
    label: '小项名称',
    prop: 'basicProjectName',
    width: 120
  },
  {
    label: '单位',
    prop: 'unit'
  },
  {
    label: '检查医生',
    prop: 'checkDoctorName',
    width: 100
  },
  {
    label: '检查时间',
    prop: 'checkTime',
    width: 120
  }
];

// 知识库检索
export const knowledgeColumns: any = [
  {
    label: '序号',
    type: 'index',
    fixed: 'left',
    width: 55
  },
  {
    label: '所属科室',
    prop: 'kzkstjName',
    width: 100
  },
  {
    label: '诊断名称',
    prop: 'zyzd',
    search: {
      el: 'input'
    },
    width: 100
  },
  {
    label: '建议内容',
    prop: 'zybjy'
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 80
  }
];
