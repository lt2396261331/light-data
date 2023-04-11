<template>
  <div class="light">
    <div class="search-box">
      <div class="group item">
        <span class="title">分组:</span>
        <el-select v-model="selectValue" placeholder="请选择" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in groupList"
            :key="item.deviceAreaID"
            :label="item.deviceAreaID"
            :value="item.deviceAreaID"
          />
        </el-select>
      </div>
      <div class="status item">
        <span class="title">状态:</span>
        <el-select v-model="statusValue" placeholder="请选择" size="small">
          <el-option
            v-for="item in statusOption"
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
        <el-button
          class="btn"
          size="small"
          type="primary"
          @click="btnSearchClick"
          >查询</el-button
        >
      </div>
      <!-- <div class="action item">
        <el-button class="btn" size="small" plain type="primary"
          >批量导入</el-button
        >
        <a href="#" class="upload">下载excel模板</a>
      </div> -->
    </div>
    <div class="content">
      <el-table
        ref="tableRef"
        :data="lightListInfo.list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="selection" />
        <el-table-column
          property="nodeIEEEAddress"
          label="灯节点id"
          width="200"
        />
        <el-table-column property="nodeName" label="灯名称" width="200" />
        <el-table-column property="groupIDNumber" label="分组一" />
        <el-table-column property="motionBr" label="有人亮度" />
        <el-table-column property="noMotionBr" label="无人亮度" />
        <el-table-column property="delayTime" label="延迟时间" />
        <el-table-column property="isUserControl" label="当前执行">
          <template #default>自动亮灯模式</template>
        </el-table-column>
        <el-table-column property="status" label="状态" />
        <el-table-column property="x" label="灯坐标x" />
        <el-table-column property="y" label="灯坐标y" />
        <el-table-column label="灯位置">
          <template #default="scoped">
            <img
              src="@/assets/image/home/position.png"
              @click="handleDeployClick(scoped.row)"
              class="icon"
            />
            <span class="text" @click="handleLockClick(scoped.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 25, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="lightListInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :small="true"
          class="page-pagination"
        />
      </div>
    </div>
    <location ref="localRef" title="查看位置" :floor="focusLevel" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useLightStore from '@/stores/lightStore'

import Location from '@/components/location/index.vue'
import { ElMessage } from 'element-plus'

const lightStore = useLightStore()
await lightStore.fetchGroupList()
await lightStore.fetchGetCountryList()
const { lightListInfo, countryInfo, groupList } = storeToRefs(lightStore)

const inputValue = ref()
const selectValue = ref('')

const statusOption = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '正常',
    label: '正常'
  },
  {
    value: '离线',
    label: '离线'
  },
  {
    value: '故障',
    label: '故障'
  }
]
const statusValue = ref('')

const localRef = ref()
const focusLevel = ref(1)
const handleLockClick = val => {
  const groupInfo = groupList.value.find(item => item.deviceAreaID ==  val.groupIDNumber)
  if (!groupInfo) {
    ElMessage.error({
      message: '灯分组所在楼层为空'
    })
    return 
  }
  // 设置楼层
  focusLevel.value = groupInfo.floorID
  const lightInfo = { ...val, level: groupInfo.floorID }
  localRef.value.isShowDialog = true
  localRef.value.showLightPosition(lightInfo)
}


const router = useRouter()
const handleDeployClick = val => {
  const groupInfo = groupList.value.find(item => item.deviceAreaID ==  val.groupIDNumber)
  if (!groupInfo) {
    ElMessage.error({
      message: '灯分组所在楼层为空'
    })
    return 
  }
  router.push({
    path: '/deploy-light',
    query: {
      nodeIEEEAddress: val.nodeIEEEAddress,
      group: val.groupIDNumber,
      floor: groupInfo.floorID
    }
  })
}

const handleSelectionChange = val => {
}
// 分页参数
const pageSize = ref(10)
const pageNo = ref(1)

const getData = () => {
  const params = {
    PageNum: pageNo.value,
    PageSize: pageSize.value,
    GroupIDNumber: selectValue.value,
    NodeName: inputValue.value,
    Status: statusValue.value,
    NodelEEEAddress: '',
    CountryID: countryInfo.value.countryID
  }
  lightStore.fetchLightListBySearch(params)
}
if (!countryInfo.value) await lightStore.fetchGetCountryList()
getData()

const handleSizeChange = val => {
  pageSize.value = val
  getData()
}

const handleCurrentChange = val => {
  pageNo.value = val
  getData()
}

const btnSearchClick = () => {
  getData()
}
</script>

<style scoped lang="scss">
.light {
  padding: 30px 40px;

  .search-box {
    display: flex;
    width: 45vw;

    .input {
      .btn {
        margin-left: 5px;
      }
    }

    .item {
      flex: 1;
      margin-left: 20px;
      display: flex;
      align-items: center;
      &.input {
        flex: 1.5;
      }

      .upload {
        color: #777;
      }
      .title {
        margin-right: 15px;
      }
    }
  }

  .content {
    padding: 30px 20px;

    .icon {
      width: 20px;
      cursor: pointer;
      user-select: none;
    }

    .text {
      margin-left: 10px;
      vertical-align: bottom;
      font-size: 13px;
      color: #409eff;
      cursor: pointer;
      user-select: none;
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
