<template>
  <div class="home">
    <div class="action">
      <el-button type="primary" @click="refreshBtn">刷新</el-button>
    </div>
    <div class="p-ab-center map-container" ref="mapRef"></div>
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
  removeLightMarker,
  mapCenter
} = useFengmap()

const { setLightInfoDom } = useMapDomMarKer()

const { setCoverType } = useMapCover(
  addPolygonCover,
  addCircleCover,
  addTextMarker
)

const lightStore = useLightStore()
await lightStore.fetchGroupList()
await lightStore.fetchGetCountryList()


const { groupList, lightAllList } = storeToRefs(lightStore)

const areaStore = useAreaStore()
const { allAreaList } = storeToRefs(areaStore)

onMounted(async () => {
  loadMap(mapRef.value, false)
})

// 地图加成完成
watch(mapStatus, async () => {
  // console.log('地图加成完成', mapState.value)
  if (mapStatus.value) {
    await lightStore.fetchLightList()
  }
})

const refreshBtn = () => {
  lightStore.fetchLightList()
}

watch(lightAllList, newValue => {
  if (mapStatus.value) {
    removeLightMarker()
    // 显示灯位置
    for (const light of lightAllList.value) {
      const groupInfo = groupList.value.find(
        item => item.id == light.groupID
      )
      if (!groupInfo) {
        return
      }
      const imageMarkerInfo = {
        x: light.x,
        y: light.y,
        level: Number(groupInfo.floorName),
        type: 'light',
        id: 'aaa-bbb-ccc',
        url: getLightUrl(light.status, light.brightness)
      }
      addImageMarker(imageMarkerInfo)
    }
  }
})

watch(lightPoints, newValue => {
  // removeModalDom()
  const clickLight = newValue.points[newValue.points.length - 1]
  let groupInfo = {}
  const lightInfo = lightAllList.value.find(item => {
    groupInfo = groupList.value.find(
      iten => iten.id == item.groupID
    )
    if (groupInfo) {
      return (
        item.x == clickLight.x &&
        item.y == clickLight.y &&
        groupInfo.floorName == clickLight.level
      )
    }
  })
  if (lightInfo) {
    const content = setLightInfoDom(lightInfo)
    addModalDomMarker({
      x: lightInfo.x,
      y: lightInfo.y,
      level: Number(groupInfo.floorName),
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
    top: 40px;
    left: 50%;
    transform: translate(-50%);

    z-index: 999;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .map-container {
    height: 80%;
    width: 80%;
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
/* 地图dom样式 */
::v-deep(.warn-dom) {
  position: absolute;
  left: -104px;
  bottom: 40px;
  display: inline-flex;
  width: 240px;
  height: 200px;
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
