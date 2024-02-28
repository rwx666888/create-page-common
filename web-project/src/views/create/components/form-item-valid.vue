<template>
  <div>
    <el-alert
      title="类型为'字符串[string]'且无其它验证条件的不做验证; 提示消息中可使用{label} {min} {max} 等占位符"
      type="warning"
      :closable="false"
      style="margin-bottom: 15px;"
    />
    <el-form label-width="110px">
      <el-form-item label="字段类型">
        <el-select v-model="ruleForm.type.value"><el-option
          v-for="(v, k) in typeListOpt"
          :key="k"
          :label="v.label"
          :value="k"
        /></el-select>
        <el-row class="cus-message-input">
          <el-input v-model="ruleForm.type.message">
            <template slot="prepend">
              提示消息
            </template>
          </el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="必填">
        <el-checkbox v-model="ruleForm.required.value" label="是否必填" />
        <el-row class="cus-message-input">
          <el-input v-model="ruleForm.required.message" :disabled="!ruleForm.required.value">
            <template slot="prepend">
              提示消息
            </template>
          </el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="长度">
        <el-row type="flex">
          <el-checkbox v-model="ruleForm.isMinMax.active" label="启用长度控制" />
          <el-col :span="12">
            <el-form-item label-width="100px" label="最小{min}"><el-input v-model.number="ruleForm.isMinMax.min" :disabled="!ruleForm.isMinMax.active" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" label="最大{max}"><el-input v-model.number="ruleForm.isMinMax.max" :disabled="!ruleForm.isMinMax.active" /></el-form-item>
          </el-col>
        </el-row>
        <el-row class="cus-message-input">
          <el-input v-model="ruleForm.isMinMax.message" :disabled="!ruleForm.isMinMax.active">
            <template slot="prepend">
              提示消息
            </template>
          </el-input>
        </el-row>
      </el-form-item>
      <el-form-item label="正则">
        <el-input v-model="ruleForm.regexp.value"><el-button
          slot="append"
          icon="el-icon-search"
          @click="openRegexpDialogFn"
        /></el-input>
        <el-row class="cus-message-input">
          <el-input v-model="ruleForm.regexp.message">
            <template slot="prepend">
              提示消息
            </template>
          </el-input>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { objectMerge } from '@/utils/index.js'
const configFormValidMsg = _$configFormValidMsg$_

export default {
  name: 'FormItemValid',
  components: {},
  inject: ['itemSetIns'],
  data () {
    return {
      rowData: this.itemSetIns.rowData, // 【原型链对象】，当前操作行的数据，直接修改原型链
      typeListOpt: configFormValidMsg.itemType,
      ruleForm: {
        type: {
          value: 'string',
          message: configFormValidMsg.itemType.string.msg
        },
        required: {
          value: false,
          message: configFormValidMsg.required.msg
        },
        isMinMax: {
          active: false,
          min: '',
          max: '',
          message: configFormValidMsg.isMinMax.strMsg
        },
        regexp: {
          value: '',
          message: configFormValidMsg.regexp.msg
        }
      },
      // 临时存储传递过来的配置信息，用于比较是否有变化
      tmpRuleForm: {}
    }
  },
  computed: {},
  watch: {
    'ruleForm.type.value': {
      immediate: false,
      handler (newValue, oldValue) {
        console.log('newValue: ', newValue)
        this.ruleForm.type.message = configFormValidMsg.itemType[newValue].msg
        this.ruleForm.isMinMax.message = ['number', 'integer', 'float'].includes(newValue) ? configFormValidMsg.isMinMax.intMsg : configFormValidMsg.isMinMax.strMsg
      }
    }

  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log('--form-item-valid--', this.rowData)
      if (this.rowData.columnType === 'integer') {
        this.ruleForm.type.value = 'number'
      }
      if (this.rowData.opts.valid) {
        this.ruleForm = objectMerge(JSON.parse(JSON.stringify(this.ruleForm)), JSON.parse(JSON.stringify(this.rowData.opts.valid)))
      }
      this.tmpRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
    },
    // 打开正则函数面板
    openRegexpDialogFn () {
      this.$message({
        message: '暂未开启',
        type: 'warning'
      })
    },
    checkRulesFn () {
      if (this.ruleForm.type.value === 'any') {
        return false
      }

      // 为 string 时判断是否有其它有效配置，否则忽略
      if (this.ruleForm.type.value === 'string') {
        const oldRuleForm_ = this.$options.data().ruleForm
        const thisForm = JSON.parse(JSON.stringify(this.ruleForm))

        if (
          thisForm.required.value === oldRuleForm_.required.value &&
          thisForm.regexp.value === oldRuleForm_.regexp.value &&
          (!thisForm.isMinMax.active || (thisForm.isMinMax.min === '' && thisForm.isMinMax.max === ''))
        ) {
          return false
        }
        return true
      }
    },
    /**
     * 配置组件提交方法，此方法中修改数据原型链
     * @return Boolean 返回 true 则关闭弹窗，其它则无；
     */
    toSubmitFn () {
      // 没有变化
      if (JSON.stringify(this.tmpRuleForm) === JSON.stringify(this.ruleForm)) {
        // so easy !!! 懂得都懂
        return true
      }
      // 直接修改原型链 this.rowData.opts.valid
      if (this.checkRulesFn) {
        this.rowData.opts.valid = JSON.parse(JSON.stringify(this.ruleForm))
      } else {
        this.rowData.opts.valid = null
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.cus-message-input {
  margin-top: 10px;
}
</style>
