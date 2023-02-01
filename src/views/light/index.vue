<template>
  <div class="light">
    <div class="search-box">
      <div class="group item">
        <span class="title">分组</span>
        <el-select v-model="selectValue" placeholder="请选择" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input item">
        <el-input
          v-model="inputValue"
          placeholder="请输入灯名/id"
          size="small"
        />
        <el-button class="btn" size="small" type="primary">查询</el-button>
      </div>
      <div class="action item">
        <el-button class="btn" size="small" plain type="primary"
          >批量导入</el-button
        >
        <a href="#" class="upload">下载excel模板</a>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="tableRef"
        :data="lgihtList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column property="ID" label="灯节点id" />
        <el-table-column property="NodeName" label="灯名称" />
        <el-table-column property="GroupID" label="分组一" />
        <el-table-column property="GroupIDNumber" label="分组二" />
        <el-table-column property="group" label="亮度" />
        <el-table-column property="group" label="有人亮度" />
        <el-table-column property="group" label="无人亮度" />
        <el-table-column property="group" label="延迟时间" />
        <el-table-column property="group" label="当前执行" />
        <el-table-column property="group" label="状态" />
        <el-table-column property="group" label="灯坐标x" />
        <el-table-column property="group" label="灯坐标y" />
        <el-table-column label="灯位置">
          <template #default>
            <el-button @click="handleClick">按钮</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <location ref="localRef" title="查看位置" :floor="focusLevel"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useLightStore from '@/stores/lightStore'
import { storeToRefs } from 'pinia'

import Location from '@/components/location/index.vue'

const lightStore = useLightStore()
lightStore.fetchLightList()

const { lgihtList } = storeToRefs(lightStore)

const inputValue = ref()
const selectValue = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

const localRef = ref()
const focusLevel = ref(1)
const handleClick = () => {
  localRef.value.isShowDialog = true
}

const handleSelectionChange = val => {
  console.log('handleSelectionChange', val)
}
</script>

<style scoped lang="scss">
.light {
  padding: 30px 40px;

  .search-box {
    display: flex;
    width: 55vw;

    .input {
      .btn {
        margin-left: 5px;
      }
    }

    .group {
      .title {
        width: 30px;
        margin-right: 5px;
      }
    }

    .item {
      flex: 1;
      margin-left: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      &.input {
        flex: 1.5;
      }

      .upload {
        color: #777;
      }
    }
  }

  .content {
    padding: 30px 20px;
  }
}
</style>
