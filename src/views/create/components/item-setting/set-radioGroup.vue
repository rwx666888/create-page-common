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
      <DataSourse
        :data-source-opts="formData._dataSourceOpts_"
        :tmp-row-data="tmpRowData"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import DataSourse from './part/dataSourse.vue'

export default {
  name: 'SetInput',
  components: { DataSourse },
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
        _dataSourceOpts_: {} // 数据源配置项
      },
      tmpFormData: {}
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
    },
    /**
     * 配置组件提交方法，此方法中修改数据原型链
     * @return Boolean 返回 true 则关闭弹窗，其它则无；
     */
    toSubmitFn () { // 直接修改原型链
      if (this.formData._dataSourceOpts_.dataSourceStr?.trim()) {
        try {
          this.formData._dataSource_ = JSON.parse(this.formData._dataSourceOpts_.dataSourceStr.trim())
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
