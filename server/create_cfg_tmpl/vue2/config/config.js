const _$cusConfig$_ = {
  _UI_TEMP_PATH_: 'element-ui', // string | array, 当为数组时，后面的会覆盖前面的重名组件；UI模板路径，必须与 web-project\src\views\create\components\item-setting\ 下的文件夹名称一致
  // 分页参数，例如每页条数，当前页码等非用户输入的参数
  pageListParams: [
    'pageSize', 'currentPage'
  ],
  makeFile: { // 生成文件的配置
    isMakeView: true, // 是否生成视图文件
    isMakeApi: true, // 是否生成api文件
    isMakeRouter: true, // 是否生成路由文件
    isMakeMock: false, // 是否生成mock数据文件
    useRouterGroup: false // 是否启用路由分组，启用后，将会生成子路由文件，例如：src/router/park/user.js ,存储路径由 template.routerFile.savePath 决定, 文件后缀名始终与主路由文件一致
  },
  /**
   * 缓存配置
   * 目前只项目、api、版本三个维度同时匹配才会返回缓存数据，场景为：本次小迭代周内，不考虑历史版本的数据变更
   */
  cache: {
    disabled: true // 是否禁用缓存
  },
  author: 'lianglei', // 作者
  reWrite: { // 存在重名文件是否直接覆盖， true：覆盖； false：跳过; key值需与 template 中的key值一致,未设置的文件默认为true;
    listPage: true, // 列表页
    infoPage: true, // 详情页
    formPage: true // 表单页
  },
  listPage: { // 列表页 表格列对齐方式
    colAlignDefault: 'left', // 默认居左对齐
    colAlignInt: 'center' // 数字型默认居中对齐
  },
  // 项目文件结构路径配置
  projectPath: {
    /**
     * 网络请求库文件路径，例如 '@/apis/request.js' 或 '@/apis/request.ts' 根据项目配置自行调整，包括是否省略后缀名
     * 注意其内部 必须 export 导出 （post get del put）方法，
     */
    httpFile: '@/apis/request.js', // 网络请求库，例如 axios；必须 export 导出 （post get del put）方法
    routerFile: 'src/router/index.js', // 路由文件
    routerMatchMark: '@/views/' // 路由文件中路由匹配标记, 可匹配路由文件中 component: () => import('@/views/icons/index'), 的 @/views/部分，
  },
  // 生成文件的配置, 其中base开头的为基础模板配置，不可修改属性名称
  template: {
    listPage: { // 列表页
      savePath: 'src/views', // 生成的位置目录 相对于项目根目录的路径， 例如： src/views
      suffix: '-list',
      dirSuffix: '-page', // 视图目录后缀连接词, 例如 /user-page
      template: 'page/list-page.art' // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
    },
    infoPage: { // 详情页
      savePath: 'src/views', // 生成的位置目录 相对于项目根目录的路径， 例如： src/views
      suffix: '-info',
      dirSuffix: '-page', // 视图目录后缀连接词, 例如 /user-page
      template: 'page/info-page.art' // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
    },
    infoDialog: { // 详情页弹窗 dialog
      savePath: 'src/components', // 生成的位置目录 相对于项目根目录的路径， 例如： src/views
      suffix: '-info-dialog',
      dirSuffix: '', // 视图目录后缀连接词, 例如 /user-page
      template: 'dialog/base-info.art' // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
    },
    formPage: { // 表单页
      savePath: 'src/views', // 生成的位置目录 相对于项目根目录的路径， 例如： src/views
      suffix: '-form',
      dirSuffix: '-page', // 视图目录后缀连接词, 例如 /user-page
      template: 'page/form-page.art' // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
    },
    formDialog: { // 表单页弹窗 dialog
      savePath: 'src/components', // 生成的位置目录 相对于项目根目录的路径， 例如： src/components
      suffix: '-form-dialog',
      dirSuffix: '', // 视图目录后缀连接词, 例如 /user-page
      template: 'dialog/base-form.art' // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
    },
    routerFile: { // 路由文件；名称不可修改; 暂不支持外部多路由文件，只支持单路由文件，也不支持路由的命名视图、动态加载等
      template: 'base/base-router.art', // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
      templateLayout: 'base/base-router-layout.art',
      savePath: './park', // 路由分组文件保存目录，相对于主路由文件的路径 ，例如 projectPath.routerFile， 仅当 projectPath.useRouterGroup 为true时生效
      routerNodeNames: [ 'asyncRoutes' ] // 路由节点名称，在主路由文件中，用于匹配路由节点；如果为空，则也不会生成路由文件
    },
    baseMockData: { // mock数据 baseMockData 名称不可修改
      savePath: 'mock/json', // 生成的位置目录 相对于项目根目录 /mock/json/data
      templateLayout: 'base/base-mock-layout.art', // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
      template: 'base/base-mock-item.art', // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
      ext: '.js' // 生成文件的后缀名, 例如：.js
    },
    apisFile: { // api文件 apisFile 名称不可修改
      savePath: 'src/apis', // 生成的位置目录 相对于项目根目录 例如： src/apis
      template: 'base/base-apis.art', // 模板名称 相对于 /create_cfg_tmpl/*/template 目录
      ext: '.js' // 生成文件的后缀名, 例如：.js
    }
  },
  // mock数据配置
  mockCig: {
    // 模式数据类型映射
    columnTypeMap: {
      /**
       * 同正则匹配字段名称，从而返回猜测类型的数据，预设的数据在/mock/json/data/example-data.js 文件中 makeDemoMockData
       * 匹配不到的所有模拟字段均返回 makeDemoMockData.randomStr 即1-5位随机字符
       * 同一类型均有数量限制，限制为makeDemoMockData中key的后缀最大值：超过数量上限后返回随机数；
       * 例如： name1:XX; name2:xx; 则name类型最多可用3次，可用增加次数，例如name3\name4，但后缀必须是同前缀分组下的连续的整数；
       * 这里的key对应 /mock/json/data/example-data.js 文件中 makeDemoMockData 对象的key 的前缀
       * 属性值只支持 正则表达式 或 false
       * 生成器中使用了 Object.assign 对配置信息进行合并，所以可随意扩展，如果想禁用预设字段的映射，将对应key值设置为false,例如： name:false
       * 注意后续版本中可能会移除预设的映射规则
       */
      integer: /integer/,
      name: /(title|name$)/i,
      city: /(^city|city$)/i,
      province: /(^province|province$)/i,
      email: /email/i,
      uid: /(code|id)/i,
      datetime: /(^datetime|datetime$)/i,
      date: /(^date|date$)|birthday/i,
      phone: /(^(phone|mobile)|(phone|mobile)$)/i,
      demoSex: /sex/i, // 演示demo数据
      demoEdu: /edu/i // 演示demo数据
    }
  },
  // 表单元素配置
  formItemCig: {
    dataTimeRangeRegExp: '^(start|end|begin)|(start|end|begin)$', // 不区分大小写
    isStartRegExp: '^(start|begin)|(start|begin)$' // 不区分大小写
  },
  /**
   * 路由前缀连接词
   * 可为空，如果设置则必须首字母大写，否则可能导致路由缓存不生效；
   * 用于构造 路由中的 name，及页面中 export default.name
   * 最终格式为： [lever2]xxxx ,例如：PageUserList, 其中page 为lever2路由前缀连接词，UserList为API名称
   * 详见 /mock/json/createPage.js
   */
  routerSuffix: {
    lever1: 'Menu',
    lever2: 'Page'
  },
  /**
   * 表单元素类型
   * disabled : 在构造模板中，不可使用（暂不支持）的元素
   *   [undefined] : 不禁用, 默认值;
   *   [boolean] true : 全部禁用;
   *   [string] 只有完全匹配的才禁用，例如：'list|form' 则表示为 list 或 form 禁用;
   * path : 可选，自定义组件的路径 例如：'@/components/cusDatePicker/index.vue'
   * valid : 必须，表单验证配置
   *  -- trigger: 必须，触发方式 'blur' 、'change' 等
   *  -- type: 可选，数据类型 'string'(默认)、'date'、'array' 等
   * dataSource : 可选，数据源配置，例如：下拉选择框的选项
   *  -- dataType: 必须，数据格式，默认array，可选：array、object
   *  -- default: 可选，数据源默认值，例如：下拉选择框的默认值 [{value: null, label: '全部'}] ; 如果没有对组件进行配置，则使用默认值
   */
  formItemOpts: [
    {
      value: 'input',
      label: '单行文本框',
      valid: {
        trigger: 'blur'
      }
    },
    {
      value: 'textarea',
      label: '多行文本框',
      disabled: 'list',
      valid: {
        trigger: 'blur'
      }
    },
    {
      value: 'select',
      label: '下拉选择框',
      valid: {
        trigger: 'change'
      },
      dataSource: {
        dataType: 'array',
        default: [ { value: null, label: '全部' } ]
      }
    },
    {
      value: 'radioGroup',
      label: '单选框组',
      disabled: 'list',
      valid: {
        trigger: 'change'
      },
      dataSource: {
        dataType: 'array',
        default: [ { value: '-1', label: '选项一' }, { value: '-2', label: '选项二' } ]
      }
    },
    {
      value: 'radio', // 暂不支持，因为基本没有单独使用单选框的场景
      label: '单选框',
      disabled: true,
      valid: {
        trigger: 'change'
      }
    },
    {
      value: 'checkboxGroup',
      label: '多选框组',
      valid: {
        trigger: 'change',
        type: 'array'
      },
      dataSource: {
        dataType: 'array',
        default: [ { value: '-1', label: '选项一' }, { value: '-2', label: '选项二' } ]
      }
    },
    {
      value: 'checkbox',
      label: '多选框',
      valid: {
        trigger: 'change'
      }
    },
    {
      value: 'timePicker',
      label: '时间选择器',
      disabled: true,
      valid: {
        trigger: 'change',
        type: 'date'
      }
    },
    {
      value: 'datePicker',
      label: '日期选择器',
      valid: {
        trigger: 'change',
        type: 'date'
      }
    },
    {
      value: 'cusDatePicker',
      label: '日期选择器（双）',
      path: '@/components/cusDatePicker/index.vue',
      valid: {
        trigger: 'change',
        type: 'date'
      }
    }
  ],
  tableRowBgColor: [ // 表格行背景色
    'table-row-success',
    'table-row-brand',
    'table-row-warning',
    'table-row-danger'
  ],
  formFieldDetection: { // 根据字段名称及类型尝试匹配表单元素类型，处理方法在 mixins/create.js -> formItemTypeChoice方法中
    findDate: true, // 是否检测日期，并适配为日期组件
    findArray: true // 是否检测数组，并适配为下拉多选框
  }
}

// 在 Node.js 环境中，将 _$configFormValidMsg$_ 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = _$cusConfig$_
}