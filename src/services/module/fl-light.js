import hxRequest from '../request'

// 获取灯信息
export function getLightListBySearch({
  PageNum,
  PageSize,
  GroupIDNumber,
  NodeName,
  Status,
  NodelEEEAddress,
  CountryID,
  GatewayAddress
}) {
  return hxRequest.get({
    url: '/fl/api/HX/GetLightNodesBySearch',
    params: {
      PageNum,
      PageSize,
      GroupIDNumber,
      NodeName,
      Status,
      NodelEEEAddress,
      CountryID,
      GatewayAddress
    }
  })
}

// 获取灯配置表
export function getLightNodes(){
  return hxRequest.get({
    url: '/fl/api/HX/GetLightNodes'
  })
}

// 获取当前院，楼栋，楼层
export function getLayers() {
  return hxRequest.get({
    url: '/fl/api/HX/GetLayers'
  })
}

// 根据院/楼栋/层级/区ID 获取组列表
export function getGroupsByIDs() {
  return hxRequest.get({
    url: '/fl/api/HX/getGroupsByIDs'
  })
}

// 节约用电情况-年数据
export function getYearMeterData() {
  return hxRequest.get({
    url: '/fl/api/HX/GetYearMeterData?type=-1&countryId=1&sensorID=-1&month=undefined'
  })
}
// 月数据
export function getMonthMeterData(month = '2023-1') {
  return hxRequest.get({
    url:
      '/fl/api/HX/GetMonthMeterData?type=-1&countryId=1&sensorID=-1&month=' +
      month
  })
}

// 多组全亮/恢复 操作组则添加后面的参数
// 全局全亮/恢复
export function SetTempTask(
  countryID,
  MotionBr,
  NoMotionBr,
  buildingID,
  floorID,
  deviceAreaID
) {
  return hxRequest.post({
    url: '/fl/api/HX/SetTempTask',
    data: {
      countryID,
      MotionBr,
      NoMotionBr,
      buildingID,
      floorID,
      deviceAreaID
    }
  })
}

// 终端计数
export const getTotalTerminalCount = (countryId = 1) => {
  return hxRequest.get({
    url: '/fl/api/HX/GetTotalInfoByCountryID?countryId=' + countryId
  })
}


// 配置灯位置
export const setLightPosition = params => {
  return hxRequest.post({
    url: '/fl/api/HX/SetSensorLocationByNodeIEEEAddress',
    params
  })
}
