<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    class="cus-dialog"
    @closed="onDialogClosed"
    @opened="onOpened"
  >
    <el-tabs
      v-if="visible"
      tab-position="left"
    >
      <el-tab-pane label="表单验证"><form-item-valid ref="formItemValid" /></el-tab-pane>
      <el-tab-pane label="组件配置"><component
        :is="curComponent"
        v-if="curComponent"
        ref="itemSetting"
      /></el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="toSubmitFn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FormItemValid from '@/views/create/components/form-item-valid.vue'

export default {
  name: 'DialogFormItemSetting',
  components: {
    FormItemValid,
    ..._$cusComponents$_
  },
  props: {
  },
  provide () {
    return {
      itemSetIns: this
    }
  },
  data () {
    return {
      curComponent: 'SetEmpty',
      visible: false,
      title: '配置',
      rowData: {}, // 【原型链对象】，当前操作行的数据，直接修改原型链
      tmpRowData: {}, // rowData的克隆对象，submit 后才修改数据
      rowList: [] // 【原型链对象】 检索条件对象数组，直接修改原型链
    }
  },
  computed: {
  },
  watch: {
  },
  created () { },
  mounted () { },
  methods: {
    onDialogClosed () {
      // 重置并断开所有与父页面关联的 原型链
      const Old_ = this.$options.data()
      this.title = Old_.title
      this.rowData = Old_.rowData
      this.tmpRowData = Old_.tmpRowData
      this.rowList = Old_.rowList
    },
    // 查找组件对应的自定义配置项
    choiceComponentFn (name) {
      if (name) {
        const n_ = 'Set' + (name.charAt(0).toUpperCase() + name.slice(1))
        this.curComponent = _$cusComponents$_[n_] ? n_ : 'SetEmpty'
      } else {
        this.curComponent = 'SetEmpty'
      }
    },
    show (row, list) {
      if (row) {
        this.rowData = row
        this.title = `${row.label}【${row.column}】配置`
        this.tmpRowData = JSON.parse(JSON.stringify(row))
        this.rowList = list
        this.choiceComponentFn(this.tmpRowData.formItemType)
        console.log('-show-', this.tmpRowData)
      }
      this.visible = true
    },
    hide () {
      this.visible = false
    },
    onOpened () {
    },
    toSubmitFn () {
      const flag1 = this.$refs.itemSetting.toSubmitFn ? this.$refs.itemSetting.toSubmitFn() : true
      const flag2 = this.$refs.formItemValid.toSubmitFn ? this.$refs.formItemValid.toSubmitFn() : true
      if (flag1 && flag2) {
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cus-dialog ::v-deep{
    .el-dialog__header{
      border-bottom:1px solid #ddd ;
    }
    .el-dialog__body{
      padding: 20px;
    }
    .el-dialog__footer{
      border-top:1px solid #ddd ;
    }
  }

</style>
