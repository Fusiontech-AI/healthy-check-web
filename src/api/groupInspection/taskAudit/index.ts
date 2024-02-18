import request from '@/utils/request';
/**
 * 查询团检任务管理列表
 */
export const getTeamTaskList = (params: any) => {
  return request({
    url: '/peis/teamTask/list',
    method: 'GET',
    params
  });
};

/**
 * 团检任务审核人员列表
 */
export const queryTaskReviewDetail = (id:any) => {
  return request({
    url: `/peis/teamTask/queryTaskReviewDetail/${id}`,
    method: 'GET',
  });
};

/**
 * 团检任务审核分组信息
 */
export const queryTaskReviewGroup = (params: any) => {
  return request({
    url: '/peis/teamTask/queryTaskReviewGroup',
    method: 'GET',
    params
  });
};

/**
 * 团检任务审核人员列表
 */
export const queryTaskReviewRegister = (params: any) => {
  return request({
    url: '/peis/teamTask/queryTaskReviewRegister',
    method: 'GET',
    params
  });
};

/**
 * 团检任务审核
 */
export const reviewTask = (data: any) => {
  return request({
    url: '/peis/teamTask/reviewTask',
    method: 'post',
    data
  });
};

/**
 * 保存人员信息
 */
export const insertRegisterData = (data: any) => {
  return request({
    url: '/peis/teamTask/insertRegisterData',
    method: 'post',
    data
  });
};

/**
 * 获取体检人员登记信息详细信息
 */
export const getRegisterById = (id: any) => {
  return request({
    url: `/peis/register/${id}`,
    method: 'get',
  });
};