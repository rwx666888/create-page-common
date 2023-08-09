<template>
  <div>
    <div class="btn-box">
      <!-- <el-radio-group
        v-model="dataMode"
        size="mini"
      >
        <el-radio-button label="static">静态 </el-radio-button>
        <el-radio-button label="remote">远程 </el-radio-button>
        <el-radio-button label="remoteSearch">远程搜索 </el-radio-button>

      </el-radio-group> -->
      <el-popover
        v-model="dataSourceVisible"
        placement="top-end"
        width="530"
      >
        <el-input
          v-model="dataSourceTmpStr"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder=""
        />
        <div style="text-align: right; margin-top: 10px;">
          <el-checkbox
            v-model="dataSourceKeyType"
            true-label="number"
            false-label="string"
            style="margin-right: 15px;"
          >value为数值型 </el-checkbox>
          <el-button
            size="mini"
            type="default"
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
          size="mini"
        >自动识别/提取</el-button>
      </el-popover>

    </div>
    <el-input
      v-model="dataSourceStr"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 10}"
      placeholder="格式：[{key: '', value: ''},{key: '', value: ''}]"
      @input="dataSourceOpts.dataSourceStr = dataSourceStr"
    />
  </div>
</template>
<script>
import { extractDataDict } from '@/utils/index.js'

export default {
  name: 'DataSourse',
  props: {
    dataSourceOpts: { // 数据源配置项
      type: Object,
      default: () => ({})
    },
    tmpRowData: { // 当前操作行的数据
      type: Object,
      default: () => ({})
    }
  },

  data () {
    const temp = {
      dataSourceVisible: false, // 数据源弹窗
      dataSourceKeyType: 'string', // value为数值型
      dataSourceTmpStr: '', // 数据源(临时输入项)
      dataSourceStr: '', // 数据源(字符串)
      dataMode: 'static'
    }
    Object.assign(temp, this.dataSourceOpts)
    return {
      ...temp
    }
  },
  computed: { },
  watch: { },
  created () {
    this.init()
    // console.log('###111', this.$options.data.call(this))
  },
  mounted () { },
  methods: {
    init () {
      if (!this.tmpRowData.opts.attr?._dataSourceOpts_?.dataSourceTmpStr && this.tmpRowData.labelDesc) {
        this.dataSourceTmpStr = this.tmpRowData.labelDesc
      }
    },
    // 数据源
    dataSourceFn () {
      const str = this.dataSourceTmpStr.trim()
      if (str) {
        const arr = extractDataDict(str, this.dataSourceKeyType, 'array')
        if (arr.length) {
          this.dataSourceStr = JSON.stringify(arr, null, 2)
          this.dataSourceOpts.dataSourceStr = this.dataSourceStr
        }
      }
      this.dataSourceOpts.dataSourceKeyType = this.dataSourceKeyType
      this.dataSourceOpts.dataSourceTmpStr = str
      this.dataSourceVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
