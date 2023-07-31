<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="样式">
      <el-radio v-model="formData._type_" label="normal">普通样式</el-radio>
      <el-radio v-model="formData._type_" label="button">按钮样式</el-radio>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="formData.border">是否显示边框 </el-checkbox>
    </el-form-item>
    <el-form-item v-if="formData.border || formData._type_ == 'button'" label="尺寸">
      <el-select v-model="formData.size" placeholder="请选择">
        <el-option label="默认" value="" />
        <el-option label="medium" value="medium" />
        <el-option label="small" value="small" />
        <el-option label="mini" value="mini" />
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="formData.disabled">是否禁用 </el-checkbox>
    </el-form-item>
    <el-form-item label="数据源">
      <div style="margin-bottom:15px">
        <el-popover
          v-model="dataSourceVisible"
          placement="top-start"
          width="530"
        >
          <el-input
            v-model="formData._dataSourceTmpStr_"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder=""
          />
          <div style="text-align: right; margin-top: 10px;">
            <el-button
              size="mini"
              type="text"
              @click="dataSourceVisible = false"
            >取消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dataSourceFn"
            >识别</el-button>
          </div>
          <el-button
            slot="reference"
            type="warning"
            plain
          >自动识别/提取</el-button>
        </el-popover>

      </div>
      <el-input
        v-model="formData._dataSourceStr_"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 10}"
        placeholder="格式：[{key: '', value: ''},{key: '', value: ''}]"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import { extractDataDict } from '@/utils/index.js'

export default {
  name: 'SetInput',
  components: {},
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: this.itemSetIns.tmpRowData,
      /* 注意以 '_'开头并且以 '_'结尾 （/^_[\w-]+_$/）的属性为私有属性，或临时变量，不会出现在模板属性过滤器 getFormItemAttr 中 */
      formData: {
        _type_: 'normal',
        disabled: false, // 是否禁用，建议使用组件的默认值
        border: false, // 是否显示边框，建议使用组件的默认值
        size: '', // 尺寸，建议使用组件的默认值
        _dataSource_: [], // 数据源，内置私有属性
        _dataSourceStr_: '', // 数据源(字符串)
        _dataSourceTmpStr_: '' // 数据源(临时输入项)
      },
      tmpFormData: {},
      dataSourceVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.tmpRowData.opts.attr) {
        Object.assign(this.formData, this.tmpRowData.opts.attr || {})
      }
      if (!this.tmpRowData.opts.attr?._dataSourceTmpStr_ && this.tmpRowData.labelDesc) {
        this.formData._dataSourceTmpStr_ = this.tmpRowData.labelDesc
      }
    },
    /**
     * 配置组件提交方法，此方法中修改数据原型链
     * @return Boolean 返回 true 则关闭弹窗，其它则无；
     */
    toSubmitFn () { // 直接修改原型链
      if (this.formData._dataSourceStr_.trim()) {
        try {
          this.formData._dataSource_ = JSON.parse(this.formData._dataSourceStr_.trim())
        } catch (error) {
          this.$alert(`数据源内容格式有误`, '错误')
          return false
        }
      }
      const tmp = {}
      const oldData = this.$options.data.call(this).formData
      // 只处理当前属性,忽略合并过来的已移除的历史属性与内置属性,忽略组件默认值的属性
      if (!this.formData.border && this.formData._type_ !== 'button') {
        delete oldData.size
      }
      Object.keys(oldData).forEach(k => {
        if (this.formData[k] !== oldData[k]) {
          tmp[k] = this.formData[k]
        }
      })
      this.rowData.opts.attr = { ...tmp }
      return true
    },
    // 数据源
    dataSourceFn () {
      if (this.formData._dataSourceTmpStr_.trim()) {
        const arr = extractDataDict(this.formData._dataSourceTmpStr_, 'array')
        if (arr.length) {
          this.formData._dataSourceStr_ = JSON.stringify(arr, null, 2)
        }
      }
      this.dataSourceVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
