import request from '@/utils/request';
/**
 * 查询体检套餐列表
 */
export const packageList = (params: any) => {
  return request({
    url: `/peis/package/list`,
    method: 'GET',
    params
  });
};
/**
 * 删除体检套餐
 */
export const packageDel = (params: any) => {
  return request({
    url: `/peis/package/${params.ids}`,
    method: 'DELETE'
  });
};
/**
 * 新增体检套餐
 */
export const packageAdd = (params: any) => {
  return request({
    url: `/peis/package`,
    method: 'POST',
    data: params
  });
};
