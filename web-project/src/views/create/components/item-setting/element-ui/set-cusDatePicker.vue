<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="开始时间">
      <el-select
        v-model="formData._start_"
        clearable
        style="width: 100%;"
      >
        <el-option
          v-for="item in rowList"
          :key="item.column"
          :label="item.column + '【'+item.label+'】'"
          :value="item.column"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="结束时间">
      <el-select
        v-model="formData._end_"
        clearable
        style="width: 100%;"
      >
        <el-option
          v-for="item in rowList"
          :key="item.column"
          :label="item.column + '【'+item.label+'】'"
          :value="item.column"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="显示类型">
      <el-select
        v-model="formData.type"
        style="width: 100%;"
      >
        <el-option
          label="双日期"
          value="daterange"
        />
        <el-option
          label="双日期时间"
          value="datetimerange"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="显示的格式">
      <el-select
        v-model="formData.format"
        style="width: 100%;"
      >
        <el-option
          label="yyyy-MM-dd"
          value="yyyy-MM-dd"
        />
        <el-option
          label="yyyy-MM-dd HH:mm"
          value="yyyy-MM-dd HH:mm"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="绑定值的格式">
      <el-select
        v-model="formData['value-format']"
        style="width: 100%;"
      >
        <el-option
          label="Date 对象"
          value=""
        />
        <el-option
          label="yyyy-MM-dd"
          value="yyyy-MM-dd"
        />
        <el-option
          label="yyyy-MM-dd HH:mm"
          value="yyyy-MM-dd HH:mm"
        />
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script>
import { isEmptyObject, _getInitAttrOfComp, getCusComptByFormItemType } from '@/utils/index.js'

const config_ = _$cusConfig$_
const com_ = require('create-vue-page-npm').createApi

export default {
  name: 'SetCusDatePicker',
  components: {},
  props: { },
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: this.itemSetIns.tmpRowData,
      rowList: this.itemSetIns.rowList, // 【原型链对象】，当前操作行的数据，直接修改原型链
      /* 注意以 '_'开头并且以 '_'结尾 （/^_[\w-]+_$/）的属性为私有属性，或临时变量，不会出现在模板属性过滤器 getFormItemAttr 中 */
      formData: {
        _start_: '',
        _end_: '',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd'
      },
      tmpFormData: {},
      /* 需要覆写的属性名称， 即在formDate中修改了组件默认属性值的属性的名称， 例如 'type'；注意：具有非空值的私有属性（_xx_）会自动应用，无需维护在这里 */
      rewriteAttr: ['type', 'format', 'value-format']
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log('--SetCusDatePicker--')
      if (this.tmpRowData.opts.range && this.tmpRowData.opts.range.isDatePickerRange) {
        if (this.tmpRowData.opts.range.isStart) {
          this.formData._start_ = this.tmpRowData.column
          this.formData._end_ = this.tmpRowData.opts.range.to_
        } else {
          this.formData._start_ = this.tmpRowData.opts.range.to_
          this.formData._end_ = this.tmpRowData.column
        }
        Object.assign(this.formData, this.tmpRowData.opts.attr || {})
        this.tmpFormData = JSON.parse(JSON.stringify(this.formData))
      }
    },
    /**
     * 配置组件提交方法，此方法中修改数据原型链
     * @return Boolean 返回 true 则关闭弹窗，其它则无；
     */
    toSubmitFn () { // 直接修改原型链
      if (this.tmpRowData.formItemType !== 'cusDatePicker') { // 此方法没啥用
        this.$alert(`配置器加载错误，当前加载的为${this.tmpRowData.formItemType}`, '错误')
        return false
      }
      if (!this.formData._start_ || !this.formData._end_) {
        this.$alert(`开始时间或结束时间不能为空`, '错误')
        return false
      }
      if (this.tmpRowData.opts.range?.isStart) {
        // 组件配置属性
        this.rowData.opts.attr = {
          'format': this.formData.format,
          'value-format': this.formData['value-format'],
          'type': this.formData.type
        }
      }
      if (this.formData._start_ === this.tmpFormData._start_ && this.formData._end_ === this.tmpFormData._end_) {
        // this.itemSetIns.hide()
        return true
      }
      if (this.formData._start_ === this.rowData.column || this.formData._end_ === this.rowData.column) {
        const regExp_ = new RegExp(config_.formItemCig.dataTimeRangeRegExp, 'i')
        let tempStart = null
        let tempEnd = null
        if (this.formData._start_ === this.rowData.column) {
          tempStart = this.rowData
          tempEnd = com_.getRowFormListByColname(this.rowList, 'column', this.formData._end_)
        } else {
          tempStart = com_.getRowFormListByColname(this.rowList, 'column', this.formData._start_)
          tempEnd = this.rowData
        }

        let f_ = tempStart.column.replace(regExp_, '__')
        f_ = f_.indexOf('__') === -1 ? f_ + '__' : f_
        tempStart.opts['range'] = {
          f_,
          to_: this.formData._end_,
          isStart: true,
          isDatePickerRange: true
        }
        tempEnd.opts['range'] = {
          f_,
          to_: this.formData._start_,
          isStart: false,
          isDatePickerRange: true
        }
        tempEnd.isShow = false

        if (this.tmpFormData._start_ && this.tmpFormData._end_) {
          if (this.formData._start_ !== this.tmpFormData._start_) {
            const toOldObj_ = com_.getRowFormListByColname(this.rowList, 'column', this.tmpFormData._start_)
            if (toOldObj_.opts.range) {
              toOldObj_.opts.range = null
              toOldObj_.isShow = true
            }
          }
          if (this.formData._end_ !== this.tmpFormData._end_) {
            const toOldObj_ = com_.getRowFormListByColname(this.rowList, 'column', this.tmpFormData._end_)
            if (toOldObj_.opts.range) {
              toOldObj_.opts.range = null
              toOldObj_.isShow = true
            }
          }
        }
        return true
      } else {
        this.$alert(`开始时间或结束时间必须有其一包含当前配置列【 ${this.rowData.column} 】`, '错误')
      }
    },
    /**
     * 自动初始化配置项
     * 【内置钩子，静态工具类】【原型链修改】
     * 组件在被初始化前，会调用此方法，用于初始化配置项，此方法会在组件实例化前调用，所以无法访问组件实例，并且其中的 this 指向的是 methods 对象;
     * 尽量不要在此方法中使用this,或不在当前实例中使用此方法，以免造成this指向错误
     * 可访问的全局变量：
     *  _$cusConfig$_ 配置项，对应config.js中的配置项
     *  _$cusComponents$_ 组件列表，对应item-setting 目录下的组件列表；_$cusComponents$_['SetInput'] 为 SetInput 组件,注意不是组件实例
     *  访问组件内的方法： _$cusComponents$_['SetInput'].methods.__autoInitConfig, 注意：被访问的方法中不能使用this
     *  访问组件内的data： _$cusComponents$_['SetInput'].data.call({}), 注意：不能获取data中包含this的引用，均为undefined 或 异常
     * @param {Object} row 当前操作行的数据 【原型链修改】 其中 row.formItemType 始终为修改后的新值，而 __toResetFn 方法中的 row.formItemType 始终为修改前的旧值
     * @param {Array | false} tableDataSearch 当前视图的数据 【原型链修改】,如果是false则表示只操作当前行的数据，不操作关联行的数据
     * @param {Object} other 其它参数
     */
    __autoInitConfig (row, tableDataSearch = [], other = {}) {
      if (!other.rangeObj) {
        return false
      }
      const curRange_ = other.rangeObj[row.column] || null
      row.isShow = (curRange_ ? (!!(curRange_.isDatePickerRange && curRange_.isStart)) : true)
      row.opts.range = curRange_
      if (tableDataSearch && curRange_) {
        const toObj_ = com_.getRowFormListByColname(tableDataSearch, 'column', row.opts.range.to_)
        if (toObj_) {
          const toRange_ = other.rangeObj[toObj_.column] || null
          toObj_.opts.range = toRange_
          toObj_.opts.attr = null
          toObj_.formItemType = row.formItemType
          toObj_.isShow = (toRange_ ? (!!(toRange_.isDatePickerRange && toRange_.isStart)) : true)

          const _Comp = getCusComptByFormItemType(row.formItemType)
          if (_Comp) {
            const attr_ = _getInitAttrOfComp(_Comp)
            console.log('---attr_--init', row.column, toObj_.column, attr_)
            if (!isEmptyObject(attr_)) {
              toObj_.opts.attr = attr_
            }
          }
        }
      }
    },
    /**
     * 重置关联数据的配置项
     * 注意当前操作行的数据，会默认自动重置不需要在这里处理(组件私有数据除外)，这里只处理关联数据的配置项
     * 例如 开始时间与结束时间的关联，开始时间的配置项修改后，同时需要在这里重置结束时间的配置项
     * @param {Object} row 【原型链修改】当前行数据 ，其中 row.formItemType 始终为修改前的旧值，而 __autoInitConfig 方法中的 row.formItemType 始终为修改后的新值
     * @param {Array} tableDataSearch 【原型链修改】当前视图的数据
     * @param {Object} newFormItemType 新的formItemType值
     */
    __toResetFn (row, tableDataSearch = [], newFormItemType) {
      console.log('---aaaa--', newFormItemType, row)
      if (row.opts.range && newFormItemType !== 'cusDatePicker') {
        const toObj_ = com_.getRowFormListByColname(tableDataSearch, 'column', row.opts.range.to_)
        console.log('fnSelFormItemType--', toObj_)
        if (toObj_) {
          toObj_.opts.range = null
          toObj_.opts.attr = null
          toObj_.formItemType = newFormItemType
          toObj_.isShow = true

          const _Comp = getCusComptByFormItemType(newFormItemType)
          if (_Comp) {
            const attr_ = _getInitAttrOfComp(_Comp)
            console.log('---attr_--reset', row.column, toObj_.column, attr_)
            if (!isEmptyObject(attr_)) {
              toObj_.opts.attr = attr_
            }
            if (_Comp.methods.__autoInitConfig) {
              _Comp.methods.__autoInitConfig(toObj_, tableDataSearch)
            }
          }
        }
        row.isShow = true
      }
    },
    /**
     * 选择组件类型
     * 【内置钩子，静态工具类】注意不能修改 row 的值
     * @param {object} row 当前操作行的数据
     * @param {object} other 其它参数
     * @return {number | null} 返回值为null则不做任何操作，返回值为数字则代表匹配优先级，数字越大优先级越高
     */
    __formItemTypeChoice (row, other = {}) {
      if (!config_.formFieldDetection.findDate) {
        return null
      }
      const name_ = row.name || ''
      if (/(date|time)/i.test(name_) && other.rangeObj[name_] && other.rangeObj[name_].isDatePickerRange) { // 日期范围
        return 5
      }
      return null
    },
    /**
     * 验证方法
     * 验证组件配置信息是否有效
     * @param {Object} row 当前操作行的数据, 禁止修改
     * @param {Array} tableDataSearch 当前视图的数据, 禁止修改
     * @return {Boolean} 返回 false 则验证不通过
     */
    __validationFn (row, tableDataSearch = []) {
      if (!row.opts.range) {
        this.$alert(`字段【${row.column}】未指定【开始时间或结束时间】`, '错误')
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
