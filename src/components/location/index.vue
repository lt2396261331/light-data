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
  levelList,
  level,
  addCircleCover,
  addPolygonCover,
  addTextMarker,
  addModalDomMarker,
  addImageMarker,
  mapCenter,
  removeAreaCover,
  removeTextMarker
} = useFengMap()

const { setAreaDom } = useMapDomMarker()

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
const showLightPosition = (lightInfo) => {
  console.log('展示灯位置', lightInfo)
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
  height: 120px;
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
    font-size: 12px;
    color: $font-white;
  }
}
</style>
