import { param } from './../../../utils/index';
import request from '@/utils/request';
/**
 * 查询体检组合项目列表
 */
export const combinationProjectList = (params: any) => {
  return request({
    url: `/peis/combinationProject/list`,
    method: 'GET',
    params
  });
};
/**
 * 体检套餐动态算费(通用版)
 */
export const commonDynamicBilling = (params: any) => {
  return request({
    url: `/peis/package/commonDynamicBilling`,
    method: 'POST',
    data: params
  });
};
// 套餐和项目混合分页查询
export const queryPackageAndProjectPages = (params: any) => {
  return request({
    url: `/peis/package/queryPackageAndProjectPages`,
    method: 'GET',
    params
  });
};
// 套餐子项
export const queryProjectByPackageId = (params: any) => {
  return request({
    url: `/peis/package/queryProjectByPackageId`,
    method: 'post',
    data: params
  });
};
// 查询职业病推荐套餐和职业病项目套餐
export const queryOccupationalPackage = (params: any) => {
  return request({
    url: `/peis/package/queryOccupationalPackage`,
    method: 'post',
    data: params
  });
};
// 分页查询职业病组合项目
export const queryOccupationalProject = (params: any) => {
  return request({
    url: `/peis/combinationProject/queryOccupationalProject`,
    method: 'post',
    data: params
  });
};
