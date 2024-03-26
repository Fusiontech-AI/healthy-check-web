import request from '@/utils/request';

/**
 * 根据基础项目查询相应科室列表信息
 */
 export const queryTjKsListByBasicName = (params:any) => {
  return request({
    url: '/peis/tjks/queryTjKsListByBasicName',
    method: 'GET',
    params
  });
};

/**
 * 规则集分页查询
 */
export const queryRuleTjSetPages = (params:any) => {
  return request({
    url: '/peis/tjSet/queryRuleTjSetPages',
    method: 'GET',
    params
  });
};

/**
 * 规则集新增
 */
export const addRuleTjSet = (params:any) => {
  return request({
    url: '/peis/tjSet/addRuleTjSet',
    method: 'post',
    data: params
  });
};


/**
 * 规则集修改
 */
export const updateRuleTjSet = (params:any) => {
  return request({
    url: '/peis/tjSet/updateRuleTjSet',
    method: 'post',
    data: params
  });
};

/**
 * 删除体检项目规则集
 */
export const deleteRuleTjSet = (ids:any) => {
  return request({
    url: `/peis/tjSet/${ids}`,
    method: 'DELETE',
  });
};

/**
 * 获取体检基础项目参考信息详细信息
 */
export const basicProject = (id:any) => {
  return request({
    url: `/peis/basicProject/${id}`,
    method: 'get',
  });
};

/**
 * 规则项查询
 */
export const queryRuleTjInfoList = (params:any) => {
  return request({
    url: '/peis/tjInfo/queryRuleTjInfoList',
    method: 'get',
    params
  });
};


/**
 * 规则项新增
 */
export const addRuleTjInfo = (params:any) => {
  return request({
    url: '/peis/tjInfo/addRuleTjInfo',
    method: 'post',
    data: params
  });
};

/**
 * 规则项修改
 */
export const updateRuleTjInfo = (params:any) => {
  return request({
    url: '/peis/tjInfo/updateRuleTjInfo',
    method: 'post',
    data: params
  });
};

/**
 * 规则项删除
 */
export const deleteRuleTjInfo = (params:any) => {
  return request({
    url: '/peis/tjInfo/deleteRuleTjInfo',
    method: 'post',
    data: params
  });
};

/**
 * 规则项新增
 */
export const addRuleTjCondition = (params:any) => {
  return request({
    url: '/peis/tjCondition/addRuleTjCondition',
    method: 'post',
    data: params
  });
};

/**
 * 规则项条件修改
 */
export const updateRuleTjCondition = (params:any) => {
  return request({
    url: '/peis/tjCondition/updateRuleTjCondition',
    method: 'post',
    data: params
  });
};

/**
 * 规则项条件删除
 */
export const deleteRuleTjCondition = (params:any) => {
  return request({
    url: '/peis/tjCondition/deleteRuleTjCondition',
    method: 'post',
    data: params
  });
};

/**
 * 查询条件所有关系运算类型
 */
export const getRelationTypeMap = (params:any) => {
  return request({
    url: '/peis/tjSet/conditionLogicType/relationTypeMap',
    method: 'get',
    params
  });
};

/**
 * 查询规则项所有逻辑运算类型
 */
export const getRuleLogicTypeMap = () => {
  return request({
    url: '/peis/tjSet/ruleLogicType/ruleLogicTypeMap',
    method: 'get'
  });
};

/**
 * 查询输入比较参数列表
 */
export const paramTypeMap = () => {
  return request({
    url: '/peis/tjSet/ruleLogicType/paramTypeMap',
    method: 'get'
  });
};


// 查询部门列表
export const listDept = (query:any) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  });
};