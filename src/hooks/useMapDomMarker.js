export default function useMapDomMarKer() {
  const setAreaDom = info => {
    return `
          <div class="member-dom">
              <span class="arrow"></span>
              <div class="info-box">
                  <div class="info-item">
                      <span class="item-text">区域id: </span>
                      <span class="item-text">${info.id}</span>
                    </div>
                  <div class="info-item">
                      <span class="item-text">区域名称: </span>
                      <span class="item-text">${info.areaName}</span>
                  </div>
                  <div class="info-item">
                      <span class="item-text">包含分组: </span>
                      <span class="item-text">${info.areaGroup}</span>
                  </div>
              </div>
          </div>
          `
  }

  return { setAreaDom }
}
