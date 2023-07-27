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
import config_ from '@/config.js'

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
      formData: {
        _start_: '',
        _end_: '',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd'
      },
      tmpFormData: {}
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
      if (this.tmpRowData.opts.range.isStart) {
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

        console.log('this.rowData', tempStart.column, tempEnd.column)
        // this.itemSetIns.hide()
        return true
      } else {
        this.$alert(`开始时间或结束时间必须有其一包含当前配置列【 ${this.rowData.column} 】`, '错误')
      }
    },
    /**
     * 重置组件配置
     * @@param {Array} tableDataSearch 【原型链修改】
     * @param {Object} formItemType 新的formItemType值
     * @param {Object} row 【原型链修改】当前行数据
     */
    toResetFn (tableDataSearch, formItemType, row) {
      console.log('---aaaa--', formItemType, row)
      if (row.opts.range && formItemType !== 'cusDatePicker') {
        const toObj_ = com_.getRowFormListByColname(tableDataSearch, 'column', row.opts.range.to_)
        console.log('fnSelFormItemType--', toObj_)
        if (toObj_) {
          toObj_.opts.range = null
          toObj_.opts.attr = null
          toObj_.formItemType = formItemType
          toObj_.isShow = true
        }
        row.opts.range = null
        row.opts.attr = null
        row.isShow = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
