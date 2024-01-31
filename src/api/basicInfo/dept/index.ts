import request from '@/utils/request';

// 查询科室
export const listDept = (query: any) => {
  return request({
    url: '/peis/tjks/list',
    method: 'get',
    params: query
  });
};

// 新增科室
export const addDept = (data: any) => {
  return request({
    url: '/peis/tjks',
    method: 'post',
    data
  });
};

// 编辑科室
export const editDept = (data: any) => {
  return request({
    url: '/peis/tjks',
    method: 'put',
    data
  });
};

// 删除科室
export const deleteDept = (id: any) => {
  return request({
    url: `/peis/tjks/${id}`,
    method: 'delete'
  });
};

// 查询体检科室编码
export const getKsCode = () => {
  return request({
    url: '/peis/tjks/getKsCode',
    method: 'get'
  });
};
