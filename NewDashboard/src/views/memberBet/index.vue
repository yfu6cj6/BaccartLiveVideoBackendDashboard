<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchTimeType" filterable class="memberBetTimeType">
            <el-option v-for="item in memberBetTimeType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
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
        <el-form-item>
          <el-select v-model="searchForm.agent_id" multiple filterable :placeholder="$t('__agent')">
            <el-option v-for="item in searchItems.agents" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.member_id" multiple filterable :placeholder="$t('__member')">
            <el-option v-for="item in searchItems.members" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.order_number" :placeholder="$t('__orderNumber')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.game_type" multiple filterable :placeholder="$t('__gameType')">
            <el-option v-for="item in searchItems.gameType" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.round_id" :placeholder="$t('__roundId')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.table_id" multiple filterable :placeholder="$t('__tableId')">
            <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.gameResult" multiple filterable :placeholder="$t('__gameResult')">
            <el-option v-for="item in searchItems.gameResult" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" multiple filterable :placeholder="$t('__status')">
            <el-option v-for="item in searchItems.orderStatus" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.game_play" multiple filterable :placeholder="$t('__gamePlay')">
            <el-option v-for="item in searchItems.game_play" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.bet_amount" type="number" :placeholder="$t('__betAmount')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.payout" type="number" :placeholder="$t('__result')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.valid_bet_amount" type="number" :placeholder="$t('__validBetAmount')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.device" multiple filterable :placeholder="$t('__device')">
            <el-option v-for="item in searchItems.deviceType" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.user_ip" placeholder="IP" />
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
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      :header-row-class-name="headerRowClassName"
    >
      <el-table-column :label="$t('__totalCount')" align="right">
        <el-table-column prop="agent" :width="agentWidth" :label="$t('__agent')" align="center" />
        <el-table-column prop="member" :width="memberWidth" :label="$t('__member')" align="center" />
        <el-table-column prop="order_number" :width="orderNumberWidth" :label="$t('__orderNumber')" align="center" />
        <el-table-column prop="bet_time" :width="betTimeWidth" :label="$t('__betTime')" align="center" />
        <el-table-column prop="payout_time" :width="payoutTimeWidth" :label="$t('__payoutTime')" align="center" />
        <el-table-column prop="game_type" :width="gameTypeWidth" :label="$t('__gameType')" align="center" />
        <el-table-column prop="round_id" :width="roundIdWidth" :label="$t('__roundId')" align="center" />
        <el-table-column :width="gameResultWidth" :label="$t('__gameResult')" align="center">
          <template slot-scope="scope">
            <span
              :class="{
                'banker': scope.row.gameResult.result === 0,
                'player': scope.row.gameResult.result === 1,
                'tie': scope.row.gameResult.result === 2,
              }"
            >
              {{ scope.row.gameResult.resultLabel }}
            </span>
            <span>
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
        <el-table-column prop="payout" :width="payoutWidth" :label="$t('__result')" align="center" />
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
    totalInfoCountString() {
      return this.$t('__total') + ' ' + this.totalInfo.count + ' ' + this.$t('__count')
    },
    agentWidth() {
      return this.calculateWidth(this.$t('__agent'), 'agent', 10) + 'px'
    },
    memberWidth() {
      return this.calculateWidth(this.$t('__member'), 'member', 10) + 'px'
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
      return this.calculateHeaderWidth(this.$t('__result'), 'payout', 9.5) + 'px'
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
    this.handleCurrentChange(1)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex >= this.tableData.length - 2) {
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
        const element = this.tableData[i]
        if (i >= max - 2 || !element[key]) {
          continue
        }
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
      this.totalCount = res.totalCount
      this.dataLoading = false
    },
    onSubmit() {
      const data = JSON.parse(JSON.stringify(this.searchForm))
      data.page = this.currentPage
      data.rowsCount = this.pageSize
      this.handleRequest(data)
      memberBetSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onExportBtnClick() {
      const data = JSON.parse(JSON.stringify(this.searchForm))
      this.handleRequest(data)
      memberBetExport(data).then((res) => {
        this.searchForm[this.searchTimeType] = undefined
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
        export_json_to_excel({ header: tHeader, data: data, filename: 'MemberBet_' + getFullDateString(new Date()) })
      })
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
</style>

<style lang="scss" scoped>
.view-container .el-form .el-form-item .el-input {
  width: 160px;
}

.el-select {
  width: 190px;
}

.memberBetTimeType {
  width: 110px;
}

.banker {
  color: red;
  font-weight: bolder;
}

.player {
  color: blue;
  font-weight: bolder;
}

.tie {
  color: green;
  font-weight: bolder;
}

span {
  color: black;
}
</style>
