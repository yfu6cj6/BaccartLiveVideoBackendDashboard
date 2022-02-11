<template>
  <div class="betRecord-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item :label="$t('__member') + $t('__account')">
        <el-input v-model="searchForm.memberName" />
      </el-form-item>
      <el-form-item :label="$t('__roundID')">
        <el-input v-model="searchForm.roundId" />
      </el-form-item>
      <el-form-item :label="$t('__tableID')">
        <el-select v-model="searchForm.tableId">
          <el-option v-for="item in gameTableList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__orderNumber')">
        <el-input v-model="searchForm.orderNumber" />
      </el-form-item>
      <el-form-item :label="$t('__payoutRange')">
        <el-input v-model="searchForm.payoutRangeMin" placeholder="1" />
      </el-form-item>
      <el-form-item :label="$t('__to')">
        <el-input v-model="searchForm.payoutRangeMax" placeholder="1000" />
      </el-form-item>
      <el-form-item :label="$t('__gameType')">
        <el-select v-model="searchForm.gameType">
          <el-option v-for="item in gameTypeList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__betTime')">
        <el-date-picker v-model="searchTimeRange" type="datetimerange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" />
      </el-form-item>
      <el-form-item :label="$t('__orderBy')">
        <el-select v-model="searchForm.orderBy">
          <el-option v-for="item in orderBy" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__orderByCondition')">
        <el-select v-model="searchForm.orderByCondition">
          <el-option v-for="item in orderByCondition_bet_record" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__currency')">
        <el-select v-model="searchForm.currency">
          <el-option v-for="item in currencyList" :key="item.Code" :label="item.Name" :value="item.Code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__agent')">
        <el-select v-model="searchForm.agentId">
          <el-option v-for="item in agentList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t("__search") }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" :border="true">
      <el-table-column style="width: 100px;" prop="MemberName" :label="$t('__member') + $t('__account')" />
      <el-table-column prop="AgentName" :label="$t('__agent')" />
      <el-table-column prop="OrderNumber" :label="$t('__orderNumber')" />
      <el-table-column prop="RoundId" :label="$t('__roundID')" />
      <el-table-column prop="TableId" :label="$t('__tableID')" />
      <el-table-column prop="OrderStatusLabel" :label="$t('__orderStatus')" />
      <el-table-column prop="GamePlayLabel" :label="$t('__gamePlay')" />
      <el-table-column prop="BetAmount" :label="$t('__betAmount')" />
      <el-table-column prop="Payout" :label="$t('__payout')" />
      <el-table-column prop="ValidBetAmount" :label="$t('__validBetAmount')" />
      <el-table-column prop="CurrencyLabel" :label="$t('__currency')" />
      <el-table-column prop="BetTime" :label="$t('__betTime')" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="betRecord-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { initDatePickerRange, getFullDate } from '@/utils/transDate'
import { apiBetRecordSelect, apiBetRecordSearch } from '@/api/operation_member'

export default {
  name: 'BetRecord',
  mixins: [handlePageChange, shared],
  data() {
    return {
      searchForm: {
        tableId: 0,
        gameType: 0,
        agentId: 0,
        currency: 0,
        timeZone: 0,
        betTimeRangeStart: null,
        betTimeRangeEnd: null,
        memberName: '',
        fuzzyQuery: false,
        roundId: undefined,
        orderNumber: undefined,
        payoutRangeMin: undefined,
        payoutRangeMax: undefined,
        orderByCondition: 0,
        orderBy: 0,
        device: 0,
        limit: 50,
        page: 1
      },
      searchTimeRange: initDatePickerRange(),
      gameTableList: [],
      gameTypeList: [],
      currencyList: [],
      agentList: [],
      timeZoneList: []
    }
  },
  computed: {
    ...mapGetters(['token', 'memberBetRecords', 'orderBy', 'orderByCondition_bet_record'])
  },
  created() {
    this.$store.dispatch('operation_member/setSelectMenu')
    this.selectLoading = true
    // 取得並初始化下拉式選單
    apiBetRecordSelect(this.token).then((res) => {
      this.gameTableList = res.Data.GameTables
      this.gameTypeList = res.Data.GameTypes
      this.agentList = res.Data.Agents
      this.currencyList = res.Data.Currencies
      this.timeZoneList = res.Data.TimeZones
      this.searchForm.tableId = this.gameTableList[0].Id
      this.searchForm.gameType = this.gameTypeList[0].Id
      this.searchForm.agentId = this.agentList[0].Id
      this.searchForm.currency = this.currencyList[0].Code
      this.searchForm.timeZone = this.timeZoneList[0].Id
      this.searchForm.orderBy = this.orderBy[0].value
      this.searchForm.orderByCondition = this.orderByCondition_bet_record[0].value
      this.selectLoading = false

      this.handleCurrentChange(1)
    })
  },
  methods: {
    async onSubmit() {
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      const ZO = ' 00:00:00'
      this.searchForm.betTimeRangeStart = getFullDate(this.searchTimeRange[0]) + ZO
      this.searchForm.betTimeRangeEnd = getFullDate(this.searchTimeRange[1]) + ZO
      await apiBetRecordSearch(this.token, this.searchForm).then((res) => {
        this.$store.dispatch('operation_member/setMemberBetRecords', res.Data.MemberBetRecords)
        this.allDataByClient = this.memberBetRecords
        this.allDataByClient.forEach(element => {
          const gameTable = this.gameTableList.find(table => table.Id === element.TableId)
          element.TableId = gameTable ? gameTable.Name : element.TableId
        })
        this.totalCount = res.Data.TotalCount
        this.handlePageChangeByClient(this.currentPage)
        this.dataLoading = false
        this.selectLoading = false
      }).catch(() => {
        this.selectLoading = false
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.betRecord {
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
