const healthyCheckStatusMap = {
  '0': {
    label: '预约',
    color: '#2175FF',
    bg: '#E1ECFF'
  },
  '1': {
    label: '登记',
    color: '#FFA81C',
    bg: '#FFF3E0'
  },
  '2': {
    label: '科室分检',
    color: '#8A7AFF',
    bg: '#EFEDFF'
  },
  '3': {
    label: '分检完成',
    color: '#21CDE4',
    bg: '#DEF9FC'
  },
  '4': {
    label: '待总检',
    color: '#F96E6E',
    bg: '#E2FFF1'
  },
  '5': {
    label: '已终检',
    color: '#38D497',
    bg: '#FFEBEB'
  }
} as any;

export const basicInfoColumnBasic = (bus_healthy_check_status: any, sys_user_sex: any, teamIdList: any, teamTaskLists: any) => [
  {
    prop: 'teamId',
    label: '单位',
    search: { el: 'tree-select', props: { checkStrictly: true, label: 'teamName', value: 'id' } },
    enum: teamIdList,
    slot: 'teamId'
  },
  {
    prop: 'taskId',
    label: '任务',
    search: { el: 'select' },
    enum: teamTaskLists,
    fieldNames: { label: 'taskName', value: 'id' }
  },
  {
    prop: 'healthyCheckCode',
    label: '体检号',
    search: { el: 'input' }
  },
  {
    prop: 'registerTime',
    label: '报道日期',
    search: {
      el: 'date-picker',
      props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' }
      // defaultValue: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
  },
  {
    prop: 'healthyCheckStatus',
    label: '体检状态',
    search: { el: 'select' },
    enum: bus_healthy_check_status
  },
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'input' }
  },
  {
    prop: 'gender',
    label: '性别',
    search: { el: 'select' },
    enum: sys_user_sex
  },
  {
    prop: 'credentialNumber',
    label: '身份证号',
    search: { el: 'input' }
  }
];

// 表格行
export const columnsBasic = [
  { type: 'selection', fixed: 'left', width: 70 },
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left', align: 'left' },
  { prop: 'recordCode', label: '档案号', width: 170, fixed: 'left', align: 'left' },
  { prop: 'credentialNumber', label: '证件号', width: '170', fixed: 'left', align: 'left' },
  {
    prop: 'businessCategory',
    label: '业务类别',
    width: '100',
    enum: [
      { label: '个检', value: '1' },
      { label: '团检', value: '2' }
    ],
    align: 'left'
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    width: '100',
    enum: [
      { label: '健康体检', value: 'JKTJ' },
      { label: '职业健康体检', value: 'ZYJKTJ' },
      { label: '放射体检', value: 'FSTJ' },
      { label: '老年人体检', value: 'LNRTJ' },
      { label: '入职体检', value: 'RZTJ' },
      { label: '学生体检', value: 'XSTJ' }
    ],
    align: 'left'
  },
  { prop: 'name', label: '姓名', align: 'left' },
  {
    prop: 'marriageStatus',
    label: '婚否',
    enum: [
      { label: '未婚', value: '0' },
      { label: '已婚', value: '1' },
      { label: '未知', value: '2' }
    ],
    align: 'left'
  },
  { prop: 'age', label: '年龄', align: 'left' },
  { prop: 'phone', label: '电话', width: '120', align: 'left' },
  { prop: 'healthyCheckTime', label: '体检日期', width: '120', align: 'left' },
  {
    prop: 'guideSheetReceived',
    label: '回收',
    render: (scope: any) => <>{scope.row.guideSheetReceived === '0' ? '是' : scope.row.guideSheetReceived === '1' ? '否' : ''}</>,
    align: 'left'
  },
  {
    prop: 'freezeStatus',
    label: '冻结',
    render: (scope: any) => <>{scope.row.freezeStatus === '0' ? '是' : scope.row.freezeStatus === '1' ? '否' : ''}</>,
    align: 'left'
  },
  {
    prop: 'healthyCheckStatus',
    label: '体检状态',
    width: '120',
    render: (scope: any) => {
      return (
        <>
          {scope.row.healthyCheckStatus ? (
            <span
              style={{
                color: healthyCheckStatusMap[scope.row.healthyCheckStatus].color,
                background: healthyCheckStatusMap[scope.row.healthyCheckStatus].bg,
                padding: '4px 8px',
                borderRadius: '2px'
              }}
            >
              {healthyCheckStatusMap[scope.row.healthyCheckStatus].label}
            </span>
          ) : (
            <span>{scope.row.healthyCheckStatus}</span>
          )}
        </>
      );
    },
    align: 'left'
  },
  {
    prop: 'needGeneralReview',
    label: '需要总检',
    width: '120',
    render: (scope: any) => <>{scope.row.needGeneralReview === '0' ? '是' : scope.row.needGeneralReview === '1' ? '否' : ''}</>,
    align: 'left'
  },
  {
    prop: 'costType',
    label: '人员费别',
    width: '120',
    render: (scope: any) => <>{scope.row.needGeneralReview === '1' ? '计费' : scope.row.needGeneralReview === '2' ? '全免' : '--'}</>,
    enums: [
      { label: '计费', value: '1' },
      { label: '全免', value: '2' }
    ],
    align: 'left'
  },
  { prop: 'teamAmount', label: '团费', align: 'left' },
  { prop: 'personAmount', label: '个费', align: 'left' },
  { prop: 'teamName', label: '单位', width: '120', align: 'left' },
  { prop: 'groupName', label: '分组', width: '120', align: 'left' },
  { prop: 'deptName', label: '部门', align: 'left' },
  { prop: 'introducerName', label: '介绍人', align: 'left' },
  { prop: 'createBy', label: '创建人', align: 'left' },
  { prop: 'registerDoctorName', label: '报到人', align: 'left' },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: '100', align: 'left' },
  { prop: 'generalReviewTime', label: '总检时间', width: '100', align: 'left' },
  { prop: 'auditDoctor', label: '审核医生', width: '100', align: 'left' },
  { prop: 'auditTime', label: '审核时间', width: '100', align: 'left' },
  { prop: 'finishTime', label: '完成时间', width: '100', align: 'left' }
];
