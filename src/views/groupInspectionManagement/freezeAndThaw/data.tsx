export const basicInfoColumnBasic = [
  {
    prop: 'f1',
    label: '单位',
    search: { el: 'input' }
  },
  {
    prop: 'f2',
    label: '任务',
    search: { el: 'input' }
  },
  {
    prop: 'f3',
    label: '体检号',
    search: { el: 'input' }
  },
  {
    prop: 'f4',
    label: '报道日期',
    search: { el: 'date-picker', props: { type: 'daterange' } }
  },
  {
    prop: 'f5',
    label: '体检状态',
    search: { el: 'select' },
    enum: [{ label: '1', value: '1' }]
  },
  {
    prop: 'f6',
    label: '姓名',
    search: { el: 'input' }
  },
  {
    prop: 'f7',
    label: '性别',
    search: { el: 'select' }
  },
  {
    prop: 'f9',
    label: '身份证号',
    search: { el: 'input' }
  }
];

// 表格行
export const columnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'f1', label: '体检号', fixed: 'left', slot: 'f1' },
  { prop: 'f2', label: '档案号', width: '100' },
  { prop: 'f3', label: '证件号', width: '140' },
  { prop: 'f4', label: '业务类别', width: '100' },
  { prop: 'f5', label: '体检类型', width: '100' },
  { prop: 'f6', label: '姓名' },
  { prop: 'f7', label: '婚否' },
  { prop: 'f8', label: '年龄' },
  { prop: 'f9', label: '电话' },
  { prop: 'f10', label: '体检日期' },
  { prop: 'f11', label: '回收' },
  { prop: 'f12', label: '冻结' },
  { prop: 'f13', label: '体检状态' },
  { prop: 'f14', label: '需要总检' },
  { prop: 'f15', label: '人员费别' },
  { prop: 'f16', label: '团费' },
  { prop: 'f17', label: '个费' },
  { prop: 'f18', label: '单位' },
  { prop: 'f19', label: '分组' },
  { prop: 'f20', label: '部门' },
  { prop: 'f21', label: '介绍人' },
  { prop: 'f22', label: '创建人' },
  { prop: 'f23', label: '报到人' },
  { prop: 'f24', label: '总检医生' },
  { prop: 'f25', label: '总检时间' },
  { prop: 'f26', label: '审核医生' },
  { prop: 'f27', label: '审核时间' },
  { prop: 'f28', label: '完成时间' }
  // {
  //   prop: 'status',
  //   label: '是否启用',
  //   fieldNames: { label: 'userLabel', value: 'userStatus' },
  //   render: (scope) => {
  //     return (
  //       <el-tag round type={scope.row.status === '0' ? 'success' : 'info'}>
  //         {scope.row.status === '0' ? '是' : '否'}
  //       </el-tag>
  //     );
  //   }
  // },
];
