<template>
  <div class="memberMessage-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true">
      <el-form-item :label="$t('__member') + $t('__account')">
        <el-input v-model="searchForm.memberName" />
      </el-form-item>
      <el-form-item :label="$t('__nickname')">
        <el-input v-model="searchForm.nickName" />
      </el-form-item>
      <el-form-item :label="$t('__currency')">
        <el-select v-model="searchForm.currency">
          <el-option v-for="item in currencyList" :key="item.Code" :label="item.Name" :value="item.Code" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__accountType')">
        <el-select v-model="searchForm.accountType">
          <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataLoading" :data="tableData" border>
      <el-table-column prop="Name" :label="$t('__member') + $t('__account')" />
      <el-table-column prop="NickName" :label="$t('__nickname')" />
      <el-table-column prop="CurrencyLabel" :label="$t('__currency')" />
      <el-table-column prop="StatusLabel" :label="$t('__accountStatus')" />
      <el-table-column prop="Balance" :label="$t('__balance')" />
      <el-table-column prop="RegisterTime" :label="$t('__registerTime')" />
    </el-table>
    <el-pagination
      class="memberMessage-pagination"
      background
      layout="prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalCount"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { apiMemberInfo, getSelectMenu } from '@/api/operation_member'

export default {
  name: 'MemberMessage',
  mixins: [handlePageChange, shared],
  data() {
    return {
      currencyList: [],
      searchForm: {
        memberName: '',
        nickName: '',
        currency: undefined,
        accountType: undefined,
        limit: 0,
        page: 1
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'accountType', 'memberInfos'])
  },
  created() {
    this.initAllSelectMenu().then(() => {
      this.handleCurrentChange(1)
    })
  },
  methods: {
    async initAllSelectMenu() {
      this.$store.dispatch('operation_member/setAccountType')
      this.selectLoading = true
      this.dataLoading = true
      await getSelectMenu(this.token).then((res) => {
        this.currencyList = []
        this.currencyList.push({ Code: 0, Name: this.$t('__allCurrency') })
        this.currencyList = this.currencyList.concat(res.Data.Currencies)

        this.searchForm.currency = this.currencyList[0].Code
        this.searchForm.accountType = this.accountType[0].value
        this.searchForm.limit = this.pageSize
      })
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      apiMemberInfo(this.token, this.searchForm).then((res) => {
        this.$store.dispatch('operation_member/setMemberInfos', res.Data.MemberInfos)
        this.allDataByClient = this.memberInfos
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
.memberMessage {
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
