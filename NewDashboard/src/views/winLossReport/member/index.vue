<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight" :row-class-name="tableRowClassName">
      <el-table-column prop="member" :label="$t('__member')" align="center" />
      <el-table-column prop="gameType" :label="$t('__gameType')" align="center" />
      <el-table-column prop="betAmount" :label="$t('__betAmount')" align="center" />
      <el-table-column prop="winLoss" :label="$t('__winLoss')" align="center" />
      <el-table-column prop="winLossRate" :label="$t('__winLossRate')" align="center" />
      <el-table-column prop="validBetAmount" :label="$t('__validBetAmount')" align="center" />
      <el-table-column prop="rollingRate" :label="$t('__rollingRate')" align="center" />
      <el-table-column prop="rollingCommission" :label="$t('__rollingCommission')" align="center" />
      <el-table-column prop="netPL" :label="$t('__totalAmount')" align="center" />
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
import { memberWinLossReportSearch } from '@/api/winLossReport/member'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { getFullDate } from '@/utils/transDate'

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
    },
    'payoutTime': {
      type: Array,
      require: true,
      default() {
        return []
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
        return 'settlement-agentWinLossReport-member'
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
        payoutTime: [],
        agentId: this.agentId
      }
      this.payoutTime.forEach(element => {
        data.payoutTime.push(getFullDate(element))
      })
      this.setDataLoading(true)
      memberWinLossReportSearch(data).then((res) => {
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
.el-table .settlement-agentWinLossReport-member {
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
