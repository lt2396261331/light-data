<template>
  <div class="month-electricity">
    <card title="月电量&节能">
      <echarts :option="option"></echarts>
    </card>
  </div>
</template>

<script setup>
import Echarts from '@/components/echarts/index.vue'
import Card from '@/components/card/index.vue'

const option = {
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
    boundaryGap: [0, 0.01]
  },
  xAxis: {
    type: 'category',
    data: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月'
    ]
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: '2012',
      type: 'bar',
      data: [19325, 23438, 31000, 121594, 134141, 681807]
    }
  ]
}
</script>

<style scoped lang="scss">
::v-deep(.title) {
  padding: 10px 0 !important;
}
</style>
