<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__account')">
        <el-input v-model="searchForm.account" />
      </el-form-item>
      <el-form-item class="inputTitle" label="IP">
        <el-input v-model="searchForm.ip" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :height="viewHeight">
      <el-table-column prop="id" width="80" label="ID" align="center" />
      <el-table-column prop="account" :label="$t('__account')" align="center" />
      <el-table-column prop="ip" label="IP" align="center" />
      <el-table-column :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-delete" @click="onDeleteBtnClick(scope.row)">{{ $t("__delete") }}</el-button>
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
      @current-change="handlePageChangeByClient"
    />

    <IpWhitelistDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <IpWhitelistDialog
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
import { whitelistSearch, whitelistCreate, whitelistEdit, whitelistDelete } from '@/api/ipWhitelist'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import IpWhitelistDialog from './ipWhitelistDialog'

export default {
  name: 'IpWhitelist',
  components: { IpWhitelistDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      searchForm: {},
      selectForm: {},
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
      this.searchForm = {}
    },
    handleRespone(res) {
      this.allDataByClient = res
      this.totalCount = res.length
      this.handlePageChangeByClient(this.currentPage)
      this.selectLoading = false
      this.dataLoading = false
    },
    handleResponeError(err) {
      this.selectLoading = false
      this.dataLoading = false
      if (err.data.code !== 401) {
        const { account, ip } = err.data.message
        const log = () => {
          if (account !== undefined) {
            return account[0]
          } else if (ip !== undefined) {
            return ip[0]
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
      whitelistSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.selectLoading = true
      this.dataLoading = true
      whitelistCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch((err) => {
        this.handleResponeError(err)
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
        this.selectLoading = true
        this.dataLoading = true
        whitelistEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch((err) => {
          this.handleResponeError(err)
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(this.$t('__confirmDeletion')).then(_ => {
        this.selectLoading = true
        this.dataLoading = true
        whitelistDelete(item.id).then((res) => {
          this.handleRespone(res)
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

.el-select {
  width: 110px;
}
</style>
