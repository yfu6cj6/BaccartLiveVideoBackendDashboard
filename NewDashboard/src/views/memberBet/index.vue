<template>
  <div class="operationLog-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__createdAt')">
        <el-date-picker
          v-model="searchForm.searchTime"
          type="datetimerange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="$t('__startDate')"
          :end-placeholder="$t('__endDate')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item class="inputTitle" label="IP">
        <el-input v-model="searchForm.ip" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__description')">
        <el-input v-model="searchForm.description" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="onExportBtnClick()">{{ $t("__export") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
      <el-table-column prop="agent" :label="$t('__agent')" align="center" />
      <el-table-column prop="member" :label="$t('__player')" align="center" />
      <el-table-column prop="order_number" :label="$t('__orderNumber')" align="center" />
      <el-table-column prop="bet_time" :label="$t('__betTime')" align="center" />
      <el-table-column prop="payout_time" :label="$t('__payoutTime')" align="center" />
      <el-table-column prop="game_type" :label="$t('__gameType')" align="center" />
      <el-table-column prop="round_id" :label="$t('__roundId')" align="center" />
      <el-table-column prop="gameResult" :label="$t('__gameResult')" align="center" />
      <el-table-column prop="status" :label="$t('__status')" align="center" />
      <el-table-column prop="game_play" :label="$t('__gamePlay')" align="center" />
      <el-table-column prop="bet_amount" :label="$t('__betAmount')" align="center" />
      <el-table-column prop="payout" :label="$t('__payout')" align="center" />
      <el-table-column prop="valid_bet_amount" :label="$t('__validBetAmount')" align="center" />
      <el-table-column prop="device" :label="$t('__device')" align="center" />
      <el-table-column prop="ip" label="IP" align="center" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="operationLog-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { memberBetSearch } from '@/api/memberBet'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDate, getFullDateString, getLastDate, getLastDateClearTime } from '@/utils/transDate'

const defaultForm = {
  betTime: getLastDateClearTime(30),
  payoutTime: getLastDateClearTime(30)
}

export default {
  name: 'MemberBet',
  mixins: [handlePageChange, shared, handleViewResize],
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
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      selectForm: {},
      editDialogVisible: false,
      createDialogVisible: false
    }
  },
  computed: {
  },
  created() {
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = JSON.parse(JSON.stringify(defaultForm))
    },
    handleRequest(data) {
      this.selectLoading = true
      this.dataLoading = true
      data.page = this.currentPage
      data.rowsCount = this.pageSize
      if (!data.betTime) {
        data.betTime = JSON.parse(JSON.stringify(defaultForm)).betTime
      }
      for (let i = 0, max = data.betTime.length; i < max; i++) {
        data.betTime[i] = getFullDate(data.betTime[i])
      }
      if (!data.payoutTime) {
        data.payoutTime = JSON.parse(JSON.stringify(defaultForm)).payoutTime
      }
      for (let i = 0, max = data.payoutTime.length; i < max; i++) {
        data.payoutTime[i] = getFullDate(data.payoutTime[i])
      }
    },
    handleRespone(res) {
      this.tableData = res.rows
      this.currentPage = res.currentPage
      this.totalCount = res.totalCount
      this.selectLoading = false
      this.dataLoading = false
    },
    onSubmit() {
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.handleRequest(data)
      memberBetSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onExportBtnClick() {
      this.selectLoading = true
      this.dataLoading = true
      const data = JSON.parse(JSON.stringify(this.searchForm))
      if (data.searchTime) {
        for (let i = 0, max = data.searchTime.length; i < max; i++) {
          data.searchTime[i] = getFullDate(data.searchTime[i])
        }
      }
      // operationLogExport(data).then((res) => {
      //   this.onDataOut(res.rows)
      //   this.selectLoading = false
      //   this.dataLoading = false
      // })
    },
    onDataOut(tableData) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = []
        const filterVal = []
        for (const item in tableData[0]) {
          tHeader.push(tableData[0][item])
          filterVal.push(item)
        }
        tableData.splice(0, 1)
        const list = JSON.parse(JSON.stringify(tableData))
        const data = this.formatJson(filterVal, list)
        export_json_to_excel({ header: tHeader, data: data, filename: 'OperationLog_' + getFullDateString(new Date()) })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
.operationLog {
  &-container {
    margin: 5px;
  }
  &-pagination {
    padding: 1em;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
}

.filterForm {
  padding-top: 0px;
  padding-bottom: 0px;
}

.el-form-item {
    margin-bottom: 0px;
}

.inputTitle {
  padding: 0px 0px 0px 5px;
}

.el-input {
  width: 140px;
}
</style>
