/**
 * 自定义指令权限控制器 create by @lianglei
 * 注意：1、暂不支持 el-tab 等复制组件的控制，复杂组件建议使用 v-if 调用checkAuth函数方式
 *      2、如有不可预期的结果，请使用 v-if 调用checkAuth函数方式
 */
import checkAuth from '@/utils/cus-auth.js'
import Vue from 'vue'

function checkPermission (el, binding) {
  const { value, arg } = binding
  const flag_ = checkAuth(value, arg) // 为保障检验逻辑一致，这里直接复用的函数控制器
  // console.log('-------', flag_, el)
  if (!flag_) {
    Vue.nextTick(function () {
      // 使用nextTick修正在多层级嵌套且 与 v-if 混用时，极易发生的 el 未插入dom中的问题（目前发现update钩子极易发生此情况）
      // 参照钩子函数限制 https://cn.vuejs.org/v2/guide/custom-directive.html
      el.parentNode && el.parentNode.removeChild(el)
    })
  }
}

export default {
  inserted (el, binding) {
    checkPermission(el, binding)
  },
  update (el, binding) {
    checkPermission(el, binding)
  }
}
