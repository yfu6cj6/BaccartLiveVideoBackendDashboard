<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight" :row-class-name="tableRowClassName">
      <el-table-column :label="$t('__agent')" align="center">
        <template slot-scope="scope">
          <router-link v-if="scope.$index < tableData.length - 2" :to="'/agentBalanceReport/agentBalanceReport/'+scope.row.agentId">
            <el-button class="agentBtn" type="primary" size="mini">
              {{ scope.row.agent }}
            </el-button>
          </router-link>
          <span v-else>{{ scope.row.agent }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subordinateAgentsBalance" :label="$t('__subordinateAgentsBalance')" align="center" />
      <el-table-column prop="subordinateMembersBalance" :label="$t('__subordinateMembersBalance')" align="center" />
      <el-table-column prop="balance" :label="$t('__unassignedBalance')" align="center" />
      <el-table-column prop="totalBalance" :label="$t('__totalBalance')" align="center" />
      <el-table-column prop="memberCount" :label="$t('__totalPlayerCount')" align="center" />
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
import { agentBalanceReportSearch } from '@/api/agentBalanceReport/agent'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'

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
        return 'settlement-agentBalanceReport-agent'
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
      agentBalanceReportSearch(data).then((res) => {
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
.el-table .settlement-agentBalanceReport-agent {
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
