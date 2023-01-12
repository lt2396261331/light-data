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
          <span class="title">查看区域</span>
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
import { ref, onMounted } from 'vue'
import useFengMap from '@/hooks/useFengMap'

const { loadMap } = useFengMap()

const isShowDialog = ref(false)

const mapRef = ref()
onMounted(() => {
  loadMap(mapRef.value)
})

//关闭弹框
const closeModal = () => {
  isShowDialog.value = false
}

defineExpose({
  isShowDialog
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
</style>
