<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>接口定义检查列表</span>
        <el-button
          style="float: right;"
          type="warning"
          plain
          size="mini"
          @click="init"
        >刷新</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="Path" min-width="240">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Method" width="120">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接口描述" min-width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.docvalid.type ? 'success' : 'warning'"
            >{{ scope.row.docvalid.type ? '通过' : '未通过' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="260">
          <template slot-scope="scope">
            <span>{{ scope.row.docvalid.msg || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { dbGet } from '@/utils/db.js'

export default {
  name: 'CreateApiList',
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      dbGet('cusCatalogDB').then(val => {
        if (!val || !val.items) {
          this.tableData = []
          this.$alert('读取离线数据失败，请先初始化项目信息！', '错误！', {
            confirmButtonText: '去初始化',
            callback: action => {
              this.$router.push({ name: 'CreateIndex' })
            }
          })
          return
        }
        this.tableData = Object.keys(val.items).map((pathKey) => {
          const cur = val.items[pathKey] || {}
          return {
            path: cur.uri || '',
            method: (cur.type || '').toUpperCase(),
            summary: cur.summary || '',
            docvalid: cur.docvalid || { type: true, msg: '' }
          }
        })
      }).catch(() => {
        this.tableData = []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card{
  margin-top: 15px;
}
</style>
