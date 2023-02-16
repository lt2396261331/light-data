<template>
  <div class="area-info">
    <div class="name">
      <span class="text">选终区域：{{ areaInfo.areaName }}</span>
      <div class="btn">
        <el-button type="primary" size="small" round @click="allLight">全亮</el-button>
        <el-button type="primary" size="small" round @click="resetAuto">恢复自动</el-button>
      </div>
    </div>
    <p class="group">包含分组：{{ areaInfo.areaGroup }}</p>
    <div class="close" @click="close"><el-icon><CircleCloseFilled /></el-icon></div>
    <div class="alter p-ab-center" v-if="message">
      <el-button round size="small" disabled>操作成功</el-button>
    </div>
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
  },
  message: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'allBright', 'resetAuto'])
const close = () => {
  emits('close')
}

// 全亮
const allLight = () => {
  emits('allBright', props.areaInfo.areaGroup, 'light')
}
// 恢复自动
const resetAuto = () => {
  emits('resetAuto', props.areaInfo.areaGroup)
}
</script>

<style scoped lang="scss">
.area-info {
  position: relative;

  
  width: 30%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 15px;
  padding-top: 12px;

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

  .group {
    word-break: break-all;
  }

  .close {
    position: absolute;
    right: 4px;
    top: 4px;
    font-size: 20px;
  }
}
</style>
