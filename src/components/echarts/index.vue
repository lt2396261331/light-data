<template>
  <div class="echarts" ref="drawRef"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    default: () => ({})
  }
})

const drawRef = ref()
onMounted(() => {
  const myChart = echarts.init(drawRef.value)
  myChart.setOption(props.option)
})
</script>

<style scoped lang="scss">
.echarts {
  height: 100%;
}
</style>
