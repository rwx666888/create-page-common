# 基于 swagger 的 VUE 代码生成器

> 注意这里源码，二次扩展开发时才需要使用，[生产使用请访问这里](../README.md)

> 提示：修改配置文件及模板不需要重新编译本项目，重启server服务并无缓存刷新页面即可生效；（配置文件及模板在 server/create_cfg_tmpl 目录下）


根据 Swagger 文档定义，自动生成视图页面、API、路由、mock等。新页面可热更新直接运行。根据目标项目根目录（工作空间）中的 ESLint 环境配置信息，对文件进行 --fix 修复，保障文件代码格式与目标项目统一。

> 建议运行在 nodejs v14.21.3 与 npm 6.14.18 版本及邻近版本上；其它版本编译过程中可能会有异常; 建议使用nvm等node版本管理工具；

> 高版本nodejs 建议使用 npm i -f 命令安装项目；经测试 nodejs 16.17.1 与 18.16.1 是可以兼容的；

> 建议使用编辑器（如 vsCode）直接打开本目录（web-project）作为独立的项目启动，以防出现插件找不到项目根目录中配置文件的情况，或者使用vsCode的工作区模式，将 web-project 和 server 加入到同一个工作区中；


## 安装与启动
1. 下载项目
```
浏览器下载并解压缩文件
https://gitee.com/rwx666888/create-page-common/repository/archive/dev.zip
或
git clone https://gitee.com/rwx666888/create-page-common.git
```
2. 打开项目目录
```
cd create-page-common/web-project
```
3. 初始化项目
```
npm i
```
4. 启动项目
```
npm run local
```
5. 编译项目
```
npm run build
```
> 编译后的项目在 server/www 目录下；

> 注意：配置文件及模板在 server/create_cfg_tmpl 目录下（vue2、vue3），修改后需要刷新页面（ctrl + F5, 强制刷新浏览器缓存，或开启开发者模式中的禁用缓存）才能生效；如果是生产模式（即使用的server服务），还需要额外的重启server服务；

> 注意：web-project/public/tmpl_cfg 及 server/www/tmpl_cfg 目录下的配置文件及模板均为临时文件，修改无效，npm run xx 启动时，这部分会被server/create_cfg_tmpl 中与 xx 匹配的文件完全覆盖；

