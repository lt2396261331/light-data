<template>
  <div class="deploy">
    <div class="title">
      <h3>在地图标记</h3>
      <h3>灯节点：{{ queryInfo.nodeIEEEAddress }}</h3>
      <h3>所属分组：{{ queryInfo.group }}</h3>
    </div>
    <div class="map-box" ref="mapRef"></div>
    <add-light ref="addLightRef" @save-light-xy="fetchAddLight" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useFengMap from '@/hooks/useFengMap'
import { setLightPosition } from '@/services/module/fl-light'

import AddLight from './cpns/add-light.vue'
import { ElMessage } from 'element-plus'

const { loadMap, mapStatus, setFloor, setMarkerOpenStatus, markerPoints } =
  useFengMap()
const route = useRoute()
const router = useRouter()

const queryInfo = ref(route.query)
const floor = route.query.floor
const addLightRef = ref()

const mapRef = ref()
onMounted(() => {
  loadMap(mapRef.value, false)
  setMarkerOpenStatus(true)
})

const fetchAddLight = async lightInfo => {
  console.log(lightInfo)
  if (addLightRef.value) {
    const params = {
      x: lightInfo.x,
      y: lightInfo.y,
      nodeIEEEAddress: lightInfo.nodeIEEEAddress
    }
    try {
      const res = await setLightPosition(params)
      ElMessage.success({
        message: res.message
      })
      addLightRef.value.dialogVisible = false
      router.push('/light')
    } catch (error) {
      ElMessage.error({
        message: '出现了未知错误'
      })
    }
  }
}

watch(mapStatus, () => {
  if (mapStatus.value) {
    setFloor(floor)
  }
})

watch(markerPoints, newValue => {
  const { x, y } = newValue.points[newValue.points.length - 1]
  const formInfo = {
    x: Math.floor(x),
    y: Math.floor(y),
    nodeIEEEAddress: queryInfo.value.nodeIEEEAddress,
    group: queryInfo.value.group
  }
  if (addLightRef.value) {
    addLightRef.value.dialogVisible = true
    addLightRef.value.form = formInfo
  }
})
</script>

<style scoped lang="scss">
.deploy {
  padding: 30px 40px;

  .title {
    width: 30%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .map-box {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.1);
    height: 500px;
  }
}
</style>
