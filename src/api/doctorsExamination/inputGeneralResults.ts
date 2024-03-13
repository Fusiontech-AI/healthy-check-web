import request from '@/utils/request';

// 根据组合项目主键id查询基础项目列表
export const queryRegBasicProjectList = (params: any) => {
  return request({
    url: '/peis/regCombinationProject/queryRegBasicProjectList',
    method: 'get',
    params
  });
};

// 体检项目诊断结果保存
export const saveDiagnosis = (params: any) => {
  return request({
    url: '/peis/register/saveDiagnosis',
    method: 'post',
    data: params
  });
};

// 查询体检登记基础项目小结列表
export const getProjectSummaryList = (params: any) => {
  return request({
    url: '/peis/regProjectSummary/summaryList',
    method: 'post',
    data: params
  });
};

// 新增体检登记基础项目小结
export const addRegProjectSummary = (params: any) => {
  return request({
    url: '/peis/regProjectSummary',
    method: 'post',
    data: params
  });
};