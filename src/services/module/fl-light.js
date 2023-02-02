import hxRequest from '../request'

// 获取灯信息
export function getLightList() {
  return hxRequest.get({
    url: '/fl/api/T8/GetLightNodes'
  })
}

// 获取当前院，楼栋，楼层
export function getLayers() {
  return hxRequest.get({
    url: '/fl/api/T8/GetLayers'
  })
}

// 根据院/楼栋/层级/区ID 获取组列表
export function getGroupsByIDs() {
  return hxRequest.get({
    url: '/fl/api/T8/getGroupsByIDs'
  })
}

// 节约用电情况
export function getYearMeterData() {
  return hxRequest.get({
    url: '/fl/api/T8/GetYearMeterData?type=-1&countryId=1&sensorID=-1&month=undefined'
  })
}

// 多组全亮/恢复 操作组则添加后面的参数
// 全局全亮/恢复 
export function SetTempTask(
  CountryID,
  MotionBr,
  NoMotionBr,
  BuildingID,
  FloorID,
  DeviceAreaID
) {
  return hxRequest.post({
    url: '/fl/api/T8/SetTempTask',
    data: {
      CountryID,
      MotionBr,
      NoMotionBr,
      BuildingID,
      FloorID,
      DeviceAreaID
    }
  })
}