import { twoNumEqual, getCenterXY } from '@/utils/helper'

export default function useMapCover(
  addPolygonCover,
  addCircleCover,
  addTextMarker,
  addModalDomMarker,
  setAreaDom,
  mapCenter
) {
  // 多边形中心点
  let centerPoint = {}

  // 设置多边形类型
  const setCoverType = (
    areas,
    type,
    floorId,
    bgColor,
    coverType,
    info = {}
  ) => {
    if (type == 2) {
      const areaParams = {
        x: Number(areas[0]),
        y: Number(areas[1]),
        r: Number(areas[2]),
        bgColor: bgColor || '#f1d11e',
        level: floorId
      }
      addCircleCover(areaParams, coverType)
      let { x, y, level } = areaParams
      centerPoint = { x, y, level }
      if (info.name) {
        addTextMarker(x, y, info.name, level, coverType)
      }
    } else {
      let points = areas.map(arr => {
        let point = arr.split('&')
        return {
          x: Number(point[0]),
          y: Number(point[1])
        }
      })
      console.log('多边形', points)
      const areaParams = {
        points: points,
        bgColor: bgColor,
        level: floorId
      }
      addPolygonCover(areaParams, coverType)
      let { centerX, centerY } = getCenterXY(points)
      centerPoint = { x: centerX, y: centerY, level: floorId }
      if (info.name) {
        addTextMarker(centerX, centerY, info.name, levelNum, coverType)
      }
    }

    if (typeof setAreaDom === 'function' && info) {
      console.log('添加dom', centerPoint)
      const content = setAreaDom(info)
      addModalDomMarker({ x: centerPoint.x, y: centerPoint.y, content, level: centerPoint.level, type: 'riskArea'})
      mapCenter({ x: centerPoint.x, y: centerPoint.y })
    }
  }

  return {
    setCoverType
  }
}
