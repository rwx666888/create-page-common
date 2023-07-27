// 注册表单配置组件
// 组件目录：“./item-setting”
// 组件文件名称格式：set-[组件名称].vue ; 例如：set-cusDatePicker.vue
// 注意 components 中使用 vm._$cusComponents$_ 报错，所以注册到 window上

const requireComponent = require.context(
  './item-setting',
  false,
  /set-[\w-]+\.vue$/
)
const tmp = {}
requireComponent.keys().forEach((fileName) => { // fileName => "./set-cusDatePicker.vue"
  const config_ = requireComponent(fileName)
  const name_ = fileName
    // Remove  filename "./"
    .replace(/^\.\//, '')
    // Remove 后缀名
    .replace(/\.\w+$/, '')
    .split('-')
    // 转首字母大写
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join('')
  tmp[name_] = config_.default
})
window._$cusComponents$_ = { ...tmp }
