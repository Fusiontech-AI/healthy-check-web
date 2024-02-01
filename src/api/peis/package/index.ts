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
/**
 * 获取体检套餐详细信息
 */
export const packageDetail = (params: any) => {
  return request({
    url: `/peis/package/${params.id}`,
    method: 'GET'
  });
};
/**
 * 修改体检套餐
 */
export const packageUpload = (params: any) => {
  return request({
    url: `/peis/package`,
    method: 'PUT',
    data: params
  });
};
/**
 * 查询体检组合项目详细信息列表
 */
export const packageInfoList = (params: any) => {
  return request({
    url: `/peis/packageInfo/list`,
    method: 'GET',
    params
  });
};
