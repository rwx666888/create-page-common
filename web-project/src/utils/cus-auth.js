/**
 * 函数权限控制器 create by @lianglei
 */

import store from '@/store'

/**
 * 权限校验控制函数，支持菜单与资源权限
 * @param {Array} value
 * @param {String}  = ['btn','menu']
 * @returns {Boolean}
 */

export default function checkAuth (value, type) {
  if (value) {
    if (!(value instanceof Array)) {
      value = [value]
    }
    if (value.length > 0) {
      if (type === 'menu') { // 菜单权限
        const menuTree_ = store.getters && store.getters.menuTree
        return menuTree_.some(item => {
          return value.indexOf(item.code) !== -1
        })
      } else if (type === 'btn') { // 资源权限
        const sourceTree_ = store.getters && store.getters.sourceTree
        return sourceTree_.some(curCode => {
          return value.indexOf(curCode) !== -1
        })
      } else { // 全部权限（资源+菜单）
        const allTree_ = store.state.user && store.state.user.permissionTree
        return allTree_.some(item => {
          return value.indexOf(item.code) !== -1
        })
      }
    }
  } else {
    console.error(`need cus-auth! Like v-cus-auth="['btnCode1','btnCode2']"`)
    return false
  }
}
