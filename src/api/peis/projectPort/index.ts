import request from '@/utils/request';
/**
 * 查询体检组合项目列表
 */
export const combinationProjectList = (params: any) => {
  return request({
    url: `/peis/combinationProject/list`,
    method: 'GET',
    params
  });
};
/**
 * 体检套餐动态算费(通用版)
 */
export const commonDynamicBilling = (params: any) => {
  return request({
    url: `/peis/package/commonDynamicBilling`,
    method: 'POST',
    data: params
  });
};
