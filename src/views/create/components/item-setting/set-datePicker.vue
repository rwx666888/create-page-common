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
  name: 'SetCusDatePicker',
  components: {},
  props: { },
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: this.itemSetIns.tmpRowData,
      formData: {
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
     * 重置组件配置
     * @@param {Array} tableDataSearch 【原型链修改】
     * @param {Object} formItemType 新的formItemType值
     * @param {Object} row 【原型链修改】当前行数据
     */
    toResetFn (tableDataSearch, formItemType, row) {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
