<template>
  <div class="cmp-table-paginatio">
    <el-table
      ref="table_ref"
      v-loading="loading.isLoad"
      class="reset-el"
      :class="minHeight ? 'tp-min-height' : 'tp-default-height'"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="loading.loadText"
      :border="border"
      :data="columData"
      :row-key="rowKey"
      :max-height="maxHeight"
      @row-dblclick="rowDblclick"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="onSelectionChange"
      @sort-change="onSortChange"
    >
      <slot />
    </el-table>

    <el-pagination
      class="el-pagination__maia section-pagination"
      :layout="showSize ? 'slot, sizes, prev, pager, next' : 'slot, prev, pager, next'"
      background
      :total="curTotal"
      :page-size="curSize"
      :page-sizes="pageSizes"
      :hide-on-single-page="hideOnSinglePage"
      :current-page="pagination.currentPage || 1"
      @current-change="onChangePage"
      @size-change="onChangeSize"
    >
      <span class="el-pagination__total" style="float:left">共 {{ curTotal }} 项，每页展示 {{ curSize }} 项</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      default () {
        return {}
      }
    },
    pagination: {
      type: Object,
      default () {
        return {}
      }
    },
    maxHeight: [String, Number],
    minHeight: {
      type: Boolean,
      default: true
    },
    rowKey: [String, Function],
    border: {
      type: Boolean,
      default: false
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    // 初始化选中的列.ID数组
    tableSelData: {
      type: Array,
      default () {
        return []
      }
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 50]
      }
    },
    showSize: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: {
        isLoad: false,
        loadText: '加载中...'
      },
      columData: [],
      curTotal: 0,
      curSize: this.pagination.pageSize
    }
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler (val) {
        this.curTotal = Number(val.totalCount) || 0
        // console.log(this.curTotal)
        this.columData = this.tableData.list || []
        // console.log(this.columData)
        if (this.tableSelData.length && this.columData.length) {
          this.$nextTick(() => {
            this.initSelectedRowsByRowIDs(this.tableSelData)
          })
        }
      }
    }
  },
  methods: {
    // 表格实例
    instance () {
      return this.$refs.table_ref
    },
    // loading 弹窗
    loadingState (type) {
      this.loading.isLoad = type || false
    },
    // 选择当前行
    onSelect (selection, row) {
      this.$emit('select', {
        selection,
        row
      })
    },
    rowDblclick (row) {
      this.$emit('rowDblclick', row)
    },
    onSelectAll (selection) {
      this.$emit('select-all', selection)
    },
    // 改变当前行选着
    onSelectionChange (selection) {
      // console.log("selection-", selection);
      this.$emit('select-change', selection)
    },
    // 改变排序
    onSortChange (column) {
      // console.log("sort-", column);

      let _order = ''
      if (column.order == 'ascending') {
        _order = 'asc'
      } else {
        _order = 'desc'
      }

      this.pagination.sort = _order
      this.pagination.orderBy = column.prop

      this.$emit('callback')
    },
    // 改变页码
    onChangePage (curPage) {
      // console.log("change-", curPage);
      this.pagination.currentPage = curPage
      this.$emit('callback')
    },
    // 改变分页数
    onChangeSize (curSize) {
      // console.log("sizes-", curSize);
      this.pagination.pageSize = curSize
      this.curSize = curSize
      this.pagination.currentPage = 1
      this.$emit('callback')
    },
    /**
     * @param {Object} RowIDs  id数组
     *
     */
    initSelectedRowsByRowIDs (RowIDs) {
      const r_ = this.columData.filter(item => {
        return RowIDs.indexOf(item.id) !== -1
      })
      r_.length && this.onToggleRowSelection(r_, true)
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    onToggleRowSelection (rows, selected) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table_ref.toggleRowSelection(row, selected)
        })
      } else {
        this.$refs.table_ref.clearSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-el {
  &.tp-min-height {
    ::v-deep.el-table__body-wrapper {
      min-height: 480px;
    }
  }
  &.tp-default-height {
    ::v-deep.el-table__empty-block {
      // background: none;
      height: auto !important;
      // .el-table__empty-text{
      //   margin-top: 0;
      // }
    }
  }
}
.section-pagination {
  padding: 15px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
