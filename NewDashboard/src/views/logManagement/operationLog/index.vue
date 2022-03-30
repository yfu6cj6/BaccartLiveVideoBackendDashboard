<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="seachForm">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.searchTime"
            type="datetimerange"
            align="right"
            unlink-panels
            :range-separator="$t('__to')"
            :start-placeholder="`${$t('__createdAt')}(${$t('__start')})`"
            :end-placeholder="`${$t('__createdAt')}(${$t('__end')})`"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.ip" placeholder="IP" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.description" :placeholder="$t('__description')" />
        </el-form-item>
        <el-form-item>
          <el-button class="bg-gray" size="mini" @click="onReset()">{{ $t("__reset") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
          <el-button class="bg-yellow" size="mini" @click="onExportBtnClick()">{{ $t("__searchAndExport") }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table :data="tableData" border :max-height="viewHeight">
      <el-table-column v-if="showDetail" type="expand">
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item label="requestContent:">
              <span>{{ props.row.request_content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="userNickName" min-width="60px" :label="$t('__operator')" align="center" sortable />
      <el-table-column prop="ip" min-width="80px" label="IP" align="center" sortable />
      <el-table-column prop="description" min-width="60px" :label="$t('__description')" align="center" />
      <el-table-column prop="created_at" min-width="100px" :label="$t('__operationTime')" align="center" sortable />
      <el-table-column v-if="isAdminister" prop="uri" min-width="120px" label="Uri" align="center" />
      <el-table-column v-if="isAdminister" prop="method" min-width="60px" :label="$t('__method')" align="center" />
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
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { operationLogSearch, operationLogExport } from '@/api/logManagement/operationLog'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { getFullDate, getFullDateString, getLastDate, getLastDateClearTime } from '@/utils/transDate'
import { mapGetters } from 'vuex'

const defaultForm = {
  searchTime: getLastDateClearTime(0)
}

export default {
  name: 'OperationLog',
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: this.$t('__lastWeek'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(7))
          }
        }, {
          text: this.$t('__lastMonth'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(30))
          }
        }, {
          text: this.$t('__lastThreeMonths'),
          onClick(picker) {
            picker.$emit('pick', getLastDate(90))
          }
        }]
      },
      searchForm: JSON.parse(JSON.stringify(defaultForm)),
      showDetail: false
    }
  },
  computed: {
    ...mapGetters([
      'isAdminister'
    ])
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    onReset() {
      this.searchForm = JSON.parse(JSON.stringify(defaultForm))
    },
    handleRequest(data) {
      this.dataLoading = true
      if (!data.searchTime) {
        data.searchTime = JSON.parse(JSON.stringify(defaultForm)).searchTime
      }
      for (let i = 0, max = data.searchTime.length; i < max; i++) {
        data.searchTime[i] = getFullDate(data.searchTime[i])
      }
    },
    handleRespone(res) {
      this.tableData = res.rows
      this.showDetail = res.showDetail
      this.totalCount = res.totalCount
      this.dataLoading = false
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.searchForm.rowsCount = this.pageSize
      this.handleRequest(this.searchForm)
      operationLogSearch(this.searchForm).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onExportBtnClick() {
      this.dataLoading = true
      this.handleRequest(this.searchForm)
      operationLogExport(this.searchForm).then((res) => {
        this.onDataOut(res.rows)
        this.dataLoading = false
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onDataOut(tableData) {
      require.ensure([], () => {
        const { export_json_to_excel, formatJson } = require('@/vendor/Export2Excel')
        const tHeader = []
        const filterVal = []
        for (const item in tableData[0]) {
          tHeader.push(tableData[0][item])
          filterVal.push(item)
        }
        tableData.splice(0, 1)
        const list = JSON.parse(JSON.stringify(tableData))
        const data = formatJson(filterVal, list)
        export_json_to_excel({ header: tHeader, data: data, filename: 'OperationLog_' + getFullDateString(new Date()) })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container .el-form .el-form-item .el-input {
  width: 160px;
}
</style>
