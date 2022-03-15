<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight">
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
      <el-table-column :label="$t('_handicapLimit')" align="center">
        <template slot-scope="scope">
          <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(scope.row.handicaps)">{{ $t("_handicapLimit") }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="directAgentCount" :label="$t('__directAgentCount')" align="center" />
      <el-table-column prop="directPlayerCount" :label="$t('__directPlayerCount')" align="center" />
      <el-table-column :label="$t('__liveCommissionRate')" align="center">
        <template slot-scope="scope">
          <span class="scope-content">{{ numberFormatStr(scope.row.live_commission_rate) + '%' }}</span>
          <el-button class="iconButton" type="primary" size="mini" icon="el-icon-tickets" @click="onCommissionRateLogBtnClick(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('__liveRollingRate')" align="center">
        <template slot-scope="scope">
          <span class="scope-content">{{ numberFormatStr(scope.row.live_rolling_rate) + '%' }}</span>
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
      class="agent-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChangeByClient"
    />

    <ModPasswordDialog
      ref="modPasswordDialog"
      :title="$t('__modPassword')"
      :visible="curDialogIndex === dialogEnum.modPassword"
      :confirm="$t('__revise')"
      :name-label="$t('__agent')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @modPassword="modPassword"
    />

    <AgentRateLogDialog
      :title="$t('__liveCommissionRate')"
      :visible="curDialogIndex === dialogEnum.liveCommissionRate"
      :list-data="rateData"
      :operation-type="1"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <AgentRateLogDialog
      :title="$t('__liveRollingRate')"
      :visible="curDialogIndex === dialogEnum.liveRollingRate"
      :list-data="rateData"
      :operation-type="2"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <LimitDialog
      :title="$t('_handicapLimit')"
      :visible="curDialogIndex === dialogEnum.limit"
      :handicaps="handicaps"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <BalanceDialog
      ref="depositBalanceDialog"
      :title="$t('__depositBalance')"
      :visible="curDialogIndex === dialogEnum.depositBalance"
      :confirm="$t('__confirm')"
      :form="editForm"
      :operation-type="1"
      :mode-type="1"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @depositBalance="depositBalance"
    />

    <BalanceDialog
      ref="withdrawBalanceDialog"
      :title="$t('__withdrawBalance')"
      :visible="curDialogIndex === dialogEnum.withdrawBalance"
      :confirm="$t('__confirm')"
      :form="editForm"
      :operation-type="2"
      :mode-type="1"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @withdrawBalance="withdrawBalance"
    />

    <AgentEditDialog
      ref="editDialog"
      :title="$t('__editSubAgent')"
      :visible="curDialogIndex === dialogEnum.edit"
      :operation-type="2"
      :agent-info="agentInfo"
      :confirm="$t('__revise')"
      :form="editForm"
      :step-enum="editStepEnum"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />

    <AgentEditDialog
      ref="createDialog"
      :title="$t('__addSubAgent')"
      :visible="curDialogIndex === dialogEnum.create"
      :operation-type="1"
      :agent-info="agentInfo"
      :confirm="$t('__confirm')"
      :form="editForm"
      :step-enum="editStepEnum"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />
  </div>
</template>

<script>
import { agentSearch, agentCommissionRateLog, agentRollingRateLog, agentModPassword, agentGetSetBalanceInfo, agentDepositBalance, agentWithdrawBalance } from '@/api/agentManagement/agentList'
import { timezoneSearch } from '@/api/backstageManagement/timeZoneManagement'
import { currencySearch } from '@/api/backstageManagement/currencyManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import AgentEditDialog from './agentEditDialog'
import ModPasswordDialog from '@/views/agentManagement/modPasswordDialog'
import LimitDialog from '@/views/agentManagement/limitDialog'
import AgentRateLogDialog from './agentRateLogDialog'
import BalanceDialog from '@/views/agentManagement/balanceDialog'
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
  live_commission_rate: 0,
  live_rolling_rate: 0,
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
  name: 'Agent',
  components: { AgentEditDialog, ModPasswordDialog, LimitDialog, AgentRateLogDialog, BalanceDialog },
  mixins: [handlePageChange, shared],
  props: {
    'viewHeight': {
      type: Number,
      require: true,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2,
        'modPassword': 3,
        'limit': 4,
        'liveCommissionRate': 5,
        'liveRollingRate': 6,
        'depositBalance': 7,
        'withdrawBalance': 8
      }),
      handicaps: [],
      agentInfo: {},
      editForm: {},
      editStepEnum: {},
      rateData: [],
      curDialogIndex: 0
    }
  },
  methods: {
    // 父物件呼叫
    async create() {
      const timezone = await timezoneSearch({})
      this.$refs.createDialog.setTimeZone(timezone)
      if (this.agentInfo.id === 1) {
        const currency = await currencySearch({})
        this.$refs.createDialog.setCurrency(currency)
      }
      this.editForm = JSON.parse(JSON.stringify(defaultForm))
      this.editStepEnum = createFormStepEnum
      this.curDialogIndex = this.dialogEnum.create
    },
    // 父物件呼叫
    setTableData(rows, agentInfo) {
      this.agentInfo = agentInfo

      this.allDataByClient = rows
      this.allDataByClient.forEach(element => {
        element.fullName = element.nickname + '(' + element.account + ')'
        element.currency = element.currency.code
        element.time_zone = element.timeZone.id
      })
      this.totalCount = rows.length
      this.handlePageChangeByClient(this.currentPage)
    },
    setDataLoading(dataLoading) {
      this.$emit('setDataLoading', dataLoading)
    },
    numberFormatStr(number) {
      return numberFormat(number)
    },
    onSubmit() {
      this.searchAgentInfo({})
    },
    searchAgentInfo(sarchData) {
      this.setDataLoading(true)
      agentSearch(sarchData).then((res) => {
        this.$emit('serverResponse', res)
      })
    },
    onLimitBtnClick(handicaps) {
      this.handicaps = JSON.parse(JSON.stringify(handicaps))
      this.curDialogIndex = this.dialogEnum.limit
    },
    onCommissionRateLogBtnClick(rowData) {
      this.setDataLoading(true)
      agentCommissionRateLog({ agentId: rowData.id, cate: 'live' }).then((res) => {
        this.curDialogIndex = this.dialogEnum.liveCommissionRate
        this.rateData = res.rows
        this.setDataLoading(false)
      })
    },
    onRollingRateLogBtnClick(rowData) {
      this.setDataLoading(true)
      agentRollingRateLog({ agentId: rowData.id, cate: 'live' }).then((res) => {
        this.curDialogIndex = this.dialogEnum.liveRollingRate
        this.rateData = res.rows
        this.setDataLoading(false)
      })
    },
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.fullName }
      this.curDialogIndex = this.dialogEnum.modPassword
    },
    onDepositBtnClick(rowData) {
      this.editForm = { agentId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.depositBalance
      this.$refs.depositBalanceDialog.setDialogLoading(true)
      agentGetSetBalanceInfo({ agentId: rowData.id }).then((res) => {
        this.$refs.depositBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.depositBalanceDialog.setDialogLoading(false)
      })
    },
    onWithdrawBtnClick(rowData) {
      this.editForm = { agentId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.withdrawBalance
      this.$refs.withdrawBalanceDialog.setDialogLoading(true)
      agentGetSetBalanceInfo({ agentId: rowData.id }).then((res) => {
        this.$refs.withdrawBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.withdrawBalanceDialog.setDialogLoading(false)
      })
    },
    async onEditBtnClick(rowData) {
      this.setDataLoading(true)
      const timezone = await timezoneSearch({})
      this.$refs.editDialog.setTimeZone(timezone)

      this.editForm = JSON.parse(JSON.stringify(rowData))
      this.editStepEnum = editFormStepEnum
      this.curDialogIndex = this.dialogEnum.edit
      this.setDataLoading(false)
    },
    modPassword(data) {
      agentModPassword(data).then((res) => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
      })
    },
    depositBalance(data) {
      agentDepositBalance(data).then((res) => {
        this.$refs.depositBalanceDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.depositBalanceDialog.setDialogLoading(false)
      })
    },
    withdrawBalance(data) {
      agentWithdrawBalance(data).then((res) => {
        this.$refs.withdrawBalanceDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.withdrawBalanceDialog.setDialogLoading(false)
      })
    },
    editSuccess(res) {
      this.$emit('serverResponse', res)
      this.closeDialogEven()
    },
    closeDialogEven() {
      this.curDialogIndex = this.dialogEnum.none
    }
  }
}
</script>

<style lang="scss" scoped>
.agent {
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

.labelButton {
  padding-left: 5px;
  padding-right: 5px;
}

.labelWithdrawButton {
  margin-left: 5px;
}
</style>
