<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="显示类型">
      <el-select
        v-model="formData.type"
        style="width: 100%;"
      >
        <el-option
          label="日期"
          value="date"
        />
        <el-option
          label="日期时间"
          value="datetime"
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

export default {
  name: 'SetDatePicker',
  components: {},
  props: { },
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: this.itemSetIns.tmpRowData,
      /* 注意以 '_'开头并且以 '_'结尾 （/^_[\w-]+_$/）的属性为私有属性，或临时变量，不会出现在模板属性过滤器 getFormItemAttr 中 */
      formData: {
        type: 'date',
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
      if (this.tmpRowData.opts.attr) {
        Object.assign(this.formData, this.tmpRowData.opts.attr || {})
      }
    },
    /**
     * 配置组件提交方法，此方法中修改数据原型链
     * @return Boolean 返回 true 则关闭弹窗，其它则无；
     */
    toSubmitFn () { // 直接修改原型链
      // 组件配置属性
      this.rowData.opts.attr = {
        'format': this.formData.format,
        'value-format': this.formData['value-format'],
        'type': this.formData.type
      }
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

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
