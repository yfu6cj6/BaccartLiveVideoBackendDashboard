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
      <el-table-column prop="Currency" :label="$t('__currency')" />
      <el-table-column prop="Status" :label="$t('__accountStatus')" />
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
import transTableDataByLang from '@/layout/mixin/transTableDataByLang'
import { apiMemberInfo, getSelectMenu } from '@/api/operation_member'
import _ from 'lodash'

export default {
  name: 'MemberMessage',
  mixins: [handlePageChange, shared, transTableDataByLang],
  data() {
    const accountType = [
      {
        label: '試用帳號',
        value: 1
      },
      {
        label: '正式真錢帳號',
        value: 2
      }
    ]
    return {
      currencyList: [],
      searchForm: {
        memberName: '',
        nickName: '',
        currency: undefined,
        accountType: undefined,
        limit: 0,
        page: 1
      },
      accountType: accountType
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.initAllSelectMenu().then((res) => {
      this.handleCurrentChange(1)
    })
  },
  methods: {
    async initAllSelectMenu() {
      this.selectLoading = true
      this.dataLoading = true
      return getSelectMenu(this.token).then((res) => {
        this.currencyList = []
        this.currencyList.push({ Code: 0, Name: this.$t('__allCurrency') })
        this.currencyList = this.currencyList.concat(res.Data.Currencies)

        this.searchForm.currency = this.currencyList[0].Code
        this.searchForm.accountType = this.accountType[0].value
        this.searchForm.limit = this.pageSize
      })
    },
    async onSubmit() {
      this.searchForm.page = this.currentPage
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      await apiMemberInfo(this.token, this.searchForm).then((res) => {
        this.allDataByClient = res.Data.MemberInfos
        this.totalCount = res.Data.TotalCount
        this.handlePageChangeByClient(this.currentPage)
        this.allData = _.cloneDeep(this.allDataByClient).map((item) => {
          item.RegisterTime = item.RegisterTime.replace('T', ' ')
          return this.transTableDataByLang(item)
        })
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
