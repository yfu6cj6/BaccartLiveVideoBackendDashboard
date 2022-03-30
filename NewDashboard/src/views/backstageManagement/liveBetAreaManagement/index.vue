<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.id" type="number" placeholder="ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.name" :placeholder="$t('__name')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.area" :placeholder="$t('__code')" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.currency" multiple filterable :placeholder="$t('__currency')">
            <el-option v-for="item in currency" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.activated" multiple filterable :placeholder="$t('__activated')">
            <el-option v-for="item in activated" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="bg-gray" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table :data="tableData" border :max-height="viewHeight">
      <el-table-column prop="id" label="ID" align="center" sortable />
      <el-table-column prop="area_name" :label="$t('__name')" align="center" sortable />
      <el-table-column prop="area" :label="$t('__code')" align="center" sortable />
      <el-table-column prop="odds" :label="$t('__odds')" align="center" />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" />
      <el-table-column prop="currency" :label="$t('__currency')" align="center" sortable />
      <el-table-column prop="activatedLabel" :label="$t('__activated')" align="center" sortable />
      <el-table-column :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button class="bg-yellow" size="mini" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button class="bg-red" size="mini" @click="onDeleteBtnClick(scope.row)">{{ $t("__delete") }}</el-button>
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
      :currency="currency"
      :activated="activated"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :currency="currency"
      :activated="activated"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />
  </div>
</template>

<script>
import { liveBetAreaSearch, liveBetAreaCreate, liveBetAreaEdit, liveBetAreaDelete } from '@/api/backstageManagement/liveBetAreaManagement'
import common from '@/layout/mixin/common'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import EditDialog from './editDialog'

export default {
  name: 'LiveBetAreaManagement',
  components: { EditDialog },
  mixins: [handlePageChange, shared, handleViewResize, common],
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2
      }),
      searchForm: {},
      selectForm: {},
      activated: [],
      currency: [],
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
      this.currency = res.searchItems.currency
      this.activated = res.searchItems.activated
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        const activatedLabel = this.activated.find(active => active.key === element.activated)
        if (activatedLabel) {
          element.activatedLabel = activatedLabel.nickname
        }
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
      liveBetAreaSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = { currency: this.currency[0].key, activated: this.activated[0].key }
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      liveBetAreaCreate(data).then((res) => {
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
      this.confirmMsg(`${this.$t('__confirmChanges')}?`, () => {
        this.$refs.editDialog.setDialogLoading(true)
        liveBetAreaEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    onDeleteBtnClick(item) {
      this.confirmMsg(`${this.$t('__confirmDeletion')}?`, () => {
        this.dataLoading = true
        liveBetAreaDelete(item.id).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      })
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
