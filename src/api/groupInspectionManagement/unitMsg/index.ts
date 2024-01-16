import request from '@/utils/request';

// 查询科室
export const teamInfoList = (query: any) => {
  return request({
    url: '/peis/teamInfo/list',
    method: 'get',
    params: query
  });
};
