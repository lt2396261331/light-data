export default function useMapDomMarKer() {
  const setAreaDom = info => {
    return `
          <div class="member-dom">
              <span class="arrow"></span>
              <div class="info-box">
                  <div class="info-item">
                      <span class="item-text">区域id：</span>
                      <span class="item-text">${info.id}</span>
                    </div>
                  <div class="info-item">
                      <span class="item-text">区域名称：</span>
                      <span class="item-text">${info.areaName}</span>
                  </div>
                  <p class="info-group">
                    包含分组：${info.areaGroup}
                  </p>
              </div>
          </div>
          `
  }

  // 设置灯信息dom
  const setLightInfoDom = lightInfo => {
    console.log(lightInfo)
    return `
          <div class="warn-dom">
              <span class="arrow"></span>
              <div class="info-box">
                  <div class="info-item">
                      <span class="item-left">灯id: </span>
                      <span class="item-text">${lightInfo.nodeIEEEAddress}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">灯名称: </span>
                      <span class="item-text">${lightInfo.nodeName}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">分组: </span>
                      <span class="item-text">${lightInfo.groupIDNumber}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">有人亮度: </span>
                      <span class="item-text">${lightInfo.motionBr}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">无人亮度: </span>
                      <span class="item-text">${lightInfo.noMotionBr}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">当前运行: </span>
                      <span class="item-text">自动亮灯模式</span>
                  </div>
                  <div class="info-item">
                      <span class="item-left">状态: </span>
                      <span class="item-text">${lightInfo.status}</span>
                  </div>
              </div>
          </div>
          `
  }

  return { setAreaDom, setLightInfoDom }
}
