<template>
  <div class="permissionManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementTitle')">
        <el-input v-model="searchForm.title" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementContent')">
        <el-input v-model="searchForm.content" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementType')">
        <el-select v-model="searchForm.type" multiple>
          <el-option v-for="item in methodType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__marquee')">
        <el-select v-model="searchForm.is_marquee" multiple>
          <el-option v-for="item in announcementMarquee" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__announcementDate')">
        <el-date-picker
          v-model="searchForm.announcementedAt"
          type="datetimerange"
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
          type="datetimerange"
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
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item :label="$t('__content') + ':'">
              <pre class="content">{{ props.row.content }}</pre>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" min-width="25px" label="ID" align="center" />
      <el-table-column prop="type" min-width="55px" :label="$t('__announcementType')" align="center" />
      <el-table-column prop="marquee" min-width="50px" :label="$t('__marquee')" align="center" />
      <el-table-column prop="title" min-width="80px" :label="$t('__announcementTitle')" align="center" />
      <el-table-column prop="announcement_started_at" min-width="60px" :label="$t('__announcementDate')" align="center" />
      <el-table-column prop="announcement_ended_at" min-width="60px" :label="$t('__announcementDate')" align="center" />
      <el-table-column prop="maintain_started_at" min-width="60px" :label="$t('__maintainDate')" align="center" />
      <el-table-column prop="maintain_ended_at" min-width="60px" :label="$t('__maintainDate')" align="center" />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
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

    <AnnouncementManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :picker-options="pickerOptions"
      :form="selectForm"
      :method-type="methodType"
      :announcement-marquee="announcementMarquee"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AnnouncementManagementDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :picker-options="pickerOptions"
      :method-type="methodType"
      :announcement-marquee="announcementMarquee"
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
import { mapGetters } from 'vuex'
import { getFullDate } from '@/utils/transDate'

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
      methodType: [],
      editDialogVisible: false,
      createDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'announcementMarquee'
    ])
  },
  created() {
    this.$store.dispatch('backstageManagement/setAnnouncementMarquee')
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = {}
    },
    handleRequest(data) {
      this.selectLoading = true
      this.dataLoading = true
      if (data.announcementedAt) {
        for (let i = 0, max = data.announcementedAt.length; i < max; i++) {
          data.announcementedAt[i] = getFullDate(data.announcementedAt[i])
        }
      }
      if (data.maintainedAt) {
        for (let i = 0, max = data.maintainedAt.length; i < max; i++) {
          data.maintainedAt[i] = getFullDate(data.maintainedAt[i])
        }
      }

      if (data.content) {
        data.contents = data.content
      }
    },
    handleRespone(res) {
      this.methodType = res.methodType
      res.rows.forEach(element => {
        element.marquee = element.is_marquee === '1' ? 'V' : ''
      })
      this.allDataByClient = res.rows
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)
      this.selectLoading = false
      this.dataLoading = false
    },
    handleResponeError(err) {
      this.selectLoading = false
      this.dataLoading = false
      if (err.data.code !== 401) {
        const { title, announcementedAt, maintainedAt } = err.data.message
        const log = () => {
          if (title !== undefined) {
            return title[0]
          } else if (announcementedAt !== undefined) {
            return announcementedAt[0]
          } else if (maintainedAt !== undefined) {
            return maintainedAt[0]
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
      this.handleRequest(data)
      announcementSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.is_marquee = this.announcementMarquee[1].key
      this.selectForm.type = this.methodType[0].key
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.handleRequest(data)
      announcementCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch((err) => {
        this.handleResponeError(err)
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.selectForm.announcementedAt = [getFullDate(this.selectForm.announcement_started_at), getFullDate(this.selectForm.announcement_ended_at)]
      this.selectForm.maintainedAt = [getFullDate(this.selectForm.maintain_started_at), getFullDate(this.selectForm.maintain_ended_at)]
      this.createDialogVisible = false
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.editDialogVisible = false
        this.handleRequest(data)
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

.content {
  margin: 13px 0 0 50px;
  line-height: 20px;
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
  width: 180px;
}
</style>
