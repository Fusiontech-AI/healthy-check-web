// 单位基础信息
export const basicInfoColumnBasic = [
  {
    prop: 'teamLevel',
    label: '单位级别',
    search: { el: 'select' },
    enum: []
  },
  {
    prop: 'parentId',
    label: '关联上级单位',
    search: { el: 'select' }
  },
  {
    prop: 'teamNo',
    label: '单位编号',
    search: { el: 'input' }
  },
  {
    prop: 'teamName',
    label: '单位名称',
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
    enum: [],
    search: { el: 'select' }
  },
  {
    prop: 'industryType',
    label: '行业类型',
    search: { el: 'select' }
  },
  {
    prop: 'regionCode',
    label: '所属地区',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '经济类型',
    search: { el: 'input' }
  },
  {
    prop: 'registerAddress',
    label: '单位注册地址',
    search: { el: 'input' }
  },
  {
    prop: 'enterpriseSize',
    label: '企业规模',
    search: { el: 'input' }
  },
  {
    prop: 'employeeTotalNum',
    label: '职工总人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '女职工总人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '生产工人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '生产女职工人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '接害工人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '接害女职工人数',
    search: { el: 'input' }
  },
  {
    prop: 'name',
    label: '备注',
    search: { el: 'input' }
  }
];

// 单位部门信息维护
export const departColumnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'ksCode', label: '部门编码' },
  { prop: 'ksName', label: '部门名称' },
  { prop: 'ksSimplePy', label: '部门负责人' },
  { prop: 'unit', label: '上级单位' },
  { prop: 'peType', label: '更新时间' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 250 }
];

export const departColumnBasic = [
  { prop: 'f1', label: '上级单位', search: { el: 'input' } },
  { prop: 'f2', label: '部门编码', search: { el: 'input' } },
  { prop: 'f3', label: '部门名称', search: { el: 'input' } },
  { prop: 'f4', label: '部门负责人', search: { el: 'input' } }
];
