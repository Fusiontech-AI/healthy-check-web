import request from '@/utils/request';
/**
 * 查询体检单位结账列表
 */
export const teamSettleList = (params: any) => {
  return request({
    url: '/peis/teamSettle/list',
    method: 'GET',
    params
  });
};
/**
 * 查询体检单位信息列表
 */
export const teamInfoList = (params: any) => {
  return request({
    url: '/peis/teamInfo/list',
    method: 'GET',
    params
  });
};
/**
 * 查询团检任务管理列表
 */
export const teamTaskList = (params: any) => {
  return request({
    url: '/peis/teamTask/list',
    method: 'GET',
    params
  });
};
/**
 * 新增体检单位结账
 */
export const addTeamSettle = (params: any) => {
  return request({
    url: '/peis/teamSettle',
    method: 'POST',
    data: params
  });
};
/**
 * 体检单位结账开票
 */
export const teamInvoice = (params: any) => {
  return request({
    url: `/peis/teamSettle/teamInvoice/${params.ids}`,
    method: 'POST',
  });
};
/**
 * 体检单位结账作废
 */
export const teamInvalidSettle = (params: any) => {
  return request({
    url: `/peis/teamSettle/teamInvalidSettle/${params.ids}`,
    method: 'POST',
  });
};

/**
 * 体检单位结账发票作废
 */
export const teamInvalidInvoice = (params: any) => {
  return request({
    url: `/peis/teamSettle/teamInvalidInvoice/${params.ids}`,
    method: 'POST',
  });
};
/**
 * 删除体检单位结账
 */
export const deleteTeamSettle = (params: any) => {
  return request({
    url: `/peis/teamSettle/${params.ids}`,
    method: 'DELETE',
  });
};

