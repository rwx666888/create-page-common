/**
 * 自定义指令权限控制器 create by @lianglei
 * 注意：暂不支持 el-tab 等复制组件的控制，复杂组件建议使用 v-if 调用checkAuth函数方式
 */
import auth from './auth.js'

const install = function (Vue) {
  Vue.directive('cusAuth', auth)
}

if (window.Vue) {
  window['cusAuth'] = auth
  Vue.use(install); // eslint-disable-line
}

auth.install = install
export default auth
