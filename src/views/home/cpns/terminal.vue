<template>
  <div class="terminal">
    <card title="运行终端">
      <div class="content">
        <div class="sum">
          <div class="icon item">
            <img src="@/assets/image/home/bg-circle.png" alt="" />
            <img
              class="inner-img"
              src="@/assets/image/home/bg-terminal.png"
              alt=""
            />
          </div>
          <div class="num item">
            <div>
              <span class="electricity up-down">{{ successLight }}个</span>
              <span class="circle">正常运行灯</span>
            </div>
            <div>
              <span class="electricity up-down">{{ normalLight }}个</span>
              <span class="circle">离线灯</span>
            </div>
            <div>
              <span class="electricity up-down">{{ errorLight }}个</span>
              <span class="circle">故障灯</span>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="item">
            <span class="circle name">灯节点</span>
            <span>{{ terminalInfo.lightcount }}个</span>
          </div>
          <div class="item">
            <span class="circle name">光 敏</span>
            <span>{{ terminalInfo.photosensitive }}个</span>
          </div>
          <div class="item">
            <span class="circle name">电 表</span>
            <span>{{ terminalInfo.meterCount }}个</span>
          </div>
          <div class="item">
            <span class="circle name">网 关</span>
            <span>{{ terminalInfo.chanelCount }}个</span>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script setup>
import Card from '@/components/card/index.vue'

defineProps({
  successLight: {
    type: Number,
    default: 100
  },
  errorLight: {
    type: Number,
    default: 0
  },
  terminalInfo: {
    type: Object,
    default: () => ({})
  },
  normalLight: {
    type: Number,
    default: 0
  }
})

</script>

<style scoped lang="scss">
.terminal {
  .sum {
    display: flex;
    height: 55px;
    .icon {
      position: relative;
      width: 30%;
      display: flex;
      justify-content: center;
      .inner-img {
        width: 20px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .num {
      display: flex;
      flex: 1;
      justify-content: space-evenly;
      align-items: center;
      .electricity {
        font-size: 20px;
        margin-bottom: 10px;
      }
    }
  }

  .info {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    .item {
      height: 30px;
      width: 50%;
      text-align: center;
      display: flex;
      padding-left: 24px;
      box-sizing: border-box;
      .name {
        width: 120px;
        text-align: left;
      }
    }
  }

  .up-down {
    display: flex;
    flex-direction: column;
  }
}
</style>
