import request from '@/utils/request';
/**
 * 查询体检人员登记信息列表
 */
export const registerPage = (params: any) => {
  return request({
    url: '/peis/register/page',
    method: 'GET',
    params
  });
};
/**
 * 新增体检人员登记信息
 */
export const registerAdd = (params: any) => {
  return request({
    url: '/peis/register',
    method: 'POST',
    data: params
  });
};
/**
 * 体检项目登记(或变更)
 */
export const registerChangeRegCombin = (params: any) => {
  return request({
    url: '/peis/register/changeRegCombin',
    method: 'POST',
    data: params
  });
};
/**
 * 获取体检人员登记信息详细信息
 */
export const registerInfo = (params: any) => {
  return request({
    url: `/peis/register/${params.id}`,
    method: 'GET'
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
