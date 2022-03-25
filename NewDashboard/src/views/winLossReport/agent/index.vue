<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight" :row-class-name="tableRowClassName">
      <el-table-column :label="$t('__agent')" align="center">
        <template slot-scope="scope">
          <router-link v-if="scope.$index < tableData.length - 2" :to="'/winLossReport/winLossReport/'+scope.row.agentId">
            <el-button class="agentBtn" type="primary" size="mini">
              {{ scope.row.agent }}
            </el-button>
          </router-link>
          <span v-else>{{ scope.row.agent }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gameType" :label="$t('__gameType')" align="center" />
      <el-table-column prop="betAmount" :label="$t('__betAmount')" align="center" />
      <el-table-column prop="winLoss" :label="$t('__winLoss')" align="center" />
      <el-table-column prop="winLossRate" :label="$t('__winLossRate')" align="center" />
      <el-table-column prop="validBetAmount" :label="$t('__validBetAmount')" align="center" />
      <el-table-column prop="rollingRate" :label="$t('__rollingRate')" align="center" />
      <el-table-column prop="rollingCommission" :label="$t('__rollingCommission')" align="center" />
      <el-table-column prop="netPL" :label="$t('__totalAmount')" align="center" />
      <el-table-column prop="commissionRate" :label="$t('__commissionRate')" align="center" />
      <el-table-column prop="toSuperior" :label="$t('__toSuperior')" align="center" />
      <el-table-column prop="commitSuperiorsValidBetAmount" :label="$t('__commitSuperiorsValidBetAmount')" align="center" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper, sizes"
      class="agent-pagination"
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
import { agentWinLossReportSearch } from '@/api/winLossReport/agent'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { getFullDate } from '@/utils/transDate'

export default {
  name: 'Agent',
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
        return 'settlement-agentWinLossReport-agent'
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
      agentWinLossReportSearch(data).then((res) => {
        this.tableData = res.rows
        this.totalCount = res.totalCount
        this.$emit('handleRespone', JSON.parse(JSON.stringify(res.agentInfo)))
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
.el-table .settlement-agentWinLossReport-agent {
  background: #f5f7fa;
  font-weight: bolder;
}
</style>

<style lang="scss" scoped>
.agent {
  &-pagination {
    padding: 1em;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
}

.agentBtn {
  padding: 0;
  background: transparent;
  color: red;
  border: none;
  font-size: 14px;
}
</style>
