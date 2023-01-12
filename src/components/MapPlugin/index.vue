<template>
  <div class="map-plugin" :style="{ left: right, bottom: bottom }">
    <div class="d3-box" :class="{ active: D3Active }" @click="select3D">
      <span class="iconfont icon-d"></span>
      <span class="d3-text">3D</span>
    </div>
    <div
      class="full-box"
      :class="{ active: fullFloor }"
      @click="selectFloorShow"
    >
      <span class="iconfont icon-lingxing"></span>
    </div>
    <div class="floor-box">
      <div class="scorll-bar">
        <div
          class="floor-item"
          @click="selectFloor(item)"
          v-for="item in floorList"
          :key="item.floorId"
        >
          <span
            class="floor-text"
            :class="{ active: activeFloor === item.number }"
            >{{ item.name }}</span
          >
        </div>
        <!-- <div
          class="floor-item"
          @click="selectFloor(item)"
          v-for="item in floorList"
          :key="item.floorId"
        >
          <span
            class="floor-text"
            :class="{ active: activeFloor === item.number }"
            >{{ item.name }}</span
          >
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRef, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useMapStore from '@/stores/mapStore'

export default {
  props: {
    right: {
      type: String
    },
    bottom: {
      type: String
    },
    level: {
      type: Number
    },
    levelList: {
      type: Array
    },
    outStatus: {
      type: Boolean
    }
  },
  setup(props, context) {
    const levelRef = toRef(props, 'level')
    const { levelList, outStatus } = props

    const { mapFloor } = storeToRefs(useMapStore())

    //3D状态
    const D3Active = ref(false)
    //全景模式
    const fullFloor = ref(false)
    //激活楼层
    const activeFloor = ref()
    //楼层列表
    const floorList = ref([])
    //初始化地图插件
    const initMapPlugin = () => {
      activeFloor.value = levelRef.value
      let keys = Object.keys(mapFloor)
      let floorObj = {}
      mapFloor.value.forEach((value) => {
        let num = value.number
        floorObj[num] = { ...value, floorId: value.number }
      })
      let floorItems = []
      //倒序楼层
      let levelItems = [...levelList].reverse()
      levelItems.forEach((level) => {
        floorItems.push({ ...floorObj[level] })
      })

      floorList.value = floorItems
    }
    //切换2D/3D视图
    const select3D = () => {
      D3Active.value = !D3Active.value
      let params = {
        type: '3D',
        val: D3Active.value ? '3D' : '2D'
      }
      context.emit('mapEvent', params)
    }
    //切换全图/单层视图
    const selectFloorShow = () => {
      fullFloor.value = !fullFloor.value
      let params = {
        type: 'floor-full',
        val: fullFloor.value
      }
      context.emit('mapEvent', params)
    }
    //切换楼层
    const selectFloor = (floor) => {
      activeFloor.value = floor.number
      let params = {
        type: 'floor',
        val: floor.number
      }
      context.emit('mapEvent', params)
    }

    onMounted(() => {
      initMapPlugin()
    })

    watch(levelRef, (val) => {
      if (activeFloor.value !== val && val !== 0) {
        context.emit('mapEvent', { type: 'floor', val: val })
      }
      activeFloor.value = val
    })

    return {
      D3Active,
      fullFloor,
      activeFloor,
      floorList,
      select3D,
      selectFloorShow,
      selectFloor
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variable';

.scroll-bar {
  height: 186px;
  overflow-y: auto;
}
.map-plugin {
  position: absolute;
  z-index: 4;
}
.active {
  color: $font-basic !important;
}
.d3-box {
  width: 40px;
  height: 48px;
  text-align: center;
  color: $font-light;
  background: $bg-white;
  cursor: pointer;
  user-select: none;
  font-size: 0;
  border-radius: 4px;
  margin-bottom: 12px;
  padding-top: 4px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 $border-transparent;
  .icon-d {
    font-size: 22px;
  }
  .d3-text {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    line-height: 12px;
  }
}
.full-box {
  background: $bg-white;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $font-light;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 $border-transparent;
  .icon-lingxing {
    font-size: 24px;
  }
}
.floor-box {
  background: $bg-white;
  width: 40px;
  max-height: 186px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 4px 0 $border-transparent;
  position: relative;
  z-index: 2;
  .floor-item {
    display: inline-block;
    width: 40px;
    padding: 0 4px;
    box-sizing: border-box;
    &:last-child > .floor-text {
      border: none;
    }
  }
  .floor-text {
    display: inline-flex;
    width: 100%;
    height: 36px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: $font-light;
    border-bottom: 1px solid $border-transparent;
    cursor: pointer;
    user-select: none;
    font-weight: bolder;
  }
}
</style>
