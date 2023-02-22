<template>
  <div class="save-electricity">
    <card title="节约用电情况">
      <div class="content">
        <div class="sum">
          <div class="icon item">
            <img src="@/assets/image/home/bg-circle.png" alt="" />
            <img
              class="inner-img"
              src="@/assets/image/home/bg-save.png"
              alt=""
            />
          </div>
          <div class="num item">
            <div>
              <span class="electricity up-down">{{ saveElectricitys.totalElectricity }}度</span>
              <span class="circle">本年累计用电</span>
            </div>
            <div>
              <span class="electricity up-down">{{ saveElectricitys.saveElectricity }}度</span>
              <span class="circle">本年累计节省用电</span>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="item">
            <span class="circle name">减排CO2</span>
            <span>{{ emissionInfo.cO2 }}kg</span>
          </div>
          <div class="item">
            <span class="circle name">减排SO2</span>
            <span>{{ emissionInfo.sO2 }}kg</span>
          </div>
          <div class="item">
            <span class="circle name">减排碳粉尘</span>
            <span>{{ emissionInfo.carbonDust }}kg</span>
          </div>
          <div class="item">
            <span class="circle name">节约标准煤</span>
            <span>{{ emissionInfo.coal }}kg</span>
          </div>
          <div class="item">
            <span class="circle name">减排氮氧化合物</span>
            <span>{{ emissionInfo.no }}kg</span>
          </div>
          <div class="item">
            <span class="circle name">约等于植树</span>
            <span>{{ emissionInfo.tree }}棵</span>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script setup>
import Card from '@/components/card/index.vue'


defineProps({
  emissionInfo: {
    type: Object,
    default: () => ({})
  },
  saveElectricitys: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.save-electricity {
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
}

</style>
