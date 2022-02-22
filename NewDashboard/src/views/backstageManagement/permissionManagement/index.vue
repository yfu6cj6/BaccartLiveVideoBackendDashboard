<template>
  <div class="accountList-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true">
      <el-form-item :label="$t('__account')">
        <el-input v-model="searchForm.account" />
      </el-form-item>
      <el-form-item :label="$t('__role')">
        <el-select v-model="searchForm.role">
          <el-option v-for="item in accountCreateAgentRole" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__agent')">
        <el-select v-model="searchForm.agent">
          <el-option v-for="item in currencyList" :key="item.Code" :label="item.Name" :value="item.Code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleCreateView">{{ $t("__accountCreate") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataLoading" :data="tableData" border>
      <el-table-column prop="Account" :label="$t('__account')" />
      <el-table-column prop="RoleName" :label="$t('__role')" />
      <el-table-column prop="AgentName" :label="$t('__agent')" />
    </el-table>
    <el-pagination
      class="accountList-pagination"
      background
      layout="prev, pager, next, jumper"
      :total="totalCount"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handlePageChangeByClient"
    />

    <AccountCreateView
      v-if="createViewVisible"
      :visible="createViewVisible"
      @close="closeResultDetail"
      @init="test"
    />
  </div>
</template>

<script>
import { accountListPage } from '@/api/backstageManagement'
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import AccountCreateView from './accountCreateView'

export default {
  name: 'AuthorityManagement',
  components: { AccountCreateView },
  mixins: [handlePageChange, shared],
  data() {
    return {
      searchForm: {
        account: undefined,
        role: undefined,
        agent: undefined
      },
      currencyList: [],
      createViewVisible: true
    }
  },
  computed: {
    ...mapGetters([
      'accountListData',
      'accountCreateAgentRole'
    ])
  },
  created() {
    this.selectLoading = true
    this.dataLoading = true
  },
  methods: {
    onSubmit() {
      this.selectLoading = true
      this.dataLoading = true
      accountListPage().then((res) => {
        this.$store.dispatch('backstageManagement/setAccountListData', res.Data)
        this.allDataByClient = this.accountListData
        this.totalCount = res.Data.length
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    handleCreateView() {
      this.createViewVisible = true
    },
    closeResultDetail() {
      this.createViewVisible = false
    },
    test(agentRole, agentId) {
      this.searchForm.role = agentRole[0].Id
      this.searchForm.agent = agentId
      this.handleCurrentChange(1)
      this.selectLoading = false
      this.dataLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.accountList {
  &-container {
    margin: 20px;
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
</style>
