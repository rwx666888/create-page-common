<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item label="前置元素">
      <el-input v-model="formData._prependVal_" :disabled="formData._prependType_ === '' || formData._prependType_ === 'select'">
        <el-select
          slot="prepend"
          v-model="formData._prependType_"
          class="cus-allowed"
          style="width: 120px;"
        >
          <el-option label="不使用" value="" />
          <el-option label="文字" value="text" />
          <el-option label="图标按钮" value="btnIcon" />
          <!-- <el-option label="下拉框" value="select" /> -->
        </el-select>
        <el-button
          v-if="formData._prependType_ === 'btnIcon'"
          slot="append"
          icon="el-icon-search"
          @click="$message('暂未支持图标库选取，请输入icon的class')"
        />
      </el-input>
    </el-form-item>
    <el-form-item label="后置元素">
      <el-input v-model="formData._appendVal_" :disabled="formData._appendType_ === '' || formData._appendType_ === 'select'">
        <el-select
          slot="prepend"
          v-model="formData._appendType_"
          class="cus-allowed"
          style="width: 120px;"
        >
          <el-option label="不使用" value="" />
          <el-option label="文字" value="text" />
          <el-option label="图标按钮" value="btnIcon" />
          <!-- <el-option label="下拉框" value="select" /> -->
        </el-select>
        <el-button
          v-if="formData._appendType_ === 'btnIcon'"
          slot="append"
          icon="el-icon-search"
          @click="$message('暂未支持图标库选取，请输入icon的class')"
        />
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>

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
        _prependType_: '', // 前置对象的类型
        _prependVal_: '', // 前置对象的值
        _appendType_: '',
        _appendVal_: ''
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
      if (this.formData._prependType_ === '' && this.formData._appendType_ === '') {
        this.rowData.opts.attr = null
      } else {
        const tmp = {}
        const oldData = this.$options.data.call(this).formData
        // 只处理当前属性,忽略合并过来的已移除的历史属性与内置属性
        Object.keys(oldData).forEach(k => {
          tmp[k] = this.formData[k]
        })
        this.rowData.opts.attr = { ...tmp }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
