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