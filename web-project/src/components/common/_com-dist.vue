<template>
  <!--
  全部城市下拉列表组件
  用法  <com-dist :val.sync="data.value" dist-name="thatName" :is-all="false"  />
  editor lianglei
   -->
  <el-select
    :value="val"
    v-bind="$attrs"
    @change="onChange"
    @clear="onClear"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { comConfig } from '@/settings.js'

export default {
  name: 'ComDist',
  components: {},
  props: {
    val: {
      type: [String, Number],
      default: null
    },
    distName: {
      type: String,
      required: true
    },
    isAll: { // 是否显示全部
      type: Boolean,
      default: false
    },
    allLabel: { // 全部的label名称
      type: [String, Number],
      default: '全部'
    }
  },
  data () {
    return {
      options: []
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (comConfig[this.distName] && Array.isArray(comConfig[this.distName])) {
        if (this.isAll) {
          this.options = [{
            value: null,
            label: this.allLabel
          }].concat(comConfig[this.distName])
        } else {
          this.options = [].concat(comConfig[this.distName])
        }
      } else {
        console.error('字典', this.distName, '不存在或非数组类型！')
      }
    },
    onChange (value) {
      console.log('--onChange--', value)
      this.$emit('update:val', value)
      const cur_ = this.options.filter(item => {
        return item.value === value
      })
      this.$emit('change', cur_.length ? cur_[0] : {})
    },
    onClear () {
    }
  }
}
</script>

<style>
</style>
