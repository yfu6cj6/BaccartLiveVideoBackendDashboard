<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item class="inputTitle" :label="$t('__account')">
        <el-input v-model="searchForm.account" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__nickname')">
        <el-input v-model="searchForm.nickname" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__role')">
        <el-select v-model="searchForm.role" multiple style="width: 300px">
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
      <el-table-column prop="roles" :label="$t('__role')" align="center" />
      <el-table-column prop="agentName" :label="$t('__agentName')" align="center" />
      <el-table-column prop="time_zone.city_name" :label="$t('__cityName')" align="center" />
      <el-table-column prop="status" width="80" :label="$t('__status')" align="center" />
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
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AccountManagementDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :confirm="$t('__confirm')"
      :form="selectForm"
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

const defaultForm = {
  role: [],
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
      status: [{
        key: 'All',
        nickname: '__all'
      },
      {
        key: 0,
        nickname: '__close'
      },
      {
        key: 1,
        nickname: '__open'
      }],
      editDialogVisible: false,
      createDialogVisible: false
    }
  },
  computed: {
  },
  created() {
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = JSON.parse(JSON.stringify(defaultForm))
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
      if (data.role && data.role.length === 0) {
        data.role = undefined
      }
      if (data.agent && data.agent.length === 0) {
        data.agent = undefined
      }
      console.log(JSON.stringify(data))
      accountSearch(data).then((res) => {
        this.allDataByClient = res.rows
        this.totalCount = res.rows.length
        this.roles = res.roles
        this.agents = res.agents
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    onCreateBtnClick() {
      this.selectForm = JSON.parse(JSON.stringify(defaultForm))
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.dataLoading = true
      accountCreate(data).then((res) => {
        this.allDataByClient = res.rows
        this.totalCount = res.rows.length
        this.handlePageChangeByClient(this.currentPage)
        this.dataLoading = false
      }).catch((err) => {
        if (err.data.code !== 401) {
          this.dataLoading = false
          const { name, code, symbol } = err.data.message
          const log = () => {
            if (name !== undefined) {
              return name[0]
            } else if (code !== undefined) {
              return code[0]
            } else if (symbol !== undefined) {
              return symbol[0]
            } else {
              return 'Create failed'
            }
          }
          this.$message({
            message: log(),
            type: 'error'
          })
        }
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.createDialogVisible = false
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.editDialogVisible = false
        this.dataLoading = true
        accountEdit(data).then((res) => {
          this.allDataByClient = res.rows
          this.totalCount = res.rows.length
          this.handlePageChangeByClient(this.currentPage)
          this.dataLoading = false
        }).catch(() => {
          this.dataLoading = false
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
