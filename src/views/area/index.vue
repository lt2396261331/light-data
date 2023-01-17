<template>
  <div class="area">
    <div class="search-box">
      <div class="keyword">
        <el-input
          class="input"
          placeholder="区域名称/关联分组名称"
          size="small"
        />
        <el-button type="primary" size="small">查询</el-button>
      </div>
      <el-button type="primary" size="small" @click="addAreaClick"
        >新增区域</el-button
      >
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
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" label="区域id" width="120">
        </el-table-column>
        <el-table-column property="name" label="区域名称" width="120" />
        <el-table-column property="group" label="关联分组详情" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="action">
              <el-link type="primary" @click="handleRowData(scope.row, 'edit')"
                >修改</el-link
              >
              <el-link
                type="primary"
                @click="handleRowData(scope.row, 'detail')"
                >查看</el-link
              >

              <el-popconfirm title="你确定删除该数据吗">
                <template #reference>
                  <el-link
                    type="warning"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @click="handleRowData(scope.row, 'delete')"
                  >
                    删除
                  </el-link>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <location ref="locationRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import location from '@/components/location/index.vue'

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

// 表格选择事件
const handleSelectionChange = val => {
  console.log(val)
}

const router = useRouter()
// 新增区域
const addAreaClick = () => {
  router.push('/add-area')
}

// 查看区域
const locationRef = ref()
// 操作
const handleRowData = (val, type) => {
  if (type === 'detail') {
    locationRef.value.isShowDialog = true
  }
}
</script>

<style scoped lang="scss">
.area {
  padding: 30px 40px;

  .search-box {
    display: flex;
    width: 400px;
    justify-content: space-between;
    .keyword {
      width: 260px;
      display: flex;
      justify-content: space-between;

      .input {
        width: 200px;
      }
    }
  }
  .content {
    margin-top: 40px;

    .action {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
