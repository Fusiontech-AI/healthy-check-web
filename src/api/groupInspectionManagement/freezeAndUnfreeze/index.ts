import request from '@/utils/request';

// 体检人员解冻
export const registerUnfreeze = (ids: any) => {
  return request({
    url: `/peis/register/unfreeze/${ids}`,
    method: 'put'
  });
};

// 体检人员冻结
export const registerFreeze = (ids: any) => {
  return request({
    url: `/peis/register/freeze/${ids}`,
    method: 'put'
  });
};

// 查询体检人员登记信息列表
export const registerPage = (params: any) => {
  return request({
    url: `/peis/register/page`,
    method: 'get',
    params
  });
};
