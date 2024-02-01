import request from '@/utils/request';

// 查询团检任务管理列表
export const teamTaskList = (params: any) => {
  return request({
    url: '/peis/teamTask/list',
    method: 'get',
    params
  });
};
// 查询体检单位信息列表
export const teamInfoList = (params: any) => {
  return request({
    url: '/peis/teamInfo/list',
    method: 'get',
    params
  });
};
// 新增团检任务管理
export const peisTeamTask = (params: any) => {
  return request({
    url: '/peis/teamTask',
    method: 'POST',
    data: params
  });
};
// 修改团检任务管理
export const peisTeamTaskUpdate = (params: any) => {
  return request({
    url: '/peis/teamTask',
    method: 'PUT',
    data: params
  });
};
// 获取团检任务管理详细信息
export const teamTaskDetail = (params: any) => {
  return request({
    url: `/peis/teamTask/${params.id}`,
    method: 'GET'
  });
};
// 获取团检分组信息详细信息
export const teamGroupDetail = (params: any) => {
  return request({
    url: `/peis/teamGroup/${params.id}`,
    method: 'GET'
  });
};
