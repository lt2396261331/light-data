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
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        >
        <el-table-column type="selection"  />
        <el-table-column property="id" label="灯节点id"  />
        <el-table-column property="name" label="灯名称"  />
        <el-table-column property="group" label="分组一" />
        <el-table-column property="group" label="分组二" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

// 表格数据
const tableData = [
  {
    id: '001',
    name: 'xxx区域',
    group: '001,002,003,004,005,006,007'
  },
  {
    id: '002',
    name: 'xxx区域',
    group: '001,002,003,004,005,006,007'
  },
  {
    id: '003',
    name: 'xxx区域',
    group: '001,002,003,004,005,006,007'
  },
  {
    id: '004',
    name: 'xxx区域',
    group: '001,002,003,004,005,006,007'
  },
  {
    id: '005',
    name: 'xxx区域',
    group: '001,002,003,004,005,006,007'
  }
]
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
