<template>
  <div class="home">
    <div class="title">
      <img src="@/assets/image/home/home-title.png" alt="" />
      <div class="text">智慧照明可视化管理</div>
    </div>
    <div class="p-ab-center map-container" ref="mapRef"></div>
    <div class="left">
      <save-electricity />
      <month-electricity />
      <light-sum />
    </div>
    <div class="right">
      <terminal />
      <day-eletricity />
      <day-save-eletricity />
    </div>
    <div class="action">
      <el-button type="primary" size="small">全局全亮</el-button>
      <el-button type="primary" size="small">全局恢复</el-button>
    </div>
    <light-info class="home-light-info" />
    <area-info
      class="home-area-info"
      :area-info="clickAreaInfo"
      v-if="showAreaInfoStatus"
      @close="showAreaInfoStatus = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useFengmap from '@/hooks/useFengMap'
import useMapCover from '@/hooks/useMapCover'
import useAreaStore from '@/stores/areaStore'

import SaveElectricity from './cpns/save-electricity.vue'
import MonthElectricity from './cpns/month-electricity.vue'
import LightSum from './cpns/light-sum.vue'

import Terminal from './cpns/terminal.vue'
import DayEletricity from './cpns/day-eletricity.vue'
import daySaveEletricity from '@/views/home/cpns/day-save-eletricity.vue'

import LightInfo from './cpns/light-info.vue'
import AreaInfo from './cpns/area-info.vue'

const mapRef = ref()
const {
  loadMap,
  polygonPoint,
  setCickPolygonStatus,
  circleBuilder,
  pointInArea,
  addPolygonCover,
  addCircleCover,
  addTextMarker
} = useFengmap()

const { setCoverType } = useMapCover(
  addPolygonCover,
  addCircleCover,
  addTextMarker
)

const areaStore = useAreaStore()
areaStore.fetchAllAreaList()
const { allAreaList } = storeToRefs(areaStore)

onMounted(async () => {
  await loadMap(mapRef.value)
  nextTick(() => {
    for (const area of allAreaList.value) {
      const areas = area.areas.split(',')
      setCoverType(areas, area.areaType, area.floorId, null, 'riskArea', {
        name: area.areaName
      })
    }
    setCickPolygonStatus(true)
  })
})

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
</script>

<style lang="scss" scoped>
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
}
</style>
