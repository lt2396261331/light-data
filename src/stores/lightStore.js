import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getLayers,
  getGroupsByIDs,
  getLightList
} from '@/services/module/fl-light'
import { COUNTRY_NAME } from '@/constants'


const useLightStore = defineStore('light', () => {
  // 获取当前院，楼栋，楼层信息
  const countryInfo = ref([])
  const fetchGetCountryList = async () => {
    const { data } = await getLayers()
    countryInfo.value = data.find(
      country => country.CountryName === COUNTRY_NAME
    )
  }

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
    groupList.value = data
  }

  return {
    countryInfo,
    fetchGetCountryList,

    lgihtList,
    fetchLightList,

    groupList,
    fetchGroupList
  }
})

export default useLightStore
