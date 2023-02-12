<template>
  <div class="day-eletricity">
    <card title="日电量数据">
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
      data: props.meterInfo.thisMonth,
      type: 'line',
      lineStyle: {
        color: '#fff'
      },
      itemStyle: {
        color: '#fff'
      }
    }
  ]
}))
</script>

<style scoped lang="scss">

::v-deep(.title) {
  padding: 10px 0 !important;
}
</style>
