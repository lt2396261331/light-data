<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import useLightStore from './stores/lightStore';

// const lightStore = useLightStore()
// // 提前获取分组信息 楼栋信息
// lightStore.fetchGroupList()
// lightStore.fetchGetCountryList()
</script>

<template>
  <Suspense>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </Suspense>
</template>

<style scoped></style>
