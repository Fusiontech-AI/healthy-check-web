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
/**
 * 根据危害因素编码、在岗状态查询必检项目
 */
export const queryItemByFactorsCodeAndDutyStauts = (params: any) => {
  return request({
    url: `/peis/factorsRequire/queryItemByFactorsCodeAndDutyStauts`,
    method: 'POST',
    data: params
  });
};
/**
 * 查询必检组合项目
 */
export const queryCompulsoryInspectionProject = (params: any) => {
  return request({
    url: `/peis/combinationProject/queryCompulsoryInspectionProject`,
    method: 'POST',
    data: params
  });
};
/**
 * 查询其他必检组合项目
 */
export const queryOtherCompulsoryInspection = (params: any) => {
  return request({
    url: `/peis/combinationProject/queryOtherCompulsoryInspection`,
    method: 'POST',
    data: params
  });
};
/**
 * 查询组合项目下基础项目信息
 */
export const queryBasicListByCombinIds = (params: any) => {
  return request({
    url: `/peis/combinationProjectInfo/queryBasicListByCombinIds`,
    method: 'POST',
    data: params
  });
};
/**
 * 体检套餐批量禁用
 */
export const batchDisable = (params: any) => {
  return request({
    url: `/peis/package/batchDisable/${params.ids}`,
    method: 'GET'
  });
};
