import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import {
  getLayers,
  getGroupsByIDs,
  getLightNodes,
  getLightListBySearch,
  getYearMeterData,
  getMonthMeterData,
  getTotalTerminalCount
} from '@/services/module/fl-light'
import { COUNTRY_NAME } from '@/constants'

const useLightStore = defineStore('light', () => {
  // 获取当前院，楼栋，楼层信息
  const countryInfo = ref([])
  const fetchGetCountryList = async () => {
    const { data } = await getLayers()
    countryInfo.value = data.find(
      country => country.countryName === COUNTRY_NAME
    )
  }

  // 灯信息列表
  const lightListInfo = reactive({
    list: [],
    total: 0
  })
  const lightAllList = ref([])
  // 根据搜索条件获取灯信息列表
  const fetchLightListBySearch = async searchInfo => {
    const { data } = await getLightListBySearch(searchInfo)
    lightListInfo.list = data.model_Out_LightInfos
    lightListInfo.total = data.totalCount
  }
  // 获取灯信息列表
  const fetchLightList = async () => {
    const { data } = await getLightNodes()
    lightAllList.value = data
  }
  

  // 分组信息
  const groupList = ref([])
  // 获取组信息
  const fetchGroupList = async () => {
    const { data } = await getGroupsByIDs()
    groupList.value = data
  }

  // 电表年数据
  const yearMeterData = reactive({
    monthList: [],
    thisYear: [],
    originalEnergyList: []
  })
  const monthMeterData = reactive({
    dayList: [],
    thisMonth: [],
    originalEnergyList: []
  })
  // 获取电表年数据
  const fetchYearMeterData = async () => {
    const { data } = await getYearMeterData()
    yearMeterData.originalEnergyList = data.originalEnergyList
    yearMeterData.thisYear = data.thisYear
    yearMeterData.monthList = data.monthList
  }

  // 电表月数据
  const fetchMonthMeterData = async () => {
    const { data } = await getMonthMeterData()
    monthMeterData.dayList = data.dayList
    monthMeterData.thisMonth = data.thisMonth
    monthMeterData.originalEnergyList = data.originalEnergyList
  }

  // 获取终端数据
  const terminalInfo = ref({})
  const fetchTerminalData = async () => {
    const res = await getTotalTerminalCount()
    terminalInfo.value = res.data
  }

  return {
    countryInfo,
    fetchGetCountryList,

    lightListInfo,
    lightAllList,
    fetchLightList,
    fetchLightListBySearch,

    groupList,
    fetchGroupList,

    yearMeterData,
    monthMeterData,
    fetchYearMeterData,
    fetchMonthMeterData,

    terminalInfo,
    fetchTerminalData
  }
})

export default useLightStore
