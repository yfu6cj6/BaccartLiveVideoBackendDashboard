<template>
  <div class="transactionRecord-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item :label="$t('__memberAccount')">
        <el-input v-model="searchForm.memberName" />
      </el-form-item>
      <el-form-item :label="$t('__transactionID')">
        <el-input v-model="searchForm.transactionId" />
      </el-form-item>
      <el-form-item :label="$t('__transactionType')">
        <el-select v-model="searchForm.transactionType">
          <el-option v-for="item in transactionTypeList" :key="item.id" :label="item.Name" :value="item.Id" />
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
          <el-option v-for="item in orderByCondition_transaction_record" :key="item.value" :label="item.label" :value="item.value" />
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
      class="transactionRecord-pagination"
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
import { initDatePickerRange, getFullDate } from '@/utils/transDate'

export default {
  name: 'MemberTransactionRecord',
  mixins: [handlePageChange, shared],
  data() {
    return {
      searchForm: {
        memberName: '',
        transactionId: undefined,
        transactionType: 0,
        transactionTimeRangeStart: null,
        transactionTimeRangeEnd: null,
        orderByCondition: 1,
        orderBy: 0,
        currency: 0,
        agentId: 0,
        limit: 0,
        page: 1
      },
      searchTimeRange: initDatePickerRange(),
      agentList: [],
      currencyList: [],
      transactionTypeList: []
    }
  },
  computed: {
    ...mapGetters([
      'orderBy',
      'orderByCondition_transaction_record',
      'memberBalanceRecords'
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
      await apiBalanceRecordSelect().then((res) => {
        this.agentList = res.Data.Agents
        this.currencyList = res.Data.Currencies
        this.transactionTypeList = res.Data.TransactionTypes
        this.transactionTypeList.unshift({ Id: 0, Name: '全部' })
        this.searchForm.agentId = this.agentList[0].Id
        this.searchForm.currency = this.currencyList[0].Code
        this.searchForm.transactionType = this.transactionTypeList[0].Id
        this.searchForm.orderBy = this.orderBy[0].value
        this.searchForm.orderByCondition = this.orderByCondition_transaction_record[0].value
      })
    },
    onSubmit() {
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      this.searchForm.limit = this.pageSize
      this.searchForm.page = this.currentPage
      this.searchForm.transactionTimeRangeStart = getFullDate(this.searchTimeRange[0])
      this.searchForm.transactionTimeRangeEnd = getFullDate(this.searchTimeRange[1])
      apiBalanceRecordSearch(this.searchForm).then((res) => {
        this.$store.dispatch('operation_member/setMemberTransactionRecords', res.Data.MemberBalanceRecords)
        this.allDataByClient = this.memberBalanceRecords
        this.totalCount = res.Data.TotalCount
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.transactionRecord {
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
