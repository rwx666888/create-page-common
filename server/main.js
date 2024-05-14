// 导入所需的模块
const express = require('express')
const path = require('path')
require('./import_cfg.js')
const webServer = require('./web-server.js')

// 创建 Express 应用
const app = express()
webServer(app)
// 设置静态文件服务的根目录为 vue-project 下的 dist 目录
app.use(express.static(path.join(__dirname, './www')))


// 启动 Express 服务器
const port = process.env.PORT || 8800
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
