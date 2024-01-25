import request from '@/utils/request';
/**
 * 获取职业病字典树形
 */
 export const getHazardFactorsTree = (params:any) => {
  return request({
    url: 'peis/factorsRequire/getHazardFactorsTree',
    method: 'GET',
    params
  });
};

/**
 * 查询危害因素必检项目主列表
 */
export const hazardFactorsQuery = (data:any) => {
  return request({
    url: '/peis/factorsRequire/hazardFactorsQuery',
    method: 'post',
    data
  });
};

/**
 * 危害因素必检项目新增或修改
 */
export const saveOrUpdate = (data:any) => {
  return request({
    url: '/peis/factorsRequire/saveOrUpdate',
    method: 'post',
    data
  });
};

/**
 * 获取危害因素必检项目主详细信息
 */
export const hazardFactorsDetail = (params:any) => {
  return request({
    url: '/peis/factorsRequire/hazardFactorsDetail',
    method: 'get',
    params
  });
};

/**
 * 删除危害因素必检项目主
 */
export const batchDeleteByIds = (params:any) => {
  return request({
    url: '/peis/factorsRequire/batchDeleteByIds',
    method: 'POST',
    data: params
  });
};