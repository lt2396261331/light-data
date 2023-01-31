<template>
  <div class="draw-box">
    <slot name="header">
      <div class="text-title">
        <div class="text">
          绘制区域
          <span class="icon">*</span>
        </div>
        <div class="show">
          <el-switch v-model="showAllArea" />
          展示已经绘制区域
        </div>
      </div>
    </slot>
    <!-- 地图容器设置position:relative 加载的地图默认设置了position: absolute -->
    <div class="map-box" ref="mapRef"></div>
    <div class="info">
      <div class="area-name section">
        <span class="name">区域名称<span class="icon">*</span></span>
        <div class="input">
          <el-input placeholder="请输入" v-model="areaName" />
        </div>
      </div>
      <div class="group section">
        <span class="name">关联分组</span>
        <div class="input">
          <el-select
            v-model="groupValue"
            multiple
            filterable
            default-first-option
            :reserve-keyword="false"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="btn">
        <el-button @click="back">取消</el-button>
        <el-button
          type="primary"
          :disabled="!hasCoverShape || !areaName.length"
          @click="saveCover"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useFengMap from '@/hooks/useFengMap'
import { twoNumEqual } from '@/utils/helper'

// 展示已经绘制的区域
const showAllArea = ref()
// 区域名称
const areaName = ref('')
// 选择分组
const groupValue = ref([])
const {
  loadMap,
  level,
  setMarkerOpenStatus,
  removeMarker,
  markerPoints,
  addMarker,
  linkPoint,
  removeLineMarker,
  addCircleCover,
  addPolygonCover,
  removeAreaCover
} = useFengMap()

// 加载地图
const mapRef = ref()
onMounted(() => {
  loadMap(mapRef.value)
})

//覆盖物类型
const type = ref('')
//是否有覆盖物
const hasCoverShape = ref(false)
//记录标注点数组长度
let pointsLen = 0

//设置覆盖物数据
const setCoverData = list => {
  if (type.value === 'round' && list.length === 2) {
    let r = fengmap.FMCalculator.distance(list[0], list[1])
    let params = {
      r,
      level: level.value,
      x: list[0].x,
      y: list[0].y,
      bgColor: '#2a2ff2'
    }
    addCircleCover(params, 'riskArea')
    hasCoverShape.value = true
    setMarkerOpenStatus(false)
  } else if (type.value === 'rectangle' && list.length === 2) {
    //过滤矩形构造的第二个点在水平线或者垂直线上
    if (list[0].x === list[1].x || list[0].y === list[1].y) {
      //去除最新的点
      removeMarker(list.length - 1)
      ElMessage.warning({
        message: '矩形构造的第二个点不能在第一个点的水平线或者垂直线上',
        type: 'warning'
      })
      return
    }
    let points = structureRectangle(list)
    addPolygonCover(
      { points: points, bgColor: '#2a2ff2', level: level.value },
      'riskArea'
    )
    hasCoverShape.value = true
    setMarkerOpenStatus(false)
  } else if (type.value === 'polygon' && list.length > 1) {
    //构造多边形
    structurePolygon(list, level.value, 'riskArea')
  }
}
//构造多边形
const structurePolygon = (list, level, coverType) => {
  if (list.length < 2) {
    return
  }
  let lastPoint = { ...list[list.length - 1] }
  let prevPoint = { ...list[list.length - 2] }
  let firstPoint = { ...list[0] }
  //终点重合绘制多边形
  if (
    twoNumEqual(lastPoint.x, firstPoint.x) &&
    twoNumEqual(lastPoint.y, firstPoint.y)
  ) {
    if (list.length < 4) {
      //去除新增重合标注点
      removeMarker(list.length - 1)
      return
    }
    //首尾点相连
    linkPoint([prevPoint, firstPoint], '#2a2ff2')
    let points = JSON.parse(JSON.stringify(list))
    points.splice(points.length - 1, 1)
    setMarkerOpenStatus(false)
    //去除最后一个标注点(重合点移除)
    removeMarker(list.length - 1)
    //添加覆盖物
    addPolygonCover({ points: points, bgColor: '#2a2ff2', level }, coverType)
    hasCoverShape.value = true
  } else {
    //两点连线
    linkPoint([prevPoint, lastPoint], '#2a2ff2')
  }
}
//构造矩形
const structureRectangle = points => {
  let point3 = { x: points[0].x, y: points[1].y }
  let point4 = { x: points[1].x, y: points[0].y }
  return [{ ...points[0] }, point3, { ...points[1] }, point4]
}
//保存覆盖物
const saveCover = () => {
  let areas = ''
  let { points } = markerPoints

  if (type.value === 'round') {
    let r = fengmap.FMCalculator.distance(points[0], points[1])
    areas = `${points[0].x},${points[0].y},${r}`
  } else {
    let pointMarkers =
      type.value === 'polygon' ? points : structureRectangle(points)
    pointMarkers.forEach(arr => {
      areas += !areas ? `${arr.x}&${arr.y}` : `,${arr.x}&${arr.y}`
    })
  }
  console.log('type', type.value, areas, level.value)
}
// 取消
const router = useRouter()
const back = () => {
  router.back()
}
//移除覆盖物和标注点
const removeCoverAndMarker = () => {
  removeMarker()
  removeLineMarker()
  removeAreaCover()
  hasCoverShape.value = false
  setMarkerOpenStatus(true)
  pointsLen = 0
}

// 是否再绘制区域
watch(type, val => {
  if (val) {
    setMarkerOpenStatus(true)
  }
  removeCoverAndMarker()
})

watch(markerPoints, (markers, oldMarkers) => {
  let { points } = markers
  //标注点长度不等于0且不小于已记录的标注点集合长度
  if (points.length && pointsLen <= points.length) {
    pointsLen = points.length //记录标注点数组长度
    addMarker(points[points.length - 1])
    setCoverData(points)
  }
})

// 分组数据
const options = [
  {
    value: 'HTML',
    label: 'HTML'
  },
  {
    value: 'CSS',
    label: 'CSS'
  },
  {
    value: 'JavaScript',
    label: 'JavaScript'
  }
]
</script>

<style lang="scss" scoped>
.draw-box {
  display: flex;
  flex-direction: column;
  flex: 1;

  .text-title {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    line-height: 20px;
    .icon {
      color: #f00;
    }
  }
  .map-box {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.1);
    height: 500px;
  }
  .info {
    .section {
      display: flex;
      align-items: center;
      margin: 0 5px;
      padding: 12px 0;
      .icon {
        color: #f00;
      }
      .name {
        width: 66px;
      }
      .input {
        margin-left: 8px;
        width: 80%;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
    }
  }
}
</style>
