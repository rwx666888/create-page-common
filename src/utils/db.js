import { openDB } from 'idb'

const CACHE_STORE = 'cache-store' // 存储历史配置信息的对象仓库
const API_STORE = 'api-store' // 存储接口数据的对象仓库

// 打开 IndexedDB 数据库
const dbPromise = openDB('cus-db', 1, {
  upgrade (db) {
    // 存储历史配置信息的对象仓库
    // 注意: 这里的keypath 中的字段名称必须与 this.$data 中的字段名称一致
    const store = db.createObjectStore(CACHE_STORE, { keyPath: ['localProjectPath', 'curApi', 'curApiVersion'] })
    store.createIndex('projectApiIndex', ['localProjectPath', 'curApi'])
    // 存储接口数据的对象仓库
    db.createObjectStore(API_STORE)
  }
})

// 添加或更新数据
export async function addOrUpdateData (data) {
  const db = await dbPromise
  try {
    await db.put(CACHE_STORE, data)
    console.log('Data added or updated.')
  } catch (error) {
    console.error('Error adding or updating data:', error)
  }
}

// 查询数据
export async function getDataByProjectApiVersion (project, api, version) {
  const db = await dbPromise
  const data = await db.get(CACHE_STORE, [project, api, version])
  return data
}

export async function getDataByProjectApi (project, api) {
  const db = await dbPromise
  const result = await db.getAllFromIndex(CACHE_STORE, 'projectApiIndex', [project, api])
  return result.length > 0 ? result : null
}

// 通用的删除数据函数
export async function deleteDataByCondition (condition) {
  const db = await dbPromise
  const keys = await db.getAllKeys(CACHE_STORE)

  for (const key of keys) {
    if (condition(key)) {
      await db.delete(CACHE_STORE, key)
    }
  }
}

// 删除数据： project、api 组合等于指定值并且 version不等于指定值的所有数据
export async function delByProjectApiNotVer (project, api, notVersion) {
  const condition = (key) => {
    const [proj, apiName, ver] = key
    return proj === project && apiName === api && ver !== notVersion
  }

  await deleteDataByCondition(condition)
  console.log('Data deleted by project, api, and version.')
}

// 删除数据： project、api 组合等于指定值的所有数据
export async function delByProjectApiAll (project, api) {
  const condition = (key) => {
    const [proj, apiName] = key
    return proj === project && apiName === api
  }

  await deleteDataByCondition(condition)
  console.log('Data deleted by project and api.')
}

// 删除数据：根据 project 删除所有匹配的数据
export async function delByProjectAll (project) {
  const condition = (key) => {
    const [proj] = key
    return proj === project
  }

  await deleteDataByCondition(condition)
  console.log('Data deleted by project.')
}

/**
 * 以下是对历史版本的兼容（IDB-Keyval）
 */
// 获取数据
export async function dbGet (key) {
  return (await dbPromise).get(API_STORE, key)
}
// 写入数据
export async function dbSet (key, val) {
  return (await dbPromise).put(API_STORE, val, key)
}
// 删除数据
export async function dbDel (key) {
  return (await dbPromise).delete(API_STORE, key)
}
// 清空数据
export async function dbClear () {
  return (await dbPromise).clear(API_STORE)
}
// 获取所有key
export async function dbKeys () {
  return (await dbPromise).getAllKeys(API_STORE)
}
