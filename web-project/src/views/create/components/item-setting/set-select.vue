<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="">
      <el-checkbox v-model="formData.multiple">是否多选 </el-checkbox>
      <el-checkbox v-if="formData.multiple" v-model="formData['collapse-tags']">多选时是否按tag形式展示</el-checkbox>
    </el-form-item>
    <el-form-item v-if="formData.multiple" label="最大可选个数">
      <el-input v-model.number="formData['multiple-limit']" type="number" />
    </el-form-item>
    <el-form-item label="">
      <el-checkbox v-model="formData.disabled">是否禁用 </el-checkbox>
      <el-checkbox v-model="formData.clearable">是否可清空 </el-checkbox>
      <el-checkbox v-model="formData.filterable">是否可搜索 </el-checkbox>
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
  name: 'SetSelect',
  components: { DataSourse },
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: this.itemSetIns.tmpRowData,
      /* 注意以 '_'开头并且以 '_'结尾 （/^_[\w-]+_$/）的属性为私有属性，或临时变量，不会出现在模板属性过滤器 getFormItemAttr 中 */
      formData: {
        'multiple-limit': 0, // 最大可选个数
        multiple: false, // 是否多选
        'collapse-tags': false, // 多选时是否按tag形式展示
        clearable: false, // 是否可清空
        filterable: false, // 是否可搜索
        disabled: false, // 是否禁用，建议使用组件的默认值
        _dataSource_: [], // 数据源，内置私有属性
        _dataSourceOpts_: {} // 数据源配置项
      },
      tmpFormData: {},
      /* 需要覆写的属性名称， 即在formDate中修改了组件默认属性值的属性的名称， 例如 'type'；注意：具有非空值的私有属性（_xx_）会自动应用，无需维护在这里 */
      rewriteAttr: []
    }
  },
  computed: {},
  watch: {},
  created () { this.init() },
  mounted () { },
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
      const oldData = this.$options.data.call(this).formData

      if (!this.formData.multiple) {
        delete oldData['collapse-tags']
        delete oldData['multiple-limit']
      }

      // 只保留当前最新的属性，忽略已移除的历史属性和组件默认值，以减少冗余输出。
      const tmp = {}
      const tempData = JSON.parse(JSON.stringify(this.formData))
      Object.keys(oldData).forEach(k => {
        if (this.rewriteAttr.includes(k) || /^_[\w-]+_$/.test(k) || tempData[k] !== oldData[k]) {
          tmp[k] = tempData[k]
        }
      })
      this.rowData.opts.attr = { ...tmp }
      return true
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
      if (row.formItemType === 'select' && row.columnType === 'array') { // 数组类型的select,默认多选
        row.opts.attr = Object.assign({}, (row.opts.attr || {}), {
          multiple: true // 是否多选
        })
      }
    },
    /**
     * 重置关联数据的配置项
     * 注意当前操作行的数据，会默认自动重置不需要在这里处理(组件私有数据除外)，这里只处理关联数据的配置项
     * 例如 开始时间与结束时间的关联，开始时间的配置项修改后，同时需要在这里重置结束时间的配置项
     * @param {Object} row 【原型链修改】当前行数据 ，其中 row.formItemType 始终为修改前的旧值，而 __autoInitConfig 方法中的 row.formItemType 始终为修改后的新值
     * @param {Array} tableDataSearch 【原型链修改】
     * @param {Object} newFormItemType 新的formItemType值
     */
    __toResetFn (row, tableDataSearch = [], newFormItemType) {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
