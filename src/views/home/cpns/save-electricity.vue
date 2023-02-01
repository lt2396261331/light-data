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
              <span class="electricity up-down">8966度</span>
              <span class="circle">本年用电</span>
            </div>
            <div>
              <span class="electricity up-down">1203度</span>
              <span class="circle">年节省用电</span>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
          <div class="item">
            <span class="circle">减排SO2</span>
            <span>25689kg</span>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script setup>
import Card from '@/components/card/index.vue'
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
      justify-content: space-evenly;
    }
  }
}

</style>
