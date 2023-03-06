import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import {
  getLayers,
  getGroupsByIDs,
  getLightNodes,
  getLightListBySearch,
  getYearMeterData,
  getMonthMeterData,
  getTotalTerminalCount,
  getEmissionTotalInfo,
  getElectricitys
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
    const date = dayjs().format('YYYY-MM')
    const { data } = await getMonthMeterData(date)
    monthMeterData.dayList = data.dayList
    monthMeterData.thisMonth = data.thisMonth.map(item => Number(item).toFixed(1))
    monthMeterData.originalEnergyList = data.originalEnergyList.map(item => Number(item).toFixed(1))
  }

  // 获取终端数据
  const terminalInfo = ref({})
  const fetchTerminalData = async () => {
    const res = await getTotalTerminalCount()
    terminalInfo.value = res.data
  }

  // 获取排放数据
  const emissionTotalInfo = ref({})
  const fetchEmissionTotalInfo = async () => {
    const { data } = await getEmissionTotalInfo()
    emissionTotalInfo.value = data
  }

  // 获取节电数据
  const saveElectricitys = ref({})
  const fetchGetElectricitys = async () => {
    const { data } = await getElectricitys()
    saveElectricitys.value = data
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
    fetchTerminalData,

    emissionTotalInfo,
    fetchEmissionTotalInfo,
    saveElectricitys,
    fetchGetElectricitys
  }
})

export default useLightStore
