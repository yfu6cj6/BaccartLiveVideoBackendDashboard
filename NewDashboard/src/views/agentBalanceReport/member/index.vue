<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight" :row-class-name="tableRowClassName">
      <el-table-column prop="member" :label="$t('__member')" align="center" />
      <el-table-column prop="totalBalance" :label="$t('__totalBalance')" align="center" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper, sizes"
      class="member-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { memberBalanceReportSearch } from '@/api/agentBalanceReport/member'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'

export default {
  name: 'Member',
  mixins: [handlePageChange, shared],
  props: {
    'viewHeight': {
      type: Number,
      require: true,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      agentId: 0
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex >= this.tableData.length - 2) {
        return 'settlement-agentBalanceReport-member'
      }
      return ''
    },
    // 父物件呼叫
    onSearch(agentId) {
      this.agentId = agentId
      this.handleCurrentChange(1)
    },
    onSubmit() {
      const data = {
        page: this.currentPage,
        rowsCount: this.pageSize,
        agentId: this.agentId
      }
      this.setDataLoading(true)
      memberBalanceReportSearch(data).then((res) => {
        this.tableData = res.rows
        this.totalCount = res.totalCount
        this.$emit('handleRespone')
      }).catch(() => {
        this.setDataLoading(false)
      })
    },
    setDataLoading(dataLoading) {
      this.$emit('setDataLoading', dataLoading)
    }
  }
}
</script>

<style>
.el-table .settlement-agentBalanceReport-member {
  background: #f5f7fa;
  font-weight: bolder;
}
</style>

<style lang="scss" scoped>
.member {
  &-pagination {
    padding: 1em;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
}
</style>
