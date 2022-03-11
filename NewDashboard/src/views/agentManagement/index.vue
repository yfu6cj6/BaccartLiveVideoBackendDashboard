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
          <label class="labelTitle">{{ $t('__balance') + ':' }}
            <span class="labelContent">{{ agentInfo.balance }}</span>
          </label>
          <label>
            <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(agentInfo.handicaps)">
              {{ $t("__limit") }}
            </el-button>
          </label>
          <br>
          <label class="labelTitle">{{ $t('__commissionRate') + ':' }}
            <span class="labelContent">{{ numberFormatStr(agentInfo.commission_rate) + '%' }}</span>
          </label>
          <label class="labelTitle">{{ $t('__rollingRate') + ':' }}
            <span class="labelContent">{{ numberFormatStr(agentInfo.rolling_rate) + '%' }}</span>
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
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onAddSubAgentBtnClick()">{{ $t("__agent") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onAddSubAgentBtnClick()">{{ $t("__player") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onAddSubAgentBtnClick()">{{ $t("__subAccount") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onAddSubAgentBtnClick()">{{ $t("__addSubAgent") }}</el-button>
        <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
          <el-table-column :label="$t('__agent')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ scope.row.fullName }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-setting" @click="onEditBtnClick(scope.row)" />
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-unlock" @click="onModPasswordBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="currency" :label="$t('__currency')" align="center" />
          <el-table-column :label="$t('__balance')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ scope.row.balance }}</span>
              <el-button class="labelButton" type="primary" size="mini" @click="onDepositBtnClick(scope.row)">{{ $t("__deposit") }}</el-button>
              <el-button class="labelButton labelWithdrawButton" type="primary" size="mini" @click="onWithdrawBtnClick(scope.row)">{{ $t("__withdraw") }}</el-button>
            </template>
          </el-table-column>
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
              <span class="scope-content">{{ numberFormatStr(scope.row.commission_rate) + '%' }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-tickets" @click="onCommissionRateLogBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('__rollingRate')" align="center">
            <template slot-scope="scope">
              <span class="scope-content">{{ numberFormatStr(scope.row.rolling_rate) + '%' }}</span>
              <el-button class="iconButton" type="primary" size="mini" icon="el-icon-tickets" @click="onRollingRateLogBtnClick(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
          <el-table-column prop="lastLoginAt" :label="$t('__lastLoginAt')" align="center" />
          <el-table-column :label="$t('__operate')" align="center" width="auto">
            <span>123</span>
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

    <AgentModPasswordDialog
      :title="$t('__modPassword')"
      :visible="curDialogIndex === dialogEnum.modPassword"
      :confirm="$t('__revise')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentRateLogDialog
      :title="$t('__commissionRate')"
      :visible="curDialogIndex === dialogEnum.commissionRate"
      :list-data="rateData"
      :operation-type="1"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentRateLogDialog
      :title="$t('__rollingRate')"
      :visible="curDialogIndex === dialogEnum.rollingRate"
      :list-data="rateData"
      :operation-type="2"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentLimitDialog
      :title="$t('__limit')"
      :visible="curDialogIndex === dialogEnum.limit"
      :handicaps="handicaps"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <AgentBalanceDialog
      :title="$t('__depositBalance')"
      :visible="curDialogIndex === dialogEnum.depositBalance"
      :confirm="$t('__confirm')"
      :form="editForm"
      :operation-type="1"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentBalanceDialog
      :title="$t('__withdrawBalance')"
      :visible="curDialogIndex === dialogEnum.withdrawBalance"
      :confirm="$t('__confirm')"
      :form="editForm"
      :operation-type="2"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentEditDialog
      ref="agentEditDialog"
      :title="$t('__edit')"
      :visible="curDialogIndex === dialogEnum.edit"
      :operation-type="2"
      :agent-info="agentInfo"
      :confirm="$t('__revise')"
      :form="editForm"
      :step-enum="editStepEnum"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />

    <AgentEditDialog
      ref="agentCreateDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :operation-type="1"
      :agent-info="agentInfo"
      :confirm="$t('__confirm')"
      :form="editForm"
      :step-enum="editStepEnum"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="agentEditDialogEditSuccess"
    />
  </div>
</template>

<script>
import { agentSearch, agentTotalPlayerCount, agentCommissionRateLog, agentRollingRateLog } from '@/api/agentManagement/agentList'
import { timezoneSearch } from '@/api/backstageManagement/timeZoneManagement'
import { currencySearch } from '@/api/backstageManagement/currencyManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AgentEditDialog from './agentEditDialog'
import AgentModPasswordDialog from './agentModPasswordDialog'
import AgentLimitDialog from './agentLimitDialog'
import AgentRateLogDialog from './agentRateLogDialog'
import AgentBalanceDialog from './agentBalanceDialog'
import { mapGetters } from 'vuex'
import { numberFormat } from '@/utils/numberFormat'

const defaultForm = {
  parent: 0,
  account: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  time_zone: 1,
  currency: 1,
  remark: '',
  commission_rate: 0,
  rolling_rate: 0,
  handicaps: [],
  balance: 0,
  userPassword: '',
  wallet_type: 1,
  status: '1',
  bet_status: '1'
}

const createFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'balanceConfig': 3, 'confirm': 4 })
const editFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'confirm': 3 })

export default {
  name: 'AgentManagement',
  components: { AgentEditDialog, AgentModPasswordDialog, AgentLimitDialog, AgentRateLogDialog, AgentBalanceDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      dialogEnum: Object.freeze({ 'none': 0, 'create': 1, 'edit': 2, 'modPassword': 3, 'limit': 4, 'commissionRate': 5, 'rollingRate': 6, 'depositBalance': 7, 'withdrawBalance': 8 }),
      agentLevel: [],
      agentInfo: {},
      handicaps: [],
      editForm: JSON.parse(JSON.stringify(defaultForm)),
      editStepEnum: {},
      rateData: [],
      curDialogIndex: 0,
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
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    numberFormatStr(number) {
      return numberFormat(number)
    },
    handleRespone(res) {
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.fullName = element.nickname + '(' + element.account + ')'
        element.currency = element.currency.code
        element.time_zone = element.timeZone.id
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
      this.curDialogIndex = this.dialogEnum.limit
    },
    onCommissionRateLogBtnClick(rowData) {
      this.dataLoading = true
      agentCommissionRateLog({ agentId: rowData.id }).then((res) => {
        this.curDialogIndex = this.dialogEnum.commissionRate
        this.rateData = res.rows
        this.dataLoading = false
      })
    },
    onRollingRateLogBtnClick(rowData) {
      this.dataLoading = true
      agentRollingRateLog({ agentId: rowData.id }).then((res) => {
        this.curDialogIndex = this.dialogEnum.rollingRate
        this.rateData = res.rows
        this.dataLoading = false
      })
    },
    onTotalPlayerBtnClick() {
      this.dataLoading = true
      agentTotalPlayerCount({ agentId: this.agentInfo.id }).then((res) => {
        this.agentInfo.totalPlayerCount = res.totalPlayerCount
        this.dataLoading = false
      })
    },
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.fullName }
      this.curDialogIndex = this.dialogEnum.modPassword
    },
    onDepositBtnClick(rowData) {
      this.editForm = { agentId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.depositBalance
    },
    onWithdrawBtnClick(rowData) {
      this.editForm = { agentId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.withdrawBalance
    },
    async onAddSubAgentBtnClick() {
      this.dataLoading = true
      const timezone = await timezoneSearch({})
      this.$refs.agentCreateDialog.setTimeZone(timezone)
      if (this.agentInfo.id === 1) {
        const currency = await currencySearch({})
        this.$refs.agentCreateDialog.setCurrency(currency)
      }
      this.editForm = JSON.parse(JSON.stringify(defaultForm))
      this.dataLoading = false
      this.editStepEnum = createFormStepEnum
      this.curDialogIndex = this.dialogEnum.create
    },
    async onEditBtnClick(rowData) {
      this.dataLoading = true
      const timezone = await timezoneSearch({})
      this.$refs.agentEditDialog.setTimeZone(timezone)

      this.editForm = JSON.parse(JSON.stringify(rowData))
      this.dataLoading = false
      this.editStepEnum = editFormStepEnum
      this.curDialogIndex = this.dialogEnum.edit
    },
    agentEditDialogEditSuccess(res) {
      this.closeDialogEven()
      this.handleRespone(res)
    },
    closeDialogEven() {
      this.curDialogIndex = this.dialogEnum.none
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

.labelWithdrawButton {
  margin-left: 5px;
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
