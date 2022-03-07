<template>
  <div class="accountManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__account')">
        <el-input v-model="searchForm.account" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__nickname')">
        <el-input v-model="searchForm.nickname" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__role')">
        <el-select v-model="searchForm.roles" multiple style="width: 300px">
          <el-option v-for="item in roles" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__agentName')">
        <el-select v-model="searchForm.agent" multiple style="width: 200px">
          <el-option v-for="item in agents" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__status')">
        <el-select v-model="searchForm.status" style="width: 120px">
          <el-option v-for="item in status" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-form-item :label="$t('__remark')">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="account" min-width="80px" :label="$t('__account')" align="center" />
      <el-table-column prop="nickname" min-width="80px" :label="$t('__nickname')" align="center" />
      <el-table-column prop="rolesNickname" min-width="80px" :label="$t('__role')" align="center" />
      <el-table-column prop="agentName" min-width="80px" :label="$t('__agentName')" align="center" />
      <el-table-column prop="time_zone.city_name" min-width="80px" :label="$t('__cityName')" align="center" />
      <el-table-column prop="statusLabel" min-width="80px" :label="$t('__status')" align="center" />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-key" @click="onPasswordResetBtnClick(scope.row)">{{ $t("__resetPassword") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="accountManagement-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChangeByClient"
    />

    <AccountManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      :roles="roles"
      :agents="agents"
      :account-status="accountStatus"
      :time-zones="timeZones"
      :has-password="false"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AccountManagementDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :roles="roles"
      :agents="agents"
      :account-status="accountStatus"
      :time-zones="timeZones"
      :has-password="true"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />

    <el-dialog :title="$t('__tip')" :visible.sync="resetDialogVisible" width="30%" :before-close="resetDialogClose">
      <span>{{ newPassword }}</span>
      <span slot="footer">
        <el-button type="primary" @click="resetDialogVisible = false">{{ $t('__confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { accountSearch, accountCreate, accountEdit, resetPassword } from '@/api/backstageManagement/accountManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AccountManagementDialog from './accountManagementDialog'
import { mapGetters } from 'vuex'

const defaultForm = {
  roles: [],
  agent: [],
  status: 'All'
}

export default {
  name: 'AccountManagement',
  components: { AccountManagementDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      selectForm: {},
      roles: [],
      agents: [],
      status: [],
      timeZones: [],
      newPassword: '',
      editDialogVisible: false,
      createDialogVisible: false,
      resetDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'accountStatus'
    ])
  },
  created() {
    this.$store.dispatch('backstageManagement/setAccountStatus')
    this.status.push({ key: 'All', nickname: '__all' })
    this.status = this.status.concat(this.accountStatus)
    this.setHeight()
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
      res.rows.forEach(element => {
        element.rolesNickname = []
        element.roles.forEach(role => {
          element.rolesNickname.push(this.roles.find((el) => role === el.key).nickname)
        })
      })
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        if (element.status === 0) {
          element.statusLabel = this.$t('__close')
        } else {
          element.statusLabel = this.$t('__open')
        }
      })
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)
      this.selectLoading = false
      this.dataLoading = false
    },
    handleResponeError() {
      this.selectLoading = false
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.selectLoading = true
      this.dataLoading = true
      data = JSON.parse(JSON.stringify(data))
      if (data.status === 'All') {
        data.status = undefined
      }
      accountSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.selectForm = JSON.parse(JSON.stringify(defaultForm))
      this.selectForm.agentId = this.agents[0].key
      this.selectForm.status = this.accountStatus[1].key
      this.selectForm.timeZone = this.timeZones[0].key
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.selectLoading = true
      this.dataLoading = true
      accountCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.handleResponeError()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.selectForm.agentId = this.selectForm.agent_id
      this.selectForm.timeZone = this.selectForm.time_zone.id
      this.createDialogVisible = false
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.editDialogVisible = false
        this.selectLoading = true
        this.dataLoading = true
        accountEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.handleResponeError()
        })
      }).catch(_ => {})
    },
    onPasswordResetBtnClick(item) {
      this.$confirm(this.$t('__confirmReset')).then(_ => {
        this.selectLoading = true
        this.dataLoading = true
        resetPassword(item).then((res) => {
          this.selectLoading = false
          this.dataLoading = false
          this.resetDialogVisible = true
          this.newPassword = this.$t('__newPassword') + ': ' + res.password
        }).catch(() => {
          this.selectLoading = false
          this.dataLoading = false
          this.$message({
            message: 'Reset failed',
            type: 'error'
          })
        })
      }).catch(_ => {})
    },
    resetDialogClose() {
      this.resetDialogVisible = false
    },
    closeDialogEven() {
      this.createDialogVisible = false
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.accountManagement {
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

.filterForm {
  padding-top: 0px;
  padding-bottom: 0px;
}

.el-form-item {
    margin-bottom: 0px;
}

.inputTitle {
  padding: 0px 0px 0px 5px;
}

.el-input {
  width: 140px;
}
</style>
