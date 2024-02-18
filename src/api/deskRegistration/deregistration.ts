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

/**
 * 体检人员再次登记
 */
export const reRegistration = (ids: any) => {
  return request({
    url: `/peis/register/reRegistration/${ids}`,
    method: 'PUT',
  });
};