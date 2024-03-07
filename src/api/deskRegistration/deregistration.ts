import request from '@/utils/request';
/**
 * 查询体检人员登记信息列表
 */
export const getRegisterPage = (params: any) => {
  return request({
    url: '/peis/register/page',
    method: 'GET',
    params
  });
};

/**
 * 体检人员再次登记
 */
export const reRegistration = (ids: any) => {
  return request({
    url: `/peis/register/reRegistration/${ids}`,
    method: 'PUT'
  });
};

/**
 * 合并档案
 */
export const mergeArchives = (data: any) => {
  return request({
    url: `/peis/register/mergeArchives`,
    method: 'POST',
    data
  });
};

/**
 * 根据登记id查询组合项目列表
 */
export const queryRegCombinProjectList = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/queryRegCombinProjectList`,
    method: 'GET',
    params
  });
};

/**
 * 根据登记组合项目主键id查询基础项目列表
 */
export const queryRegBasicProjectList = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/queryRegBasicProjectList`,
    method: 'GET',
    params
  });
};
