import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

// 自定义权限判断指令（非官方）
import cusAuth from '@/directive/cus-auth/index.js'
import elDragDialog from '@/directive/el-drag-dialog/index.js'

// 注册全局组件
import './components/_globals.js'
// 注册表单元素配置到 window._$cusComponents$_
import './views/create/components/global-item-setting.js'

// 生成器全局配置
import config_ from './config.js'
window._$cusConfig$_ = config_

Element.Dialog.props.closeOnClickModal.default = false // 全局禁止通过点击 modal 关闭 Dialog
Element.Dialog.props.closeOnPressEscape = false // 全局禁止通过按下 ESC 关闭 Dialog
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

cusAuth.install(Vue)
elDragDialog.install(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
