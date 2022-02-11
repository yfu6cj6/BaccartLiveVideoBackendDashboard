<template>
  <div class="app-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item :label="$t('__memberAccount')">
        <el-input v-model="searchForm.memberName" />
      </el-form-item>
      <el-form-item :label="$t('__transactionID')">
        <el-input v-model="searchForm.transactionId" />
      </el-form-item>
      <el-form-item :label="$t('__transactionType')">
        <el-select v-model="searchForm.transactionType">
          <el-option v-for="item in transactionTypeList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__transactionTime')">
        <el-date-picker v-model="searchForm.searchTimeRange" type="datetimerange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" />
      </el-form-item>
      <el-form-item :label="$t('__orderBy')">
        <el-select v-model="searchForm.orderBy">
          <el-option v-for="item in orderBy" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__orderByCondition')">
        <el-select v-model="searchForm.orderByCondition">
          <el-option v-for="item in orderByCondition_transaction_record" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__currency')">
        <el-select v-model="searchForm.currency">
          <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__agent')">
        <el-select v-model="searchForm.agentId">
          <el-option v-for="item in agentList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">{{ $t("__search") }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" :border="true">
      <el-table-column prop="transactionId" :label="$t('__transactionIDForInternal')" />
      <el-table-column prop="memberName" :label="$t('__memberAccount')" />
      <el-table-column prop="agentName" :label="$t('__agent')" />
      <el-table-column prop="transactionType" :label="$t('__transactionType')" />
      <el-table-column prop="createTime" :label="$t('__transactionTime')" />
      <el-table-column prop="currency" :label="$t('__currency')" />
      <el-table-column prop="preTradeBalance" :label="$t('__preTradeBalance')" />
      <el-table-column prop="income" :label="$t('__income')" />
      <el-table-column prop="payout" :label="$t('__payout')" />
      <el-table-column prop="balanceAfterTrade" :label="$t('__balanceAfterTrade')" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
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
import { apiBalanceRecordSelect, apiBalanceRecordSearch } from '@/api/operation_member'
import { initDatePickerRange, getFullDate, transTimeModel } from '@/utils/transDate'
import _ from 'lodash'

export default {
  name: 'MemberTransactionRecord',
  mixins: [handlePageChange, shared],
  data() {
    return {
      limitList: this._limitList,
      searchForm: {
        memberName: '',
        transactionId: 0,
        transactionType: 0,
        searchTimeRange: initDatePickerRange(),
        transactionTimeRangeStart: null,
        transactionTimeRangeEnd: null,
        orderByCondition: null,
        orderBy: null,
        currency: null,
        agentId: this.agentId,
        limit: 0,
        page: 1
      },
      tableData: [],
      oriAllData: [],
      agentList: [],
      currencyList: [],
      transactionTypeList: [],
      messageInstance: this.$message
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'orderBy',
      'orderByCondition_transaction_record',
      '_limitList',
      'agentId'
    ])
  },
  created() {
    this.initAllSelectMenu()
  },
  methods: {
    search() {
      this.currentPage = 1
      this.onSubmit()
    },
    onSubmit() {
      this.dataLoading = true
      const ZO = ' 00:00:00'
      this.searchForm.limit = this.pageSize
      this.searchForm.page = this.currentPage
      this.searchForm.transactionTimeRangeStart =
        getFullDate(this.searchForm.searchTimeRange[0]) + ZO
      this.searchForm.transactionTimeRangeEnd =
        getFullDate(this.searchForm.searchTimeRange[1]) + ZO
      apiBalanceRecordSearch(this.token, this.searchForm).then((res) => {
        this.totalCount = res.data.totalCount
        this.oriAllData = res.data.memberBalanceRecords
        this.allData = _.cloneDeep(this.oriAllData).map((item) => {
          item.createTime = transTimeModel(item.createTime)
          return item
        })
        this.dataLoading = false
      })
    },
    async initAllSelectMenu() {
      await apiBalanceRecordSelect(this.token).then((res) => {
        this.agentList = res.data.agents
        this.currencyList = res.data.currencies
        this.transactionTypeList = res.data.transactionTypes
        this.transactionTypeList.unshift({ id: 0, name: '全部' })
        this.$store.dispatch('select_menu/changeSelectLang')
        this.searchForm.agentId = this.agentList[0].id
        this.searchForm.currency = this.currencyList[0].code
        this.searchForm.transactionType = this.transactionTypeList[0].id
        this.searchForm.orderBy = this.orderBy[0].value
        this.searchForm.orderByCondition = this.orderByCondition_transaction_record[0].value
      })
      this.selectLoading = false
    }
  }
}
</script>

<style scoped>
</style>
