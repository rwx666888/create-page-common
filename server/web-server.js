const express = require('express')
const fs = require('fs')
const path = require('path')
const comConfig_ = require('./www/tmpl_cfg/config/config.js')
const template_ = require('art-template')
const axios = require('axios')
const apiPath = '/mockapi'
const nodeFileApi = require('create-vue-page-npm').nodeFileApi


console.log('comConfig_', comConfig_.author)
// 初始化模板解析器
nodeFileApi.initTemplate(template_, { ...comConfig_, _templateRoot_: path.join(__dirname, './www/tmpl_cfg/template')})

const routerList = [
  {
    url: new RegExp(`${apiPath}/getTemplate`),
    type: 'post',
    response: (req, res) => {
      // console.log('uuu', req.body)
      res.render(req.body.tmp, req.body)
      // res.json({ a: 10 })
    }
  },
  {
    url: new RegExp(`${apiPath}/toCreatePage`),
    type: 'post',
    response: (req, res) => {
      handleCreation(req, res)
    }
  },
  {
    url: new RegExp(`${apiPath}/toCreateDialog`),
    type: 'post',
    response: (req, res) => {
      handleCreation(req, res)
    }
  },
  {
    url: new RegExp(`${apiPath}/getProjectInfo`),
    type: 'post',
    response: (req, res) => {
      try {
        var data = fs.readFileSync(path.join(req.body.path, 'src/settings.js'))
        const str = data.toString()
        const arr_ = str.match(/title:\s+?'([^,]+)'/g)
        if (arr_.length) {
          const tt = arr_[0].split(':')[1].replace(/'/g, '').trim()
          res.json({ title: tt })
        } else {
          res.json({})
        }
      } catch (e) {
        res.status(500).json({ tip: '本地项目根目录配置有误，如确认无误则忽略此提示' })
      }
    }
  },
  {
    url: new RegExp(`${apiPath}/getCatalog`),
    type: 'get',
    isNotJson: true, // 必须
    response: async (req, res) => {
      const url = req.query.url // 获取前端传递的URL参数
      try {
        // 使用axios发送代理请求
        const response = await axios.get(url)
        res.json(response.data)
      } catch (error) {
        res.status(500).json({ tip: '读取远端swagger文档失败' })
      }
    }
  }
]


/**
 *  创建页面
 */
function handleCreation (req, res) {
  const flag = nodeFileApi.checkRootDir(req.body.rootPath)
  if (!flag) {
    res.json({
      code: 0, msg: '项目根目录不存在'
    })
    return false
  }
  // 按 mock、 API 、VIEW 、Router 的顺序调用
  if (comConfig_.makeFile.isMakeMock) { // 是否生成mock文件
    try {
      nodeFileApi.makeMockfile(req.body)
    } catch (e) {
      console.log('--create mock err--\n', e)
    }
  }

  let d_ = null
  if (comConfig_.makeFile.isMakeApi) { // 是否生成api文件
    try {
      d_ = nodeFileApi.makeApifile(req.body)
    } catch (e) {
      d_ = {
        code: 0, msg: `API创建错误，详情请查看控制台日志`
      }
      console.log('--create API err--\n', e)
    }
  }
  let d2_ = null
  if (comConfig_.makeFile.isMakeView) { // 是否生成视图文件
    try {
      d2_ = nodeFileApi.makeViewfile(req.body)
    } catch (e) {
      d2_ = {
        code: 0, msg: `页面模板解析错误，详情请查看控制台日志`
      }
      console.log('--create view err--\n', e)
    }
  }

  let d3_ = null
  if (comConfig_.makeFile.isMakeRouter && req.body.otherConfig.type === 'page') { // 是否生成路由文件
    try {
      const routerData = nodeFileApi.makeRouterData(req.body)
      d3_ = nodeFileApi.updateRouterFile(routerData)
    } catch (e) {
      d3_ = {
        code: 0, msg: `路由创建错误，详情请查看控制台日志`
      }
      console.log('--create router err--\n', e)
    }
  }

  res.json({
    apiPage: d_,
    viewPage: d2_,
    routerPage: d3_
  })
}



module.exports = app => {
  app.use(apiPath, express.json())
  app.use(apiPath, express.urlencoded({
    extended: true
  }))
  for (const router of routerList) {
    app[router.type](router.url, router.response)

  }
}