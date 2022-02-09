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
          <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
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
    <el-table v-loading="dataLoading" :data="tableData" :border="true">
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
import { apiMemberInfo } from '@/api/member'
import { getSelectMenu } from '@/api/select_menu'
import _ from 'lodash'

export default {
  mixins: [handlePageChange, shared, transTableDataByLang],
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
      },
      accountType: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.selectLoading = true
    this.initAllSelectMenu().then((res) => {
      this.handleCurrentChange(1)
    })
  },
  methods: {
    async initAllSelectMenu() {
      return getSelectMenu(this.token).then((res) => {
        this.currencyList.push({ code: 0, name: this.$t('__allCurrency') })
        this.currencyList = this.currencyList.concat(res.Data.Currencies)

        this.searchForm.currency = this.currencyList[0].code
        // this.searchForm.accountType = this.accountType[0].value
        this.searchForm.limit = this.pageSize
        this.selectLoading = false
      })
    },
    async onSubmit() {
      this.searchForm.page = this.currentPage
      this.tableData = []
      this.dataLoading = true
      await apiMemberInfo(this.token, this.searchForm).then((res) => {
        this.allDataByClient = res.Data.MemberInfos
        this.totalCount = res.Data.TotalCount
        this.handlePageChangeByClient(this.currentPage)
        this.allData = _.cloneDeep(this.allDataByClient).map((item) => {
          item.RegisterTime = item.RegisterTime.replace('T', ' ')
          return this.transTableDataByLang(item)
        })
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
