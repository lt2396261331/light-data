import hxRequest from '../request'
import { objToForm } from '@/utils/helper'

// 分页查询智慧照明区域
export function getAreaList(search, pageSize, pageNo) {
  return hxRequest.post({
    url: '/api/light/page.shtml',
    data: objToForm({
      search,
      count: pageSize,
      page: pageNo
    })
  })
}

// 新增区域
/**
 * 
 * @param {
 *  areaName: 区域名称
 *  areaType: 区域类型 多边形1，圆形2
 *  areas: 顶点坐标(原点/半径)
 *  floorId: 楼层
 *  areaGroup: 关联分组
 * } areaObj 
 */ 
export function addArea(areaObj) {
  return hxRequest.post({
    url: '/api/light/add.shtml',
    data: objToForm(areaObj)
  })
}

// 根据floorId获取照明区域详细信息
export function findAreaMsgByfloorId(floorId) {
  return hxRequest.get({
    url: '/api/light/findAreaMsgByfloorId.shtml?floorId=1'
  })
}
