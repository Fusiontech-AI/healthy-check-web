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
 * 编辑体检样本
 */
 export const updataSample = (params:any) => {
  return request({
    url: '/peis/sample',
    method: 'PUT',
    data:params
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
/**
 * 批量修改体检样本类别
 */
 export const batchUpdateCategory = (params:any) => {
  return request({
    url: '/peis/sample/batchUpdateCategory',
    method: 'POST',
    data:params
  });
};
/**
 * 批量禁用体检样本
 */
 export const batchDisableApi = (params:any) => {
  return request({
    url: `/peis/sample/batchDisable/${params.ids}`,
    method: 'GET',
  });
};

/**
 * 根据样本id查询样本下的项目列表信息
 */
 export const getCombinProjectBySampleId = (params:any) => {
  return request({
    url: `/peis/sample/getCombinProjectBySampleId/${params.id}`,
    method: 'GET',
  });
};


/**
 * 根据样本id新增和修改样本下的项目列表信息
 */
 export const updateCombinProjectBySampleId = (params:any) => {
  return request({
    url: '/peis/sample/updateCombinProjectBySampleId',
    method: 'POST',
    data:params
  });
};

/**
 * 查询体检组合项目列表
 */
 export const combinationProjectList = (params:any) => {
  return request({
    url: '/peis/combinationProject/list',
    method: 'GET',
    params
  });
};


/**
 * 查询体检科室列表
 */
 export const tjksList = (params:any) => {
  return request({
    url: '/peis/tjks/list',
    method: 'GET',
    params
  });
};

/**
 * 查询体检基础项目列表
 */
 export const basicProjectList = (params:any) => {
  return request({
    url: '/peis/basicProject/list',
    method: 'GET',
    params
  });
};

/**
 * 新增体检基础项目
 */
 export const addBasicProject = (params:any) => {
  return request({
    url: '/peis/basicProject',
    method: 'POST',
    data:params
  });
};

/**
 * 修改体检基础项目
 */
 export const updataBasicProject = (params:any) => {
  return request({
    url: '/peis/basicProject',
    method: 'PUT',
    data:params
  });
};

/**
 * 删除体检基础项目
 */
 export const deleteBasicProject = (params:any) => {
  return request({
    url: `/peis/basicProject/${params.ids}`,
    method: 'DELETE',
  });
};

/**
 * 查询体检基础项目参考信息列表
 */
 export const basicProjectRefList = (params:any) => {
  return request({
    url: '/peis/basicProjectRef/list',
    method: 'GET',
    params
  });
};

/**
 * 新增体检基础项目参考信息
 */
 export const addBasicProjectRef = (params:any) => {
  return request({
    url: '/peis/basicProjectRef',
    method: 'POST',
    data:params
  });
};
/**
 * 删除体检基础项目参考信息
 */
 export const deleteBasicProjectRef = (params:any) => {
  return request({
    url: `/peis/basicProjectRef/${params.ids}`,
    method: 'DELETE',
  });
};
