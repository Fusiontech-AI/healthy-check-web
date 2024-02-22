// 手机号码校验
var validatePhone = (rule, value, callback) => {
  const pattern = /^1[34578][0-9]{9}$/;
  if (!value) {
    callback();
  }
  if (!pattern.test(value)) {
    callback(new Error('请输入正确的电话号码'));
  }
  callback();
};

//单位基础信息校验
export const basciInfoRules = {
  teamLevel: { required: true, message: '请选择单位级别', trigger: ['blur', 'change'] },
  parentId: { required: true, message: '请选择关联上级单位', trigger: ['blur', 'change'] },
  teamNo: { required: true, message: '请输入单位编号', trigger: ['blur', 'change'] },
  teamName: { required: true, message: '请输入单位名称', trigger: ['blur', 'change'] },
  phoneticCode: { required: true, message: '请输入拼音简码', trigger: ['blur', 'change'] },
  contactPhone: { required: false, trigger: ['blur', 'change'], validator: validatePhone }
};
