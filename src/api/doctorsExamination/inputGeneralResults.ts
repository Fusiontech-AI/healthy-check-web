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

// 删除体检登记基础项目小结
export const delRegProjectSummary = (ids: any) => {
  return request({
    url: `/peis/regProjectSummary/${ids}`,
    method: 'DELETE',
    // data: params
  });
};

// 体检人员批量放弃综合项目
export const abandonProjects = (ids: any) => {
  return request({
    url: `/peis/regCombinationProject/abandonProjects/${ids}`,
    method: 'PUT',
    // data: params
  });
};

// 查询体检登记基础项目阳性记录列表
export const getProjectPositiveList = (params: any) => {
  return request({
    url: '/peis/regProjectPositive/positiveList',
    method: 'post',
    data: params
  });
};

// 新增体检登记基础项目阳性记录
export const addProjectPositive = (params: any) => {
  return request({
    url: '/peis/regProjectPositive',
    method: 'post',
    data: params
  });
};


// 删除体检登记基础项目阳性记录
export const delRegProjectPositiv = (ids: any) => {
  return request({
    url: `/peis/regProjectPositive/${ids}`,
    method: 'DELETE',
    // data: params
  });
};

// 查询诊断建议主列表
export const getZdjyList = (params: any) => {
  return request({
    url: '/peis/zdjywh/list',
    method: 'get',
    params
  });
};