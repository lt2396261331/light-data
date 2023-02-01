<template>
  <div class="day-eletricity">
    <card title="日电量数据">
      <echarts :option="option"></echarts>
    </card>
  </div>
</template>

<script setup>
import Echarts from '@/components/echarts/index.vue'
import Card from '@/components/card/index.vue'

const option = {
  xAxis: {
    type: 'category',
    data: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ]
  },
  yAxis: {
    type: 'value'
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
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      lineStyle: {
        color: '#fff'
      },
      itemStyle: {
        color: '#fff'
      }
    }
  ]
}
</script>

<style scoped lang="scss">

::v-deep(.title) {
  padding: 10px 0 !important;
}
</style>
