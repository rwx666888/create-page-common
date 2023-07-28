<!-- 创建详情页或详情弹窗 -->
<template>
  <div class="app-container">
    <div class="t-wrap">
      <div class="form-container">
        <div class="form-left-box">
          <span>选择API：</span>
          <el-select
            v-model="curApi"
            placeholder="请选择"
            style="width:700px"
            filterable
            @change="toChoiceApiFn"
          >
            <el-option
              v-for="item in apiOpts"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-tooltip
            effect="dark"
            content="启用过滤后，将会根据表单元素类型进行过滤，过滤条件请自行修改init方法，以匹配你的数据结构"
            placement="top"
          >
            <el-checkbox
              v-model="isFilterTheList"
              style="margin-left:20px;"
              @change="filterTheListFn"
            >启用过滤</el-checkbox>
          </el-tooltip>
        </div>
        <div class="form-right-box"><el-button
          :disabled="!curApi"
          type="success"
          icon="el-icon-plus"
          @click="toCreateFn"
        >生成</el-button></div>
      </div>
    </div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>检索条件</span>
        <div style="float: right;">
          展现类型：<el-select
            v-model="tableConfig.type"
            size="mini"
            style="width: 100px;"
          >
            <el-option
              label="页面"
              value="page"
            />
            <el-option
              label="弹窗"
              value="dialog"
            />
          </el-select>
        </div>
      </div>
      <el-table
        ref="cmp_table"
        :data="tableDataSearch"
        :border="false"
        data-data-name="tableDataSearch"
      >
        <el-table-column label="" width="40"><i class="el-icon-sort js-handle" /></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50px"
        />
        <el-table-column label="列名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.column" placeholder="请输入内容" />
          </template>
        </el-table-column>
        <el-table-column label="label名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="请输入内容" />
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="labelDesc"
        />
        <el-table-column
          label="数据类型"
          width="100px"
          prop="columnType"
        />

      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>列表项</span>
        <div style="float: right;">
          列数：
          <el-select
            v-model="tableConfig.columnNum"
            style="margin-right: 20px; width: 80px;"
            size="mini"
            @change="changeColumnNumFn"
          >
            <el-option
              v-for="item in 3"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-checkbox v-model="tableConfig.showColon">显示冒号</el-checkbox>
          <el-checkbox v-model="tableConfig.showBorder">显示边框</el-checkbox>
        </div>
      </div>
      <el-table
        ref="cmp_table2"
        :data="tableData"
        :border="false"
        row-class-name="js-can-sort"
        data-data-name="tableData"
      >
        <el-table-column label="" width="40"><i class="el-icon-sort js-handle" /></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50px"
        />
        <el-table-column label="列名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.column" placeholder="请输入内容" />
          </template>
        </el-table-column>
        <el-table-column label="label名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="请输入内容" />
          </template>
        </el-table-column>
        <el-table-column
          label="数据类型"
          prop="columnType"
          width="100px"
        />
        <el-table-column
          label="显示"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isShow" />
          </template>
        </el-table-column>
        <el-table-column
          label="单元格数"
          width="90px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.spanNum"
            >
              <el-option
                v-for="item in tableConfig.columnNum"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
import { toCreatePage, toCreateDialog } from '@/apis/create-page.js'
import createMixin from '@/mixins/create.js'

export default {
  name: 'CreateInfo',
  components: {
  },
  mixins: [createMixin],
  data () {
    return {
      tableConfig: {
        showColon: false, // 显示冒号
        showBorder: true, // 显示边框
        columnNum: 3, // 列数
        type: 'dialog' // 类型 page | dialog
      }
    }
  },
  computed: {},
  watch: { },
  mounted () {
    this.init()
  },
  created () {},
  methods: {
    init () {
      this.initData(item => { return !item.hasList && (item.res?.dataFormat === 'array' || item.res?.dataFormat === 'object') })
    },

    toChoiceApiFn (val) {
      const Old_ = this.$options.data()
      this.tableData = Old_.tableData
      this.tableDataSearch = Old_.tableDataSearch
      this.apiConfig = Old_.apiConfig
      if (val) {
        const obj_ = this.tempCatalogData[val]
        console.log('--', obj_, val)

        this.apiConfig = this._fnMakeApiCfg(obj_)
        console.log(' this.apiConfig', this.apiConfig)

        this.tableData = this._fnMakeTableData(obj_)

        this.tableDataSearch = this._fnMakeTableDataSearch(obj_)

        this.$nextTick(() => {
          this.rowDrop()
        })
      }
    },

    toCreateFn () {
      (this.tableConfig.type === 'page' ? toCreatePage : toCreateDialog)({
        rootPath: this.localProjectPath,
        templateType: this.tableConfig.type === 'page' ? 'infoPage' : 'infoDialog',
        formData: JSON.parse(JSON.stringify(this.tableDataSearch)),
        tableData: JSON.parse(JSON.stringify(this.tableData)),
        tableConfig: JSON.parse(JSON.stringify(this.tableConfig)),
        apiConfig: JSON.parse(JSON.stringify(this.apiConfig)),
        querysInPath: JSON.parse(JSON.stringify(this.querysInPath))
      }).then(resc => {
        console.log('resc', resc)
        this.showMsgFn(resc)
      })
    },
    changeColumnNumFn () {
      this.tableData.forEach(item => {
        item.spanNum = 1
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.t-wrap {
  background: #fff;
  padding: 20px;
}

.box-card {
  margin-top: 15px;
}
.js-handle {
  font-size: 18px;
  cursor: s-resize;
}

</style>
