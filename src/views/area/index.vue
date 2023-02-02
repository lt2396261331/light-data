<template>
  <div class="area">
    <div class="search-box">
      <div class="keyword">
        <el-input
          class="input"
          placeholder="区域名称/关联分组名称"
          size="small"
          v-model="serachValue"
        />
        <el-button type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
      </div>
      <el-button type="primary" size="small" @click="addAreaClick"
        >新增区域</el-button
      >
    </div>
    <div class="content">
      <el-table
        ref="tableRef"
        :data="areaList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" label="区域id" width="120">
        </el-table-column>
        <el-table-column property="areaName" label="区域名称" />
        <el-table-column property="areaGroup" label="关联分组详情" />
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

              <el-popconfirm
                title="你确定删除该数据吗"
                @confirm="handleRowData(scope.row, 'delete')"
              >
                <template #reference>
                  <el-link
                    type="warning"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                  >
                    删除
                  </el-link>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 25, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rowCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :small="true"
          class="page-pagination"
        />
      </div>
    </div>
    <location ref="locationRef" :floor="focusLevel"/>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import useAreaStore from '@/stores/areaStore'
import location from '@/components/location/index.vue'

import { deleteArea } from '@/services/module/hx-light'
import { ElMessage } from 'element-plus'

// 聚焦楼层
const focusLevel = ref(1)

// 分页参数
const pageSize = ref(10)
const pageNo = ref(1)
const serachValue = ref('')

const areaStore = useAreaStore()
// 获取数据
const getData = (value = '') => {
  areaStore.fetchAreaList(value, pageSize.value, pageNo.value)
}

getData()

const { areaList, rowCount } = storeToRefs(areaStore)

// 表格选择事件
const handleSelectionChange = val => {
  console.log(val)
}

const router = useRouter()
// 新增区域
const addAreaClick = () => {
  router.push('/add-area')
}

const locationRef = ref()
// 区域信息
// const detailAreaInfo = ref({})
// 操作
const handleRowData = async (val, type) => {
  // 查看区域
  if (type === 'detail') {
    locationRef.value.isShowDialog = true
    nextTick(() => {
      focusLevel.value = val.floorId
      locationRef.value.showArea(val)
    })
  } else if (type === 'delete') {
    console.log('删除', val)
    const res = await deleteArea(val.id)
    if (res.errorCode === 0) {
      ElMessage.success({
        message: '删除成功'
      })
      getData()
    } else {
      ElMessage.warning({
        message: res.msg
      })
    }
  } else {
    router.push('/update-area/' + val.id)
  }
}

const handleSearch = () => {
  getData(serachValue.value)
}

const handleSizeChange = val => {
  pageSize.value = val
  getData()
}

const handleCurrentChange = val => {
  pageNo.value = val
  getData()
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

.pagination-box {
  display: flex;
  justify-content: end;
  .page-pagination {
    margin-top: 20px;
  }
}
</style>
