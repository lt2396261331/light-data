<template>
  <div class="card">
    <img class="bg-img" src="@/assets/image/home/bg-card.png" alt="" />
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '我是标题'
  }
})
</script>

<style scoped lang="scss">
.card {
  height: 260px;
  position: relative;
  color: #fff;
  /* padding: 20px; */
  .bg-img {
    position: absolute;
    width: 100%;
    height: 260px;
  }
  .container {
    height: 100%;
    padding: 10px 24px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .title {
      height: 18px;
      line-height: 18px;
      padding: 12px 0;
      font-size: 16px;
      /* margin: 10px 0; */
    }

    .content {
      flex: 1;
    }
  }
}
</style>
