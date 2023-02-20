<template>
  <div class="home">
    <div class="title">
      <img src="@/assets/image/home/home-title.png" alt="" />
      <div class="text">智慧照明可视化管理</div>
    </div>
    <div class="p-ab-center map-container" ref="mapRef"></div>
    <div class="left">
      <save-electricity :emission-info="emissionTotalInfo" />
      <month-electricity :electricity-info="yearMeterData" />
      <light-sum :every-light-info="lightSum" />
    </div>
    <div class="right">
      <terminal
        :success-light="normalLight"
        :error-light="errorLight"
        :terminal-info="terminalInfo"
      />
      <day-eletricity :meter-info="monthMeterData" />
      <day-save-eletricity :meter-info="monthMeterData" />
    </div>
    <div class="action">
      <el-button
        type="primary"
        size="small"
        @click="setAllLightTempTask('light')"
        >全局全亮</el-button
      >
      <el-button type="primary" size="small" @click="setAllLightTempTask"
        >全局恢复</el-button
      >
    </div>
    <el-button type="primary" size="small" class="go-btn" @click="onGoBack">管理后台</el-button>
    <light-info class="home-light-info" />
    <area-info
      class="home-area-info"
      :area-info="clickAreaInfo"
      :message="showTip"
      v-if="showAreaInfoStatus"
      @close="showAreaInfoStatus = false"
      @all-bright="showGroupAllBright"
      @reset-auto="showGroupAllBright"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, watchEffect, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useFengmap from '@/hooks/useFengMap'
import useMapCover from '@/hooks/useMapCover'
import useMapDomMarKer from '@/hooks/useMapDomMarker'

import useAreaStore from '@/stores/areaStore'
import useLightStore from '@/stores/lightStore'

import { getLightUrl } from '@/utils/helper'

import { SetTempTask } from '@/services/module/fl-light'

import SaveElectricity from './cpns/save-electricity.vue'
import MonthElectricity from './cpns/month-electricity.vue'
import LightSum from './cpns/light-sum.vue'

import Terminal from './cpns/terminal.vue'
import DayEletricity from './cpns/day-eletricity.vue'
import daySaveEletricity from '@/views/home/cpns/day-save-eletricity.vue'

import LightInfo from './cpns/light-info.vue'
import AreaInfo from './cpns/area-info.vue'
import { ElMessage } from 'element-plus'

const mapRef = ref()
const {
  loadMap,
  mapStatus,
  polygonPoint,
  setCickPolygonStatus,
  circleBuilder,
  pointInArea,
  addPolygonCover,
  addCircleCover,
  addTextMarker,
  addImageMarker,
  lightPoints,
  addModalDomMarker,
  removeModalDom,
  mapCenter
} = useFengmap()

const { setLightInfoDom } = useMapDomMarKer()

const { setCoverType } = useMapCover(
  addPolygonCover,
  addCircleCover,
  addTextMarker
)

const lightStore = useLightStore()
lightStore.fetchYearMeterData()
lightStore.fetchMonthMeterData()
lightStore.fetchTerminalData()
lightStore.fetchEmissionTotalInfo()
await lightStore.fetchGroupList()
await lightStore.fetchGetCountryList()

const {
  countryInfo,
  groupList,
  lightAllList,
  yearMeterData,
  monthMeterData,
  terminalInfo,
  emissionTotalInfo
} = storeToRefs(lightStore)

const areaStore = useAreaStore()
const { allAreaList } = storeToRefs(areaStore)

// 各灯数量
const lightSum = computed(() => {
  const light10 = lightAllList.value.filter(arr => arr.motionBr === 10).length
  const light8 = lightAllList.value.filter(arr => arr.motionBr === 8).length
  const light1 = lightAllList.value.filter(arr => arr.motionBr === 1).length
  const light0 = lightAllList.value.filter(arr => arr.motionBr === 0).length
  return {
    light10,
    light8,
    light1,
    light0
  }
})

// 终端
const normalLight = computed(
  () => lightAllList.value.filter(arr => arr.status === '正常').length
)
const errorLight = computed(
  () => lightAllList.value.filter(arr => arr.status === '故障').length
)

onMounted(async () => {
  loadMap(mapRef.value)
})

// 地图加成完成
watchEffect(async () => {
  // console.log('地图加成完成', mapState.value)
  if (mapStatus.value) {
    await areaStore.fetchAllAreaList()
    await lightStore.fetchLightList()
    nextTick(() => {
      // 显示智慧照明区域
      for (const area of allAreaList.value) {
        const areas = area.areas.split(',')
        setCoverType(areas, area.areaType, area.floorId, null, 'riskArea', {
          name: area.areaName
        })
      }
      setCickPolygonStatus(true)
      // 显示灯位置
      for (const light of lightAllList.value) {
        const groupInfo = groupList.value.find(
          item => item.deviceAreaID == light.groupIDNumber
        )
        if (!groupInfo) {
          return
        }
        const imageMarkerInfo = {
          x: light.x,
          y: light.y,
          level: groupInfo.floorID,
          type: 'light',
          id: 'aaa-bbb-ccc',
          url: getLightUrl(light.status, light.brightness)
        }
        addImageMarker(imageMarkerInfo)
      }
    })
  }
})

// 全局全亮/恢复
const setAllLightTempTask = async type => {
  // 全亮
  if (type === 'light') {
    const res = await SetTempTask(countryInfo.value.countryID, 10, 10)
    ElMessage({
      message: res.message
    })
    return
  }
  // 恢复
  const res = await SetTempTask(countryInfo.value.countryID, -2, -2)
  ElMessage({
    message: res.message
  })
}

const showTip = ref(false)
// 多组全亮/回复
const showGroupAllBright = async (group, type) => {
  const groups = group.split(',')
  const groupInfo = groups.map(arr => {
    const info = groupList.value.find(item => item.deviceAreaID == arr)
    if (info) {
      if (type === 'light') {
        // 全亮
        return SetTempTask(
          info.countryID,
          10,
          10,
          info.buildingID,
          info.floorID,
          info.deviceAreaID
        )
      }
      return SetTempTask(
        info.countryID,
        -2,
        -2,
        info.buildingID,
        info.floorID,
        info.deviceAreaID
      )
    }
  })
  try {
    const res = await Promise.all(groupInfo)
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 1000)
  } catch (error) {}
}

// 进入后台
// http://localhost/#/lightControl/dashboard
const onGoBack = () => {
  location.assign('http://172.16.70.149/#/lightControl/dashboard')
}

// 监听区域点击
const clickAreaInfo = ref({})
const showAreaInfoStatus = ref(false)
watch(polygonPoint.value, () => {
  const newAreaPonit = polygonPoint.value[polygonPoint.value.length - 1]
  const clickPoint = { x: newAreaPonit.x, y: newAreaPonit.y }
  clickAreaInfo.value = allAreaList.value.find(area => {
    const areas = area.areas.split(',')
    if (area.floorId == newAreaPonit.level) {
      if (area.areaType == 2) {
        const [x, y, r] = areas
        const circlePoint = circleBuilder(
          Number(r),
          { x: Number(x), y: Number(y) },
          100
        )
        return pointInArea(clickPoint, circlePoint)
      } else {
        const areaPoint = areas.map(arr => {
          const [x, y] = arr.split('&')
          return { x: Number(x), y: Number(y) }
        })
        return pointInArea(clickPoint, areaPoint)
      }
    }
  })
  if (clickAreaInfo.value) showAreaInfoStatus.value = true
})

watch(lightPoints, newValue => {
  // removeModalDom()
  const clickLight = newValue.points[newValue.points.length - 1]
  let groupInfo = {}
  const lightInfo = lightAllList.value.find(item => {
    groupInfo = groupList.value.find(
      iten => iten.deviceAreaID == item.groupIDNumber
    )
    if (groupInfo) {
      return (
        item.x == clickLight.x &&
        item.y == clickLight.y &&
        groupInfo.floorID == clickLight.level
      )
    }
  })
  if (lightInfo) {
    const content = setLightInfoDom(lightInfo)
    addModalDomMarker({
      x: lightInfo.x,
      y: lightInfo.y,
      level: groupInfo.floorID,
      content
    })
  }
  mapCenter({ x: lightInfo.x, y: lightInfo.y })
})
</script>

<style lang="scss" scoped>                   
@import '@/assets/scss/variable';
.home {
  background-color: #0b203d;
  height: 100vh;
  width: 100%;
  position: relative;
  .title {
    position: relative;
    height: 50px;
    text-align: center;
    img {
      width: 100%;
    }
    .text {
      position: absolute;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -30%);
    }
  }

  .left {
    position: absolute;
    height: calc(100vh - 50px);
    width: 28%;
    left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .right {
    position: absolute;
    height: calc(100vh - 50px);
    width: 28%;
    right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .action {
    width: 20%;
    position: absolute;
    height: 30px;
    top: 100px;
    left: 50%;
    transform: translate(-50%);

    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .map-container {
    height: 70%;
    width: 40%;
  }

  .home-light-info {
    position: absolute;
    z-index: 1;
    top: 85%;
    left: 70%;
    color: #fff;
    background-color: rgba(13, 44, 87, 0.5);
    border: 1px solid rgb(39, 93, 113);
    border-radius: 5px;
    transform: translate(-95%, -70%);
  }

  .home-area-info {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%);
    color: #fff;
    background-color: rgba(13, 44, 87, 0.5);
    border: 1px solid rgb(39, 93, 113);
    border-radius: 5px;
  }

  .go-btn {
    position: fixed;
    right: 109px;
    top: 33px;
    z-index: 999;
  }
}

/* 楼层控件 */
/* 楼层列表 */
::v-deep(.fm-layer-list) {
  background-color: #0b203d !important;
}

/* 多楼层按钮  */
::v-deep(.fm-btn-layer) {
  background-color: #0b203d !important;
}
/* 3d按钮 */
::v-deep(.fm-control-tool-3d) {
  background-color: #0b203d !important;
}
::v-deep(.fm-control-groups) {
  box-shadow: #1e82fa 0px 0px 5px !important;
}

::v-deep(.warn-dom) {
  position: absolute;
  left: -104px;
  bottom: 40px;
  display: inline-flex;
  width: 240px;
  height: 180px;
  padding: 12px;
  box-sizing: border-box;
  align-items: center;
  background: rgba(60, 66, 91, 0.6);
  border-radius: 4px;
  animation: shine 1.4s linear infinite;
  //box-shadow: 0 0 12px red;
  .arrow {
    position: absolute;
    bottom: -16px;
    left: 112px;
    border-top: 8px solid rgba(60, 66, 91, 0.6);
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .info-box {
    height: 100%;
  }
  .info-item {
    display: inline-flex;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
    color: $font-white;
  }
  .item-left {
    display: inline-block;
    line-height: 16px;
    font-size: 14px;
    width: 84px;
    margin-right: 8px;
    text-align: right;
  }
  .item-left-b {
    display: inline-block;
    line-height: 16px;
    font-size: 14px;
    width: 80px;
    margin-right: 8px;
    text-align: right;
  }
  .item-text {
    display: inline-block;
    line-height: 16px;
    font-size: 14px;
  }
}
</style>
