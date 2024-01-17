import request from '@/utils/request';
/**
 * 查询字典
 */
 export const systemList = (params:any) => {
  return request({
    url: '/system/dict/data/list',
    method: 'GET',
    params
  });
};
/**
 * 查询体检样本列表
 */
 export const sampleList = (params:any) => {
  return request({
    url: '/peis/sample/list',
    method: 'GET',
    params
  });
};
/**
 * 新增体检样本
 */
 export const addSample = (params:any) => {
  return request({
    url: '/peis/sample',
    method: 'POST',
    data:params
  });
};

