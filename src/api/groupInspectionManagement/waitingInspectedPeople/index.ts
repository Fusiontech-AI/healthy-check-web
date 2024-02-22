import request from '@/utils/request';

// 查询团检分组信息列表
export const teamGroupList = (params: any) => {
  return request({
    url: `/peis/teamGroup/list`,
    method: 'get',
    params
  });
};

// 查询团检分组对应项目列表
export const teamGroupItem = (params: any) => {
  return request({
    url: `/peis/teamGroupItem/list`,
    method: 'get',
    params
  });
};

// 查询体检单位待检人员详情任务分组树
export const teamSettleWaitTaskGroupTree = (id: any) => {
  return request({
    url: `/peis/teamWait/teamSettleWaitTaskGroupTree/${id}`,
    method: 'get'
  });
};

//体检单位待检人员批量换组
export const batchSwitchGroup = (data: any) => {
  return request({
    url: `/peis/teamWait/batchSwitchGroup`,
    method: 'post',
    data
  });
};
