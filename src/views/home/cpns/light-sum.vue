<template>
  <div class="light-sum">
    <card title="各亮度灯数量">
      <echarts :option="option"></echarts>
    </card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import Echarts from '@/components/echarts/index.vue'
import Card from '@/components/card/index.vue'

const props = defineProps({
  everyLightInfo: {
    type: Object,
    default: () => ({})
  }
})

const option = computed(() => ({
  title: {},
  tooltip: {
    trigger: 'item'
  },
  legend: {
    textStyle: {
      color: '#fff'
    }
  },
  textStyle: {
    color: '#fff'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: Number(props.everyLightInfo.light0), name: '0%' },
        { value: Number(props.everyLightInfo.light1), name: '10%' },
        { value: Number(props.everyLightInfo.light8), name: '80%' },
        { value: Number(props.everyLightInfo.light10), name: '100%' }
      ],
      itemStyle: {
        color: function (colors) {
          var colorList = ['#D7C6B3', '#F9C78B', '#F5A544', '#F98A05']
          return colorList[colors.dataIndex]
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))
</script>

<style scoped lang="scss"></style>
