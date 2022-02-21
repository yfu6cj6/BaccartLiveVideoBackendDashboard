<template>
  <div class="timeZoneManagement-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item class="inputTitle" label="ID">
        <el-input v-model="searchForm.id" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__timeZone')">
        <el-input v-model="searchForm.time_zone" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__cityName')">
        <el-input v-model="searchForm.city_name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">{{ $t("__search") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" :border="true">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="time_zone" :label="$t('__timeZone')" />
      <el-table-column prop="city_name" :label="$t('__cityName')" />
      <el-table-column :label="$t('__operate')">
        <template slot-scope="scope">
          <el-button type="primary" @click="visibleDialog(scope.row)">{{ $t("__edit") }}</el-button>
          <el-button type="primary" @click="deleteData(scope.row)">{{ $t("__delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="timeZoneManagement-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    />

    <TimeZoneManagementDialog
      :visible="dialogVisible"
      :form="selectForm"
      @close="closeDialog"
      @edit="editData"
    />
  </div>
</template>

<script>
import { timezoneSearch, timezoneDelete, timezoneDataEdit } from '@/api/backstageManagement'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import TimeZoneManagementDialog from './timeZoneManagementDialog'

export default {
  name: 'TimeZoneManagement',
  components: { TimeZoneManagementDialog },
  mixins: [handlePageChange, shared],
  data() {
    const defaultForm = {
      id: undefined,
      time_zone: undefined,
      city_name: undefined
    }
    return {
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      selectForm: JSON.parse(JSON.stringify(defaultForm)),
      dialogVisible: false
    }
  },
  computed: {
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onSubmit() {
      this.tableData = []
      this.selectLoading = true
      this.dataLoading = true
      timezoneSearch(this.searchForm).then((res) => {
        this.allDataByClient = res
        this.totalCount = res.length
        console.log('!!: ' + this.totalCount)
        this.handlePageChangeByClient(this.currentPage)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    deleteData(item) {
      this.dataLoading = true
      timezoneDelete(item.id).then((res) => {
        this.allDataByClient = res
        this.totalCount = res.length
        this.handlePageChangeByClient(this.currentPage)
        this.dataLoading = false
      })
    },
    visibleDialog(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.dialogVisible = true
    },
    editData(data) {
      this.dataLoading = true
      timezoneDataEdit(data).then((res) => {
        this.allDataByClient = res
        this.totalCount = res.length
        this.handlePageChangeByClient(this.currentPage)
        this.dataLoading = false
        this.dialogVisible = false
      })
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.timeZoneManagement {
  &-container {
    margin: 20px;
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
.inputTitle{
  padding: 0px 12px 0 12px;
}
.el-input {
  width: 150px;
}
.el-select {
  width: 150px;
}
</style>
