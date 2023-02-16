<template>
  <div
    class="sel-modal"
    :class="{
      'modal-hidden': !isShowDialog,
      'modal-visible': isShowDialog
    }"
  >
    <div class="sel-modal-box">
      <div class="sel-modal-content map-modal">
        <div class="modal-title">
          <span class="title" @click="setFloor(3)">{{ title }}</span>
          <span class="iconfont icon-cuo" @click="closeModal"></span>
        </div>
        <div class="map-view">
          <div class="map-container" ref="mapRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { getLightUrl } from '@/utils/helper'
import useFengMap from '@/hooks/useFengMap'
import useMapCover from '@/hooks/useMapCover'
import useMapDomMarker from '@/hooks/useMapDomMarker'

const props = defineProps({
  title: {
    type: String,
    default: '查看区域'
  },
  floor: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['closeModal'])

const {
  loadMap,
  setFloor,
  mapStatus,
  addCircleCover,
  addPolygonCover,
  addTextMarker,
  addModalDomMarker,
  addImageMarker,
  mapCenter,
  removeAreaCover,
  removeTextMarker,
  removeLightMarker
} = useFengMap()

const { setAreaDom, setLightInfoDom } = useMapDomMarker()

const { setCoverType } = useMapCover(
  addPolygonCover,
  addCircleCover,
  addTextMarker,
  addModalDomMarker,
  setAreaDom,
  mapCenter
)

const isShowDialog = ref(false)

const mapRef = ref()
onMounted(() => {
  loadMap(mapRef.value, false)
})

// 展示需要展示的信息
watchEffect(() => {
  if (mapStatus.value) {
    setFloor(props.floor)
  }
})

// 展示区域
const showArea = areaInfo => {
  const areas = areaInfo.areas.split(',')
  setCoverType(
    areas,
    areaInfo.areaType,
    areaInfo.floorId,
    '#2a2ff2',
    'riskArea',
    areaInfo
  )
}

// 展示灯位置
const showLightPosition = lightInfo => {
  // 设置imageMarker
  const imageMarkerInfo = {
    x: lightInfo.x,
    y: lightInfo.y,
    level: lightInfo.level,
    type: 'light',
    url: getLightUrl(lightInfo.status, lightInfo.brightness)
  }
  addImageMarker(imageMarkerInfo)
  // 获取dom内容
  const content = setLightInfoDom(lightInfo)
  addModalDomMarker({
    x: lightInfo.x,
    y: lightInfo.y,
    level: lightInfo.level,
    type: 'light',
    content
  })
  mapCenter({ x: lightInfo.x, y: lightInfo.y })
}

// 移除区域
const removeCover = () => {
  removeAreaCover('riskAreaCircle', 'riskAreaPolygon')
  removeTextMarker('riskArea')
}

//关闭弹框
const closeModal = () => {
  isShowDialog.value = false
  removeCover()
  removeLightMarker()
}

defineExpose({
  isShowDialog,
  showArea,
  showLightPosition
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/variable';
@import '@/assets/scss/modal';
.modal-visible {
  visibility: visible;
  opacity: 1;
  z-index: $third-index;
}
.modal-hidden {
  visibility: hidden;
  opacity: 0;
  z-index: -1;
}
.map-modal {
  width: 75%;
  height: 640px;
  padding: 12px 20px;
  box-sizing: border-box;
}
.map-container {
  width: 100%;
  height: 578px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden;
}
.modal-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  width: 100%;
  //padding: 0 8px;
  box-sizing: border-box;
  margin-bottom: 8px;
  .iconfont {
    color: $font-light;
    cursor: pointer;
    font-size: 14px;
  }
  .title {
    font-size: 16px;
    color: $font-dark;
  }
}
.map-view {
  width: 100%;
  height: 578px;
  position: relative;
  border: 1px solid $border-transparent;
  box-sizing: border-box;
  overflow: hidden;
}
.mapShow {
  visibility: visible !important;
}
::v-deep(.member-dom) {
  position: absolute;
  font-size: 16px;
  left: -150px;
  bottom: 40px;
  display: inline-flex;
  width: 200px;
  padding: 12px;
  box-sizing: border-box;
  align-items: center;
  background: rgba(60, 66, 91, 0.6);
  border-radius: 4px;
  .arrow {
    position: absolute;
    bottom: -16px;
    left: 156px;
    border-top: 8px solid rgba(60, 66, 91, 0.6);
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .left-img {
    width: 100px;
    margin-right: 12px;
  }
  .info-box {
    height: 100%;
  }
  .info-item {
    display: inline-flex;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
  }
  .item-text {
    display: inline-block;
    line-height: 16px;
    font-size: 14px;
    color: $font-white;
  }
  .info-group {
    font-size: 14px;
    word-break: break-all;
    margin: 0;
    color: #fff;
  }
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
