import { computed, reactive, ref, onBeforeUnmount } from 'vue'
// import { useStore } from 'vuex'

export default function useFengMap() {
  //地图对象
  let map
  // 楼层/3D   /页面缩放
  let toolbar, stretchBar
  //覆盖物对象
  let cover = {
    riskAreaCircle: [],
    riskAreaPolygon: [],
    electricFenceCircle: [],
    electricFencePolygon: []
  }
  //文字对象
  let mapText = {
    riskArea: [],
    electricFence: [],
    marker: [],
    position: []
  }
  //坐标标记列表
  let pointMarker = {
    //普通标记点列表
    markList: [],
    //人员定位点列表
    memberList: [],
    //告警定位点列表
    warnList: [],
    //sos告警列表
    sosList: [],
    //传感器列表
    aepList: [],
    // 区域告警列表
    RiskList: [],
    //电子围栏告警列表
    fenceList: [],
    //图片标记点列表
    POIList: [],
    //新增图片标记点列表
    newImageList: [],
    //视频标记点
    videoList: []
  }
  //自定义标记列表
  let domMarkerList = {
    text: [],
    member: [],
    warn: [],
    sos: [],
    aep: [],
    fence: []
  }
  //人员定位点集合
  let memberPositionMarker = {}
  //人员定位人员名集合
  let memberPositionText = {}
  //自定义弹框提示
  let modalDomMarker = null
  // 安全风险区域提示框
  let riskDomMarkerList = []
  //标记点字符串集合
  let markerGather = []
  //线集合
  let lineMarkerList = []
  //是否添加标记点
  let addMarkerStatus = false
  // 点击打点标记
  const addMarker_click = false
  //分析器列表
  let analyserList = []
  //路线段列表
  let routeLineList = []
  //分析器对象
  let analyserObj = null
  //热力图数据
  let hotAreas = []

  //历史位置定位点
  let historyMarker = []
  //历史定位起点
  let historyStartMarker = []
  //历史文字移动
  let historyTextMarker = null

  //定位点集合
  let markerPoints = reactive({
    points: []
  })
  //人员图标点集合
  let memberPoints = reactive({ points: [] })
  //告警图标点集合
  let warnPoints = reactive({ points: [] })
  // 是否监听多边形覆盖物点击
  const clickPolygonStatus = ref(false)
  // 多边形点击集合
  const polygonPoint = ref([])
  //点击事件点集合
  let clickEvents = reactive({ points: [] })
  //视频图标点集合
  const videoPoints = reactive({ points: [] })
  //当前楼层
  let level = ref()
  //楼层列表
  const levelList = ref([])
  //地图加载状态
  let mapStatus = ref(false)

  //生成加载地图
  const loadMap = (mapDom, showMapControl = true) => {
    return new Promise((resolve, reject) => {
      if (map) {
        disposeMap()
      }

      let options = {
        appName: 'huixun',
        key: 'b0318a6707ee2e6a8cbc63f3dd2bd82a',
        mapID: '1596039795349127169',
        container: mapDom,
        mapURL: '/fengmap/',
        themeURL: '/theme/',
        themeID: '1596039795349127169',
        highlightColor: 'none',
        floorSpace: 25, // 设置楼层高度
        // nonFocusAlphaMode: true,
        nonFocusAlpha: 0.2,
        // mapZoom: 20,
        viewMode: fengmap.FMViewMode.MODE_2D
      }
      map = new fengmap.FMMap(options)
      // 地图加载完成事件
      map.on('loaded', function () {
        // loadDimensionCtrl(map)
        // loadStretchBar(map)
        level.value = map.getLevel()
        levelList.value = map.getLevels()
        mapStatus.value = true

        let floor = map.getFloor(map.getLevel())
        let bound = floor.getBound()
        map.setFitView(bound)

        if (showMapControl) loadMapControl()
        resolve(map)
      })

      // 地图点击事件
      map.on('click', function (event) {
        let { targets, coords, level } = event
        //判断选择的是否是图片标注
        let imgTarget = targets.filter(arr => arr.type === 8)
        if (imgTarget.length) {
          // console.log(imgTarget)
          let { x, y, url } = imgTarget[0]
          if (url.includes('warn.png') || url.includes('warn1.png')) {
            warnPoints.points.push(`${x}-${y}`)
          } else if (url.includes('video.png')) {
            videoPoints.points.push(`${x}-${y}`)
          } else {
            memberPoints.points.push(`${x}-${y}-${level.value}`)
          }
          return
        }

        let { x, y } = coords
        let xy = `${x},${y}`

        // 判断选择的是否是多边形标注(圆形也是)
        const polygonTarget = targets.filter(arr => arr.type === 32)
        if (polygonTarget.length && clickPolygonStatus.value) {
          polygonPoint.value.push({x, y, level})
        }
        
        //添加页面标注点
        if (addMarkerStatus) {
          if (
            !markerGather.includes(xy) ||
            (markerGather.length > 2 && markerGather[0] === xy)
          ) {
            markerGather.push(xy)
            markerPoints.points.push({ x, y, xy: `${x},${y}` })
          }
        } else {
          clickEvents.points.push(xy)
        }
      })
      // 地图楼层切换事件
      map.on('levelChanged', function (event) {
        console.log('levelChanged')
        level.value = event.level
        let floor = map.getFloor(map.getLevel())
        let bound = floor.getBound()
        map.setFitView(bound)
      })
    })
    // console.log(fengmap)
  }

  // 加载地图控件
  const loadMapControl = () => {
    const scrollFloorCtlOpt = {
      position: fengmap.FMControlPosition.LEFT_BOTTOM,
      floorButtonCount: 5,
      offset: {
        x: 30,
        y: -50
      },
      viewModeControl: true,
      floorModeControl: true,
      needAllLayerBtn: true
    }
    const scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt)
    scrollFloorControl.addTo(map)
  }

  //设置楼层
  const setFloor = (val, cb) => {
    console.log(val)
    map.setLevel({
      level: val,
      animate: true
      // duration: 0.3,
      // finish: () => {
      //   cb && cb()
      // }
    })
  }
  //设置2D/3D模式
  const setMapModel = val => {
    let mode =
      val === '2D' ? fengmap.FMViewMode.MODE_2D : fengmap.FMViewMode.MODE_3D
    map.setViewMode({
      mode
    })
  }
  //设置楼层全部展示
  const setFullFloor = val => {
    let levels = map.getLevels()
    let currentLevel = map.getLevel()
    let showLevels = val ? levels : [currentLevel]
    map.setVisibleLevels(showLevels)
  }
  //显示楼层控件
  const loadDimensionCtrl = map => {
    //显示页面2D/3D，楼层插件
    toolbar = new fengmap.FMToolbar({
      position: fengmap.FMControlPosition.LEFT_BOTTOM,
      offset: {
        x: 40,
        y: -100
      }
    })
    toolbar.addTo(map)
  }
  //显示页面缩放插件
  const loadStretchBar = map => {
    stretchBar = new fengmap.FMZoomControl({
      position: fengmap.FMControlPosition.RIGHT_TOP,
      offset: {
        x: -40,
        y: 240
      }
    })
    stretchBar.addTo(map)
  }
  //设置点击地图是否获取坐标开关
  const setMarkerOpenStatus = status => {
    addMarkerStatus = status
  }
  // 设置是否监听点击地图多边形覆盖物
  const setCickPolygonStatus = status => {
    clickPolygonStatus.value = status
  }

  //添加坐标点
  const addMarker = ({ x, y, level, size, url }) => {
    let locationMarker = new fengmap.FMLocationMarker({
      x,
      y,
      size: size || 12,
      url: url || '/mapImgs/local.png',
      level: level || map.getLevel()
    })
    console.log(url)
    locationMarker.addTo(map)
    pointMarker.markList.push(locationMarker)
  }
  //添加图片定位点
  const addImageMarker = ({ x, y, type, id, size, level, url, height }) => {
    let imageMarker = new fengmap.FMImageMarker({
      x,
      y,
      height: height || 1,
      name: id,
      url: url || './mapImgs/member_icon.png',
      size: size || 24,
      anchor: fengmap.FMMarkerAnchor.BOTTOM
    })
    let floorLevel = level || map.getLevel()
    // console.log('map--->', map)
    let floor = map.getFloor(floorLevel)
    imageMarker.collision = false
    imageMarker.visible = true
    imageMarker.addTo(floor)
    if (type === 'POI') {
      pointMarker.POIList.push(imageMarker)
    } else if (type === 'new') {
      pointMarker.newImageList.push(imageMarker)
    } else if (type === 'member') {
      pointMarker.memberList.push(imageMarker)
    } else if (type === 'warn') {
      pointMarker.warnList.push(imageMarker)
    } else if (type === 'SOS') {
      pointMarker.sosList.push(imageMarker)
      // console.log(pointMarker.sosList)
    } else if (type === 'AEP') {
      pointMarker.aepList.push(imageMarker)
    } else if (type === 'Risk') {
      pointMarker.RiskList.push(imageMarker)
    } else if (type === 'fence') {
      pointMarker.fenceList.push(imageMarker)
    } else if (type === 'history') {
      historyMarker.push(imageMarker)
    } else if (type === 'historyStart') {
      historyStartMarker.push(imageMarker)
    } else if (type === 'memberPosition') {
      memberPositionMarker[id] = imageMarker
    } else if (type === 'video') {
      pointMarker.videoList.push(imageMarker)
    }
  }
  //移除视频标记点
  const removeVideoMarker = index => {
    removePointMarker('videoList', index)
  }
  //移除人员最后一个坐标点 （历史轨迹中使用）
  const removeLastMemberMarker = () => {
    let len = pointMarker.memberList.length
    if (len !== 0) {
      removePointMarker('memberList', len - 1)
    }
  }
  //移除历史定位点
  const removeHistoryMarker = () => {
    if (historyMarker.length) {
      historyMarker.forEach(item => item.remove())
      historyMarker = []
    }
  }
  //移除历史定位起点
  const removeHistoryStartMarker = () => {
    if (historyStartMarker.length) {
      historyStartMarker.forEach(item => item.remove())
      historyStartMarker = []
    }
  }
  //移除坐标点
  const removeMarker = index => {
    removePointMarker('markList', index)
  }
  //移除图片定位点
  const removeImageMarker = index => {
    removePointMarker('POIList', index)
  }
  //移除新增图片定位点
  const removeNewImageMarker = index => {
    removePointMarker('newImageList', index)
  }
  //移除人员定位点
  const removeMemberMarker = index => {
    removePointMarker('memberList', index)
  }
  //移除告警定位点
  const removeWarnMarker = (type, index) => {
    let typeObj = {
      SOS: 'sosList',
      AEP: 'aepList',
      Risk: 'RiskList',
      fence: 'fenceList'
    }
    removePointMarker(typeObj[type], index)
  }
  //移除坐标标记
  const removePointMarker = (key, index) => {
    if (key == null) {
      //清空所有标记
      let keys = Object.keys(pointMarker)
      keys.forEach(val => {
        pointMarker[val].forEach(item => item.remove())
        pointMarker[val] = []
      })
      return
    }
    if (!pointMarker[key].length) {
      return
    }
    if (index == null) {
      pointMarker[key].forEach(arr => arr.remove())
      pointMarker[key] = []
      if (key === 'markList' || key === 'newImageList') {
        markerPoints.points = []
      }
    } else {
      pointMarker[key][index].remove()
      pointMarker[key].splice(index, 1)
      if (key === 'markList' || key === 'newImageList') {
        markerPoints.points.splice(index, 1)
      }
    }
  }
  //添加自定义dom标记点
  const addDomMarker = ({ x, y, content, level }, type) => {
    let domMarker = new fengmap.FMDomMarker({
      x,
      y,
      content
    })
    let floor = map.getFloor(level)
    domMarker.addTo(floor)
    if (type === 'text') {
      removeTextDom()
    }
    domMarkerList[type].push(domMarker)
  }
  //移除告警dom标记点
  const removeTextDom = index => {
    removeDomMarker('text', index)
  }
  //移除dom标记点
  const removeDomMarker = (type, index) => {
    if (index == null) {
      if (domMarkerList[type].length) {
        domMarkerList[type].forEach(arr => arr.remove())
        domMarkerList[type] = []
      }
    } else {
      domMarkerList[type][index].remove()
      domMarkerList[type].splice(index, 1)
    }
  }
  //添加自定义弹框dom标记
  const addModalDomMarker = ({ x, y, content, level, type }) => {
    if (!type) {
      removeModalDom(type)
    }
    const domMarker = new fengmap.FMDomMarker({
      x,
      y,
      content
    })
    let floor = map.getFloor(level)
    domMarker.addTo(floor)
    if (type) {
      riskDomMarkerList.push(domMarker)
    } else {
      modalDomMarker = domMarker
    }
  }
  //移除弹框dom标记点
  const removeModalDom = () => {
    if (modalDomMarker) {
      modalDomMarker.remove()
    }
  }
  const removeAllModalDom = () => {
    if (riskDomMarkerList.length > 0) {
      riskDomMarkerList.forEach(item => item.remove())
      riskDomMarkerList = []
    }
  }

  //两点连线
  const linkPoint = (points, color, width) => {
    let segment = new fengmap.FMSegment()
    segment.points = []
    points.forEach(arr => {
      let { x, y } = arr
      segment.points.push({
        x,
        y,
        z: 1
      })
    })
    segment.level = map.getLevel()
    let lineMarker = new fengmap.FMLineMarker({
      segments: [segment],
      width: width || 2,
      color,
      animate: false
    })
    lineMarker.addTo(map)
    lineMarkerList.push(lineMarker)
  }
  //移除连线
  const removeLineMarker = () => {
    if (lineMarkerList.length) {
      lineMarkerList.forEach(arr => arr.remove())
      lineMarkerList = []
    }
  }
  //添加圆形覆盖物
  const addCircleCover = ({ x, y, r, bgColor, level }, coverType) => {
    let floor = map.getFloor(level)
    let circleOption = {
      points: fengmap.FMCalculator.circleBuilder(r, { x, y }, 100),
      color: bgColor,
      opacity: 0.5,
      borderWidth: 0
    }
    if (coverType === 'electricFence') {
      // circleOption.borderColor = 'red'
      // circleOption.borderWidth = 2
    }
    let circle = new fengmap.FMPolygonMarker(circleOption)
    circle.addTo(floor)
    if (coverType === 'riskArea') {
      cover.riskAreaCircle.push(circle)
    } else if (coverType === 'electricFence') {
      cover.electricFenceCircle.push(circle)
    }
  }
  //添加多边形覆盖物
  const addPolygonCover = ({ points, bgColor, level }, coverType) => {
    let floor = map.getFloor(level)
    let polygonOption = {
      color: bgColor,
      opacity: 0.5,
      points: points,
      borderWidth: 0
    }
    if (coverType === 'electricFence') {
      // polygonOption.borderColor = 'red'
      // polygonOption.borderWidth = 2
    }
    let polygon = new fengmap.FMPolygonMarker(polygonOption)
    polygon.addTo(floor)
    if (coverType === 'riskArea') {
      cover.riskAreaPolygon.push(polygon)
    } else if (coverType === 'electricFence') {
      cover.electricFencePolygon.push(polygon)
    }
  }
  //移除风险区域覆盖物
  const removeAreaCover = () => {
    removeGeometryCover('riskAreaCircle', 'riskAreaPolygon')
    removeAllModalDom()
  }
  //移除电子围栏覆盖物
  const removeElectricFenceCover = () => {
    removeGeometryCover('electricFenceCircle', 'electricFencePolygon')
  }
  //移除几何形状覆盖区域
  const removeGeometryCover = (circleKey, polygonKey) => {
    if (cover[circleKey].length) {
      cover[circleKey].forEach(item => item.remove())
      cover[circleKey] = []
    }
    if (cover[polygonKey].length) {
      cover[polygonKey].forEach(item => item.remove())
      cover[polygonKey] = []
    }
  }
  //添加文字覆盖物
  const addTextMarker = (x, y, text, level, type, id) => {
    let textOption = {
      x,
      y,
      text,
      fontsize: 14
    }
    let types = ['memberPosition', 'position', 'history']
    if (types.includes(type)) {
      textOption.fontsize = 16
      textOption.anchor = fengmap.FMMarkerAnchor.LEFT_TOP
    }
    let textMarker = new fengmap.FMTextMarker(textOption)
    textMarker.visible = true
    textMarker.collision = false
    let floor = map.getFloor(level)
    textMarker.addTo(floor)
    if (type === 'riskArea') {
      mapText.riskArea.push(textMarker)
    } else if (type === 'electricFence') {
      mapText.electricFence.push(textMarker)
    } else if (type === 'position') {
      mapText.position.push(textMarker)
    } else if (type === 'history') {
      historyTextMarker = textMarker
    } else if (type === 'memberPosition') {
      memberPositionText[id] = textMarker
    } else {
      mapText.marker.push(textMarker)
    }
  }
  //移除对应文字物
  const removeTextMarker = type => {
    if (type === 'riskArea') {
      mapText.riskArea.forEach(item => item.remove())
      mapText.riskArea = []
    } else if (type === 'electricFence') {
      mapText.electricFence.forEach(item => item.remove())
      mapText.electricFence = []
    } else if (type === 'position') {
      mapText.position.forEach(item => item.remove())
      mapText.position = []
    } else if (type === 'history') {
      if (historyTextMarker) {
        historyTextMarker.remove()
        historyTextMarker = null
      }
    } else {
      mapText.marker.forEach(item => item.remove())
      mapText.marker = []
    }
  }
  //移除首个历史标注文字
  const removeHistoryTextMarker = () => {
    mapText.position[0].remove()
    mapText.position.splice(0, 1)
  }
  //跟新历史标注文字
  const updateHistoryTextMarker = () => {
    // console.log(mapText.position)
    mapText.position.forEach((item, index) => {
      item.text = `${index + 1}`
      item.update()
    })
  }
  //添加路线
  const addRouteLine = lineList => {
    if (analyserObj != null) {
      //已有分析器
      lineList.forEach(item => {
        let { startX, startY, startLevel } = item.start
        let { endX, endY, endLevel } = item.end
        let naviRequest = {
          start: {
            level: startLevel,
            x: startX,
            y: startY
          },
          dest: {
            level: endLevel,
            x: endX,
            y: endY
          },
          mode: fengmap.FMNaviMode.MODULE_SHORTEST,
          priority: fengmap.FMNaviPriority.PRIORITY_DEFAULT
        }
        analyserObj.route(naviRequest, result => {
          drawRoute(result)
        })
      })
      return
    }
    //没有初始化过分析器，需要初始化一个分析器
    let options = {
      map,
      key: key.value,
      appName: appName.value,
      mapID: fmapID.value
    }
    let analyser = new fengmap.FMNaviAnalyser(
      options,
      () => {
        analyserObj = analyser
        lineList.forEach(item => {
          let { startX, startY, startLevel } = item.start
          let { endX, endY, endLevel } = item.end
          let naviRequest = {
            start: {
              level: startLevel,
              x: startX,
              y: startY
            },
            dest: {
              level: endLevel,
              x: endX,
              y: endY
            },
            mode: fengmap.FMNaviMode.MODULE_SHORTEST,
            priority: fengmap.FMNaviPriority.PRIORITY_DEFAULT
          }
          analyser.route(naviRequest, result => {
            drawRoute(result)
          })
        })
      },
      err => {
        console.lo(err)
      }
    )
  }
  //画导航线
  const drawRoute = route => {
    let segments = []
    let segment = new fengmap.FMSegment()
    for (let index = 0; index < route.subs.length; index++) {
      const leg = route.subs[index]
      if (leg.levels[0] === leg.levels[1]) {
        leg.waypoint.points.forEach(point => {
          point.z = 1
        })
        if (segment.points) {
          segment.points = segment.points.concat(leg.waypoint.points)
        } else {
          segment.points = leg.waypoint.points
        }
        segment.level = leg.levels[0]
        if (index === route.subs.length - 1) {
          segments.push(segment)
        }
      } else {
        segments.push(segment)
        segment = new fengmap.FMSegment()
      }
    }
    let line = new fengmap.FMLineMarker({
      segments: segments
    })
    line.addTo(map)
    routeLineList.push(line)
  }
  //移除导航线
  const removeRouteLine = () => {
    if (analyserList.length) {
      analyserList.forEach(item => item.dispose())
      analyserList = []
      analyserObj.dispose()
      analyserObj = null
    }
    if (routeLineList.length) {
      routeLineList.forEach(item => item.remove())
      routeLineList = []
    }
  }
  //移除最初的到航线
  const removeFirstRouteLine = () => {
    if (routeLineList.length) {
      routeLineList[0].remove()
      routeLineList.splice(0, 1)
    }
  }
  //svg坐标转化fengmap坐标
  const svgToFengMap = (x, y, floorId, radius) => {
    let mapFloor = store.state.map.mapFloor
    const { fengx, fengy, originx, originy, cadToFengx, cadToFengy } =
      mapFloor[floorId]
    // console.log('mapFloor', mapFloor.value[floorId])
    let fengX = fengx + (Number(x) - originx) * cadToFengx
    let fengY = fengy + (originy - Number(y)) * cadToFengy
    let fengR = radius ? radius * cadToFengx : radius
    return { fengX, fengY, fengR }
  }

  // fengmap坐标转换svg坐标
  const fengMapToSvg = (fengX, fengY, floorId, radius) => {
    let mapFloor = store.state.map.mapFloor
    const { fengx, fengy, originx, originy, cadToFengx, cadToFengy } =
      mapFloor[floorId]
    console.log('参数', mapFloor[floorId])
    let svgX = (fengX - fengx + originx * cadToFengx) / cadToFengx
    let svgY = (fengy + originy * cadToFengy - fengY) / cadToFengy
    let svgR = radius ? radius / cadToFengx : radius
    // 四舍五入为整数
    svgX = Math.round(svgX)
    svgY = Math.round(svgY)
    return { svgX, svgY, svgR }
  }

  //吸附路径计算
  const absorptionPath = coords => {
    let options = {
      map,
      key: key.value,
      appName: appName.value,
      mapID: fmapID.value
    }
    let analyser = new fengmap.FMNaviAnalyser(options, () => {
      coords.forEach((item, index) => {
        let { x, y, level, deviceId } = item
        let analyserObj = analyser.pathConstraint({
          x,
          y,
          level
        })
        let analyserCoords = analyserObj.coords
        if (!analyserCoords.x || !analyserCoords.y) {
          return
        }
        moveMemberMarker(x, y, analyserCoords.x, analyserCoords.y, deviceId)
        moveMemberDeviceText({
          x: analyserCoords.x,
          y: analyserCoords.y,
          id: deviceId
        })
      })
    })
  }

  // 计算路径吸附后坐标
  const absorptionPathXy = (item, callback) => {
    let options = {
      map,
      key: key.value,
      appName: appName.value,
      mapID: fmapID.value
    }
    let analyser = new fengmap.FMNaviAnalyser(options, () => {
      let { x, y, level, deviceId } = item
      let analyserObj = analyser.pathConstraint({
        x,
        y,
        level
      })
      let analyserCoords = analyserObj.coords
      if (!analyserCoords.x || !analyserCoords.y) {
        return
      }

      callback && callback(x, y, analyserCoords.x, analyserCoords.y, deviceId)
    })
  }

  //移动人员坐标
  const moveMemberMarker = (originX, originY, x, y, deviceId) => {
    console.log('移动')
    if (originX === x && originY === y) {
      return
    }
    let item = memberPositionMarker[deviceId]
    item.moveTo({
      x,
      y,
      animate: true
      // duration: 0.5,
    })
  }
  //重置人员坐标
  const resetMemberMarker = originPoints => {
    originPoints.forEach(item => {
      let nowPoint = memberPositionMarker[item.deviceId]
      let originX = nowPoint.x
      let originY = nowPoint.y
      let { x, y } = item

      moveMemberMarker(originX, originY, x, y, item.deviceId)
    })
  }
  // 重置TextMark坐标
  const resetTextMemberMark = originPoints => {
    originPoints.forEach(item => {
      let nowPoint = memberPositionText[item.deviceId]
      let originX = nowPoint.x
      let originY = nowPoint.y
      let { x, y } = item
      // console.log('重置', originX, originY, x, y, item.deviceId)
      moveMemberDeviceText({ x, y, id: item.deviceId })
    })
  }

  // 生成圆形
  const circleBuilder = (radius, centerXy, segments) => {
    return fengmap.FMCalculator.circleBuilder(radius, centerXy, segments)
  }

  //判断某个点是否在多边形上
  const pointInArea = (point, polygon) => {
    return fengmap.FMCalculator.isContain(polygon, point)
  }

  // 计算两点之间距离
  const calculator = (start, end) => {
    return fengmap.FMCalculator.distance(start, end)
  }

  //添加热力图覆盖物
  const addHotAreas = ({ level, sources }) => {
    let heat = new fengmap.FMHeatMap(map, {
      opacity: 0.5,
      valueRange: {
        max: 50,
        min: 0
      },
      gradient: {
        0.15: 'rgb(225,225,225)',
        0.35: 'rgb(204,210,252)',
        0.65: 'rgb(171,231,208)',
        0.85: 'yellow',
        1.0: 'red'
      }
    })
    /* 添加热力的数据源 */
    heat.addDataSource(sources)
    /* 将热力添加到地图的指定楼层上，添加后立刻显示 */
    heat.addTo(map.getFloor(level))
    //全部加载后使用
    heat.update()
    hotAreas.push(heat)
  }
  //清除热力图数据
  const clearHotAreas = () => {
    if (hotAreas.length) {
      hotAreas.forEach(item => item.remove())
      hotAreas = []
    }
  }

  //历史位置坐标移动
  const historyMarkerMove = ({ x, y }) => {
    if (historyMarker.length) {
      historyMarker[0].moveTo({
        x,
        y,
        animate: true,
        duration: 0.3
      })
      mapCenter({ x, y })
    }
  }

  //历史文字移动文字移动
  const historyTextMarkerMove = ({ x, y, text }) => {
    if (historyTextMarker) {
      historyTextMarker.moveTo({
        x,
        y,
        animate: true,
        duration: 0.3,
        finish: function () {
          historyTextMarker.text = text
          historyTextMarker.update()
        }
      })
    }
  }

  //移除人员设备定位点
  const removeMemberDeviceMarker = id => {
    if (id == null) {
      for (let val in memberPositionMarker) {
        if (!memberPositionMarker[val]) {
          continue
        }
        memberPositionMarker[val].remove()
        // memberPositionMarker[val] = null
        delete memberPositionMarker[val]
      }
      memberPositionMarker = {}
    } else {
      if (memberPositionMarker[id]) {
        memberPositionMarker[id].remove()
        // memberPositionMarker[id] = null
        delete memberPositionMarker[id]
      }
    }
  }

  //移动人员设备定位点
  const moveMemberDeviceMarker = ({ x, y, id }) => {
    if (memberPositionMarker[id]) {
      memberPositionMarker[id].moveTo({
        x,
        y,
        animate: true,
        duration: 0.3
      })
    }
  }

  //移除人员设备文字标注
  const removeMemberDeviceText = id => {
    if (id == null) {
      for (let val in memberPositionText) {
        memberPositionText[val].remove()
        memberPositionText[val] = null
        delete memberPositionText[id]
      }
      memberPositionText = {}
    } else {
      if (memberPositionText[id]) {
        memberPositionText[id].remove()
        // memberPositionText[id] = null
        delete memberPositionText[id]
      }
    }
  }

  //移动人员设备定位点
  const moveMemberDeviceText = ({ x, y, id }) => {
    if (memberPositionText[id]) {
      memberPositionText[id].moveTo({
        x,
        y,
        animate: true,
        duration: 0.3
      })
    }
  }

  // 设置视图中心的地图坐标
  const mapCenter = ({ x, y }) => {
    map.setCenter({ x, y })
  }

  // 获取获取地图界限
  const getMapBound = () => {
    return map.getBound()
  }

  //释放地图
  const disposeMap = () => {
    removeAreaCover()
    removeElectricFenceCover()
    removeLineMarker()
    removeMarker()
    removeImageMarker()
    removeNewImageMarker()
    removeMemberMarker()
    removeWarnMarker()
    removeTextDom()
    removeModalDom()
    removeAllModalDom()
    removeRouteLine()
    removeTextMarker()
    removeMemberDeviceMarker()
    removeMemberDeviceText()
    if (map) {
      map.dispose()
      map = null
      mapStatus.value = false
    }
  }

  onBeforeUnmount(() => {
    // can'nt destroy map,
    // 地图销毁时，操作地图的异步任务还没有执行完毕 此处不能销毁地图
    disposeMap()
  })

  return {
    pointMarker,
    mapStatus,

    markerPoints,
    clickEvents,
    memberPoints,
    warnPoints,
    videoPoints,
    polygonPoint,

    level,
    levelList,

    loadMap,
    disposeMap,
    setMarkerOpenStatus,
    setCickPolygonStatus,

    setFloor,
    setFullFloor,
    setMapModel,

    addMarker,
    addImageMarker,
    removeMarker,
    removeImageMarker,
    removeNewImageMarker,
    removeMemberMarker,
    removeLastMemberMarker,
    removeWarnMarker,
    removeVideoMarker,

    addDomMarker,
    removeTextDom,
    addModalDomMarker,
    removeModalDom,
    removeAllModalDom,

    linkPoint,
    removeLineMarker,

    addCircleCover,
    addPolygonCover,
    removeAreaCover,
    removeElectricFenceCover,

    addTextMarker,
    removeTextMarker,

    addRouteLine,
    removeRouteLine,
    removeFirstRouteLine,

    svgToFengMap,
    fengMapToSvg,
    absorptionPath,
    resetMemberMarker,
    resetTextMemberMark,

    pointInArea,
    calculator,
    circleBuilder,
    addHotAreas,
    clearHotAreas,

    mapCenter,
    getMapBound,

    removeHistoryMarker,
    removeHistoryStartMarker,
    historyMarkerMove,
    historyTextMarkerMove,

    removeHistoryTextMarker,
    updateHistoryTextMarker,

    moveMemberDeviceMarker,
    removeMemberDeviceMarker,

    moveMemberDeviceText,
    removeMemberDeviceText
  }
}
