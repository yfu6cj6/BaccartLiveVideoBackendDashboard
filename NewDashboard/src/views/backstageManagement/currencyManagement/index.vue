<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item class="inputTitle" label="ID">
        <el-input v-model="searchForm.id" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__name')">
        <el-input v-model="searchForm.name" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__code')">
        <el-input v-model="searchForm.code" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__symbol')">
        <el-input v-model="searchForm.symbol" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :height="viewHeight">
      <el-table-column prop="id" width="80" label="ID" />
      <el-table-column prop="name" :label="$t('__name')" />
      <el-table-column prop="code" :label="$t('__code')" />
      <el-table-column prop="symbol" :label="$t('__symbol')" />
      <el-table-column :label="$t('__operate')">
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
      @current-change="handleCurrentChange"
    />

    <CurrencyManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <CurrencyManagementDialog
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
import { currencySearch, currencyCreate, currencyEdit, currencyDelete } from '@/api/backstageManagement/currencyManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import CurrencyManagementDialog from './currencyManagementDialog'

export default {
  name: 'CurrencyManagement',
  components: { CurrencyManagementDialog },
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
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.selectLoading = true
      this.dataLoading = true
      currencySearch(data).then((res) => {
        this.allDataByClient = res
        this.totalCount = res.length
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.dataLoading = true
      currencyCreate(data).then((res) => {
        this.allDataByClient = res
        this.totalCount = res.length
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
        currencyEdit(data).then((res) => {
          this.allDataByClient = res
          this.totalCount = res.length
          this.handlePageChangeByClient(this.currentPage)
          this.dataLoading = false
        }).catch(() => {
          this.dataLoading = false
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(this.$t('__confirmDeletion')).then(_ => {
        this.dataLoading = true
        currencyDelete(item.id).then((res) => {
          this.allDataByClient = res
          this.totalCount = res.length
          this.handlePageChangeByClient(this.currentPage)
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

.el-select {
  width: 110px;
}
</style>
