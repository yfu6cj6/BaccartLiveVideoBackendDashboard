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
        <el-input v-model="searchForm.lower_limit" type="number" :placeholder="$t('__lowerLimit')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.upper_limit" type="number" :placeholder="$t('__upperLimit')" />
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" size="mini" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" size="mini" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="tableData" border :max-height="viewHeight">
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="lower_limit" :label="$t('__lowerLimit')" align="center" />
      <el-table-column prop="upper_limit" :label="$t('__upperLimit')" align="center" />
      <el-table-column :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
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
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />
  </div>
</template>

<script>
import { tableLimitSearch, tableLimitCreate, tableLimitEdit } from '@/api/backstageManagement/limitManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import EditDialog from './editDialog'

export default {
  name: 'LimitManagement',
  components: { EditDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2
      }),
      searchForm: {},
      selectForm: {},
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
      this.allDataByClient = res.rows
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)

      this.closeDialogEven()
      this.closeLoading()
    },
    closeLoading() {
      this.$refs.createDialog.setDialogLoading(false)
      this.$refs.editDialog.setDialogLoading(false)
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.dataLoading = true
      tableLimitSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      tableLimitCreate(data).then((res) => {
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
        tableLimitEdit(data).then((res) => {
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
  width: 120px;
}
</style>
