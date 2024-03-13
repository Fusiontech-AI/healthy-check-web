import { param } from './../../../utils/index';
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
// 修改任务项目分组信息
export const updateGroupProjectInfo = (params: any) => {
  return request({
    url: '/peis/teamGroup/updateGroupProjectInfo',
    method: 'POST',
    data: params
  });
};
// 删除团检任务管理
export const teamTaskDel = (params: any) => {
  return request({
    url: `/peis/teamTask/${params.ids}`,
    method: 'DELETE'
  });
};
// 新增体检单位任务文件
export const teamTaskFile = (params: any) => {
  return request({
    url: `/peis/teamTaskFile`,
    method: 'POST',
    data: params
  });
};
// 查询体检单位任务文件列表
export const teamTaskFileList = (params: any) => {
  return request({
    url: `/peis/teamTaskFile/list`,
    method: 'GET',
    params
  });
};
// 团检任务校验分组数据
export const teamTaskVerifyGroupData = (params: any) => {
  return request({
    url: `/peis/teamTask/verifyGroupData`,
    method: 'POST',
    data: params
  });
};
// 团检任务校验分组数据
export const teamTaskVerifyGroupPackageData = (params: any) => {
  return request({
    url: `/peis/teamTask/verifyGroupPackageData`,
    method: 'POST',
    data: params
  });
};
// 删除体检单位任务文件
export const teamTaskFileDel = (params: any) => {
  return request({
    url: `/peis/teamTaskFile/${params.ids}`,
    method: 'DELETE'
  });
};
// 获取体检单位任务文件详细信息
export const teamTaskFileInfo = (params: any) => {
  return request({
    url: `/peis/teamTaskFile/${params.id}`,
    method: 'GET'
  });
};
// 获取团检分组信息详细信息
export const teamGroupInfo = (params: any) => {
  return request({
    url: `/peis/teamGroup/${params.id}`,
    method: 'GET'
  });
};
// 获取tab套餐信息
export const getTaskItemGroupInfoInfo = (params: any) => {
  return request({
    url: `/peis/teamTask/getTaskItemGroupInfo`,
    method: 'GET',
    params
  });
};
// 删除团检分组信息
export const teamGroupDel = (params: any) => {
  return request({
    url: `/peis/teamGroup/${params.ids}`,
    method: 'DELETE',
    data: params
  });
};
