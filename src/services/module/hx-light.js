import hxRequest from '../request'
import { objToForm } from '@/utils/helper'

// 分页查询智慧照明区域
export function getAreaList(search, pageSize, pageNo) {
  return hxRequest.post({
    url: '/hx/light/page.shtml',
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
    url: '/hx/light/add.shtml',
    data: objToForm(areaObj)
  })
}

// 根据floorId获取照明区域详细信息
export function findAreaMsgByfloorId(floorId) {
  return hxRequest.get({
    url: '/hx/light/findAreaMsgByfloorId.shtml?floorId=1'
  })
}

// 根据id获取照明区域详细信息
export function findAreaMsgById(areaId) {
  return hxRequest.get({
    url: '/hx/light/findAreaMsgById.shtml?id=' + areaId
  })
}

// 修改智慧照明区域
export function updateAreaInfo(info) {
  return hxRequest.post({
    url: '/hx/light/edit.shtml',
    params: info
  })
}

// 获取所有照明区域
export function findAllArea() {
  return hxRequest.get({
    url: '/hx/light/findAllArea.shtml'
  })
}

// 删除区域
export function deleteArea(id) {
  return hxRequest.post({
    url: '/hx/light/delete.shtml?id=' + id
  })
}

