
import { get as dbGet } from 'idb-keyval'
import config_ from '@/config.js'
import Sortable from 'sortablejs'
const com_ = require('create-vue-page-npm').createApi

let rowbg_ = {}
export default {
  data () {
    return {
      curApi: null,
      apiOpts: [],
      // 表单元素类型
      formItemOpts: config_.formItemOpts,
      tableData: [],
      tableDataSearch: [],
      // url中的参数
      querysInPath: [],
      // 临时存储 序列化后的 CatalogData
      tempCatalogData: {},
      // 临时存储 日期范围组件配置项
      theDateRangeObj: {},
      tableConfig: {
        columnNum: 1 // 列数
      },
      apiConfig: {
        name: '',
        nameToPath: '',
        desc: '',
        type: '',
        uri: '',
        fileName: '',
        fileDesc: ''
      },
      localProjectPath: '',
      msgCache: [],
      isFilterTheList: false // 是否过滤列表
    }
  },
  methods: {
    initData (fn = (item) => true) {
      dbGet('cusCatalogDB').then(val => {
        if (val) {
          this.apiOpts = Object.keys(val.items)
            .filter(f => { return !this.isFilterTheList ? true : fn(val.items[f]) })
            .map((v, k) => {
              const t_ = val.items[v]
              return {
                value: v,
                code: t_.name,
                label: `【${t_.name}】${t_.summary} -- ${v}`
              }
            })
          this.tempCatalogData = val.items
          console.log(JSON.parse(JSON.stringify(val)))
          this.localProjectPath = val.project.pjtPath
        } else {
          this.$alert('读取离线数据失败，请先初始化项目信息！', '错误！', {
            confirmButtonText: '去初始化',
            callback: action => {
              this.$router.push({ name: 'CreateIndex' })
            }
          })
        }
      })
    },
    filterOptsFn (filterStr, mode = '') {
      return typeof filterStr === 'undefined' ? false : (typeof filterStr === 'string' ? (new RegExp('^(' + filterStr + ')$').test(mode)) : !!filterStr)
    },
    // 根据字段名称尝试匹配表单元素类型
    formItemTypeChoice (row) {
      const name_ = row.name || ''
      if (config_.formFieldDetection.findDate && /(date|time)/i.test(name_)) { // 日期或时间，优选日期
        if (this.theDateRangeObj[name_] && this.theDateRangeObj[name_].isDatePickerRange) { // 双日历
          return 'cusDatePicker'
        } else {
          return 'datePicker'
        }
      }
      if (config_.formFieldDetection.findArray && row.type === 'array') { // 数组，优选多选框
        return 'select'
      }

      return 'input'
    },
    // 尝试过滤 label 名称
    filterColumnLable (str) {
      return (str || '').replace(/(,|，|\s)[\s\S]+/, '')
    },
    // 行排序
    rowDrop () {
      const tbodys_ = document.querySelectorAll('.el-table__body-wrapper tbody')
      const _this = this
      tbodys_.forEach(function (tbody) {
        Sortable.create(tbody, {
          handle: '.js-handle',
          draggable: '.js-can-sort',
          onEnd ({
            newIndex, oldIndex, from, to, item
          }) {
            const dataName_ = com_.closest(from, '.el-table').dataset.dataName
            const tableList_ = [..._this[dataName_]]
            const currRow_ = tableList_.splice(oldIndex, 1)[0]
            tableList_.splice(newIndex, 0, currRow_)
            _this[dataName_] = []
            _this.$nextTick(() => {
              _this[dataName_] = tableList_
            })
          }
        })
      })
    },
    showMsgFn (msgObj) {
      if (this.msgCache.length) {
        this.msgCache.forEach(n => {
          try {
            n.close()
          } catch (e) {
            // TODO handle the exception
          }
        })
      }
      if (msgObj) {
        Object.keys(msgObj).forEach((k, i) => {
          const t_ = msgObj[k]
          if (t_) {
            const titleArr = [
              '错误', '成功', '警告'
            ]
            const typeArr = [
              'error', 'success', 'warning'
            ]
            setTimeout(() => {
              const nn_ = this.$notify({
                title: titleArr[t_.code],
                message: t_.msg,
                position: 'top-left',
                type: typeArr[t_.code],
                offset: 0,
                duration: t_.code === 1 ? 5000 : 0
              })
              this.msgCache.push(nn_)
            }, i * 700 + 300)
          }
        })
      }
    },
    /**
     * 打开配置面板
     * @param {Object} row
     */
    toOpenOptPannel (row) {
      // this.$alert('暂未开放')
      this.$refs['dialogFormItemSetting'].show(row, this.tableDataSearch)
    },
    // 显示分组结果
    searchRowClass ({ row }) {
      const c_ = 'js-can-sort'
      if (row.opts.range) {
        if (rowbg_[row.opts.range.f_]) {
          return c_ + ' ' + rowbg_[row.opts.range.f_]
        } else {
          const color = config_.tableRowBgColor[ Object.keys(rowbg_).length % config_.tableRowBgColor.length ]
          rowbg_[row.opts.range.f_] = color
          return c_ + ' ' + color
        }
      }
      return c_
    },
    /**
     *  获取自定义组件,根据组件类型
     * @param {string} formItemType
     * @return {Object} 组件对象, 非组件实例，找不到返回 null
     */
    getCusComptByFormItemType (formItemType) {
      const n_ = 'Set' + (formItemType.charAt(0).toUpperCase() + formItemType.slice(1))
      return _$cusComponents$_[n_] || null
    },
    // 组件类型发生变化
    fnSelFormItemType (val, row) {
      const _oldFormItemType = row.formItemType
      const _resetFn_ = () => { // 尝试重置旧组件的关联设置
        const _oldFormItemComp = this.getCusComptByFormItemType(_oldFormItemType)
        if (_oldFormItemComp && _oldFormItemComp.methods.__toResetFn) {
          _oldFormItemComp.methods.__toResetFn(row, this.tableDataSearch, val)
        }
      }
      const _autoInitFn_ = () => { // 尝试自动初始化新组件的关联设置
        const _newFormItemComp = this.getCusComptByFormItemType(val)
        if (_newFormItemComp && _newFormItemComp.methods.__autoInitConfig) {
          _newFormItemComp.methods.__autoInitConfig(row, this.tableDataSearch, this.theDateRangeObj)
        }
      }

      if (row.opts.attr) {
        this.$confirm('当前组件存在配置信息，变更将导致配置信息重置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action, instance) => {
            if (action === 'confirm') {
              _resetFn_()
              row.formItemType = val
              row.opts.attr = null
              row.opts.range = null
              _autoInitFn_()
            }
          }
        })
      } else {
        _resetFn_()
        row.formItemType = val
        row.opts.range = null
        _autoInitFn_()
      }
    },
    fnValidSearch (list) {
      return !list.some(v => {
        if (v.formItemType === 'cusDatePicker' && !v.opts.range) {
          this.$alert(`字段【${v.column}】未指定【开始时间或结束时间】`, '错误')
          return true
        }
      })
    },
    // 构造 apiConfig
    _fnMakeApiCfg (obj_) {
      // 过滤 vue页面的名称，过滤后名字可能为空，所以设置默认值 index
      const filterNameToPath = obj_.name.replace(/(^query|list$)/gi, '') || 'index'
      // 过滤后的api名称，主要用于生成 view 页面文件的名称 xxx-xxx-xxx
      const nameToPathfilter = filterNameToPath.replace(filterNameToPath.charAt(0), filterNameToPath.charAt(0).toLowerCase()).replace(/([A-Z])/g, '-$1').toLowerCase()
      // 连接符（-）的 api名称 xxx-xxx-xxx
      const nameToPath = obj_.name.replace(obj_.name.charAt(0), obj_.name.charAt(0).toLowerCase()).replace(/([A-Z])/g, '-$1').toLowerCase()
      const curTagCode = obj_.tags.code || ''
      return {
        name: obj_.name, // api名称
        nameHump: obj_.name.replace(obj_.name.charAt(0), obj_.name.charAt(0).toUpperCase()), // api名称, 大驼峰格式
        nameToPathfilter, // 过滤后的api名称，主要用于生成 view 页面文件的名称
        nameToPath, // 连接符（-）的 api名称
        desc: obj_.summary, // 接口描述
        type: obj_.type === 'delete' ? 'del' : obj_.type, // 请求类型
        uri: obj_.uri, // 接口地址
        fileName: curTagCode.replace(/([A-Z])/g, '-$1').toLowerCase(), // API 所属分组 tags,连接符（-）格式，用于生成api文件的名称
        fileNameHump: curTagCode.replace(curTagCode.charAt(0), curTagCode.charAt(0).toUpperCase()), // API 所属分组 tags, 大驼峰格式
        fileDesc: obj_.tags.label // API 所属分组的描述
      }
    },
    // 构造tabledata
    _fnMakeTableData (obj_) {
      if (obj_.hasList) {
        const list_ = obj_.res.body.filter(v => {
          return v.type === 'array'
        })[0].children
        return list_.map(n => {
          return {
            column: n.name,
            label: n.description,
            columnType: n.type,
            isShow: true,
            showTips: false,
            alignType: n.type === 'integer' ? config_.listPage.colAlignInt.toLowerCase() : config_.listPage.colAlignDefault.toLowerCase()
          }
        })
      } else if (Array.isArray(obj_.res.body)) {
        return obj_.res.body.map(n => {
          return {
            column: n.name,
            label: n.description,
            columnType: n.type,
            isShow: true,
            showTips: false,
            alignType: n.type === 'integer' ? config_.listPage.colAlignInt.toLowerCase() : config_.listPage.colAlignDefault.toLowerCase(),
            spanNum: 1 // 详情页中的表单项占用的列数
          }
        })
      } else { // 有数据 ,可能为对象、字符串、或 boolean
        return [
          {
            column: null,
            label: null,
            columnType: obj_.res.dataFormat,
            other: obj_.res.body ?? null
          }
        ]
      }
    },
    // 构造 tableDataSearch
    _fnMakeTableDataSearch (obj_, isStatic = false) {
      rowbg_ = {}
      if (obj_.req.body && obj_.req.body.length) {
        // 从请求参数中过滤出 inPath 的参数
        this.querysInPath = obj_.req.body.filter(qi => {
          return qi.inPath
        })
        // 从请求参数中过滤出不是 inPath 及不是分页器相关 的参数
        const fArr_ = obj_.req.body.filter(qf => {
          return !(config_.pageListParams.includes(qf.name) || qf.inPath)
        })
        // 从请求参数中过滤出日期或时间的参数
        const dataOrTimeArr = fArr_.filter(fd => {
          return /(date|time)/i.test(fd.name)
        })
        // 获取双日历配置项
        this.theDateRangeObj = com_.getDateTimeRangeOpt(dataOrTimeArr, 'name', config_.formItemCig.dataTimeRangeRegExp, config_.formItemCig.isStartRegExp)

        return fArr_.map(qn => {
          // 生成表单项
          const row_ = {
            column: qn.name,
            isShow: true,
            opts: {
              range: null, // 双日历配置项
              valid: null, // 表单验证配置项
              attr: null // 表单配置属性
            }, // 配置项
            needValidateOpts: false, // 是否需要验证配置项
            label: this.filterColumnLable(qn.description),
            labelDesc: qn.description,
            columnType: qn.type,
            formItemType: !isStatic ? this.formItemTypeChoice(qn) : 'input',
            paramsInPath: qn.inPath || false,
            spanNum: 1
          }
          // 自动适配表单元素配置项
          const thatApi_ = this.getCusComptByFormItemType(row_.formItemType)
          if (thatApi_ && thatApi_.methods.__autoInitConfig) {
            thatApi_.methods.__autoInitConfig(row_, false, this.theDateRangeObj)
          }

          return row_
        })
      } else {
        return []
      }
    },
    filterTheListFn () {
      this.init()
    }

  }
}
