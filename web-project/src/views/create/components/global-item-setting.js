// 注册表单配置组件
// 组件目录：“./item-setting”
// 组件文件名称格式：set-[组件名称].vue ; 例如：set-cusDatePicker.vue
// 注意 components 中使用 vm._$cusComponents$_ 报错，所以注册到 window上

const requireComponent = require.context(
  './item-setting',
  true,
  /set-[\w-]+\.vue$/
)
const tmp = {}
requireComponent.keys().forEach((path_) => { // fileName => "./set-cusDatePicker.vue"
  // 提取分组名称部分 ./xxx/
  const groupNameMatch = path_.match(/\.\/([^/]+)\//)
  const groupName = groupNameMatch ? groupNameMatch[1] : null

  if (groupName) {
    // 提取最右侧的文件名并转换为大驼峰结构
    const fileNameMatch = path_.match(/\/([^/]+)\.vue$/)
    let fileName = fileNameMatch ? fileNameMatch[1] : null

    if (fileName) {
      fileName = fileName.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('')
    }
    if (!tmp[groupName]) {
      tmp[groupName] = {}
    }
    const config_ = requireComponent(path_)
    tmp[groupName][fileName] = config_.default
  }
})
console.log('tmp', tmp, _$cusConfig$_._UI_TEMP_PATH_)
window._$cusComponents$_ = { ...tmp['_com'] }

if (Array.isArray(_$cusConfig$_._UI_TEMP_PATH_)) {
  _$cusConfig$_._UI_TEMP_PATH_.forEach(path => {
    if (path) {
      window._$cusComponents$_ = { ...window._$cusComponents$_, ...tmp[path] }
    }
  })
} else {
  window._$cusComponents$_ = { ...window._$cusComponents$_, ...tmp[_$cusConfig$_._UI_TEMP_PATH_ || 'vue2'] }
}
