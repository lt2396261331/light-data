<template>
  <div class="update">
    <darw-box action-type="update" @save-cover-info="updateArea" />
  </div>
</template>

<script setup>
import darwBox from './cpns/darw-box.vue'
import { updateAreaInfo } from '@/services/module/hx-light'
import { useRouter } from 'vue-router'

const router = useRouter()

const updateArea = async info => {
  const res = await updateAreaInfo(info)

  if (res.errorCode === 0) {
    ElMessage.success({
      message: '操作成功'
    })
    router.push('/area')
  }
}
</script>

<style scoped lang="scss"></style>
