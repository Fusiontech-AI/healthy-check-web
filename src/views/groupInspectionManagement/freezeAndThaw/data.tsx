enum healthyCheckStatusColorEnum {
  '预约' = '#2175FF',
  '登记' = '#FFA81C',
  '科室分检' = '#8A7AFF',
  '分检完成' = '#21CDE4',
  '待总检' = '#F96E6E',
  '已终检' = '#38D497'
}
enum healthyCheckStatusBgEnum {
  '预约' = '#E1ECFF',
  '登记' = '#FFF3E0',
  '科室分检' = '#FFF3E0',
  '分检完成' = '#DEF9FC',
  '待总检' = '#E2FFF1',
  '已终检' = '#FFEBEB'
}

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
    search: { el: 'tree-select', props: { checkStrictly: true, label: 'teamName' } },
    enum: teamIdList,
    fieldNames: { label: 'teamName', value: 'id' }
  },
  {
    prop: 'taskId',
    label: '任务',
    search: { el: 'select' },
    enum: teamTaskLists
  },
  {
    prop: 'healthyCheckCode',
    label: '体检号',
    search: { el: 'input' }
  },
  {
    prop: 'registerTime',
    label: '报道日期',
    search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }
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
  { prop: 'healthyCheckCode', label: '体检号', fixed: 'left' },
  { prop: 'recordCode', label: '档案号', width: '120', fixed: 'left' },
  { prop: 'credentialNumber', label: '证件号', width: '170', fixed: 'left' },
  {
    prop: 'businessCategory',
    label: '业务类别',
    width: '100',
    enum: [
      { label: '个检', value: '1' },
      { label: '团检', value: '2' }
    ]
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
    ]
  },
  { prop: 'name', label: '姓名' },
  {
    prop: 'marriageStatus',
    label: '婚否',
    enum: [
      { label: '未婚', value: '0' },
      { label: '已婚', value: '1' },
      { label: '未知', value: '2' }
    ]
  },
  { prop: 'age', label: '年龄' },
  { prop: 'phone', label: '电话', width: '120' },
  { prop: 'healthyCheckTime', label: '体检日期', width: '120' },
  {
    prop: 'guideSheetReceived',
    label: '回收',
    render: (scope: any) => <>{scope.row.guideSheetReceived === '0' ? '是' : scope.row.guideSheetReceived === '1' ? '否' : ''}</>
  },
  {
    prop: 'freezeStatus',
    label: '冻结',
    render: (scope: any) => <>{scope.row.freezeStatus === '0' ? '是' : scope.row.freezeStatus === '1' ? '否' : ''}</>
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
    }
  },
  {
    prop: 'needGeneralReview',
    label: '需要总检',
    width: '120',
    render: (scope: any) => <>{scope.row.needGeneralReview === '0' ? '是' : scope.row.needGeneralReview === '1' ? '否' : ''}</>
  },
  {
    prop: 'costType',
    label: '人员费别',
    width: '120',
    render: (scope: any) => <>{scope.row.needGeneralReview === '1' ? '计费' : scope.row.needGeneralReview === '2' ? '全免' : '--'}</>,
    enums: [
      { label: '计费', value: '1' },
      { label: '全免', value: '2' }
    ]
  },
  { prop: 'teamAmount', label: '团费' },
  { prop: 'personAmount', label: '个费' },
  { prop: 'teamName', label: '单位', width: '120' },
  { prop: 'groupName', label: '分组', width: '120' },
  { prop: 'deptName', label: '部门' },
  { prop: 'introducerName', label: '介绍人' },
  { prop: 'createBy', label: '创建人' },
  { prop: 'registerDoctorName', label: '报到人' },
  { prop: 'generalReviewDoctorName', label: '总检医生', width: '100' },
  { prop: 'generalReviewTime', label: '总检时间', width: '100' },
  { prop: 'auditDoctor', label: '审核医生', width: '100' },
  { prop: 'auditTime', label: '审核时间', width: '100' },
  { prop: 'finishTime', label: '完成时间', width: '100' }
];
