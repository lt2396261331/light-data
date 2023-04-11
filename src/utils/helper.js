// 表单格式提交数据转化
export const conversionFrom = function (data) {
  let formData = ''
  for (let val in data) {
    formData += `${encodeURIComponent(val)}=${encodeURIComponent(data[val])}&`
  }
  return formData
}
//过滤input输入框特殊字符
export const filterVal = val => {
  return val
    .replace(
      /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,
      ''
    )
    .replace(/\s/g, '')
}
//列表日期转化
export const dateConversion = date => {
  let dateArr = date.split('T')
  return `${dateArr[0]} ${dateArr[1]}`
}

//复制对象
export const copyObj = obj => {
  let objStr = Object.prototype.toString.call(obj)
  let newObj = objStr === '[object Array]' ? [] : {}
  if (objStr === '[object Array]') {
    obj.forEach(arr => {
      let arrObj = {}
      for (let val in arr) {
        if (arr[val] === null || typeof arr[val] !== 'object') {
          arrObj[val] = arr[val]
        } else {
          arrObj[val] = copyObj(arr[val])
        }
      }
      newObj.push(arrObj)
    })
  } else {
    for (let val in obj) {
      if (obj[val] === null || typeof obj[val] !== 'object') {
        newObj[val] = obj[val]
      } else {
        newObj[val] = copyObj(obj[val])
      }
    }
  }
  return newObj
}
//转化日期第一种形式 YYYY-mm-ddTHH:MM:SS
export const formatDate = date => {
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`
  let day = date.getDate() + 1 < 10 ? `0${date.getDate()}` : date.getDate()
  let hour = date.getHours() + 1 < 10 ? `0${date.getHours()}` : date.getHours()
  let minute =
    date.getMinutes() + 1 < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return `${year}-${month}-${day}T${hour}:${minute}:00`
}
//转化日期第二种形式 YYYY-mm-dd
export const formDate2 = date => {
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${year}-${month}-${day}`
}
//转化日期第三种形式 (YYY-mm-dd HH:MM) => (YYY-mm-ddTHH:MM:SS)
export const formDate3 = date => {
  let dateArr = date.split(' ')
  return `${dateArr[0]}T${dateArr[1]}:00`
}
//转化日期第三种形式 (YYYY-mm-ddTHH:MM:SS) => (YYY/mm/dd HH:MM:SS)
export const formDate4 = date => {
  let dateArr = date.split('T')
  let dateStr = dateArr[0].replace(/-/g, '/')
  return `${dateStr} ${dateArr[1]}`
}
//获取当前时间字符串
export const currentTimeArr = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return [`${year}-${month}-${day} 00:00`, `${year}-${month}-${day} 23:59`]
}

//获取当前一周时间字符串
export const currentWeekTimeArr = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  let hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
  let minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  let weekDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  let weekYear = date.getFullYear()
  let weekMonth =
    weekDate.getMonth() + 1 < 10
      ? `0${weekDate.getMonth() + 1}`
      : `${weekDate.getMonth() + 1}`
  let weekDay =
    weekDate.getDate() < 10 ? `0${weekDate.getDate()}` : weekDate.getDate()
  return [
    `${weekYear}-${weekMonth}-${weekDay} 00:00`,
    `${year}-${month}-${day} ${hour}:${minute}`
  ]
}

//星期对应参数
export const weekendDay = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}
//巡检子任务状态
export const childTaskStatus = {
  0: '待巡检',
  1: '巡检中',
  2: '已完成',
  3: '已过期'
}

//下载文件,兼容IE浏览器
export const downloadFile = (blob, name) => {
  if (navigator.msSaveOrOpenBlob) {
    //IE浏览器
    navigator.msSaveOrOpenBlob(blob, name)
  } else {
    //其他浏览器
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob) // 创建下载的链接
    downloadElement.href = href
    downloadElement.download = name // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放掉blob对象
  }
}
//文件地址
export const $fileSrc = path => {
  if (process.env.NODE_ENV === 'development') {
    return `http://52.130.89.100:31808${path}`
  } else {
    return `/api${path}`
  }
}

//主模块渲染第一个路由页面
export const renderPath = (_this, path, menuList) => {
  console.log(path)
  let routeArr = path.split('/').slice(1)
  let parentPath = routeArr[1]
  if (routeArr.length < 3) {
    //获取首个可用子路由路径
    for (let i = 0; i < menuList.length; i++) {
      if (parentPath === menuList[i].name) {
        let childrenPath
        menuList[i].menu.forEach(item => {
          if (!item.isHide && !childrenPath) {
            childrenPath = item.name
          }
        })
        _this.$router.push(
          `${parentPath}/${childrenPath}?timeStr=${Date.now()}`
        )
        break
      }
    }
  }
}

//object转form格式
export const objToForm = data => {
  let keys = Object.keys(data)
  let params = new FormData()
  keys.forEach(key => {
    params.set(key, data[key])
  })
  return params
}

//两个数字模糊相等(相差值不大于10)
export const twoNumEqual = (num1, num2) => {
  let result = num1 - num2
  return result <= 1 && result >= -1
}

//获取多边形中心xy值
export const getCenterXY = items => {
  let { x, y } = items[0]
  let maxX = x
  let maxY = y
  let minX = x
  let minY = y
  for (let i = 1; i < items.length; i++) {
    let { x, y } = items[i]
    if (x > maxX) {
      maxX = x
    } else if (x < minX) {
      minX = x
    }
    if (y > maxY) {
      maxY = y
    } else if (y < minY) {
      minY = y
    }
  }
  let centerX = (maxX + minX) / 2
  let centerY = (maxY + minY) / 2
  return { centerX, centerY }
}

// 设备编号两个两个反转
// C5AA951C0397
// 97031C95AAC5
export function stringTowReverse(str) {
  const arr = []
  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      let temp = ''
      temp += str[i]
      temp += str[i + 1]
      arr.unshift(temp)
    }
  }

  return arr.join('')
}

// 随机获取颜色
export function getOneColor() {
  // 0-9之间的数
  const num = Math.floor(Math.random() * 10)
  const colorArray = [
    '#de868f',
    '#fcca00',
    '#f4ce98',
    '#FEFA83',
    '#CCF783',
    '#B4FDFF',
    '#93D2F3',
    '#7F83F7',
    '#B886F8',
    '#B886F8'
  ]

  return colorArray[num]
}

// 获取灯imageMaker的url
export function getLightUrl(status, brightness) {
  if (status === '在线') {
    return './mapImgs/light100.png'
  } else if (status === '正常') {
    return './mapImgs/light0.png'
  }
  return './mapImgs/light-bad.png'
}
