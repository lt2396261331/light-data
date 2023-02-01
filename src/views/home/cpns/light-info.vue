<template>
  <div class="light-info">
    <span>亮度：</span>
    <div class="item up-down">
      <img src="@/assets/image/home/light0.png" alt="">
      <span>0%</span>
    </div>
    <div class="item up-down">
      <img src="@/assets/image/home/light10.png" alt="">
      <span>10%</span>
    </div>
    <div class="item up-down">
      <img src="@/assets/image/home/light80.png" alt="">
      <span>80%</span>
    </div>
    <div class="item up-down">
      <img src="@/assets/image/home/light100.png" alt="">
      <span>100%</span>
    </div>
    <div class="item up-down">
      <img src="@/assets/image/home/light-bad.png" alt="">
      <span>故障</span>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.light-info {
  height: 55px;
  width: 300px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  .item {
    /* height: 55px; */
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
