// 单位基础信息
export const basicInfoColumnBasic = [
  {
    prop: 'teamLevel',
    label: '单位级别',
    slot: 'teamLevel',
    search: { el: 'select' },
    enum: []
  },
  {
    prop: 'parentId',
    slot: 'parentId',
    label: '关联上级单位',
    disabled: true,
    search: { el: 'select', props: { disabled: true }, disabled: true }
  },
  {
    prop: 'teamNo',
    label: '单位编号',
    search: { el: 'input', props: { disabled: true } }
  },
  {
    prop: 'teamName',
    label: '单位名称',
    slot: 'teamName',
    search: { el: 'input' }
  },
  {
    prop: 'shortName',
    label: '单位简称',
    search: { el: 'input' }
  },
  {
    prop: 'phoneticCode',
    label: '拼音简码',
    search: { el: 'input' }
  },
  {
    prop: 'contactName',
    label: '联系人姓名',
    search: { el: 'input' }
  },
  {
    prop: 'contactPhone',
    label: '联系人电话',
    search: { el: 'input' }
  }
];
// 单位其他信息
export const otherInfoColumnBasic = [
  {
    prop: 'creditCode',
    label: '统一社会信用代码',
    search: { el: 'input' }
  },
  {
    prop: 'industryType',
    label: '行业类型',
    enum: [],
    search: { el: 'select' }
  },
  {
    prop: 'regionCode',
    slot: 'regionCode',
    label: '所属地区',
    search: { el: 'input' }
  },
  {
    prop: 'economicType',
    label: '经济类型',
    search: { el: 'select' }
  },
  {
    prop: 'registerAddress',
    label: '单位注册地址',
    search: { el: 'input' }
  },
  {
    prop: 'enterpriseSize',
    label: '企业规模',
    search: { el: 'select' },
    enum: []
  },
  {
    prop: 'employeeTotalNum',
    label: '职工总人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'femaleEmployeeNum',
    label: '女职工总人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'productTotalNum',
    label: '生产工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'femaleProductNum',
    label: '生产女职工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'affectedTotalNum',
    label: '接害工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'femaleAffectedNum',
    label: '接害女职工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 } }
  },
  {
    prop: 'remark',
    label: '备注',
    search: { el: 'input' }
  }
];

// 单位部门信息维护
export const departColumnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'deptNo', label: '部门编码' },
  { prop: 'deptName', label: '部门名称' },
  { prop: 'deptManager', label: '部门负责人' },
  { prop: 'teamId', label: '上级单位' },
  { prop: 'updateTime', label: '更新时间' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 150 }
];

export const departColumnBasic = [
  { prop: 'teamId', label: '上级单位', search: { el: 'select' }, enum: [], slot: 'teamId' },
  { prop: 'deptNo', label: '部门编码', search: {}, slot: 'deptNo' },
  { prop: 'deptName', label: '部门名称', search: { el: 'input' } },
  { prop: 'deptManager', label: '部门负责人', search: { el: 'input' } }
];

export const departRulesBasic = {
  deptName: { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] }
};
