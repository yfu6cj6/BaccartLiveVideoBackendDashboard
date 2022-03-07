<template>
  <div class="gameTableManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__tableId')">
        <el-select v-model="searchForm.table_id" multiple>
          <el-option v-for="item in searchItems.tables" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__liveBetAreaId')">
        <el-select v-model="searchForm.live_bet_area_id" multiple>
          <el-option v-for="item in searchItems.liveBetArea" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__betMin')">
        <el-input v-model="searchForm.bet_min" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__betMax')">
        <el-input v-model="searchForm.bet_max" type="number" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__totalBetMax')">
        <el-input v-model="searchForm.total_bet_max" type="number" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-folder-opened" @click="onShowAllBtnClick({})">{{ $t("__showAll") }}</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="table_id" :label="$t('__tableId')" align="center" />
      <el-table-column prop="live_bet_area_id" :label="$t('__liveBetAreaId')" align="center" />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" />
      <el-table-column prop="total_bet_max" :label="$t('__totalBetMax')" align="center" />
      <el-table-column min-width="100px" :label="$t('__operate')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-delete" @click="onDeleteBtnClick(scope.row)">{{ $t("__delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="gameTableManagement-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChangeByClient"
    />

    <GameTableManagementDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      :tables="searchItems.tables"
      :live-bet-area="searchItems.liveBetArea"
      :is-edit="true"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <GameTableManagementDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
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
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import GameTableManagementDialog from './gameTableManagementDialog'

export default {
  name: 'GameTableManagement',
  components: { GameTableManagementDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      searchForm: {},
      selectForm: {},
      searchItems: {},
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
      this.searchItems = res.searchItems
      this.allDataByClient = res.rows
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)
      this.selectLoading = false
      this.dataLoading = false
    },
    handleResponeError() {
      this.selectLoading = false
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.onShowAllBtnClick(this.searchForm)
    },
    onShowAllBtnClick(data) {
      this.selectLoading = true
      this.dataLoading = true
      gameTableSearch(data).then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.selectForm = {}
      this.selectForm.table_id = this.searchItems.tables[0].key
      this.selectForm.live_bet_area_id = this.searchItems.liveBetArea[0].key
      this.createDialogVisible = true
      this.editDialogVisible = false
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.selectLoading = true
      this.dataLoading = true
      gameTableCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.handleResponeError()
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
        data.table_id = undefined
        data.live_bet_area_id = undefined
        gameTableEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.handleResponeError()
        })
      }).catch(_ => {})
    },
    onDeleteBtnClick(item) {
      this.$confirm(this.$t('__confirmDeletion')).then(_ => {
        this.selectLoading = true
        this.dataLoading = true
        gameTableDelete(item.id).then((res) => {
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
.gameTableManagement {
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
  width: 270px;
}
</style>
