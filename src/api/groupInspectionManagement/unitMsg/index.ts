import request from '@/utils/request';

// 查询科室
export const teamInfoList = (query: any) => {
  return request({
    url: '/peis/teamInfo/list',
    method: 'get',
    params: query
  });
};

// 获取体检单位信息详细信息
export const queryTeamInfoById = (id: any) => {
  return request({
    url: `/peis/teamInfo/${id}`,
    method: 'get'
  });
};

// 新增体检单位信息
export const addTeamInfo = (data: any) => {
  return request({
    url: `/peis/teamInfo`,
    method: 'post',
    data
  });
};

// 修改体检单位信息
export const editTeamInfo = (data: any) => {
  return request({
    url: `/peis/teamInfo`,
    method: 'put',
    data
  });
};

// 查询单位部门信息列表
export const teamDeptList = (params: any) => {
  return request({
    url: `/peis/teamDept/list`,
    method: 'get',
    params
  });
};

// 查询职业病字典列表(非分页字典)
export const occupationalDictList = (params: any) => {
  return request({
    url: `/peis/occupationalDict/dictList`,
    method: 'get',
    params
  });
};

// 获取部门编号
export const getDeptNoById = (id: any) => {
  return request({
    url: `/peis/teamDept/getDeptNoById/${id}`,
    method: 'get'
  });
};

// 新增单位部门信息
export const addTeamDept = (data: any) => {
  return request({
    url: `/peis/teamDept`,
    method: 'post',
    data
  });
};

// 修改单位部门信息
export const editTeamDept = (data: any) => {
  return request({
    url: `/peis/teamDept`,
    method: 'put',
    data
  });
};

// 删除单位部门信息
export const deleteTeamDept = (ids: any) => {
  return request({
    url: `/peis/teamDept/${ids}`,
    method: 'delete'
  });
};

// 获取体检单位编号
export const getTeamNoById = (id: any) => {
  return request({
    url: `/peis/teamInfo/getTeamNoById/${id}`,
    method: 'get'
  });
};

// 删除体检单位信息
export const deleteTeamInfo = (ids: any) => {
  return request({
    url: `/peis/teamInfo/${ids}`,
    method: 'delete'
  });
};
