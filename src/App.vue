<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <Suspense>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </Suspense>
</template>

<style scoped></style>
