<template>
  <div class="day-save-eletricity">
    <card title="日节约用电">
      <echarts :option="option"></echarts>
    </card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Echarts from '@/components/echarts/index.vue'
import Card from '@/components/card/index.vue'

const props = defineProps({
  meterInfo: {
    type: Object,
    default: () => ({})
  }
})

const option = computed(() => ({
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.meterInfo.dayList
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} KW'
    },
  },
  tooltip: {
    trigger: 'axis'
  },
  textStyle: {
    color: '#fff'
  },
  grid: {
    top: '15px'
  },
  series: [
    {
      data: props.meterInfo.originalEnergyList,
      type: 'line',
      areaStyle: {}
    }
  ]
}))
</script>

<style scoped lang="scss"></style>
