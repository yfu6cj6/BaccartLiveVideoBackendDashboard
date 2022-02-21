<template>
  <div class="app-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item :label="$t('__roundID')">
        <el-input v-model="searchForm.roundId" />
      </el-form-item>
      <el-form-item :label="$t('__tableID')">
        <el-select v-model="searchForm.tableId">
          <el-option v-for="item in gameTableList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__gameType')">
        <el-select v-model="searchForm.gameType">
          <el-option v-for="item in gameTypeList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__status')">
        <el-select v-model="searchForm.gamePaymentStatus">
          <el-option v-for="item in gamePaymentStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__transactionTime')">
        <el-date-picker v-model="searchTimeRange" type="datetimerange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" />
      </el-form-item>
      <el-form-item :label="$t('__orderBy')">
        <el-select v-model="searchForm.orderBy">
          <el-option v-for="item in orderBy" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__orderByCondition')">
        <el-select v-model="searchForm.orderByCondition">
          <el-option v-for="item in orderByCondition_game_result" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t("__search") }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" :border="true">
      <el-table-column prop="roundId" :label="$t('__roundID')" />
      <el-table-column prop="tableName" :label="$t('__tableID')" />
      <el-table-column prop="gameStartTime" :label="$t('__startTime')" />
      <el-table-column prop="gameEndTime" :label="$t('__endTime')" />
      <el-table-column prop="gameResultModel" :label="$t('__gameResult')">
        <template slot-scope="props">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-search"
            @click="handleResultDetail(props.row)"
          />
          <el-tag type="success" :disable-transitions="true">
            閒 : {{ props.row.gameResultModel.playerPoints }}，莊 : {{ props.row.gameResultModel.bankerPoints }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    />

    <ResultDetailDialog
      :visible="resultDetailDialogVisible"
      :row-data="rowData"
      @close="closeResultDetail"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { apiGameResultSelect, apiGameResultSearch } from '@/api/operation_member'
import { initDatePickerRange, getFullDate } from '@/utils/transDate'
import ResultDetailDialog from './resultDetailDialog.vue'

export default {
  name: 'MemberGameResult',
  components: { ResultDetailDialog },
  mixins: [handlePageChange, shared],
  data() {
    return {
      searchForm: {
        roundId: undefined,
        tableId: 0,
        gameStartTime: null,
        gameEndTime: null,
        gameType: 0,
        gamePaymentStatus: 1,
        orderByCondition: null,
        orderBy: null,
        limit: 50,
        page: 1
      },
      searchTimeRange: initDatePickerRange(),
      gameTableList: [],
      gameTypeList: [],
      resultDetailDialogVisible: false,
      rowData: {
        roundId: 0,
        playerCard: [],
        bankerCard: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'gamePaymentStatus',
      'memberGameResultRecords',
      'orderBy',
      'orderByCondition_game_result'
    ])
  },
  created() {
    this.initAllSelectMenu().then(() => {
      this.handleCurrentChange(1)
    })
  },
  methods: {
    async initAllSelectMenu() {
      this.$store.dispatch('operation_member/setSelectMenu')
      this.selectLoading = true
      this.dataLoading = true
      await apiGameResultSelect().then((res) => {
        this.gameTableList = res.Data.GameTables
        this.gameTypeList = res.Data.GameTypes
        this.searchForm.tableId = this.gameTableList[0].Id
        this.searchForm.gameType = this.gameTypeList[0].Id
        this.searchForm.gamePaymentStatus = this.gamePaymentStatus[0].value
        this.searchForm.orderBy = this.orderBy[0].value
        this.searchForm.orderByCondition = this.orderByCondition_game_result[0].value
      })
    },
    onSubmit() {
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      this.searchForm.limit = this.pageSize
      this.searchForm.page = this.currentPage
      this.searchForm.gameStartTime = getFullDate(this.searchTimeRange[0])
      this.searchForm.gameEndTime = getFullDate(this.searchTimeRange[1])
      apiGameResultSearch(this.searchForm).then((res) => {
        this.$store.dispatch('operation_member/setMemberGameResultRecords', res.Data.GameResultRecords)
        this.allDataByClient = this.memberGameResultRecords
        this.totalCount = res.Data.TotalCount
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    handleResultDetail(row) {
      this.resultDetailDialogVisible = true
      this.rowData.roundId = row.roundId
      this.rowData.playerCard = row.gameResultModel.playerCard
      this.rowData.bankerCard = row.gameResultModel.bankerCard
    },
    closeResultDetail() {
      this.resultDetailDialogVisible = false
      this.rowData = []
    }
  }
}
</script>
