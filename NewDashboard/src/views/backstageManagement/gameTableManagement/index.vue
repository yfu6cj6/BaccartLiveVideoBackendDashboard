<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.table_id" multiple filterable :placeholder="$t('__tableId')">
            <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.live_bet_area_id" multiple filterable :placeholder="$t('__liveBetAreaId')">
            <el-option v-for="item in searchItems.liveBetArea" :key="item.key" :label="item.nickname" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.bet_min" type="number" :placeholder="$t('__betMin')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.bet_max" type="number" :placeholder="$t('__betMax')" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.total_bet_max" type="number" :placeholder="$t('__totalBetMax')" />
        </el-form-item>
        <el-form-item>
          <el-button class="bg-gray" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
        </el-form-item>
      </el-form>
      <span class="zeroMeansNoLimit">{{ `${$t('__totalBetMax')}${$t('__zeroMeansNoLimit')}` }}</span>
    </el-row>

    <el-table :data="tableData" border :max-height="viewHeight">
      <el-table-column prop="id" label="ID" align="center" :min-width="idWidth" sortable />
      <el-table-column prop="table_id" :label="$t('__tableId')" align="center" :min-width="tableIdWidth" sortable />
      <el-table-column prop="live_bet_area_id" :label="$t('__liveBetAreaId')" align="center" :min-width="liveBetAreaIdWidth" sortable />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :min-width="betMinWidth" sortable />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :min-width="betMaxWidth" sortable />
      <el-table-column prop="totalBetMaxLabel" :label="$t('__totalBetMax')" align="center" :min-width="totalBetMaxWidth" sortable />
      <el-table-column :label="$t('__operate')" align="center" min-width="200px">
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
      :tables="searchItems.tables"
      :live-bet-area="searchItems.liveBetArea"
      :is-edit="true"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <editDialog
      ref="createDialog"
      :title="$t('__create')"
      :visible="curDialogIndex === dialogEnum.create"
      :confirm="$t('__confirm')"
      :form="selectForm"
      :tables="searchItems.tables"
      :live-bet-area="searchItems.liveBetArea"
      :is-edit="false"
      @close="closeDialogEven"
      @confirm="createDialogConfirmEven"
    />
  </div>
</template>

<script>
import { gameTableSearch, gameTableCreate, gameTableEdit, gameTableDelete } from '@/api/backstageManagement/gameTableManagement'
import common from '@/layout/mixin/common'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import handleTableWidth from '@/layout/mixin/handleTableWidth'
import EditDialog from './editDialog'

export default {
  name: 'GameTableManagement',
  components: { EditDialog },
  mixins: [handlePageChange, shared, handleViewResize, handleTableWidth, common],
  data() {
    return {
      dialogEnum: Object.freeze({
        'none': 0,
        'create': 1,
        'edit': 2
      }),
      searchForm: {},
      selectForm: {},
      searchItems: {},
      curDialogIndex: 0
    }
  },
  computed: {
    idWidth() {
      return this.calculateWidth('ID', 'id', 30) + 'px'
    },
    tableIdWidth() {
      return this.calculateWidth(this.$t('__tableId'), 'table_id', 10) + 'px'
    },
    liveBetAreaIdWidth() {
      return this.calculateWidth(this.$t('__liveBetAreaId'), 'live_bet_area_id', 14) + 'px'
    },
    betMinWidth() {
      return this.calculateWidth(this.$t('__betMin'), 'bet_min', 10) + 'px'
    },
    betMaxWidth() {
      return this.calculateWidth(this.$t('__betMax'), 'bet_max', 10) + 'px'
    },
    totalBetMaxWidth() {
      return this.calculateWidth(this.$t('__totalBetMax'), 'totalBetMaxLabel', 10) + 'px'
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = {}
    },
    handleRespone(res) {
      this.searchItems = res.searchItems
      this.allDataByClient = res.rows
      this.allDataByClient.forEach(element => {
        element.totalBetMaxLabel = element.total_bet_max === '0.00' ? '不限制' : element.total_bet_max
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
      gameTableSearch(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.closeLoading()
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.table_id = this.searchItems.tables[0].key
      this.selectForm.live_bet_area_id = this.searchItems.liveBetArea[0].key
      this.curDialogIndex = this.dialogEnum.create
    },
    createDialogConfirmEven(data) {
      this.$refs.createDialog.setDialogLoading(true)
      gameTableCreate(data).then((res) => {
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
        data.table_id = undefined
        data.live_bet_area_id = undefined
        gameTableEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    onDeleteBtnClick(item) {
      this.confirmMsg(`${this.$t('__confirmDeletion')}?`, () => {
        this.dataLoading = true
        gameTableDelete(item.id).then((res) => {
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
  width: 180px;
}

.el-select {
  width: 170px;
}

.zeroMeansNoLimit {
  color: red;
  font-weight: bolder
}
</style>
