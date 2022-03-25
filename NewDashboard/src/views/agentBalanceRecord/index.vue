<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            align="right"
            unlink-panels
            :range-separator="$t('__to')"
            :start-placeholder="`${$t('__operationTime')}(${$t('__start')})`"
            :end-placeholder="`${$t('__operationTime')}(${$t('__end')})`"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.type" multiple filterable :placeholder="$t('__recordType')">
            <el-option v-for="item in searchItems.type" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.ip" placeholder="IP" type="url" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.orderNumber" :placeholder="$t('__transactionNumber')" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="fuzzyMatchingByOrderNumber" class="red-tick" :label="$t('__fuzzyMatching')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.agents" multiple filterable :placeholder="$t('__agent')">
            <el-option v-for="item in searchItems.agents" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="bg-gray" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onExportBtnClick()">{{ $t("__searchAndExport") }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :data="tableData"
      border
      :max-height="viewHeight"
    >
      <el-table-column prop="order_number" :label="$t('__transactionNumber')" align="center" :min-width="orderNumberWidth" />
      <el-table-column prop="operationTime" :label="$t('__operationTime')" align="center" :min-width="operationTimeWidth" />
      <el-table-column prop="superiorAgent" :label="$t('__superiorAgent')" align="center" :min-width="superiorAgentWidth" />
      <el-table-column prop="agent" :label="$t('__agent')" align="center" :min-width="agentWidth" />
      <el-table-column prop="counterparty" :label="$t('__counterparty')" align="center" :min-width="counterpartyWidth" />
      <el-table-column prop="type" :label="$t('__recordType')" align="center" :min-width="typeWidth" />
      <el-table-column prop="pre_trade_balance" :label="$t('__preTradeBalance')" align="center" :min-width="preTradeBalanceWidth" />
      <el-table-column :label="$t('__income')" align="center" :min-width="incomeWidth">
        <template slot-scope="scope">
          <span :class="{'front' : scope.row.income > 0}">
            {{ scope.row.income }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('__payout')" align="center" :min-width="payoutWidth">
        <template slot-scope="scope">
          <span :class="{'back' : scope.row.payout < 0}">
            {{ scope.row.payout }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="balance_after_trade" :label="$t('__balanceAfterTrade')" align="center" :min-width="balanceAfterTradeWidth" />
      <el-table-column prop="ip" label="IP" align="center" :min-width="ipWidth" />
      <el-table-column prop="operator" :label="$t('__operator')" align="center" :min-width="operatorWidth" />
      <el-table-column :label="$t('__operationMessage')" align="left" :min-width="operationMessageWidth" style="padding-left: 10px;">
        <template slot-scope="scope">
          <span style="padding-left: 10px;">
            {{ scope.row.message }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper, sizes"
      class="pagination"
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
import { agentBalanceRecordSearch, agentBalanceRecordExport } from '@/api/agentBalanceRecord'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import handleTableWidth from '@/layout/mixin/handleTableWidth'
import { getFullDate, getFullDateString, getLastDate, getLastDateClearTime } from '@/utils/transDate'

const defaultSearchTime = getLastDateClearTime(30)

export default {
  name: 'AgentBalanceRecord',
  mixins: [handlePageChange, shared, handleViewResize, handleTableWidth],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('__lastWeek'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(7))
          }
        }, {
          text: this.$t('__lastMonth'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(30))
          }
        }, {
          text: this.$t('__lastThreeMonths'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(90))
          }
        }]
      },
      searchTime: defaultSearchTime,
      searchForm: {},
      searchItems: {},
      fuzzyMatchingByOrderNumber: false
    }
  },
  computed: {
    orderNumberWidth() {
      return this.calculateWidth(this.$t('__transactionNumber'), 'order_number', 9) + 'px'
    },
    operationTimeWidth() {
      return this.calculateWidth(this.$t('__operationTime'), 'operationTime', 9) + 'px'
    },
    superiorAgentWidth() {
      return this.calculateWidth(this.$t('__superiorAgent'), 'superiorAgent', 9) + 'px'
    },
    agentWidth() {
      return this.calculateWidth(this.$t('__agent'), 'agent', 9) + 'px'
    },
    counterpartyWidth() {
      return this.calculateWidth(this.$t('__counterparty'), 'counterparty', 9) + 'px'
    },
    typeWidth() {
      return this.calculateWidth(this.$t('__recordType'), 'type', 9) + 'px'
    },
    preTradeBalanceWidth() {
      return this.calculateWidth(this.$t('__preTradeBalance'), 'pre_trade_balance', 9) + 'px'
    },
    incomeWidth() {
      return this.calculateWidth(this.$t('__income'), 'income', 9) + 'px'
    },
    payoutWidth() {
      return this.calculateWidth(this.$t('__payout'), 'payout', 9) + 'px'
    },
    balanceAfterTradeWidth() {
      return this.calculateWidth(this.$t('__balanceAfterTrade'), 'balance_after_trade', 9) + 'px'
    },
    ipWidth() {
      return this.calculateWidth('IP', 'ip', 9) + 'px'
    },
    operatorWidth() {
      return this.calculateWidth(this.$t('__operator'), 'operator', 9) + 'px'
    },
    operationMessageWidth() {
      return this.calculateWidth(this.$t('__operationMessage'), 'message', 9) + 'px'
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onExportBtnClick() {
      const data = JSON.parse(JSON.stringify(this.searchForm))
      this.handleRequest(data)
      agentBalanceRecordExport(data).then((res) => {
        this.onDataOut(res.rows)
        this.dataLoading = false
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onDataOut(tableData) {
      require.ensure([], () => {
        const { export_json_to_excel, formatJson } = require('@/vendor/Export2Excel')
        const tHeader = []
        const filterVal = []
        for (const item in tableData[0]) {
          tHeader.push(tableData[0][item])
          filterVal.push(item)
        }
        tableData.splice(0, 1)
        const list = JSON.parse(JSON.stringify(tableData))
        const data = formatJson(filterVal, list)
        export_json_to_excel({ header: tHeader, data: data, filename: 'AgentBalanceRecord_' + getFullDateString(new Date()) })
      })
    },
    onReset() {
      this.searchForm = {}
      this.fuzzyMatchingByOrderNumber = false
      this.searchTime = defaultSearchTime
    },
    handleRequest(data) {
      this.dataLoading = true
      const searchTime = []
      if (!this.searchTime) {
        this.searchTime = defaultSearchTime
      }
      this.searchTime.forEach(element => {
        searchTime.push(getFullDate(element))
      })
      data.operationTime = searchTime
      data.fuzzyMatchingByOrderNumber = this.fuzzyMatchingByOrderNumber ? '1' : '0'
    },
    handleRespone(res) {
      this.searchItems = res.searchItems
      this.tableData = res.rows
      this.totalCount = res.totalCount
      this.dataLoading = false
    },
    onSubmit() {
      const data = JSON.parse(JSON.stringify(this.searchForm))
      data.page = this.currentPage
      data.rowsCount = this.pageSize
      this.handleRequest(data)
      agentBalanceRecordSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.dataLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container .el-form .el-form-item .el-input {
  width: 160px;
}

.el-select {
  width: 190px;
}

.front {
  color: blue;
  font-weight: bolder;
}

.back {
  color: red;
  font-weight: bolder;
}
</style>
