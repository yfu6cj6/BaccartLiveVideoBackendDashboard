<template>
  <div>
    <el-table :data="tableData" border :max-height="viewHeight">
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
      <el-table-column :label="$t('__limit')" align="center">
        <template slot-scope="scope">
          <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(scope.row.handicaps)">{{ $t("__limit") }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="max_win_amount_limit" :label="$t('__maxWinAmountLimit')" align="center" />
      <el-table-column prop="max_lose_amount_limit" :label="$t('__maxLoseAmountLimit')" align="center" />
      <el-table-column prop="total_payout" :label="$t('__totalPayout')" align="center" />
      <el-table-column prop="total_valid_bet_amount" :label="$t('__totalValidBetAmount')" align="center" />
      <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
      <el-table-column prop="lastLoginAt" :label="$t('__lastLoginAt')" align="center" />
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
      ref="memberModPasswordDialog"
      :title="$t('__modPassword')"
      :visible="curDialogIndex === dialogEnum.memberModPassword"
      :confirm="$t('__revise')"
      :name-label="$t('__member')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @modPassword="modPassword"
    />

    <LimitDialog
      :title="$t('__limit')"
      :visible="curDialogIndex === dialogEnum.memberLimit"
      :handicaps="handicaps"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />

    <BalanceDialog
      ref="memberDepositBalanceDialog"
      :title="$t('__depositBalance')"
      :visible="curDialogIndex === dialogEnum.memberDepositBalance"
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
      ref="memberWithdrawBalanceDialog"
      :title="$t('__withdrawBalance')"
      :visible="curDialogIndex === dialogEnum.memberWithdrawBalance"
      :confirm="$t('__confirm')"
      :form="editForm"
      :operation-type="2"
      :mode-type="2"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @withdrawBalance="withdrawBalance"
    />
  </div>
</template>

<script>
import { memberModPassword, memberGetSetBalanceInfo, memberDepositBalance, memberWithdrawBalance } from '@/api/agentManagement/memberList'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import LimitDialog from '@/views/agentManagement/limitDialog'
import ModPasswordDialog from '@/views/agentManagement/modPasswordDialog'
import BalanceDialog from '@/views/agentManagement/balanceDialog'
import { numberFormat } from '@/utils/numberFormat'

const createFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'balanceConfig': 3, 'confirm': 4 })
const editFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'confirm': 3 })

export default {
  name: 'Member',
  components: { LimitDialog, ModPasswordDialog, BalanceDialog },
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
        'memberCreate': 1,
        'memberEdit': 2,
        'memberModPassword': 3,
        'memberLimit': 4,
        'memberDepositBalance': 5,
        'memberWithdrawBalance': 6
      }),
      agentInfo: {},
      handicaps: [],
      editForm: {},
      editStepEnum: {},
      curDialogIndex: 0
    }
  },
  methods: {
    // 父物件呼叫
    memberCreate() {
      this.editForm = {}
      this.editStepEnum = createFormStepEnum
      this.curDialogIndex = this.dialogEnum.memberCreate
    },
    // 父物件呼叫
    setMemberTableData(rows, agentInfo) {
      this.agentInfo = agentInfo

      this.allDataByClient = rows
      this.allDataByClient.forEach(element => {
        element.currency = element.currency.code
        element.time_zone = element.timeZone.id
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
    onEditBtnClick(rowData) {
      this.setDataLoading(true)
      this.editForm = JSON.parse(JSON.stringify(rowData))
      this.editStepEnum = editFormStepEnum
      this.curDialogIndex = this.dialogEnum.memberEdit
      this.setDataLoading(false)
    },
    onLimitBtnClick(handicaps) {
      this.handicaps = JSON.parse(JSON.stringify(handicaps))
      this.curDialogIndex = this.dialogEnum.memberLimit
    },
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.name }
      this.curDialogIndex = this.dialogEnum.memberModPassword
    },
    onDepositBtnClick(rowData) {
      this.editForm = { memberId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.memberDepositBalance
      this.$refs.memberDepositBalanceDialog.setDialogLoading(true)
      memberGetSetBalanceInfo({ memberId: rowData.id }).then((res) => {
        this.$refs.memberDepositBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.memberDepositBalanceDialog.setDialogLoading(false)
      })
    },
    onWithdrawBtnClick(rowData) {
      this.editForm = { memberId: rowData.id, amount: this.numberFormatStr(0) }
      this.curDialogIndex = this.dialogEnum.memberWithdrawBalance
      this.$refs.memberWithdrawBalanceDialog.setDialogLoading(true)
      memberGetSetBalanceInfo({ memberId: rowData.id }).then((res) => {
        this.$refs.memberWithdrawBalanceDialog.setBalanceInfo(res.rows)
        this.$refs.memberWithdrawBalanceDialog.setDialogLoading(false)
      })
    },
    modPassword(data) {
      memberModPassword(data).then((res) => {
        this.$refs.memberModPasswordDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.memberModPasswordDialog.setDialogLoading(false)
      })
    },
    depositBalance(data) {
      memberDepositBalance(data).then((res) => {
        this.$refs.memberDepositBalanceDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.memberDepositBalanceDialog.setDialogLoading(false)
      })
    },
    withdrawBalance(data) {
      memberWithdrawBalance(data).then((res) => {
        this.$refs.memberWithdrawBalanceDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.memberWithdrawBalanceDialog.setDialogLoading(false)
      })
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
