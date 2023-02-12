<template>
  <div class="add-light">
    <el-dialog v-model="dialogVisible" title="打点标记" width="30%">
    <el-form :model="form">
      <el-form-item label="灯节点：" :label-width="100">
        <div>{{ form.nodeIEEEAddress }}</div>
      </el-form-item>
      <el-form-item label="所属分组：" :label-width="100">
        <div>{{ form.group }}</div>
      </el-form-item>
      <el-form-item label="灯坐标x：" :label-width="100">
        <el-input v-model="form.x" autocomplete="off" />
      </el-form-item>
      <el-form-item label="灯坐标y：" :label-width="100">
        <el-input v-model="form.y" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveClick">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emits = defineEmits('saveLightXy')

const dialogVisible = ref(false)
const form = ref({
  nodeIEEEAddress: '',
  group: '',
  x: '',
  y: '',
})

// 确定
const saveClick = () => emits('saveLightXy', form.value)

defineExpose({
  dialogVisible,
  form
})
</script>

<style scoped lang="scss">
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
