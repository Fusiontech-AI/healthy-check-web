import { param } from './../../../utils/index';
import request from '@/utils/request';
/**
 * 根据条件查询单个体检人员信息
 */
export const registerGetSingleInfo = (params: any) => {
  return request({
    url: '/peis/register/getSingleInfo',
    method: 'GET',
    params
  });
};
/**
 * 查询体检人员综合项目信息列表
 */
export const regCombinationProjectList = (params: any) => {
  return request({
    url: '/peis/regCombinationProject/list',
    method: 'GET',
    params
  });
};
/**
 * 体检人员批量放弃综合项目
 */
export const abandonProjects = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/abandonProjects/${params.ids}`,
    method: 'PUT'
  });
};
/**
 * 体检人员批量延期综合项目
 */
export const delayProjects = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/delayProjects`,
    method: 'PUT',
    data: params
  });
};
/**
 * 保存或撤回电子导检单
 */
export const saveOrWithdrawGuideSheet = (params: any) => {
  return request({
    url: `/peis/guideSheetLog/saveOrWithdrawGuideSheet`,
    method: 'PUT',
    params
  });
};
/**
 * 恢复
 */
export const regCombinationProjectRestoreProjects = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/restoreProjects/${params.ids}`,
    method: 'PUT'
  });
};
/**
 * 获取电子导检单列表
 */
export const guideSheetLogList = (params: any) => {
  return request({
    url: `/peis/guideSheetLog/list`,
    method: 'GET',
    params
  });
};
/**
 * 删除电子导检单
 */
export const guideSheetLogDel = (params: any) => {
  return request({
    url: `/peis/guideSheetLog/${params.ids}`,
    method: 'DELETE'
  });
};
/**
 * 修改体检人员登记信息
 */
export const register = (params: any) => {
  return request({
    url: `/peis/register`,
    method: 'PUT',
    data: params
  });
};
