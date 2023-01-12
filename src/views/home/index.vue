<template>
  <div class="map" ref="mapRef"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useFengmap from '@/hooks/useFengMap'

const mapRef = ref()
const { loadMap, levelList, level, setMapModel, setFullFloor, setFloor } =
  useFengmap()
onMounted(() => {
  loadMap(mapRef.value)
})
</script>

<style lang="scss" scoped>
.map {
  height: 100vh;
}
</style>
