<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-form-item :label="$t('__remark')">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('__member')" align="center">
        <template slot-scope="scope">
          <span class="scope-content">{{ scope.row.name }}</span>
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
      <el-table-column prop="max_win_amount_limit" :label="$t('__maxWinAmountLimit')" align="center" />
      <el-table-column prop="max_lose_amount_limit" :label="$t('__maxLoseAmountLimit')" align="center" />
      <el-table-column prop="total_payout" :label="$t('__totalPayout')" align="center" />
      <el-table-column prop="total_valid_bet_amount" :label="$t('__totalValidBetAmount')" align="center" />
      <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
      <el-table-column prop="lastLoginAt" :label="$t('__lastLoginAt')" align="center" />
      <el-table-column :label="$t('__operate')" align="center" width="auto">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.lockLogin" :label="$t('__lockLogin')" @mousedown.native="onOperateCheckboxClick(dialogEnum.lockLogin, scope.row.id)" />
          <el-checkbox v-model="scope.row.debarBet" :label="$t('__debarBet')" @mousedown.native="onOperateCheckboxClick(dialogEnum.debarBet, scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="member-pagination"
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
      :name-label="$t('__member')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @modPassword="modPassword"
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
      :mode-type="2"
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
      :mode-type="2"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @withdrawBalance="withdrawBalance"
    />

    <MemberEditDialog
      ref="editDialog"
      :title="$t('__editMember')"
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

    <MemberEditDialog
      ref="createDialog"
      :title="$t('__addMember')"
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

    <OperateDialog
      :visible="curDialogIndex === dialogEnum.lockLogin"
      :content="'確定要改變狀態嗎?'"
      :form="editForm"
      :submit-fun="onOperateSubmitFun"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />

    <OperateDialog
      :visible="curDialogIndex === dialogEnum.debarBet"
      :content="'確定要改變狀態嗎?'"
      :form="editForm"
      :submit-fun="onOperateSubmitFun"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />
  </div>
</template>

<script>
import { memberModPassword, memberGetSetBalanceInfo, memberDepositBalance, memberWithdrawBalance, memberModStatus, memberModBetStatus } from '@/api/agentManagement/memberList'
import { timezoneSearch } from '@/api/backstageManagement/timeZoneManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import MemberEditDialog from './memberEditDialog'
import LimitDialog from '@/views/agentManagement/limitDialog'
import ModPasswordDialog from '@/views/agentManagement/modPasswordDialog'
import BalanceDialog from '@/views/agentManagement/balanceDialog'
import OperateDialog from '@/views/agentManagement/operateDialog'
import { numberFormat } from '@/utils/numberFormat'

const defaultForm = {
  name: '',
  nick_name: '',
  password: '',
  confirmPassword: '',
  time_zone: 1,
  remark: '',
  live_rolling_rate: 0,
  max_win_amount_limit: 0,
  max_lose_amount_limit: 0,
  handicaps: [],
  balance: 0,
  userPassword: '',
  wallet_type: 1,
  status: '1',
  bet_status: '1'
}

const createFormStepEnum = Object.freeze({ 'memberInfo': 0, 'rate': 1, 'limit': 2, 'balanceConfig': 3, 'confirm': 4 })
const editFormStepEnum = Object.freeze({ 'memberInfo': 0, 'rate': 1, 'limit': 2, 'confirm': 3 })

export default {
  name: 'Member',
  components: { MemberEditDialog, LimitDialog, ModPasswordDialog, BalanceDialog, OperateDialog },
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
        'depositBalance': 5,
        'withdrawBalance': 6,
        'lockLogin': 7,
        'debarBet': 8
      }),
      agentInfo: {},
      handicaps: [],
      editForm: {},
      editStepEnum: {},
      curDialogIndex: 0
    }
  },
  methods: {
    onOperateSubmitFun(data) {
      switch (this.curDialogIndex) {
        case this.dialogEnum.lockLogin: {
          return memberModStatus(data).then((res) => {
            return res
          })
        }
        case this.dialogEnum.debarBet: {
          return memberModBetStatus(data).then((res) => {
            return res
          })
        }
      }
    },
    onOperateCheckboxClick(operateType, id) {
      this.editForm = { memberId: id }
      switch (operateType) {
        case this.dialogEnum.lockLogin: {
          this.curDialogIndex = this.dialogEnum.lockLogin
          break
        }
        case this.dialogEnum.debarBet: {
          this.curDialogIndex = this.dialogEnum.debarBet
          break
        }
      }
    },
    // 父物件呼叫
    async create() {
      const timezone = await timezoneSearch({})
      this.$refs.createDialog.setTimeZone(timezone)
      this.editForm = JSON.parse(JSON.stringify(defaultForm))
      this.editStepEnum = createFormStepEnum
      this.curDialogIndex = this.dialogEnum.create
    },
    // 父物件呼叫
    setTableData(rows, agentInfo) {
      this.agentInfo = agentInfo

      this.allDataByClient = rows
      this.allDataByClient.forEach(element => {
        element.currency = element.currency.code
        element.time_zone = element.timeZone.id
        element.lockLogin = element.status === '0'
        element.debarBet = element.bet_status === '0'
      })
      this.totalCount = rows.length
      this.handlePageChangeByClient(this.currentPage)
    },
    numberFormatStr(number) {
      return numberFormat(number)
    },
    setDataLoading(dataLoading) {
      this.$emit('setDataLoading', dataLoading)
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
    onLimitBtnClick(handicaps) {
      this.handicaps = JSON.parse(JSON.stringify(handicaps))
      this.curDialogIndex = this.dialogEnum.limit
    },
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.name }
      this.curDialogIndex = this.dialogEnum.modPassword
    },
    onDepositBtnClick(rowData) {
      this.editForm = { memberId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.depositBalance
      this.$refs.depositBalanceDialog.setDialogLoading(true)
      memberGetSetBalanceInfo({ memberId: rowData.id }).then((res) => {
        this.$refs.depositBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.depositBalanceDialog.setDialogLoading(false)
      })
    },
    onWithdrawBtnClick(rowData) {
      this.editForm = { memberId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.withdrawBalance
      this.$refs.withdrawBalanceDialog.setDialogLoading(true)
      memberGetSetBalanceInfo({ memberId: rowData.id }).then((res) => {
        this.$refs.withdrawBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.withdrawBalanceDialog.setDialogLoading(false)
      })
    },
    modPassword(data) {
      memberModPassword(data).then((res) => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
      })
    },
    depositBalance(data) {
      memberDepositBalance(data).then((res) => {
        this.$refs.depositBalanceDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.depositBalanceDialog.setDialogLoading(false)
      })
    },
    withdrawBalance(data) {
      memberWithdrawBalance(data).then((res) => {
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
.member {
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
