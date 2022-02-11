<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              :data="treeData.subAgentLevelInfos"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
          <el-form-item class="inputTitle" :label="$t('__accountStatus')">
            <el-select v-model="searchForm.userStatus">
              <el-option v-for="item in userStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__currency')">
            <el-select v-model="searchForm.currency">
              <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__orderBy')">
            <el-select v-model="searchForm.orderBy">
              <el-option v-for="item in orderBy" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__orderByCondition')">
            <el-select v-model="searchForm.orderByCondition">
              <el-option v-for="item in orderByCondition_agent_management" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("__search") }}</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="dataLoading" :data="tableData" :border="true">
          <el-table-column prop="name" :label="$t('__agentName')" />
          <el-table-column prop="status" :label="$t('__status')" />
          <el-table-column prop="currency" :label="$t('__currency')" />
        </el-table>

        <el-pagination
          layout="prev, pager, next"
          :total="totalCount"
          background
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAgentManageSelect, getAgentManageSearch, getAgentLevelInfo } from '@/api/operation_agent'
import { mapGetters } from 'vuex'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import transTableDataByLang from '@/layout/mixin/transTableDataByLang'
import _ from 'lodash'
import { parseTime } from '@/utils/index'

export default {
  name: 'Home',
  mixins: [handlePageChange, shared, transTableDataByLang],
  data() {
    return {
      tableData: [],
      oriAllData: [],
      userStatusList: [],
      currencyList: [],
      searchForm: {
        language: '',
        userStatus: undefined,
        currency: null,
        orderByCondition: null,
        orderBy: null,
        agentId: ''
      },
      excel: true,
      treeData: {
        subAgentLevelInfos: []
      },
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      messageInstance: this.$message
    }
  },
  computed: {
    ...mapGetters(['token', 'orderBy', 'orderByCondition_agent_management', 'userStatus'])
  },
  created() {
    this.initAllSelectMenu()
  },
  methods: {
    async initAllSelectMenu() {
      this.selectLoading = false
      this.orderByList = this.orderBy
      this.orderByConditionList = this.orderByCondition_agent_management
      await getAgentManageSelect(this.token).then((res) => {
        this.currencyList = res.Data.Currencies
        // this.$store.dispatch('select_menu/changeSelectLang')
        this.userStatusList = this.userStatus
        this.searchForm.currency = this.currencyList[0].code
        // this.searchForm.orderBy = this.orderBy[0].value
        // this.searchForm.orderByCondition = this.orderByCondition_agent_management[0].value
        // this.searchForm.userStatus = this.userStatusList[0].value
        this.selectLoading = false
      })
      getAgentLevelInfo(this.token).then((res) => {
        this.treeData.subAgentLevelInfos.push(res.Data.AgentLevelInfo)
        this.searchForm.agentId = res.Data.AgentLevelInfo.AgentId
      })
    },
    onSubmit() {
      this.tableData = undefined
      getAgentManageSearch(this.token, this.searchForm).then((res) => {
        console.log(res)
        this.total = res.Data.TotalCount
        this.oriAllData = res.Data.Agents
        this.allData = _.cloneDeep(this.oriAllData).map((item) => {
          return transTableDataByLang(item)
        })
        this.dataLoading = false
      })
    },
    onDataOut() {
      this.dataLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = this.tableList
        const filterVal = [
          'userName',
          'accountTypeName',
          'trialCredit',
          'officalCredit',
          'userStatusName',
          'currencyName',
          'updateTime',
          'createTime',
          'lastLoginTime'
        ]
        const list = this.tableData

        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.dataLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => j === 'timestamp' ? parseTime(v[j]) : v[j]))
    },
    handleNodeClick(data) {
      this.searchForm.agentId = data.agentId
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}，ID: {data.AgentId}
        </span>
      )
    }
  }
}
</script>

<style scoped>
  .inputTitle{
    padding: 0px 12px 0 12px;
  }
  .el-tree {
  display:inline-block;
  }
</style>
