module.exports = {
  title: 'VUE页面生成器',

  /**
   * @type {boolean} true | false
   * @description Whether need waterMarkFlag
   */
  waterMarkFlag: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  /**
   * 本应用业务层全局参数配置
   * 枚举类型统一为 value \ label
   * 不包含 全部（value = null）
   */
  comConfig: {
    expOpts: [
      {
        value: '1',
        label: '名称'
      }
    ]
  }
}
