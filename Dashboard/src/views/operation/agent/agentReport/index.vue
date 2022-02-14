<template>
  <div class="reportCreate-container">
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
          <el-form-item class="inputTitle" :label="$t('__searchTime')">
            <el-date-picker v-model="searchForm.searchTimeRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" />
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__currency')">
            <el-select v-model="searchForm.currency">
              <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__orderBy')">
            <el-select v-model="searchForm.orderBy">
              <el-option v-for="item in agentOrderBy" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__orderByCondition')">
            <el-select v-model="searchForm.orderByCondition">
              <el-option v-for="item in orderByCondition_agent_report" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("__search") }}</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="dataLoading" :data="tableData" :border="true">
          <el-table-column prop="agentName" :label="$t('__agentName')" />
          <el-table-column prop="currency" :label="$t('__currency')" />
          <el-table-column prop="betMemberCount" :label="$t('__betCount')" />
          <el-table-column prop="betOrderCount" :label="$t('__betOrderCount')" />
          <el-table-column prop="totalBetAmount" :label="$t('__totalBetAmount')" />
          <el-table-column prop="totalValidBetAmount" :label="$t('__validBetAmount')" />
          <el-table-column prop="totalPayout" :label="$t('__memberPaidOut')" />
          <el-table-column prop="reportTime" :label="$t('__date')" />
        </el-table>

        <el-pagination
          class="agentList-pagination"
          layout="prev, pager, next, jumper"
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
import { mapGetters } from 'vuex'
import { getAgentReportSelect, getAgentDayReportSearch, getAgentLevelInfo } from '@/api/operation_agent'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import { getAgentReport } from '../Data'
import { getFullDate } from '@/utils/transDate'
import { transTimeModel } from '@/utils/transTimeModel'
import _ from 'lodash'
import { parseTime } from '@/utils/index'

export default {
  name: 'Home',
  mixins: [handlePageChange, shared],
  data() {
    return {
      userData: [],
      tableData: [],
      currencyList: [],
      searchForm: getAgentReport(),
      oriAllData: [],
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
    ...mapGetters([
      'token',
      'agentOrderBy',
      'orderByCondition_agent_report'
    ])
  },
  created() {
    this.$store.dispatch('operation_agent/setSelectMenu')
    this.initAllSelectMenu()
  },
  methods: {
    async initAllSelectMenu() {
      this.selectLoading = true
      await getAgentReportSelect(this.token).then((res) => {
        this.currencyList = res.Data.Currencies
        this.searchForm.currency = this.currencyList[0].code
        this.searchForm.orderBy = this.agentOrderBy[0].value
        this.searchForm.orderByCondition = this.orderByCondition_agent_report[0].value
        this.searchForm.orderByCondition = 0
        this.selectLoading = false
      })
      getAgentLevelInfo(this.token).then((res) => {
        this.treeData.subAgentLevelInfos.push(res.Data.AgentLevelInfo)
        this.searchForm.agentId = res.Data.AgentLevelInfo.AgentId
      })
    },
    onSubmit() {
      this.tableData = undefined
      const ZO = ' 00:00:00'
      this.searchForm.betTimeRangeStart = getFullDate(this.searchForm.searchTimeRange[0]) + ZO
      this.searchForm.betTimeRangeEnd = getFullDate(this.searchForm.searchTimeRange[1]) + ZO
      getAgentDayReportSearch(this.token, this.searchForm).then((res) => {
        this.totalCount = res.Data.TotalCount
        this.oriAllData = res.Data.AgentDayReports
        this.allData = _.cloneDeep(this.oriAllData).map((item) => {
          item.createTime = transTimeModel(item.createTime)
          return item
        })
        this.dataLoading = false
      })
    },
    onDataOut() {
      this.dataLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const els = this.tableList.slice(0, this.tableList.length - 2)
        const tHeader = els
        const filterVal = [
          'agentName',
          'currencyName',
          'betMemberCount',
          'betOrderCount',
          'totalBetAmount',
          'totalValidBetAmount',
          'totalPayout'
        ]
        const hdd = [{ agentName: '' }]
        const sd1 = [{ agentName: this.tableList[7] }]
        const sd2 = [{ agentName: this.tableList[8] }]
        const list = sd1
          .concat(this.userData)
          .concat(hdd)
          .concat(sd2)
          .concat(this.tableData)

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
      return jsonData.map((v) =>
        filterVal.map((j) => (j === 'timestamp' ? parseTime(v[j]) : v[j]))
      )
    },
    handleNodeClick(data) {
      this.searchForm.agentId = data.AgentId
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}，ID: {data.AgentId}
        </span>
      )
    },
    tableRowClassName({ row }) {
      return row.agentName !== '' ? 'pick' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.reportCreate {
  &-container {
    margin: 20px;
  }
}
.inputTitle{
  padding: 0px 12px 0 12px;
}
.el-input {
  width: 150px;
}
.el-select {
  width: 150px;
}
.el-tree {
  display: inline-block;
}
.agentList {
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
