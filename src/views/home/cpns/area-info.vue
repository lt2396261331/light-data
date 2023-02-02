<template>
  <div class="area-info">
    <div class="name">
      <span class="text">选终区域：{{ areaInfo.areaName }}</span>
      <div class="btn">
        <el-button type="primary" size="small" round @click="allLight">全亮</el-button>
        <el-button type="primary" size="small" round @click="resetAuto">回复自动</el-button>
      </div>
    </div>
    <div class="group">包含分组：{{ areaInfo.areaGroup }}</div>
    <div class="close" @click="close"><el-icon><CircleCloseFilled /></el-icon></div>
  </div>
</template>

<script setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps({
  areaInfo: {
    type: Object,
    default: () => ({
      areaName: '机械装备区'
    })
  }
})

const emits = defineEmits(['close'])
const close = () => {
  emits('close')
}

// 全亮
const allLight = () => {}
// 恢复自动
const resetAuto = () => {}
</script>

<style scoped lang="scss">
.area-info {
  position: relative;

  height: 70px;
  width: 30%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 15px;

  .name {
    display: flex;
    .text {
      flex: 1;
    }
    .btn {
      width: 160px;
      display: inline-block;
      margin-left: 100px;
    }
  }

  .close {
    position: absolute;
    right: 4px;
    top: 4px;
    font-size: 20px;
  }
}
</style>
