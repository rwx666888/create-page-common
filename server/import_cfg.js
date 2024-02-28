const path = require('path')
const fsExtra = require('fs-extra')

// 获取传入的参数（第三个元素开始是传入的参数）
const args = process.argv.slice(3)
// 导入模板
if(args[0]){
  const targetFromPath_ =  path.join(__dirname, './create_cfg_tmpl', args[0])
  console.log('导入模板：', args[0])
  if (fsExtra.existsSync(targetFromPath_)) {
    const targetToPath_ = path.join(__dirname, './www/tmpl_cfg')
    fsExtra.emptyDirSync(targetToPath_)
    fsExtra.copySync(targetFromPath_, targetToPath_)
  } else {
    console.log('未找到模板目录:', targetFromPath_)
  }
}else{
  console.log('请传入参数')
}