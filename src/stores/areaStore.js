import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  findAreaMsgByfloorId,
  getAreaList,
  findAllArea
} from '@/services/module/hx-light'

const useAreaStore = defineStore('areaStore', () => {
  // 分页列表
  const areaList = ref([])
  const rowCount = ref(0)

  // 分页查询区域列表
  const fetchAreaList = async (search, pageSize, pageNo) => {
    const res = await getAreaList(search, pageSize, pageNo)
    areaList.value = res.data.records
    rowCount.value = res.data.rowCount
  }

  // 根据floorId获取照明区域详细信息
  const fetchAreaMsgByfloorId = async floorId => {
    const res = await findAreaMsgByfloorId(floorId)
  }

  // 所有区域
  const allAreaList = ref([])
  // 查询所有区域
  const fetchAllAreaList = async () => {
    const { data } = await findAllArea()
    allAreaList.value = data
  }

  // 查看区域
  const areaDetailInfo = ref({})
  const showAreaInfoStatus = ref(false)

  return {
    areaList,
    rowCount,
    allAreaList,
    fetchAreaList,
    fetchAreaMsgByfloorId,
    fetchAllAreaList,

    areaDetailInfo,
    showAreaInfoStatus
  }
})

export default useAreaStore
