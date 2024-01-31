// 体检项目列表
export const itemListColumn = [
  { prop: 'f1', label: '科室' },
  { prop: 'f2', label: '项目名称' },
  { prop: 'f3', label: '支付方式' },
  { prop: 'f4', label: '支付状态' },
  { prop: 'f5', label: '检查状态' },
  { prop: 'f6', label: '检查时间' },
  { prop: 'f7', label: '检查医生' }
];

// 人员换组
export const changGroupColumnsBasic = [
  { prop: 'taskName', label: '任务名称', search: { el: 'select' }, slot: 'taskName' },
  { prop: 'groupName', label: '分组名称', search: { el: 'select' }, slot: 'groupName' }
];
