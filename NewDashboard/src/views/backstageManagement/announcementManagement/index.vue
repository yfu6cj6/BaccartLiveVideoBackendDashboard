<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="onSubmit()">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementTitle')">
        <el-input v-model="searchForm.title" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementContent')">
        <el-input v-model="searchForm.content" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementType')">
        <el-input v-model="searchForm.type" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__marquee')">
        <el-input v-model="searchForm.is_marquee" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementDate')">
        <el-date-picker
          v-model="searchForm.announcementedAt"
          type="daterange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="$t('__startDate')"
          :end-placeholder="$t('__endDate')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__maintainDate')">
        <el-date-picker
          v-model="searchForm.maintainedAt"
          type="daterange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="$t('__startDate')"
          :end-placeholder="$t('__endDate')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit()">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :height="viewHeight">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item :label="$t('__content') + ':'">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" width="50" label="ID" align="center" />
      <el-table-column prop="type" :label="$t('__announcementType')" align="center" />
      <el-table-column prop="is_marquee" width="80" :label="$t('__marquee')" align="center" />
      <el-table-column prop="title" :label="$t('__announcementTitle')" align="center" />
      <el-table-column prop="announcement_started_at" width="160" :label="$t('__announcementDate')" align="center" />
      <el-table-column prop="announcement_ended_at" width="160" :label="$t('__announcementDate')" align="center" />
      <el-table-column prop="maintain_started_at" width="160" :label="$t('__maintainDate')" align="center" />
      <el-table-column prop="maintain_ended_at" width="160" :label="$t('__maintainDate')" align="center" />
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
      @current-change="handleCurrentChange"
    />

    <AnnouncementManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AnnouncementManagementDialog
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
import { announcementSearch, announcementCreate, announcementEdit, announcementDelete } from '@/api/backstageManagement/announcementManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AnnouncementManagementDialog from './announcementManagementDialog'

export default {
  name: 'AnnouncementManagement',
  components: { AnnouncementManagementDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('__nextWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('__nextMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('__nextThreeMonths'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
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
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.selectLoading = true
      this.dataLoading = true
      announcementSearch(data).then((res) => {
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
      announcementCreate(data).then((res) => {
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
        announcementEdit(data).then((res) => {
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
        announcementDelete(item.id).then((res) => {
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
