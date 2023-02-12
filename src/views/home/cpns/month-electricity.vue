<template>
  <div class="month-electricity">
    <card title="月电量&节能">
      <echarts :option="option"></echarts>
    </card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import Echarts from '@/components/echarts/index.vue'
import Card from '@/components/card/index.vue'

const props = defineProps({
  electricityInfo: {
    type: Object,
    default: () => ({})
  }
})

const option = computed(() => ({
  title: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '13%',
    top: '35px',
    containLabel: true
  },
  textStyle: {
    color: '#fff'
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    axisLabel: {
      formatter: '{value} KW'
    },
  },
  xAxis: {
    type: 'category',
    data: props.electricityInfo.monthList.map(item => `${item}月`)
  },
  series: [
    {
      name: '月电量(kw/h)',
      type: 'bar',
      data: props.electricityInfo.originalEnergyList,
      itemStyle: {
        color: '#5087EC'
      }
    },
    {
      name: '节能(kw/h)',
      type: 'bar',
      data: props.electricityInfo.thisYear,
      itemStyle: {
        color: '#68BBC4'
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
