<!-- 创建列表页 -->
<template>
  <div class="app-container">
    <div class="t-wrap">
      <div class="form-container">
        <div class="form-left-box">
          <span>选择列表API：</span>
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
          <el-checkbox v-model="otherConfig.showFormRightBtns">显示右侧按钮区</el-checkbox>
        </div>
      </div>
      <el-table
        ref="cmp_table"
        :data="tableDataSearch"
        :border="false"
        :row-class-name="searchRowClass"
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
        <el-table-column
          label="显示"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isShow" />
          </template>
        </el-table-column>

        <el-table-column label="表单元素类型">
          <template slot-scope="scope">
            <el-select
              :value="scope.row.formItemType"
              placeholder="请选择"
              @change="fnSelFormItemType($event, scope.row)"
            >
              <el-option
                v-for="item in formItemOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="配置"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <i class="row-opt-btn el-icon-s-tools" @click="toOpenOptPannel(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>列表项</span>
        <div style="float: right;">
          <el-checkbox v-model="otherConfig.showBtnCol">显示按钮列</el-checkbox>
          <el-checkbox v-model="otherConfig.showNumCol">显示序号列</el-checkbox>
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
          label="气泡"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.showTips" />
          </template>
        </el-table-column>
        <el-table-column label="对齐">
          <template slot-scope="scope">
            <el-select v-model="scope.row.alignType">
              <el-option
                v-for="item in alignItemOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <DialogFormItemSetting ref="dialogFormItemSetting" />
  </div>
</template>

<script>
import { toCreatePage } from '@/apis/create-page.js'
import DialogFormItemSetting from '@/views/create/dialog/dialog-form-item-setting.vue'
import createMixin from '@/mixins/create.js'
import { getFormItemOpts } from '@/utils/index.js'

export default {
  name: 'CreateList',
  components: {
    DialogFormItemSetting
  },
  mixins: [createMixin],
  data () {
    return {
      formItemOpts: getFormItemOpts(_$cusConfig$_.formItemOpts, 'list'),
      otherConfig: {
        showBtnCol: false, // 显示按钮列
        showNumCol: true, // 显示序号列
        showFormRightBtns: false // 显示表单右侧按钮区域
      },
      alignItemOpts: [
        {
          label: '居左',
          value: 'left'
        },
        {
          label: '居中',
          value: 'center'
        },
        {
          label: '居右',
          value: 'right'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.init()
  },
  created () {},
  methods: {
    init () {
      this.initData(item => {
        return item.hasList
      })
    },

    toCreateFn () {
      if (!this.fnValidSearch(this.tableDataSearch)) {
        return false
      }
      toCreatePage({
        rootPath: this.localProjectPath,
        templateType: 'listPage',
        formData: JSON.parse(JSON.stringify(this.tableDataSearch)),
        tableData: JSON.parse(JSON.stringify(this.tableData)),
        otherConfig: JSON.parse(JSON.stringify(this.otherConfig)),
        apiConfig: JSON.parse(JSON.stringify(this.apiConfig)),
        querysInPath: JSON.parse(JSON.stringify(this.querysInPath))
      }).then(resc => {
        console.log('resc', resc)
        this.showMsgFn(resc)
      })
      this.fnWriteOptData() // 写入操作记录
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
