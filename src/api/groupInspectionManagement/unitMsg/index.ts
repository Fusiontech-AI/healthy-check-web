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
