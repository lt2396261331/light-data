import { ref } from 'vue'
import { defineStore } from 'pinia'
import { findAreaMsgByfloorId, getAreaList } from '@/services/module/hx-light'

const useAreaStore = defineStore('areaStore', () => {
  const areaList = ref([])
  const rowCount = ref(0)

  // 分页查询区域列表
  const fetchAreaList = async (search, pageSize, pageNo) => {
    const res = await getAreaList(search, pageSize, pageNo)
    areaList.value = res.data.records
    rowCount.value = res.data.rowCount
    console.log(res)
  }

  // 根据floorId获取照明区域详细信息
  const fetchAreaMsgByfloorId = async floorId => {
    const res = await findAreaMsgByfloorId(floorId)
    console.log(res)
  }

  return {
    areaList,
    rowCount,
    fetchAreaList,
    fetchAreaMsgByfloorId
  }
})

export default useAreaStore
