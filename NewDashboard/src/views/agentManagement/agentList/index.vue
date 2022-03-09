<template>
  <div class="currencyManagement-container">
    <el-row>
      <el-col :span="3">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              v-loading="dataLoading"
              :data="agentLevel"
              :props="defaultProps"
              node-key="AgentId"
              :default-expanded-keys="treeDefaultExpandedKeys"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :indent="14"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="21">
        <el-row>
          <label class="labelTitle">{{ $t('__agent') + ':' }}
            <span class="labelContent">{{ agentInfo.fullName }}</span>
          </label>
          <label class="labelTitle">{{ $t('__currency') + ':' }}
            <span class="labelContent">{{ agentInfo.currency }}</span>
          </label>
          <label class="labelTitle">{{ $t('__creditlimit') + ':' }}
            <span class="labelContent">{{ agentInfo.balance }}</span>
          </label>
          <label>
            <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(agentInfo.handicaps)">
              {{ $t("__limit") }}
            </el-button>
          </label>
          <br>
          <label class="labelTitle">{{ $t('__commissionRate') + ':' }}
            <span class="labelContent">{{ agentInfo.commission_rate + '%' }}</span>
          </label>
          <label class="labelTitle">{{ $t('__rollingRate') + ':' }}
            <span class="labelContent">{{ agentInfo.rolling_rate + '%' }}</span>
          </label>
          <label class="labelTitle">{{ $t('__accountStatus') + ':' }}
            <span class="labelContent" :class="{'enable':accountStatusEnable, 'disEnable':!accountStatusEnable}">{{ $t(agentInfo.accountStatus) }}</span>
          </label>
          <label class="labelTitle">{{ $t('__betStatus') + ':' }}
            <span class="labelContent" :class="{'enable':betStatusEnable, 'disEnable':!betStatusEnable}">{{ $t(agentInfo.betStatus) }}</span>
          </label>
          <label class="labelTitle">{{ $t('__directAgentCount') + ':' }}
            <span class="labelContent">{{ agentInfo.directAgentCount }}</span>
          </label>
          <label class="labelTitle">{{ $t('__directPlayerCount') + ':' }}
            <span class="labelContent">{{ agentInfo.directPlayerCount }}</span>
          </label>
          <label>
            <el-button class="labelButton" type="primary" size="mini" @click="onTotalPlayerBtnClick()">
              {{ $t("__totalPlayerCount") + ':' }}
              <span>{{ agentInfo.totalPlayerCount }}</span>
            </el-button>
          </label>
          <label class="labelTitle">{{ $t('__createdAt') + ':' }}
            <span class="labelContent">{{ agentInfo.created_at }}</span>
          </label>
          <label class="labelTitle">{{ $t('__lastLoginAt') + ':' }}
            <span class="labelContent">{{ agentInfo.lastLoginAt }}</span>
          </label>
        </el-row>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
        <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
          <el-table-column :label="$t('__agent')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ scope.row.fullName }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-setting" @click="onEditBtnClick(scope.row)" />
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-unlock" @click="onEditBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="currency" :label="$t('__currency')" align="center" />
          <el-table-column prop="balance" :label="$t('__creditlimit')" align="center" />
          <el-table-column prop="timeZone.city_name" :label="$t('__timeZone')" align="center" />
          <el-table-column :label="$t('__limit')" align="center">
            <template slot-scope="scope">
              <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(scope.row.handicaps)">{{ $t("__limit") }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="directAgentCount" :label="$t('__directAgentCount')" align="center" />
          <el-table-column prop="directPlayerCount" :label="$t('__directPlayerCount')" align="center" />
          <el-table-column :label="$t('__commissionRate')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ scope.row.commission_rate }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-tickets" @click="onCommissionRateLogBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('__rollingRate')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ scope.row.rolling_rate }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-tickets" @click="onRollingRateLogBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
          <el-table-column prop="lastLoginAt" :label="$t('__lastLoginAt')" align="center" />
          <el-table-column :label="$t('__operate')" align="center" width="auto">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          layout="prev, pager, next, jumper"
          class="currencyManagement-pagination"
          :total="totalCount"
          background
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChangeByClient"
        />
      </el-col>
    </el-row>

    <AgentLimitDialog
      :title="$t('__limit')"
      :visible="limitDialogVisible"
      :handicaps="handicaps"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <AgentEditDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AgentCreateDialog
      ref="agentCreateDialog"
      :title="$t('__create')"
      :visible="createDialogVisible"
      :agent-info="agentInfo"
      :form0="form0"
      :form1="form1"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { agentSearch, agentCreate, agentEdit, agentTotalPlayerCount, agentCommissionRateLog, agentRollingRateLog } from '@/api/agentManagement/agentList'
import { timezoneSearch } from '@/api/backstageManagement/timeZoneManagement'
import { currencySearch } from '@/api/backstageManagement/currencyManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AgentCreateDialog from './agentCreateDialog'
import AgentEditDialog from './agentEditDialog'
import AgentLimitDialog from './agentLimitDialog'
import { mapGetters } from 'vuex'

const defaultForm0 = {
  account: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  time_zone: 1,
  currency: 1
}

const defaultForm1 = {
  commission_rate: '0',
  rolling_rate: '0'
}

export default {
  name: 'AgentList',
  components: { AgentCreateDialog, AgentEditDialog, AgentLimitDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      agentLevel: [],
      agentInfo: {},
      selectForm: {},
      handicaps: [],
      form0: JSON.parse(JSON.stringify(defaultForm0)),
      form1: JSON.parse(JSON.stringify(defaultForm1)),
      createDialogVisible: false,
      editDialogVisible: false,
      limitDialogVisible: false,
      rateLogDialogVisible: false,
      accountStatusEnable: false,
      betStatusEnable: false
    }
  },
  computed: {
    ...mapGetters([
      'agentAccountStatusType'
    ]),
    treeDefaultExpandedKeys() {
      return this.agentLevel.length === 0 ? [] : [this.agentLevel[0].AgentId]
    }
  },
  created() {
    this.$store.dispatch('agentManagement/setAgentAccountStatusType')
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    handleRespone(res) {
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.fullName = element.nickname + '(' + element.account + ')'
        element.currency = element.currency.code
      })
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)
      this.agentLevel = res.agentLevel

      this.agentInfo = res.agentInfo
      this.agentInfo.currency = this.agentInfo.currency.code
      this.agentInfo.fullName = this.agentInfo.nickname + '(' + this.agentInfo.account + ')'
      this.agentInfo.accountStatus = this.agentAccountStatusType.find(element => element.key === this.agentInfo.status).nickname
      this.accountStatusEnable = this.agentInfo.status === '1'
      this.agentInfo.betStatus = this.agentAccountStatusType.find(element => element.key === this.agentInfo.bet_status).nickname
      this.betStatusEnable = this.agentInfo.bet_status === '1'

      this.dataLoading = false
    },
    handleResponeError() {
      this.dataLoading = false
    },
    onSubmit() {
      this.searchAgentInfo({})
    },
    searchAgentInfo(sarchData) {
      this.tableData = []
      this.dataLoading = true
      agentSearch(sarchData).then((res) => {
        this.handleRespone(res)
      })
    },
    onLimitBtnClick(handicaps) {
      this.handicaps = JSON.parse(JSON.stringify(handicaps))
      this.limitDialogVisible = true
    },
    onCommissionRateLogBtnClick(handicaps) {
      this.rateLogDialogVisible = true
      agentCommissionRateLog({ agentId: this.agentInfo.id }).then((res) => {
        console.log(res)
      })
    },
    onRollingRateLogBtnClick(handicaps) {
      this.rateLogDialogVisible = true
      agentRollingRateLog({ agentId: this.agentInfo.id }).then((res) => {
        console.log(res)
      })
    },
    onTotalPlayerBtnClick() {
      this.dataLoading = true
      agentTotalPlayerCount({ agentId: this.agentInfo.id }).then((res) => {
        this.agentInfo.totalPlayerCount = res.totalPlayerCount
        this.dataLoading = false
      })
    },
    async onCreateBtnClick() {
      this.dataLoading = true
      const timezone = await timezoneSearch({})
      this.$refs.agentCreateDialog.setTimeZone(timezone)
      if (this.agentInfo.id === 1) {
        const currency = await currencySearch({})
        this.$refs.agentCreateDialog.setCurrency(currency)
      }
      this.form0 = JSON.parse(JSON.stringify(defaultForm0))
      this.form1 = JSON.parse(JSON.stringify(defaultForm1))
      this.dataLoading = false
      this.createDialogVisible = true
    },
    createDialogConfirmEven(data) {
      this.closeDialogEven()
      this.dataLoading = true
      agentCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.handleResponeError()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.closeDialogEven()
        this.dataLoading = true
        agentEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.handleResponeError()
        })
      }).catch(_ => {})
    },
    closeDialogEven() {
      this.createDialogVisible = false
      this.editDialogVisible = false
      this.limitDialogVisible = false
      this.rateLogDialogVisible = false
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}
        </span>
      )
    },
    handleNodeClick(data) {
      this.searchAgentInfo({ agentId: data.AgentId })
    }
  }
}
</script>

<style lang="scss" scoped>
.currencyManagement {
  &-container {
    margin: 5px;
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

.scope-content {
  margin-right: 2px;
}

.iconButton {
  padding: 0;
  background: transparent;
  color: red;
  border: none;
  font-size: 18px;
  margin-left: 0;
}

label {
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
}

.labelTitle {
  font-weight: normal;
}

.labelButton {
  padding-left: 5px;
  padding-right: 5px;
}

.labelContent {
  font-weight: bold;
}

.labelContent.enable {
  color: rgb(35, 179, 35);
}

.labelContent.disEnable {
  color: red;
}
</style>
