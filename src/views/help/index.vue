<template>
  <div class="app-container">
    <div class="t-wrap markdown-body" v-html="content" />
  </div>
</template>

<script>

// import hljs from 'highlight.js'
import '@/styles/github-markdown.css'
// import 'highlight.js/styles/github.css'
import RM from '../../../README.md'
// import { getComConfig } from '@/apis/create-page.js'
export default {
  name: 'Help',
  directives: { },
  components: {
  },
  data () {
    return {
      content: ''
    }
  },
  watch: {
  },

  mounted () {
    const md_ = RM.toString().replace(/(<\/?template>|<\/?section>)/gi, '')
    /* getComConfig().then(res => {
      // 注意这里必须使用 函数返回 res 否则其中的$符会被解析为正则
      this.content = md_.replace('## 查看 /src/config ##', () => res)
      this.$nextTick(_ => {
        document.querySelectorAll('.t-wrap pre > code').forEach((el2) => {
          hljs.highlightBlock(el2)
        })
      })
    }) */
    this.content = md_
    /* this.$nextTick(_ => {
      document.querySelectorAll('.t-wrap pre > code').forEach((el2) => {
        el2.classList.add('jsx')
        hljs.highlightBlock(el2)
      })
    }) */
  },
  created () {

  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.t-wrap {
  background: #fff;
  padding: 20px;
}

</style>
