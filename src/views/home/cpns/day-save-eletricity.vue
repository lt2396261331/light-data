<template>
  <div class="day-save-eletricity">
    <card title="日节约用电">
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
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {}
    }
  ]
}
</script>

<style scoped lang="scss"></style>
