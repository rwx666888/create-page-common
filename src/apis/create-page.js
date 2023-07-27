import {
  get,
  post
} from '@/apis/request.js'

export const getCatalog = (data) => get('/getCatalog', { url: data }, { useMockServer: true })

export const getTemplate = (data) => post('/getTemplate', data, { useMockServer: true })

export const toCreatePage = (data) => post('/toCreatePage', data, { useMockServer: true })

export const getProjectInfo = (data) => post('/getProjectInfo', data, { useMockServer: true })

export const getComConfig = (data) => get('/getComConfig', data, { useMockServer: true })

export const toCreateDialog = (data) => post('/toCreateDialog', data, { useMockServer: true })
