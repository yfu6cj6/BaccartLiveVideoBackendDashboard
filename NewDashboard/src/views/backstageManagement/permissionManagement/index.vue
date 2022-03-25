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
        <el-input v-model="searchForm.uri" placeholder="Uri" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.methodType" multiple filterable :placeholder="$t('__method')">
          <el-option v-for="item in searchMethodType" :key="item" :label="item" :value="item" />
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
          <el-form label-position="left">
            <el-form-item label="requestContent:">
              <span>{{ props.row.request_content }}</span>
            </el-form-item>
            <el-form-item label="responseContent:">
              <span>{{ props.row.response_content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" min-width="25px" label="ID" align="center" sortable />
      <el-table-column prop="name" min-width="120px" :label="$t('__name')" align="center" sortable />
      <el-table-column prop="nickname" min-width="40px" :label="$t('__nickname')" align="center" sortable />
      <el-table-column prop="uri" min-width="80px" label="Uri" align="center" sortable />
      <el-table-column prop="method" min-width="40px" :label="$t('__method')" align="center" />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
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
      :method-type="methodType"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :method-type="methodType"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />
  </div>
</template>

<script>
import { permissionSearch, permissionCreate, permissionEdit, permissionDelete } from '@/api/backstageManagement/permissionManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import EditDialog from './editDialog'

export default {
  name: 'PermissionManagement',
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
      searchMethodType: [],
      methodType: [],
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
      this.searchMethodType = res.methodType
      this.methodType = []
      this.methodType.push('None')
      this.methodType = this.methodType.concat(res.methodType)
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
      data = JSON.parse(JSON.stringify(data))
      if (data.methodType === 'All') {
        data.methodType = undefined
      }
      permissionSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.method = this.methodType[0]
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      if (data.method !== 'None') {
        data.methodType = data.method
      }
      permissionCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      if (!this.selectForm.method) {
        this.selectForm.method = this.methodType[0]
      }
      this.curDialogIndex = this.dialogEnum.edit
    },
    editDialogConfirmEven(data) {
      this.$confirm(`${this.$t('__confirmChanges')}?`).then(_ => {
        this.$refs.editDialog.setDialogLoading(true)
        if (data.method !== 'None') {
          data.methodType = data.method
        }
        permissionEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(`${this.$t('__confirmDeletion')}?`).then(_ => {
        this.dataLoading = true
        permissionDelete(item.id).then((res) => {
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
  width: 190px;
}
</style>
