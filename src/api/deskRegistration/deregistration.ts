import request from '@/utils/request';
/**
 * 查询体检人员登记信息列表
 */
export const getRegisterPage = (params: any) => {
  return request({
    url: '/peis/register/page',
    method: 'GET',
    params
  });
};