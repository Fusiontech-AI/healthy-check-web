import request from '@/utils/request';

/**
 * 单位应缴费列表
 */
export const groupList = (params:any) => {
  return request({
    url: '/peis/teamCharge/groupList',
    method: 'GET',
    params
  });
};
/**
 * 单位分组-树查询
 */
export const teamGroupTree = (params:any) => {
  return request({
    url: 'peis/team/teamGroupTree',
    method: 'POST',
    data: params
  });
};


