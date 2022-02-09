<template>
  <div class="customerServiceList-container">
    <el-table :data="tableData" border>
      <el-table-column prop="Account" :label="$t('__account')" />
      <el-table-column prop="RoleName" :label="$t('__role')" />
      <el-table-column prop="AgentName" :label="$t('__agent')" />
    </el-table>
    <el-pagination
      class="customerServiceList-pagination"
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
import { customerServiceList } from '@/api/customerService'
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'

export default {
  name: 'CustomerServiceList',
  mixins: [handlePageChange, shared],
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.currentPage = 1
      this.onSubmit()
    },
    async onSubmit() {
      this.selectLoading = true
      customerServiceList(this.token).then((res) => {
        this.allDataByClient = res.Data
        this.totalCount = res.Data.length
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customerServiceList {
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
