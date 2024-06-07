// demo 数据 用于演示数据的生成

const Mock = require('mockjs')
// http://mockjs.com/examples.html

const generateMockData = (count) => {
  const arr = []

  for (let i = 0; i < count; i++) {
    arr.push(Mock.mock({
      id: '@increment',
      timestamp: +Mock.Random.date('T'),
      author: '@first',
      reviewer: '@first',
      title: '@title(5, 10)',
      content_short: 'mock data',
      forecast: '@float(0, 100, 2, 2)',
      importance: '@integer(1, 3)',
      'type|1': [
        'CN', 'US', 'JP', 'EU'
      ],
      'status|1': [
        'published', 'draft'
      ],
      display_time: '@datetime',
      comment_disabled: true,
      pageviews: '@integer(300, 5000)',
      platforms: ['a-platform']
    }))
  }

  return arr
}

// 演示数据
const makeDemoMockData = (count) => {
  const arr = []

  for (let i = 0; i < count; i++) {
    arr.push(
      Mock.mock({
        uid1: '@increment',
        name1: '@cname',
        name2: '@cname',
        province1: '@province',
        city1: '@city',
        email1: '@email',
        email2: '@email',
        phone1: /1[3-9]\d\*{4}\d{4}/,
        date1: '@date',
        date2: '@date',
        dateTime1: '@datetime',
        dateTime2: '@datetime',
        integer1: '@integer(1, 100)',
        integer2: '@integer(1, 100)',
        integer3: '@integer(1, 100)',
        integer4: '@integer(1, 100)',
        integer5: '@integer(1, 100)',
        integer6: '@integer(1, 100)',
        integer7: '@integer(1, 100)',
        integer8: '@integer(1, 100)',
        string1: '@ctitle(3, 5)',
        string2: '@ctitle(3, 5)',
        string3: '@ctitle(3, 5)',
        string4: '@ctitle(3, 5)',
        string5: '@ctitle(3, 5)',
        randomStr: '@string("lower", 1, 5)',
        demoSex1: '@cword("012", 1)',
        demoEdu1: '@cword("0123", 1)',
        emptyArray: [],
        emptyObject: {}
      })
    )
  }

  return arr
}

// 调用函数并将结果存储在变量中
const comList_ = generateMockData(100)
const demoList = makeDemoMockData(100)

/**
 *
 * @param {Object} tobj 待匹配数据源key的对象
 * @example {
 *  username: {type: 'name'},
 *  firstname: {type: 'name'},
 *  lastname: {type: 'name'},
 *  datatime: {type: 'date'},
 *  datatime2: {type: 'date'},
 *  datatime3: {type: 'date'}
 * }
 * 其中 username 为对象的key, type 为key值的类型，对应 demoList 中的 key 的前缀值 例如XXX1,XXX2,XXX3
 * @returns {Object} tobj
 * @example { username: { type: 'name', target: 'name1' } }
 */
function demoFnGetTheListKey (tobj) {
  // 定义一个对象，用于记录已经使用过的 type 值的个数
  var typeCount = {}
  const list = demoList

  // 遍历目标对象的每个属性
  for (var key in tobj) {
  // 获取当前属性的 type 值
    var type = tobj[key].type

    // 判断当前 type 值是否已经被使用过，如果没有则初始化计数器为 0
    if (!(type in typeCount)) {
      typeCount[type] = 0
    }

    // 遍历数据源列表中的每个对象，查找与当前 type 值匹配的属性
    var valueFound = false
    for (var i = 0; i < list.length; i++) {
      var obj = list[i]
      for (var prop in obj) {
      // 判断当前属性是否与当前 type 值匹配，如果是则使用该值，并将计数器加 1
        if (prop.startsWith(type) && prop.endsWith(String(typeCount[type] + 1))) {
          tobj[key]['target'] = prop
          typeCount[type]++
          valueFound = true
          break
        }
      }
      if (valueFound) {
        break
      }
    }

    // 如果没有找到匹配的属性，则为当前属性赋值为随机数
    if (!valueFound) {
      tobj[key]['target'] = 'randomStr'
    }
  }
}

/**
 *
 * @param {String} key 路由key
 * @param {Object} query config.query
 * @returns {Object} {totalCount: 100, list: []}
 */
function demoFnMakeListPageData (key, query = {}) {
  const obj = __cacheKey__[key]
  const query_ = { ...query }
  // 过滤数据 去除分页参数 和 空值参数
  const tmpParams = Object.keys(query_).filter((key) => {
    return (
      !['currentPage', 'pageSize'].includes(key) &&
      query_[key] !== '' &&
      query_[key] !== null &&
      query_[key] !== undefined &&
      (!Array.isArray(query_[key]) || query_[key].length > 0)
    )
  })
  console.log('tmpParams: ', tmpParams, query)

  // 过滤数据 模拟搜索
  const mockList = demoList.filter((item) => {
    return !tmpParams.some((key) => {
      if (!obj[key]) {
        return false
      }
      if (Array.isArray(query_[key])) {
        return !query_[key].includes(item[obj[key].target])
      } else {
        return item[obj[key].target].toString().indexOf(query_[key]) < 0
      }
    })
  })

  const { currentPage = 1, pageSize = 20 } = query_
  const start_ = (currentPage - 1) * pageSize
  const end_ = currentPage * pageSize
  const pageList = mockList.slice(start_, end_).map((item) => {
    const tmp = {}
    for (const key in obj) {
      tmp[key] = item[obj[key].target]
    }
    return tmp
  })

  return {
    totalCount: mockList.length,
    list: pageList
  }
}

/**
 * @param {Object} obj tableData
 * @returns {Object} return {}
 */
function demoFnMakeInfoPageData (obj) {
  const tmp = {}
  const randomData = demoList[ Math.floor(Math.random() * demoList.length) ]
  for (const key in obj) {
    tmp[key] = randomData[obj[key].target]
  }
  return tmp
}

/**
 * 啥也不干就是玩
 */
function demoFnEmpty () {
}

// 用于缓存数据 只为demo演示使用
const __cacheKey__ = {}
module.exports = {
  comList_,
  demoList,
  __cacheKey__,
  demoFnGetTheListKey,
  demoFnMakeListPageData,
  demoFnMakeInfoPageData,
  demoFnEmpty
}
