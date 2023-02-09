<template>
  <div class="add-area">
    <darw-box @save-cover-info="addAreaHandle" />
  </div>
</template>

<script setup>
import darwBox from './cpns/darw-box.vue'
import { addArea } from '@/services/module/hx-light'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';

const router = useRouter()
const addAreaHandle = async info => {
  const res = await addArea(info)
  if (res.errorCode === 0) {
    ElMessage.success({
      message: '操作成功'
    })
    router.push('/area')
  } else {
    ElMessage.error({
      message: res.msg
    })
  }
}
</script>
