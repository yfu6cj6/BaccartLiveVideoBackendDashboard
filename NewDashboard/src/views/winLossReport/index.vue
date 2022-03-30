<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="agentInfoFormData">
      <el-form :inline="true">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="onTableBtnClick(curTableIndex)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchTime"
            class="date-picker"
            type="datetimerange"
            align="right"
            unlink-panels
            :range-separator="$t('__to')"
            :start-placeholder="$t('__startDate')"
            :end-placeholder="$t('__endDate')"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="onTableBtnClick(curTableIndex)">{{ $t("__search") }}</el-button>
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
            <span>{{ $t('__gameType') }}</span>
            <span>{{ scope.row.gameType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__betAmount') }}</span>
            <span>{{ scope.row.betAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__winLoss') }}</span>
            <span>{{ scope.row.winLoss }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__winLossRate') }}</span>
            <span>{{ scope.row.winLossRate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__validBetAmount') }}</span>
            <span>{{ scope.row.validBetAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__rollingRate') }}</span>
            <span>{{ scope.row.rollingRate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__rollingCommission') }}</span>
            <span>{{ scope.row.rollingCommission }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__totalAmount') }}</span>
            <span>{{ scope.row.netPL }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__commissionRate') }}</span>
            <span>{{ scope.row.commissionRate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__toSuperior') }}</span>
            <span>{{ scope.row.toSuperior }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <span>{{ $t('__commitSuperiorsValidBetAmount') }}</span>
            <span>{{ scope.row.commitSuperiorsValidBetAmount }}</span>
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

    <agent
      v-show="curTableIndex === tableEnum.agent"
      ref="agent"
      :view-height="viewHeight"
      :payout-time="searchTime"
      @handleRespone="handleAgentRespone"
      @setDataLoading="setDataLoading"
    />
    <member
      v-show="curTableIndex === tableEnum.member"
      ref="member"
      :view-height="viewHeight"
      :payout-time="searchTime"
      @handleRespone="handleMemberRespone"
      @setDataLoading="setDataLoading"
    />
  </div>
</template>

<script>
import { agentWinLossReportExport } from '@/api/winLossReport/agent'
import Agent from './agent/index'
import Member from './member/index'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDateString, getLastDateClearTime, getLastDate, getFullDate } from '@/utils/transDate'

const defaultSearchTime = getLastDateClearTime(7)

export default {
  name: 'WinLossReport',
  components: { Agent, Member },
  mixins: [handleViewResize],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('__lastWeek'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(7))
          }
        }, {
          text: this.$t('__lastMonth'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(30))
          }
        }, {
          text: this.$t('__lastThreeMonths'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(90))
          }
        }]
      },
      tableEnum: Object.freeze({
        'agent': 0,
        'member': 1
      }),
      agentInfo: {},
      curTableIndex: 0,
      dataLoading: false,
      searchTime: defaultSearchTime,
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
      const data = {
        payoutTime: [],
        agentId: this.agentId
      }
      this.searchTime.forEach(element => {
        data.payoutTime.push(getFullDate(element))
      })
      this.dataLoading = true
      agentWinLossReportExport(data).then((res) => {
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
      multipleSheetExport(excelDatas, 'WinLossReport_' + getFullDateString(new Date()), true, 'xlsx')
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
