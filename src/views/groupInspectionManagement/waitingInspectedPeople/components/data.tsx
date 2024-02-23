//详情待检用户
export const tableColumnsWaitingUserBasic = (sys_user_sex: any) => [
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'id',
    label: '序号',
    width: '60',
    render: (scope: any) => {
      return scope.$index + 1;
    }
  },
  { prop: 'healthyCheckCode', label: '体检编号' },
  { prop: 'peTimes', label: '体检次数' },
  { prop: 'healthyCheckTime', label: '体检日期' },
  { prop: 'groupName', label: '分组名称' },
  { prop: 'name', label: '姓名' },
  { prop: 'credentialNumber', label: '身份证号', width: 170 },
  { prop: 'gender', label: '性别', enum: sys_user_sex },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话号码', width: 130 }
];

// 人员换组
export const changGroupColumnsBasic = [
  { prop: 'taskName', label: '任务名称', search: { el: 'select' }, slot: 'taskName' },
  { prop: 'groupName', label: '分组名称', search: { el: 'select' }, slot: 'groupName' }
];

// 团检待检人员主列表
export const tableColumnsBasic = (teamTaskLists: any, bus_physical_type: any, sys_user_sex: any) => [
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'physicalType',
    label: '体检类型',
    search: { el: 'select' },
    isShow: false,
    enum: bus_physical_type,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  { prop: 'teamId', label: '体检单位', search: { el: 'select' }, isShow: false, slot: 'teamId' },
  {
    prop: 'taskId',
    label: '任务名称',
    search: { el: 'select', props: { clearable: false } },
    isShow: false,
    enum: teamTaskLists,
    fieldNames: { label: 'taskName', value: 'id' },
    slot: 'taskId'
  },
  { prop: 'teamGroupId', label: '分组', search: { el: 'select' }, isShow: false, slot: 'teamGroupId' },
  { prop: 'healthyCheckCode', label: '体检号/姓名', search: { el: 'input' }, isShow: false },
  { prop: 'credentialNumber', label: '身份证号', search: { el: 'input' }, isShow: false },
  { prop: 'taskName', label: '任务名称', fixed: 'left' },
  { prop: 'healthyCheckCode', label: '体检号' },
  { prop: 'name', label: '姓名' },
  { prop: 'gender', label: '性别', width: 80, enum: sys_user_sex },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'credentialNumber', width: 180, label: '身份证号' },
  { prop: 'phone', label: '电话', width: 120 },
  { prop: 'physicalType', label: '体检类型', enum: bus_physical_type },
  { prop: 'teamName', label: '单位名称' },
  { prop: 'groupName', label: '所属分组' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 100 }
];

// 团检待检人员详情-套餐列表
export const packageColumnsBasic = [
  {
    prop: 'id',
    label: '序号',
    width: '60',
    render: (scope: any) => {
      return scope.$index + 1;
    }
  },
  { prop: 'itemName', label: '项目名称' },
  { prop: 'standardPrice', label: '原金额' },
  { prop: 'discount', label: '折扣' },
  { prop: 'actualPrice', label: '应收额' }
];

// 团检待检人员详情-套餐列表-折扣计算
export const packageFormColumnBasic = [
  {
    prop: 'standardPrice',
    label: '原总额',
    search: { el: 'input', props: { disabled: true } }
  },
  {
    prop: 'projectDiscount',
    label: '总折扣',
    search: { el: 'input', props: { disabled: true } }
  },
  {
    prop: 'actualPrice',
    label: '应收金额',
    search: { el: 'input', props: { disabled: true } }
  }
];
