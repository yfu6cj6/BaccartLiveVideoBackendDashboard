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
      :visible="curDialogIndex === dialogEnum.subAccountModPassword"
      :confirm="$t('__revise')"
      :name-label="$t('__member')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @modPassword="modPassword"
    />
  </div>
</template>

<script>
import { subAccountModPassword } from '@/api/agentManagement/subAccount'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import ModPasswordDialog from '@/views/agentManagement/modPasswordDialog'
import { numberFormat } from '@/utils/numberFormat'

const createFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'balanceConfig': 3, 'confirm': 4 })
const editFormStepEnum = Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'confirm': 3 })

export default {
  name: 'SubAccount',
  components: { ModPasswordDialog },
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
        'subAccountCreate': 1,
        'subAccountEdit': 2,
        'subAccountModPassword': 3
      }),
      agentInfo: {},
      editForm: {},
      editStepEnum: {},
      curDialogIndex: 0
    }
  },
  methods: {
    // 父物件呼叫
    subAccountCreate() {
      this.editForm = {}
      this.editStepEnum = createFormStepEnum
      this.curDialogIndex = this.dialogEnum.memberCreate
    },
    // 父物件呼叫
    setSubAccountTableData(rows, agentInfo) {
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
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.name }
      this.curDialogIndex = this.dialogEnum.subAccountModPassword
    },
    modPassword(data) {
      subAccountModPassword(data).then((res) => {
        this.$refs.memberModPasswordDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.memberModPasswordDialog.setDialogLoading(false)
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
