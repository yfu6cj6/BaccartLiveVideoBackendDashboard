<template>
  <div v-loading="dataLoading" class="view-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.account" :placeholder="$t('__account')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.nickname" :placeholder="$t('__nickname')" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.roles" multiple filterable :placeholder="$t('__role')">
          <el-option v-for="item in roles" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.agent" multiple filterable :placeholder="$t('__agentName')">
          <el-option v-for="item in agents" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" multiple filterable :placeholder="$t('__accountStatus')">
          <el-option v-for="item in accountStatusType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" size="mini" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" size="mini" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

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
      <el-table-column prop="account" min-width="80px" :label="$t('__account')" align="center" sortable />
      <el-table-column prop="nickname" min-width="80px" :label="$t('__nickname')" align="center" sortable />
      <el-table-column :label="$t('__role')" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.rolesNickname" :key="index">{{ item + ((index + 1 === scope.row.rolesNickname.length) ? '' : '、') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentName" min-width="80px" :label="$t('__agentName')" align="center" sortable />
      <el-table-column prop="time_zone.cityName" min-width="80px" :label="$t('__cityName')" align="center" sortable />
      <el-table-column prop="statusLabel" min-width="80px" :label="$t('__accountStatus')" align="center" sortable />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="danger" size="mini" @click="onPasswordResetBtnClick(scope.row)">{{ $t("__resetPassword") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper, sizes"
      class="pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handlePageChangeByClient"
    />

    <editDialog
      ref="editDialog"
      :title="`${$t('__edit')} [${selectForm.account}]`"
      :visible="curDialogIndex === dialogEnum.edit"
      :confirm="$t('__revise')"
      :form="selectForm"
      :roles="roles"
      :agents="agents"
      :account-status-type="accountStatusType"
      :time-zones="timeZones"
      :has-password="false"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :roles="roles"
      :agents="agents"
      :account-status-type="accountStatusType"
      :time-zones="timeZones"
      :has-password="true"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />

    <resetPasswordDialog
      ref="resetDialog"
      :title="$t('__tip')"
      :visible="curDialogIndex === dialogEnum.reset"
      :confirm="$t('__confirm')"
      :form="selectForm"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { accountSearch, accountCreate, accountEdit, resetPassword } from '@/api/backstageManagement/accountManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import EditDialog from './editDialog'
import ResetPasswordDialog from './resetPasswordDialog'
import { mapGetters } from 'vuex'

const defaultForm = {
  roles: [],
  agent: []
}

export default {
  name: 'AccountManagement',
  components: { EditDialog, ResetPasswordDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2,
        'reset': 3
      }),
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      selectForm: {},
      roles: [],
      agents: [],
      timeZones: [],
      curDialogIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType'
    ])
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = JSON.parse(JSON.stringify(defaultForm))
    },
    handleRespone(res) {
      this.roles = res.roles
      this.agents = res.agents
      this.timeZones = res.timeZones
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.rolesNickname = []
        element.roles.forEach(elRole => {
          const roleObj = this.roles.find((role) => elRole === role.key)
          if (roleObj) {
            element.rolesNickname.push(roleObj.nickname)
          }
        })
        const statusNickname = this.accountStatusType.find(statusType => statusType.key === element.status).nickname
        element.statusLabel = this.$t(statusNickname)
      })
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)

      this.closeDialogEven()
      this.closeLoading()
    },
    closeLoading() {
      this.$refs.createDialog.setDialogLoading(false)
      this.$refs.editDialog.setDialogLoading(false)
      this.$refs.resetDialog.setDialogLoading(false)
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.dataLoading = true
      accountSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = JSON.parse(JSON.stringify(defaultForm))
      this.selectForm.agentId = this.agents[0].key
      this.selectForm.status = this.accountStatusType[1].key
      this.selectForm.timeZone = this.timeZones[0].key
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      accountCreate(data).then((res) => {
        this.handleRespone(res)
        this.selectForm = { account: data.account, newPassword: data.password }
        this.curDialogIndex = this.dialogEnum.reset
      }).catch(() => {
        this.closeLoading()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.selectForm.agentId = this.selectForm.agent_id
      this.selectForm.timeZone = this.selectForm.time_zone.key
      this.curDialogIndex = this.dialogEnum.edit
    },
    editDialogConfirmEven(data) {
      this.$confirm(`${this.$t('__confirmChanges')}?`).then(_ => {
        this.$refs.editDialog.setDialogLoading(true)
        accountEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(_ => {})
    },
    onPasswordResetBtnClick(item) {
      this.$confirm(`${this.$t('__confirmReset')}${this.$t('__account')}:${item.account} ${this.$t('__of')}${this.$t('__password')}?`).then(_ => {
        this.selectForm = { account: item.account }
        this.$refs.resetDialog.setDialogLoading(true)
        resetPassword(item).then((res) => {
          this.selectForm.newPassword = res.password
          this.curDialogIndex = this.dialogEnum.reset
          this.dataLoading = false
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(_ => {})
    },
    closeDialogEven() {
      this.curDialogIndex = this.dialogEnum.none
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container .el-form .el-form-item .el-input {
  width: 160px;
}

.el-select {
  width: 190px;
}
</style>
