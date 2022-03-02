<template>
  <div class="roleManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" label="ID">
        <el-input v-model="searchForm.id" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__name')">
        <el-input v-model="searchForm.name" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__nickname')">
        <el-input v-model="searchForm.nickname" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__type')">
        <el-select v-model="searchForm.type">
          <el-option v-for="item in searchTypes" :key="item.key" :label="item.nickname" :value="item.key" />
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
      <el-table-column prop="id" min-width="25px" label="ID" align="center" />
      <el-table-column prop="name" min-width="100px" :label="$t('__name')" align="center" />
      <el-table-column prop="nickname" min-width="50px" :label="$t('__nickname')" align="center" />
      <el-table-column prop="type" min-width="40px" :label="$t('__type')" align="center" />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-coordinate" @click="onPermissionBtnClick(scope.row)">{{ $t("__permission") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-delete" @click="onDeleteBtnClick(scope.row)">{{ $t("__delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="roleManagement-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChangeByClient"
    />

    <RoleManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      :types="types"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <RoleManagementDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :types="types"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />

    <RolePermissionDialog
      ref="rolePermissionDialog"
      :title="$t('__setPermission')"
      :visible="permissionDialogVisible"
      :confirm="$t('__confirm')"
      :data-loading="permissionDataLoading"
      @close="closeDialogEven"
      @confirm="permissionDialogConfirmEven"
    />
  </div>
</template>

<script>
import { roleSearch, roleCreate, roleEdit, roleDelete, getPermissions, setPermissions } from '@/api/backstageManagement/roleManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import RoleManagementDialog from './roleManagementDialog'
import RolePermissionDialog from './rolePermissionDialog'

const defaultForm = {
  type: 'All'
}

export default {
  name: 'RoleManagement',
  components: { RoleManagementDialog, RolePermissionDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      selectForm: {},
      searchTypes: [],
      types: [],
      editDialogVisible: false,
      createDialogVisible: false,
      permissionDialogVisible: false,
      permissionDataLoading: false
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
    handleRespone(res) {
      this.allDataByClient = res.rows
      this.totalCount = res.rows.length
      this.searchTypes = []
      this.searchTypes.push({ 'key': 'All', 'nickname': 'All' })
      this.searchTypes = this.searchTypes.concat(res.types)
      this.types = res.types
      this.handlePageChangeByClient(this.currentPage)
      this.selectLoading = false
      this.dataLoading = false
    },
    handleResponeError(err) {
      this.selectLoading = false
      this.dataLoading = false
      if (err.data.code !== 401) {
        const { name, nickname, type } = err.data.message
        const log = () => {
          if (name !== undefined) {
            return name[0]
          } else if (nickname !== undefined) {
            return nickname[0]
          } else if (type !== undefined) {
            return type[0]
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
      if (data.type === 'All') {
        data.type = undefined
      }
      roleSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.type = this.types[0].key
      this.createDialogVisible = true
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.selectLoading = true
      this.dataLoading = true
      roleCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch((err) => {
        this.handleResponeError(err)
      })
    },
    onPermissionBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.permissionDialogVisible = true
      this.permissionDataLoading = true
      getPermissions(item).then((res) => {
        this.$refs.rolePermissionDialog.setData(res)
        this.permissionDataLoading = false
      })
    },
    permissionDialogConfirmEven(selection) {
      this.permissionDialogVisible = false
      this.selectLoading = true
      this.dataLoading = true
      const requestData = { id: this.selectForm.id, permissions: selection.map(element => { return element.name }) }
      setPermissions(requestData).then((res) => {
        this.handleRespone(res)
      }).catch((err) => {
        this.handleResponeError(err)
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.editDialogVisible = false
        this.selectLoading = true
        this.dataLoading = true
        roleEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch((err) => {
          this.handleResponeError(err)
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(this.$t('__confirmDeletion')).then(_ => {
        this.dataLoading = true
        roleDelete(item.id).then((res) => {
          this.handleRespone(res)
        })
      }).catch(_ => {})
    },
    closeDialogEven() {
      this.createDialogVisible = false
      this.editDialogVisible = false
      this.permissionDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.roleManagement {
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
  width: 150px;
}

.el-select {
  width: 120px;
}
</style>
