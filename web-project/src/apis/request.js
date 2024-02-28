import axios from 'axios'
import store from '@/store'
import {
  Message
} from 'element-ui'
import { blobToJson } from '@/utils/download-file.js'

const defConfig = {
  baseURL: process.env.VUE_APP_BASE,
  headers: {
    'content-type': 'application/json'
  },
  timeout: 60000,
  // withCredentials: true,
  nonConcurrent: true
}
const instance = axios.create(defConfig)

// 接口请求时 需注意，等token 失效时，返回401 ，要 跳转中台登录
instance.interceptors.request.use(config => {
  // 控制仅开发环境可启用 mock-server
  if (process.env.NODE_ENV === 'development' && config.useMockServer === true) {
    config.baseURL = process.env.VUE_APP_MOCK_SERVER
  }

  console.log('http-request-config:', config)
  const {
    token
  } = store.state.user
  if (token) {
    config.headers.Authorization = token
  }

  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  // console.log('http-response-config:', response.config)
  return response.data
}, async error => {
  if (error.response && !error.response.config.hideGlobalMsg && error.response.status >= 400 && error.response.status !== 404) {
    let msg_ = ''
    if (error.response.status === 500 && error.response.config.responseType === 'blob') {
      // 处理二进制文件流模式，一般用于文件下载失败的错误提示
      msg_ = (await blobToJson(error.response.data)).tip
    } else {
      msg_ = error.response.data.tip
    }
    Message.warning(msg_)
  }
  return Promise.reject(error)
})

export const post = (url, data, config = {}) => instance.post(url, data, config)
export const get = (url, params, config = {}) => instance.get(url, {
  params,
  ...config
})
export const del = (url, data, config = {}) => instance.delete(url, {
  data,
  ...config
})
export const put = (url, params, config = {}) => instance.put(url, params, config)

export default instance
