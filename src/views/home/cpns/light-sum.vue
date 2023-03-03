<template>
  <div class="light-sum">
    <card title="灯区域划分详情">
      <div class="title">
        <span>楼层</span>
        <span>区域名称</span>
        <span>查看</span>
      </div>
      <el-scrollbar  class="list" height="163px" >
        <template v-for="item of allAreaList" :key="item.id">
          <div class="item" :class="{'list-active': item.id === areaDetailInfo.id}">
            <span>F{{ item.floorId }}</span>
            <span>{{ item.areaName }}</span>
            <span class="thi iconfont icon-chakanyanjingshishifenxi2" @click="showAreaDetail(item)"></span>
          </div>
        </template>
      </el-scrollbar>
    </card>
  </div>
</template>

<script setup>
import useAreaStore from '@/stores/areaStore'
import { storeToRefs } from 'pinia';

const emits = defineEmits(['clickShowArea'])

const areaStore = useAreaStore()
const { allAreaList, areaDetailInfo } = storeToRefs(areaStore)

const showAreaDetail = item => {
  emits('clickShowArea', item)
}

</script>

<style scoped lang="scss">
.item {
  display: flex;
  font-size: 14px;
  padding: 8px 0;
  box-sizing: border-box;
  justify-content: space-around;
  .thi {
    cursor: pointer;
  }
}

.title {
  display: flex;
  font-size: 14px;
  justify-content: space-around;
  margin: 12px 0;
}

.list-active .thi {
  color: #2d8cf0 !important;
}
</style>
