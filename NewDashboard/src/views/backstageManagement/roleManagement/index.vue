<template>
  <div v-loading="dataLoading" class="view-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.id" type="number" placeholder="ID" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.name" :placeholder="$t('__name')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.nickname" :placeholder="$t('__nickname')" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" filterable :placeholder="$t('__type')" multiple>
          <el-option v-for="item in searchTypes" :key="item.key" :label="item.nickname" :value="item.key" />
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
      <el-table-column prop="id" min-width="25px" label="ID" align="center" sortable />
      <el-table-column prop="name" min-width="100px" :label="$t('__name')" align="center" sortable />
      <el-table-column prop="nickname" min-width="50px" :label="$t('__nickname')" align="center" sortable />
      <el-table-column prop="typeNickname" min-width="40px" :label="$t('__type')" align="center" sortable />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onPermissionBtnClick(scope.row)">{{ $t("__permission") }}</el-button>
          <el-button type="primary" size="mini" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="danger" size="mini" @click="onDeleteBtnClick(scope.row)">{{ $t("__delete") }}</el-button>
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
      :title="$t('__edit')"
      :visible="curDialogIndex === dialogEnum.edit"
      :confirm="$t('__revise')"
      :form="selectForm"
      :types="types"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :types="types"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />

    <rolePermissionDialog
      ref="permissionDialog"
      :title="$t('__setPermission')"
      :visible="curDialogIndex === dialogEnum.permission"
      :confirm="$t('__confirm')"
      :form="selectForm"
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
import EditDialog from './editDialog'
import RolePermissionDialog from './rolePermissionDialog'

export default {
  name: 'RoleManagement',
  components: { EditDialog, RolePermissionDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2,
        'permission': 3
      }),
      searchForm: {},
      selectForm: {},
      searchTypes: [],
      types: [],
      curDialogIndex: 0
    }
  },
  computed: {
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = {}
    },
    handleRespone(res) {
      this.totalCount = res.rows.length
      this.searchTypes = res.types
      this.types = res.types
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.typeNickname = this.types.find(type => type.key === element.type).nickname
      })
      this.handlePageChangeByClient(this.currentPage)

      this.closeDialogEven()
      this.closeLoading()
    },
    closeLoading() {
      this.$refs.createDialog.setDialogLoading(false)
      this.$refs.editDialog.setDialogLoading(false)
      this.$refs.permissionDialog.setDialogLoading(false)
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.dataLoading = true
      roleSearch(JSON.parse(JSON.stringify(data))).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.type = this.types[0].key
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      roleCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onPermissionBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.dataLoading = true
      getPermissions(item).then((res) => {
        this.curDialogIndex = this.dialogEnum.permission
        this.$refs.permissionDialog.setData(res)
        this.closeLoading()
      }).catch(() => {
        this.closeLoading()
      })
    },
    permissionDialogConfirmEven(selection) {
      this.$refs.permissionDialog.setDialogLoading(true)
      const requestData = { id: this.selectForm.id, permissions: selection.map(element => { return element.name }) }
      setPermissions(requestData).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.curDialogIndex = this.dialogEnum.edit
    },
    editDialogConfirmEven(data) {
      this.$confirm(`${this.$t('__confirmChanges')}?`).then(_ => {
        this.$refs.editDialog.setDialogLoading(true)
        roleEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(`${this.$t('__confirmDeletion')}?`).then(_ => {
        this.dataLoading = true
        roleDelete(item.id).then((res) => {
          this.handleRespone(res)
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
  width: 220px;
}
</style>
