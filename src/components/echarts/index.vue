<template>
  <div class="echarts" ref="drawRef"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'

import useEcharts from './hooks/use-echarts'

const props = defineProps({
  option: {
    type: Object,
    default: () => ({})
  }
})
const drawRef = ref()
onMounted(() => {
  const { setOptions } = useEcharts(drawRef.value)
  watchEffect(() => setOptions(props.option))
})
</script>

<style scoped lang="scss">
.echarts {
  height: 100%;
}
</style>
