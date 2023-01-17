<template>
  <div class="deploy">
    <div class="title">
      <span>在地图标记</span>
      <span>灯节点</span>
    </div>
    <div class="map-box" ref="mapRef"></div>
  </div>
</template>

<script setup>
import useFengMap from '@/hooks/useFengMap';
import { onMounted, ref } from 'vue'

const { loadMap } = useFengMap()

const mapRef = ref()
onMounted(() => {
  loadMap(mapRef.value)
})

</script>

<style scoped lang="scss">
.deploy {
  padding: 30px 40px;

  .map-box {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.1);
    height: 500px;
  }
}
</style>
