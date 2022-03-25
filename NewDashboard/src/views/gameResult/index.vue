<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchTimeType" filterable class="gameResultTimeType">
            <el-option v-for="item in gameResultTimeType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
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
          <el-input v-model="searchForm.round_id" :placeholder="$t('__roundId')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.table_id" multiple filterable :placeholder="$t('__tableId')">
            <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.gameType" multiple filterable :placeholder="$t('__gameType')">
            <el-option v-for="item in searchItems.gameType" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" multiple filterable :placeholder="$t('__status')">
            <el-option v-for="item in searchItems.gamePaymentStatus" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="bg-gray" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :data="tableData"
      border
      :max-height="viewHeight"
    >
      <el-table-column prop="game_type" :label="$t('__gameType')" align="center" />
      <el-table-column prop="table_id" :label="$t('__tableId')" align="center" />
      <el-table-column prop="game_start_time" :label="$t('__gameStartTime')" align="center" />
      <el-table-column prop="game_end_time" :label="$t('__gameEndTime')" align="center" />
      <el-table-column prop="round_id" :label="$t('__roundId')" align="center" />
      <el-table-column :label="$t('__gameResult')" align="center">
        <template slot-scope="scope">
          <span
            :class="{
              'banker': scope.row.gameResult.result === 0,
              'player': scope.row.gameResult.result === 1,
              'tie': scope.row.gameResult.result === 2
            }"
          >
            {{ scope.row.gameResult.resultLabel }}
          </span>
          <span>
            {{ scope.row.gameResultPoints }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="game_payment_status" :label="$t('__status')" align="center" />
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
    this.handleCurrentChange(1)
  },
  methods: {
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
      this.totalCount = res.totalCount
      this.dataLoading = false
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.searchForm.rowsCount = this.pageSize
      this.handleRequest(this.searchForm)
      gameResultSearch(this.searchForm).then((res) => {
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

.gameResultTimeType {
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
