import request from '@/utils/request';
/**
 * 每日体检者概览
 */
export const dailyPhysicalOverview = (params: any) => {
  return request({
    url: '/peis/statistics/dailyPhysicalOverview',
    method: 'POST',
    data: params
  });
};
/**
 * 每日体检者概览导出
 */
export const dailyPhysicalOverviewExport = (params: any) => {
  return request({
    url: '/peis/statistics/dailyPhysicalOverviewExport',
    method: 'POST',
    responseType: 'blob',
    data: params
  });
};
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
 * 查询团检分组信息列表
 */
export const teamGroupList = (params: any) => {
  return request({
    url: '/peis/teamGroup/list',
    method: 'GET',
    params
  });
};