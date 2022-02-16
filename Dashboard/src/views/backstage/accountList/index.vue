<template>
  <div class="accountList-container">
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
  </div>
</template>

<script>
import { accountListPage } from '@/api/backstage'
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'

export default {
  name: 'AccountList',
  mixins: [handlePageChange, shared],
  data() {
    return {
      dataLoading: false
    }
  },
  computed: {
    ...mapGetters(['token', 'accountListData'])
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    async onSubmit() {
      this.dataLoading = true
      await accountListPage(this.token).then((res) => {
        this.$store.dispatch('backstage/setAccountListData', res.Data)
        this.allDataByClient = this.accountListData
        this.totalCount = res.Data.length
        this.handlePageChangeByClient(this.currentPage)
        this.dataLoading = false
      })
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
