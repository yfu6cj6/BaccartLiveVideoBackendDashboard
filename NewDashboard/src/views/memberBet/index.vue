<template>
  <div class="operationLog-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle">
        <el-select v-model="searchTimeType">
          <el-option v-for="item in memberBetTimeType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle">
        <el-date-picker
          v-model="searchTime"
          type="datetimerange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="$t('__startDate')"
          :end-placeholder="$t('__endDate')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__agent')">
        <el-select v-model="searchForm.agent_id" multiple>
          <el-option v-for="item in searchItems.agents" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__player')">
        <el-select v-model="searchForm.member_id" multiple>
          <el-option v-for="item in searchItems.members" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__orderNumber')">
        <el-input v-model="searchForm.order_number" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__gameType')">
        <el-select v-model="searchForm.game_type" multiple>
          <el-option v-for="item in searchItems.gameType" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__roundId')">
        <el-input v-model="searchForm.round_id" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__tableId')">
        <el-select v-model="searchForm.table_id" multiple>
          <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__gameResult')">
        <el-select v-model="searchForm.gameResult" multiple>
          <el-option v-for="item in searchItems.gameResult" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__status')">
        <el-select v-model="searchForm.status" multiple>
          <el-option v-for="item in searchItems.orderStatus" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__gamePlay')">
        <el-select v-model="searchForm.game_play" multiple>
          <el-option v-for="item in searchItems.game_play" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__betAmount')">
        <el-input v-model="searchForm.bet_amount" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__payout')">
        <el-input v-model="searchForm.payout" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__validBetAmount')">
        <el-input v-model="searchForm.valid_bet_amount" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__device')">
        <el-select v-model="searchForm.device" multiple>
          <el-option v-for="item in searchItems.deviceType" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" label="IP">
        <el-input v-model="searchForm.user_ip" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="onExportBtnClick()">{{ $t("__export") }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="dataLoading"
      :data="tableData"
      border
      :max-height="viewHeight"
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      :header-row-class-name="headerRowClassName"
    >
      <el-table-column :label="$t('__totalCount')" align="right">
        <el-table-column prop="agent" :width="agentWidth" :label="$t('__agent')" align="center" />
        <el-table-column prop="member" :width="memberWidth" :label="$t('__player')" align="center" />
        <el-table-column prop="order_number" :width="orderNumberWidth" :label="$t('__orderNumber')" align="center" />
        <el-table-column prop="bet_time" :width="betTimeWidth" :label="$t('__betTime')" align="center" />
        <el-table-column prop="payout_time" :width="payoutTimeWidth" :label="$t('__payoutTime')" align="center" />
        <el-table-column prop="game_type" :width="gameTypeWidth" :label="$t('__gameType')" align="center" />
        <el-table-column prop="round_id" :width="roundIdWidth" :label="$t('__roundId')" align="center" />
        <el-table-column :width="gameResultWidth" :label="$t('__gameResult')" align="center">
          <template slot-scope="scope">
            {{ scope.row.gameResult.resultLabel }}
            <span class="gameResultPoints">
              {{ scope.row.gameResultPoints }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :width="statusWidth" :label="$t('__status')" align="center" />
        <el-table-column prop="game_play" :width="gamePlayWidth" :label="$t('__gamePlay')" align="center" />
      </el-table-column>
      <el-table-column :label="totalInfo.bet_amount" align="center">
        <el-table-column prop="bet_amount" :width="betAmountWidth" :label="$t('__betAmount')" align="center" />
      </el-table-column>
      <el-table-column :label="totalInfo.payout" align="center">
        <el-table-column prop="payout" :width="payoutWidth" :label="$t('__payout')" align="center" />
      </el-table-column>
      <el-table-column :label="totalInfo.valid_bet_amount" align="center">
        <el-table-column prop="valid_bet_amount" :width="validBetAmountWidth" :label="$t('__validBetAmount')" align="center" />
      </el-table-column>
      <el-table-column :label="totalInfoCountString" align="center">
        <el-table-column prop="device" :width="deviceWidth" :label="$t('__device')" align="center" />
        <el-table-column prop="ip" width="auto" label="IP" align="center" />
      </el-table-column>
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
import { memberBetSearch, memberBetExport } from '@/api/memberBet'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDate, getFullDateString, getLastDate, getLastDateClearTime } from '@/utils/transDate'
import { mapGetters } from 'vuex'

const defaultSearchTimeType = 'betTime'
const defaultSearchTime = getLastDateClearTime(30)

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
      searchTimeType: defaultSearchTimeType,
      searchTime: defaultSearchTime,
      searchForm: {},
      searchItems: {},
      totalInfo: {
        count: 0,
        bet_amount: '',
        payout: '',
        valid_bet_amount: ''
      },
      subtotalInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'memberBetTimeType'
    ]),
    subtotalWidth() {
      return 'width: ' + this.agentWidth + this.memberWidth + this.orderNumberWidth +
      this.betTimeWidth + this.payoutTimeWidth + this.gameTypeWidth +
      this.roundIdWidth + this.gameResultWidth + this.statusWidth + this.gamePlayWidth + 'px;'
    },
    totalInfoCountString() {
      return this.$t('__total') + ' ' + this.totalInfo.count + ' ' + this.$t('__count')
    },
    agentWidth() {
      return this.calculateWidth(this.$t('__agent'), 'agent', 10) + 'px'
    },
    memberWidth() {
      return this.calculateWidth(this.$t('__player'), 'member', 10) + 'px'
    },
    orderNumberWidth() {
      return this.calculateWidth(this.$t('__orderNumber'), 'order_number', 9) + 'px'
    },
    betTimeWidth() {
      return this.calculateWidth(this.$t('__betTime'), 'bet_time', 9) + 'px'
    },
    payoutTimeWidth() {
      return this.calculateWidth(this.$t('__payoutTime'), 'payout_time', 9) + 'px'
    },
    gameTypeWidth() {
      return this.calculateWidth(this.$t('__gameType'), 'game_type', 9) + 'px'
    },
    roundIdWidth() {
      return this.calculateWidth(this.$t('__roundId'), 'round_id', 11) + 'px'
    },
    gameResultWidth() {
      return this.calculateWidth(this.$t('__gameResult'), 'gameResultPoints', 10) + 'px'
    },
    statusWidth() {
      return this.calculateWidth(this.$t('__status'), 'status', 20) + 'px'
    },
    gamePlayWidth() {
      return this.calculateWidth(this.$t('__gamePlay'), 'game_play', 10) + 'px'
    },
    betAmountWidth() {
      return this.calculateHeaderWidth(this.$t('__betAmount'), 'bet_amount', 8) + 'px'
    },
    payoutWidth() {
      return this.calculateHeaderWidth(this.$t('__payout'), 'payout', 9.5) + 'px'
    },
    validBetAmountWidth() {
      return this.calculateHeaderWidth(this.$t('__validBetAmount'), 'valid_bet_amount', 8) + 'px'
    },
    deviceWidth() {
      return this.calculateWidth(this.$t('__device'), 'device', 9) + 'px'
    }
  },
  created() {
    this.$store.dispatch('memberBet/setMemberBetTimeType')
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.gameResult.result === 0) {
        return 'bankerWin-member'
      } else if (row.gameResult.result === 1) {
        return 'playerWin-member'
      } else if (row.gameResult.result === 2) {
        return 'tie-member'
      } else if (rowIndex >= this.tableData.length - 2) {
        return 'settlement-member'
      }
      return ''
    },
    headerRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-member'
      }
      return ''
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex >= this.tableData.length - 2) {
        if (columnIndex === 0) {
          return [1, 10]
        } else if (columnIndex < 10) {
          return [0, 0]
        } else if (columnIndex === 13) {
          return [1, 2]
        } else if (columnIndex === 14) {
          return [0, 0]
        }
      }
    },
    calculateWidth(defaultText, key, charWidth) {
      let width = defaultText.length * 24.5
      for (let i = 0, max = this.tableData.length; i < max; i++) {
        if (i >= max - 2) {
          continue
        }
        const element = this.tableData[i]
        const str = element[key].toString()
        const fontWidth = str.length * charWidth
        if (width < fontWidth) {
          width = fontWidth
        }
      }
      return width
    },
    calculateHeaderWidth(defaultText, key, charWidth) {
      let width = defaultText.length * 24.5
      if (this.totalInfo[key]) {
        const str = this.totalInfo[key].toString()
        const fontWidth = str.length * charWidth
        if (width < fontWidth) {
          width = fontWidth
        }
      }
      return width
    },
    onReset() {
      this.searchForm = {}
      this.searchTimeType = defaultSearchTimeType
      this.searchTime = defaultSearchTime
    },
    handleRequest(data) {
      this.selectLoading = true
      this.dataLoading = true
      const searchTime = []
      if (!this.searchTime) {
        this.searchTime = defaultSearchTime
      }
      this.searchTime.forEach(element => {
        searchTime.push(getFullDate(element))
      })
      data[this.searchTimeType] = searchTime
    },
    handleRespone(res) {
      this.searchForm[this.searchTimeType] = undefined
      this.totalInfo = res.totalInfo
      this.subtotalInfo = res.subtotalInfo
      this.searchItems = res.searchItems
      this.tableData = res.rows
      for (let i = 0, max = this.tableData.length; i < max; i++) {
        if (i >= max - 2) {
          continue
        }
        const element = this.tableData[i]
        const winner = this.searchItems.gameResult.find(item => item.key === element.gameResult.result).nickname
        element.gameResult.resultLabel = winner
        const player = this.searchItems.gameResult.find(item => item.key === 1).nickname
        const playerPoint = element.gameResult.player_point
        const banker = this.searchItems.gameResult.find(item => item.key === 0).nickname
        const bankerPoint = element.gameResult.banker_point
        const pointResult = player + playerPoint + ' ' + banker + bankerPoint
        element.gameResultPoints = '[' + pointResult + ']'
        element.game_play = element.game_play.nickname
      }
      this.currentPage = res.currentPage
      this.totalCount = res.totalCount
      this.selectLoading = false
      this.dataLoading = false
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.searchForm.rowsCount = this.pageSize
      this.handleRequest(this.searchForm)
      memberBetSearch(this.searchForm).then((res) => {
        this.handleRespone(res)
      })
    },
    onExportBtnClick() {
      this.handleRequest(this.searchForm)
      memberBetExport(this.searchForm).then((res) => {
        this.searchForm[this.searchTimeType] = undefined
        this.onDataOut(res.rows)
        this.selectLoading = false
        this.dataLoading = false
      })
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
        export_json_to_excel({ header: tHeader, data: data, filename: 'MemberBet_' + getFullDateString(new Date()) })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style>
.header-member th:nth-child(1){
  padding-right: 25px !important;
}

.el-table .settlement-member {
  background: #f5f7fa;
  font-weight: bolder;
}

.el-table .settlement-member td:nth-child(1) {
  text-align: right;
  padding-right: 35px !important;
}

.el-table .bankerWin-member td:nth-child(8) {
  color: red;
  font-weight: bolder;
}

.el-table .playerWin-member td:nth-child(8) {
  color: blue;
  font-weight: bolder;
}

.el-table .tie-member td:nth-child(8) {
  color: green;
  font-weight: bolder;
}
</style>

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

.el-table {
  width: 100%;
}

.el-select {
  width: 270px;
}

.el-input {
  width: 140px;
}

.gameResultPoints {
  color: black;
}
</style>
