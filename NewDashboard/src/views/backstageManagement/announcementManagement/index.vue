<template>
  <div v-loading="dataLoading" class="view-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.title" :placeholder="$t('__announcementTitle')" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.content" :placeholder="$t('__announcementContent')" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" multiple filterable :placeholder="$t('__announcementType')">
          <el-option v-for="item in methodType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.is_marquee" multiple filterable :placeholder="$t('__marquee')">
          <el-option v-for="item in announcementMarqueeStatusType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.announcementedAt"
          type="datetimerange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="`${$t('__announcementDate')}(${$t('__start')})`"
          :end-placeholder="`${$t('__announcementDate')}(${$t('__end')})`"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.maintainedAt"
          type="datetimerange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="`${$t('__maintainDate')}(${$t('__start')})`"
          :end-placeholder="`${$t('__maintainDate')}(${$t('__end')})`"
          :picker-options="pickerOptions"
        />
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
            <el-form-item :label="$t('__content') + ':'">
              <pre class="table-content">{{ props.row.content }}</pre>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" min-width="25px" label="ID" align="center" sortable />
      <el-table-column prop="typeNickname" min-width="55px" :label="$t('__announcementType')" align="center" sortable />
      <el-table-column prop="marquee" min-width="50px" :label="$t('__marquee')" align="center" sortable />
      <el-table-column prop="title" min-width="80px" :label="$t('__announcementTitle')" align="center" />
      <el-table-column prop="announcement_started_at" min-width="60px" :label="`${$t('__announcementDate')}(${$t('__start')})`" align="center" sortable />
      <el-table-column prop="announcement_ended_at" min-width="60px" :label="`${$t('__announcementDate')}(${$t('__end')})`" align="center" sortable />
      <el-table-column prop="maintain_started_at" min-width="60px" :label="`${$t('__maintainDate')}(${$t('__start')})`" align="center" sortable />
      <el-table-column prop="maintain_ended_at" min-width="60px" :label="`${$t('__maintainDate')}(${$t('__end')})`" align="center" sortable />
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
      :picker-options="pickerOptions"
      :form="selectForm"
      :method-type="methodType"
      :announcement-marquee-status-type="announcementMarqueeStatusType"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :picker-options="pickerOptions"
      :method-type="methodType"
      :announcement-marquee-status-type="announcementMarqueeStatusType"
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
import EditDialog from './editDialog'
import { mapGetters } from 'vuex'
import { getFullDate, getNextDate } from '@/utils/transDate'

export default {
  name: 'AnnouncementManagement',
  components: { EditDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('__nextWeek'),
          onClick(picker) {
            picker.$emit('pick', getNextDate(7))
          }
        }, {
          text: this.$t('__nextMonth'),
          onClick(picker) {
            picker.$emit('pick', getNextDate(30))
          }
        }, {
          text: this.$t('__nextThreeMonths'),
          onClick(picker) {
            picker.$emit('pick', getNextDate(90))
          }
        }]
      },
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2
      }),
      searchForm: {},
      selectForm: {},
      methodType: [],
      curDialogIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'announcementMarqueeStatusType'
    ])
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = {}
    },
    handleRequest(data) {
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
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.marquee = element.is_marquee === '1' ? 'V' : ''
        const typeNickname = this.methodType.find(type => type.key === element.type)
        element.typeNickname = typeNickname ? typeNickname.nickname : element.type
      })
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
      this.handleRequest(data)
      announcementSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.is_marquee = this.announcementMarqueeStatusType[1].key
      this.selectForm.type = this.methodType[0].key
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      this.handleRequest(data)
      announcementCreate(data).then((res) => {
        this.handleRespone(res)
        this.$store.dispatch('backstageManagement/setAnnouncement', res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.selectForm.announcementedAt = [getFullDate(this.selectForm.announcement_started_at), getFullDate(this.selectForm.announcement_ended_at)]
      this.selectForm.maintainedAt = [getFullDate(this.selectForm.maintain_started_at), getFullDate(this.selectForm.maintain_ended_at)]
      this.curDialogIndex = this.dialogEnum.edit
    },
    editDialogConfirmEven(data) {
      this.$confirm(`${this.$t('__confirmChanges')}?`).then(_ => {
        this.$refs.editDialog.setDialogLoading(true)
        this.handleRequest(data)
        announcementEdit(data).then((res) => {
          this.handleRespone(res)
          this.$store.dispatch('backstageManagement/setAnnouncement', res)
        }).catch(() => {
          this.closeLoading()
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(`${this.$t('__confirmDeletion')}?`).then(_ => {
        this.dataLoading = true
        announcementDelete(item.id).then((res) => {
          this.handleRespone(res)
          this.$store.dispatch('backstageManagement/setAnnouncement', res)
        }).catch(() => {

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

.table-content {
  margin: 13px 0 0 10px;
  line-height: 20px;
}
</style>
