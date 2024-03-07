import request from '@/utils/request';
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
 * 新增体检人员登记信息
 */
export const registerAdd = (params: any) => {
  return request({
    url: '/peis/register',
    method: 'POST',
    data: params
  });
};
/**
 * 体检项目登记(或变更)
 */
export const registerChangeRegCombin = (params: any) => {
  return request({
    url: '/peis/register/changeRegCombin',
    method: 'POST',
    data: params
  });
};
/**
 * 获取体检人员登记信息详细信息
 */
export const registerInfo = (params: any) => {
  return request({
    url: `/peis/register/${params.id}`,
    method: 'GET'
  });
};
/**
 * 根据登记id查询组合项目列表
 */
export const queryRegCombinProjectList = (params: any) => {
  return request({
    url: `/peis/regCombinationProject/queryRegCombinProjectList`,
    method: 'GET',
    params
  });
};
/**
 * 修改体检人员登记信息
 */
export const registerUpdate = (params: any) => {
  return request({
    url: `/peis/register`,
    method: 'PUT',
    data: params
  });
};
/**
 * 查询该证件号第几次体检
 */
export const registerGetPeTimes = (params: any) => {
  return request({
    url: `/peis/register/getPeTimes`,
    method: 'POST',
    data: params
  });
};
/**
 * 体检替检登记
 */
export const changeRegReplaceInfo = (params: any) => {
  return request({
    url: `/peis/register/changeRegReplaceInfo`,
    method: 'POST',
    data: params
  });
};
/**
 * 报告领取方式信息登记
 */
export const changeReportReceiveWay = (params: any) => {
  return request({
    url: `/peis/register/changeReportReceiveWay`,
    method: 'POST',
    data: params
  });
};
/**
 * 团转个接口
 */
export const registerTeamToPerson = (params: any) => {
  return request({
    url: `/peis/register/teamToPerson`,
    method: 'POST',
    data: params
  });
};
/**
 * 个转团
 */
export const registerPersonToTeam = (params: any) => {
  return request({
    url: `/peis/register/personToTeam`,
    method: 'POST',
    data: params
  });
};
/**
 * 删除体检人员登记信息
 */
export const registerDel = (params: any) => {
  return request({
    url: `/peis/register/${params.ids}`,
    method: 'DELETE'
  });
};
/**
 * 体检项目批量报到
 */
export const registerBatchReport = (params: any) => {
  return request({
    url: `peis/register/batchReport`,
    method: 'POST',
    data: params
  });
};
