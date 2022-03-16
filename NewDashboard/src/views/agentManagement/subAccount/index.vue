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
      <el-table-column prop="agent.nickname" :label="$t('__mainAccount')" align="center" />
      <el-table-column :label="$t('__subAccount')" align="center">
        <template slot-scope="scope">
          <span class="scope-content">{{ scope.row.fullName }}</span>
          <el-button class="iconButton" type="primary" size="mini" icon="el-icon-setting" @click="onEditBtnClick(scope.row)" />
          <el-button class="iconButton" type="primary" size="mini" icon="el-icon-unlock" @click="onModPasswordBtnClick(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="statusLabel" :label="$t('__accountStatus')" align="center" />
      <el-table-column :label="$t('__role')" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.rolesLabel" :key="index" :class="{'role-admin':scope.row.roles[index]==='AgentSubAccountAdmin', 'role-visitor':scope.row.roles[index]==='AgentSubAccount'}">{{ item + ((index + 1 === scope.row.rolesLabel.length) ? '' : '、') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" :label="$t('__creator')" align="center" />
      <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
      <el-table-column prop="lastLoginAt" :label="$t('__lastLoginAt')" align="center" />
      <el-table-column prop="lastLoginIp" :label="$t('__lastLoginIP')" align="center" />
      <el-table-column :label="$t('__operate')" align="center" width="auto">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.lockLogin" :label="$t('__lockLogin')" @mousedown.native="onOperateCheckboxClick(dialogEnum.lockLogin, scope.row.id)" />
          <el-checkbox v-model="scope.row.allPermission" :label="$t('__allPermission')" @mousedown.native="onOperateCheckboxClick(dialogEnum.effectAgentLine, scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="subAccount-pagination"
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
      :name-label="$t('__subAccount')"
      :form="editForm"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @modPassword="modPassword"
    />

    <SubAccountEditDialog
      ref="editDialog"
      :title="$t('__editSubAccount')"
      :visible="curDialogIndex === dialogEnum.edit"
      :operation-type="2"
      :confirm="$t('__revise')"
      :agent-info="agentInfo"
      :form="editForm"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />

    <SubAccountEditDialog
      ref="createDialog"
      :title="$t('__addSubAccount')"
      :visible="curDialogIndex === dialogEnum.create"
      :operation-type="1"
      :confirm="$t('__confirm')"
      :agent-info="agentInfo"
      :form="editForm"
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
      :visible="curDialogIndex === dialogEnum.effectAgentLine"
      :content="'確定要改變狀態嗎?'"
      :form="editForm"
      :submit-fun="onOperateSubmitFun"
      @close="closeDialogEven"
      @editSuccess="editSuccess"
    />
  </div>
</template>

<script>
import { subAccountModPassword, subAccountModStatus, subAccountModEffectAgentLine } from '@/api/agentManagement/subAccount'
import { timezoneSearch } from '@/api/backstageManagement/timeZoneManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import SubAccountEditDialog from './subAccountEditDialog'
import ModPasswordDialog from '@/views/agentManagement/modPasswordDialog'
import OperateDialog from '@/views/agentManagement/operateDialog'
import { mapGetters } from 'vuex'

const defaultForm = {
  account: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  status: '1',
  timeZone: 1,
  effectAgentLine: false,
  isAdmin: false,
  remark: '',
  userPassword: ''
}

export default {
  name: 'Member',
  components: { SubAccountEditDialog, ModPasswordDialog, OperateDialog },
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
        'lockLogin': 7,
        'effectAgentLine': 8
      }),
      agentInfo: {},
      editForm: {},
      curDialogIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType',
      'roles'
    ])
  },
  methods: {
    onOperateSubmitFun(data) {
      switch (this.curDialogIndex) {
        case this.dialogEnum.lockLogin: {
          return subAccountModStatus(data).then((res) => {
            return res
          })
        }
        case this.dialogEnum.effectAgentLine: {
          return subAccountModEffectAgentLine(data).then((res) => {
            return res
          })
        }
      }
    },
    onOperateCheckboxClick(operateType, id) {
      this.editForm = { id: id }
      switch (operateType) {
        case this.dialogEnum.lockLogin: {
          this.curDialogIndex = this.dialogEnum.lockLogin
          break
        }
        case this.dialogEnum.effectAgentLine: {
          this.curDialogIndex = this.dialogEnum.effectAgentLine
          break
        }
      }
    },
    // 父物件呼叫
    async create() {
      const timezone = await timezoneSearch({})
      this.$refs.createDialog.setTimeZone(timezone)
      this.editForm = JSON.parse(JSON.stringify(defaultForm))
      this.curDialogIndex = this.dialogEnum.create
    },
    // 父物件呼叫
    setTableData(rows, agentInfo) {
      this.agentInfo = agentInfo

      this.allDataByClient = rows
      this.allDataByClient.forEach(element => {
        element.fullName = element.nickname + '(' + element.account + ')'
        const statusNickname = this.accountStatusType.find(statusType => statusType.key === element.status).nickname
        element.statusLabel = this.$t(statusNickname)
        const newRoles = []
        element.roles.forEach(role => {
          const roleNickname = this.roles.find(item => item.key === role).nickname
          newRoles.push(this.$t(roleNickname))
        })
        element.rolesLabel = newRoles
        element.lockLogin = element.status === '0'
        element.allPermission = element.effectAgentLine === '1'
      })
      this.totalCount = rows.length
      this.handlePageChangeByClient(this.currentPage)
    },
    setDataLoading(dataLoading) {
      this.$emit('setDataLoading', dataLoading)
    },
    async onEditBtnClick(rowData) {
      this.setDataLoading(true)
      const timezone = await timezoneSearch({})
      this.$refs.editDialog.setTimeZone(timezone)

      this.editForm = JSON.parse(JSON.stringify(rowData))
      this.editForm.effectAgentLine = this.editForm.effectAgentLine === '1'
      this.editForm.isAdmin = this.editForm.isAdmin === '1'
      this.editForm.timeZone = this.editForm.timeZone.id
      this.curDialogIndex = this.dialogEnum.edit
      this.setDataLoading(false)
    },
    onModPasswordBtnClick(rowData) {
      this.editForm = { id: rowData.id, fullName: rowData.fullName }
      this.curDialogIndex = this.dialogEnum.modPassword
    },
    modPassword(data) {
      subAccountModPassword(data).then((res) => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
        this.$emit('serverResponse', res)
        this.closeDialogEven()
      }).catch(() => {
        this.$refs.modPasswordDialog.setDialogLoading(false)
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
.subAccount {
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

.role-admin {
  color: red;
  font-weight: bolder;
}

.role-visitor {
  color: blue;
  font-weight: bolder;
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
