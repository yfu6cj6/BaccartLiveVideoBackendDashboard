<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="onSubmit()">{{ $t("__refresh") }}</el-button>
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
        <el-button type="primary" icon="el-icon-search" @click="onSubmit()">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :height="viewHeight">
      <el-table-column prop="account" :label="$t('__account')" align="center" />
      <el-table-column prop="nickname" :label="$t('__nickname')" align="center" />
      <el-table-column prop="rolesNickname" :label="$t('__role')" align="center" />
      <el-table-column prop="agentName" :label="$t('__agentName')" align="center" />
      <el-table-column prop="time_zone.city_name" :label="$t('__cityName')" align="center" />
      <el-table-column prop="statusLabel" width="80" :label="$t('__status')" align="center" />
      <el-table-column :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="permissionManagement-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
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
  </div>
</template>

<script>
import { accountSearch, accountCreate, accountEdit } from '@/api/backstageManagement/accountManagement'
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
      editDialogVisible: false,
      createDialogVisible: false
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
    handleResponeError(err) {
      this.selectLoading = false
      this.dataLoading = false
      if (err.data.code !== 401) {
        const { account, password, nickname } = err.data.message
        const log = () => {
          if (account !== undefined) {
            return account[0]
          } else if (password !== undefined) {
            return password[0]
          } else if (nickname !== undefined) {
            return nickname[0]
          } else {
            return 'Create failed'
          }
        }
        this.$message({
          message: log(),
          type: 'error'
        })
      }
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
      if (data.roles && data.roles.length === 0) {
        data.roles = undefined
      }
      if (data.agent && data.agent.length === 0) {
        data.agent = undefined
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
      }).catch((err) => {
        this.handleResponeError(err)
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
        }).catch((err) => {
          this.handleResponeError(err)
        })
      }).catch(_ => {})
    },
    closeDialogEven() {
      this.createDialogVisible = false
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.permissionManagement {
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
