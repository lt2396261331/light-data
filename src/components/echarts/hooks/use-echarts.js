import * as echarts from 'echarts'

export default function (el) {
  const echartsInstance = echarts.init(el)

  const setOptions = (options) => {
    echartsInstance.setOption(options)
  }

  const updateSize = () => {
    echartsInstance.resize()
  }

  window.addEventListener('resize', () => {
    echartsInstance.resize()
  })

  return { echartsInstance, setOptions, updateSize }
}
