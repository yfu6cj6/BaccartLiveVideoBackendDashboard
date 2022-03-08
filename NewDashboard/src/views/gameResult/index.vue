<template>
  <div class="operationLog-container">
    <el-form v-loading="dataLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle">
        <el-select v-model="searchTimeType">
          <el-option v-for="item in gameResultTimeType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
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
      <el-form-item class="inputTitle" :label="$t('__roundId')">
        <el-input v-model="searchForm.round_id" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__tableId')">
        <el-select v-model="searchForm.table_id" multiple>
          <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__gameType')">
        <el-select v-model="searchForm.gameType" multiple>
          <el-option v-for="item in searchItems.gameType" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__status')">
        <el-select v-model="searchForm.status" multiple>
          <el-option v-for="item in searchItems.gamePaymentStatus" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="dataLoading"
      :data="tableData"
      border
      :max-height="viewHeight"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="game_type" :label="$t('__gameType')" align="center" />
      <el-table-column prop="table_id" :label="$t('__tableId')" align="center" />
      <el-table-column prop="game_start_time" :label="$t('__gameStartTime')" align="center" />
      <el-table-column prop="game_end_time" :label="$t('__gameEndTime')" align="center" />
      <el-table-column prop="round_id" :label="$t('__roundId')" align="center" />
      <el-table-column :label="$t('__gameResult')" align="center">
        <template slot-scope="scope">
          {{ scope.row.gameResult.resultLabel }}
          <span class="gameResultPoints">
            {{ scope.row.gameResultPoints }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="game_payment_status" :label="$t('__status')" align="center" />
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
import { gameResultSearch } from '@/api/gameResult'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDate, getLastDate, getLastDateClearTime } from '@/utils/transDate'
import { mapGetters } from 'vuex'

const defaultSearchTimeType = 'startTime'
const defaultSearchTime = getLastDateClearTime(30)

export default {
  name: 'GameResult',
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
      searchItems: {}
    }
  },
  computed: {
    ...mapGetters([
      'gameResultTimeType'
    ])
  },
  created() {
    this.$store.dispatch('gameResult/setGameResultTimeType')
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.gameResult.result === 0) {
        return 'bankerWin-gameResult'
      } else if (row.gameResult.result === 1) {
        return 'playerWin-gameResult'
      } else if (row.gameResult.result === 2) {
        return 'tie-gameResult'
      }
      return ''
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
      this.searchItems = res.searchItems
      this.tableData = res.rows
      this.tableData.forEach(element => {
        const winner = this.searchItems.gameResult.find(item => item.key === element.gameResult.result).nickname
        element.gameResult.resultLabel = winner
        const player = this.searchItems.gameResult.find(item => item.key === 1).nickname
        const playerPoint = element.gameResult.player_point
        const banker = this.searchItems.gameResult.find(item => item.key === 0).nickname
        const bankerPoint = element.gameResult.banker_point
        const pointResult = player + playerPoint + ' ' + banker + bankerPoint
        element.gameResultPoints = '[' + pointResult + ']'
      })
      this.currentPage = res.currentPage
      this.totalCount = res.totalCount
      this.dataLoading = false
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.searchForm.rowsCount = this.pageSize
      this.handleRequest(this.searchForm)
      gameResultSearch(this.searchForm).then((res) => {
        this.handleRespone(res)
      })
    }
  }
}
</script>

<style>
.el-table .bankerWin-gameResult td:nth-child(6) {
  color: red;
  font-weight: bolder;
}

.el-table .playerWin-gameResult td:nth-child(6) {
  color: blue;
  font-weight: bolder;
}

.el-table .tie-gameResult td:nth-child(6) {
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

.el-input {
  width: 140px;
}

.el-select {
  width: 270px;
}

.gameResultPoints {
  color: black;
}
</style>
