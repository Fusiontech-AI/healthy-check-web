// 单位基础信息
export const basicInfoColumnBasic = (showParentId) => [
  {
    prop: 'teamLevel',
    label: '单位级别',
    slot: 'teamLevel',
    search: { el: 'select', placeholder: '请选择单位级别' },
    enum: []
  },
  {
    prop: 'parentId',
    slot: 'parentId',
    label: '关联上级单位',
    disabled: true,
    isShowSearch: showParentId,
    search: { el: 'select', props: { disabled: true }, isShow: false }
  },
  {
    prop: 'teamNo',
    label: '单位编号',
    search: { el: 'input', props: { disabled: true }, placeholder: '单位编号根据单位级别自动生成' }
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
    search: { el: 'input', placeholder: '请输入单位简称' }
  },
  {
    prop: 'phoneticCode',
    label: '拼音简码',
    search: { el: 'input', placeholder: '请输入拼音简码' }
  },
  {
    prop: 'contactName',
    label: '联系人姓名',
    search: { el: 'input', placeholder: '请输入联系人姓名' }
  },
  {
    prop: 'contactPhone',
    label: '联系人电话',
    search: { el: 'input', placeholder: '请输入联系人电话' }
  }
];
// 单位其他信息
export const otherInfoColumnBasic = [
  {
    prop: 'creditCode',
    label: '统一社会信用代码',
    search: { el: 'input', placeholder: '请输入统一社会信用代码' }
  },
  {
    prop: 'industryType',
    label: '行业类型',
    enum: [],
    search: { el: 'select', placeholder: '请选择行业类型' }
  },
  {
    prop: 'regionCode',
    slot: 'regionCode',
    label: '所属地区',
    search: { el: 'input', placeholder: '请输入所属地区进行检索' }
  },
  {
    prop: 'economicType',
    label: '经济类型',
    search: { el: 'select', placeholder: '请选择经济类型' }
  },
  {
    prop: 'registerAddress',
    label: '单位注册地址',
    search: { el: 'input', placeholder: '请输入单位注册地址' }
  },
  {
    prop: 'enterpriseSize',
    label: '企业规模',
    search: { el: 'select', placeholder: '请选择企业规模' },
    enum: []
  },
  {
    prop: 'employeeTotalNum',
    label: '职工总人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入职工总人数' }
  },
  {
    prop: 'femaleEmployeeNum',
    label: '女职工总人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入女职工总人数' }
  },
  {
    prop: 'productTotalNum',
    label: '生产工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入生产工人数' }
  },
  {
    prop: 'femaleProductNum',
    label: '生产女职工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入生产女职工人数' }
  },
  {
    prop: 'affectedTotalNum',
    label: '接害工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入接害工人数' }
  },
  {
    prop: 'femaleAffectedNum',
    label: '接害女职工人数',
    search: { el: 'input-number', props: { min: 0, precision: 0 }, placeholder: '请输入接害女职工人数' }
  },
  {
    prop: 'remark',
    label: '备注',
    search: { el: 'input', props: { type: 'textarea', showWordLimit: true, maxlength: 100 }, placeholder: '请输入备注' }
  }
];

// 单位部门信息维护
export const departColumnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'deptNo', label: '部门编码', align: 'left' },
  { prop: 'deptName', label: '部门名称', align: 'left' },
  { prop: 'deptManager', label: '部门负责人', align: 'left' },
  { prop: 'teamName', label: '上级单位', align: 'left', width: 280 },
  { prop: 'updateTime', label: '更新时间', align: 'left', width: 170 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 150, align: 'left' }
];

export const departColumnBasic = [
  { prop: 'teamId', label: '上级单位', search: { el: 'select' }, enum: [], slot: 'teamId' },
  { prop: 'deptNo', label: '部门编码', search: {}, slot: 'deptNo' },
  { prop: 'deptName', label: '部门名称', search: { el: 'input', placeholder: '请输入部门名称' } },
  { prop: 'deptManager', label: '部门负责人', search: { el: 'input', placeholder: '请输入部门负责人' } }
];

export const departRulesBasic = {
  deptName: { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] }
};
