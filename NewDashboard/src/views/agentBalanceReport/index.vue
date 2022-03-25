<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="agentInfoFormData">
      <el-form :inline="true">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="onExportBtnClick()">{{ $t("__export") }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="[agentInfo]" border :max-height="viewHeight" :show-header="false">
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__agent') }}</span>
            <span>{{ scope.row.agent }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__subordinateAgentsBalance') }}</span>
            <span>{{ scope.row.subordinateAgentsBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__subordinateMembersBalance') }}</span>
            <span>{{ scope.row.subordinateMembersBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__unassignedBalance') }}</span>
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__totalBalance') }}</span>
            <span>{{ scope.row.totalBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__totalPlayerCount') }}</span>
            <span>{{ scope.row.memberCount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="agentInfoForm">
      <el-col :span="12">
        <el-button class="agentInfoFormBtn" :class="{'focus': curTableIndex === tableEnum.agent}" @click="onTableBtnClick(tableEnum.agent)">{{ $t("__agent") }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="agentInfoFormBtn" :class="{'focus': curTableIndex === tableEnum.member}" @click="onTableBtnClick(tableEnum.member)">{{ $t("__member") }}</el-button>
      </el-col>
    </el-row>

    <Agent
      v-show="curTableIndex === tableEnum.agent"
      ref="agent"
      :view-height="viewHeight"
      @handleRespone="handleAgentRespone"
      @setDataLoading="setDataLoading"
    />
    <Member
      v-show="curTableIndex === tableEnum.member"
      ref="member"
      :view-height="viewHeight"
      @handleRespone="handleMemberRespone"
      @setDataLoading="setDataLoading"
    />
  </div>
</template>

<script>
import { agentBalanceReportExport } from '@/api/agentBalanceReport/agent'
import Agent from './agent/index'
import Member from './member/index'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDateString } from '@/utils/transDate'

export default {
  name: 'AgentBalanceReport',
  components: { Agent, Member },
  mixins: [handleViewResize],
  data() {
    return {
      tableEnum: Object.freeze({
        'agent': 0,
        'member': 1
      }),
      agentInfo: {},
      curTableIndex: 0,
      dataLoading: false,
      agentId: 0,
      tempRoute: {}
    }
  },
  computed: {
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    this.formClassName = ['agentInfoFormData', 'agentInfoForm']
    this.otherHeight += 50
    this.$nextTick(() => {
      this.agentId = this.$route.params && this.$route.params.id
      this.onTableBtnClick(this.tableEnum.agent)
    })
  },
  methods: {
    setTagsViewTitle() {
      const title = this.$t(this.tempRoute.meta.title)
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.agentInfo.agent}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    onExportBtnClick() {
      this.dataLoading = true
      agentBalanceReportExport({ agentId: this.agentId }).then((res) => {
        this.onDataOut(res)
        this.dataLoading = false
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onDataOut(tablesData) {
      const excelDatas = []
      for (var tableData in tablesData) {
        const tHeader = []
        const filterVal = []
        for (const item in tablesData[tableData][0]) {
          tHeader.push(tablesData[tableData][0][item])
          filterVal.push(item)
        }
        const tableDatas = tablesData[tableData].slice(1, tablesData[tableData].length)
        excelDatas.push({
          tHeader: tHeader,
          filterVal: filterVal,
          tableDatas: tableDatas,
          sheetName: tableData
        })
      }
      const { multipleSheetExport } = require('@/vendor/Export2Excel')
      multipleSheetExport(excelDatas, 'AgentBalanceReport_' + getFullDateString(new Date()), true, 'xlsx')
    },
    handleAgentRespone(agentInfo) {
      this.agentInfo = agentInfo
      this.setTagsViewTitle()
      this.dataLoading = false
    },
    handleMemberRespone() {
      this.dataLoading = false
    },
    onTableBtnClick(tableEnum) {
      this.curTableIndex = tableEnum
      this.dataLoading = true
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          this.$refs.agent.onSearch(this.agentId)
          break
        }
        case this.tableEnum.member: {
          this.$refs.member.onSearch(this.agentId)
          break
        }
      }
    },
    setDataLoading(dataLoading) {
      this.dataLoading = dataLoading
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  display: block;
  line-height: 23px;
  font-weight: bolder;
}

.agentInfoFormData,
.agentInfoForm {
  background: #333;
  margin: 5px 5px 0 5px;
}

.agentInfoFormBtn {
  background: #333;
  color: #fff;
  border: 1px solid #d8dce5;
  height: 44px;
  width: 100%;
  padding: 14px 5px;
  font-size: 14px;
  font-weight: 700;
}
.agentInfoFormBtn:hover,
.focus {
  color: #f9c901;
}
</style>
