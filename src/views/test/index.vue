<template>
  <div class="app-container">
    <el-button @click="testfn01">测试</el-button>
    数据1： {{ msg }}
    <div>
      数据2： {{ msg2 }}
    </div>
  </div>
</template>

<script>
import { getTestList, getTestList2, gettt } from '../../apis/example.js'
export default {
  data () {
    return {
      msg: '',
      msg2: ''
    }
  },
  watch: {
  },

  mounted () {
    this.init()
  },
  created () {
    gettt().then(res => {
      console.log('aaaa', res)
    })
  },
  methods: {
    init () {
      getTestList({ name: 123 }).then(res => {
        this.msg = JSON.stringify(res)
      })
      getTestList2({ name: 456 }).then(res => {
        this.msg2 = JSON.stringify(res)
      })
    },
    testfn01 () {
      this.init()
    }
  }
}
</script>
