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