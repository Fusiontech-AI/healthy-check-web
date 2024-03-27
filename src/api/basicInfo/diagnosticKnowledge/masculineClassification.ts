import request from '@/utils/request';

/**
 * 查询体检阳性分类列表
 */
export const getYxTypeList = (params: any) => {
  return request({
    url: '/peis/yxType/list',
    method: 'GET',
    params
  });
};

/**
 * 阳性分类List查询
 */
export const getTjYxTypedList = (data: any) => {
  return request({
    url: '/peis/yxType/getTjYxTypedList',
    method: 'POST',
    data
  });
};

/**
 * 阳性分类新增/编辑
 */
export function addOrEditTjYxType(params: any) {
  return request({
    url: '/peis/yxType',
    method: params.id ? 'put' : 'post',
    data: params
  })
}


/**
 * 删除体检阳性分类
 */
export const delYxType = (ids: any) => {
  return request({
    url: `/peis/yxType/${ids}`,
    method: 'DELETE',
  });
};
