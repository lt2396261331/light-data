import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGroupsByIDs, getLightList } from '@/services/module/fl-light'


const useLightStore = defineStore('light', () => {

  // 灯信息列表
  const lgihtList = ref([])
  // 获取灯信息列表
  const fetchLightList = async () => {
    const { data } = await getLightList()
    console.log(data)
    lgihtList.value = data
  }

  // 分组信息
  const groupList = ref([])
  // 获取组信息
  const fetchGroupList = async () => {
    const { data } = await getGroupsByIDs()
    console.log(data)
  }

  return {
    lgihtList,
    fetchLightList,

    groupList,
    fetchGroupList
  }
})

export default useLightStore
