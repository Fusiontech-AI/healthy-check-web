// 表格行
export const columnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'ksCode', label: '科室代码', search: { el: 'input' }, isShow: false },
  { prop: 'ksName', label: '科室名称', search: { el: 'input' }, isShow: false },
  {
    prop: 'ksCode',
    label: '科室代码'
  },
  {
    prop: 'ksName',
    label: '科室名称'
  },
  {
    prop: 'ksSimplePy',
    label: '科室简称'
  },
  { prop: 'ksSort', label: '排序' },
  {
    prop: 'status',
    label: '是否启用',
    // fieldNames: { label: 'userLabel', value: 'userStatus' },
    render: (scope) => {
      return (
        <el-tag round type={scope.row.status === '0' ? 'success' : 'warning'}>
          {scope.row.status === '0' ? '是' : '否'}
        </el-tag>
      );
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 250 }
];
// 新增表单
export const formColumnsBasic = [
  {
    prop: 'ksCode',
    label: '科室编码',
    search: { el: 'input', props: { disabled: true } }
  },
  {
    prop: 'ksName',
    label: '科室名称',
    search: { el: 'input' }
  },
  {
    prop: 'ksSimplePy',
    label: '科室简称',
    search: { el: 'input' }
  },
  {
    prop: 'printFlag',
    label: '是否打印条码',
    search: { el: 'select' },
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' }
    ]
  },
  {
    prop: 'ksSort',
    label: '排序',
    search: { el: 'input-number', props: { min: 0, max: 9999, precision: 0 } }
  },
  {
    prop: 'status',
    label: '是否启用',
    search: { el: 'switch', props: { activeValue: '0', inactiveValue: '1' } },
    enum: [
      { label: '是', value: '0' },
      { label: '否', value: '1' }
    ]
  }
];

export const formRulesBasic = {
  ksName: [{ required: true, message: '请输入科室名称', trigger: ['change', 'blur'] }],
  ksSimplePy: [{ required: true, message: '请输入科室简称', trigger: ['change', 'blur'] }],
  ksSort: [{ required: true, message: '请输入排序', trigger: ['change', 'blur'] }]
};
