import axios from 'axios'
import { BASE_URL, TIMEOUT } from './config'


class hyRequest {
  constructor(baseURL, timeout = 100000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    this.instance.interceptors.request.use(
      config => {
        return config
      },
      err => {
        return err
      }
    )
    this.instance.interceptors.response.use(
      res => {
        return res.data
      },
      async err => {
        return err
      }
    )
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  }
  get(config) {
    return this.request({ ...config, method: 'GET' })
  }
  post(config) {
    return this.request({ ...config, method: 'POST' })
  }
  delete(config) {
    return this.request({ ...config, method: 'DELETE' })
  }
  put(config) {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default new hyRequest(BASE_URL, TIMEOUT)
