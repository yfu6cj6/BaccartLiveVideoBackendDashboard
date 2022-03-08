<template>
  <div class="operationLog-container">
    <el-form v-loading="selectLoading" class="filterForm" :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleCurrentChange(1)">{{ $t("__refresh") }}</el-button>
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__createdAt')">
        <el-date-picker
          v-model="searchForm.searchTime"
          type="datetimerange"
          align="right"
          unlink-panels
          :range-separator="$t('__to')"
          :start-placeholder="$t('__startDate')"
          :end-placeholder="$t('__endDate')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item class="inputTitle" label="IP">
        <el-input v-model="searchForm.ip" />
      </el-form-item>
      <el-form-item class="inputTitle" :label="$t('__description')">
        <el-input v-model="searchForm.description" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-minus" @click="onReset()">{{ $t("__reset") }}</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">{{ $t("__search") }}</el-button>
        <el-button type="primary" icon="el-icon-download" @click="onExportBtnClick()">{{ $t("__export") }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
      <el-table-column v-if="showDetail" type="expand">
        <template slot-scope="props">
          <el-form label-position="left">
            <el-form-item label="requestContent:">
              <span>{{ props.row.request_content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="userNickName" min-width="60px" :label="$t('__nickname')" align="center" sortable />
      <el-table-column prop="ip" min-width="80px" label="IP" align="center" sortable />
      <el-table-column prop="description" min-width="60px" :label="$t('__description')" align="center" />
      <el-table-column prop="created_at" min-width="100px" :label="$t('__createdAt')" align="center" sortable />
      <el-table-column prop="uri" min-width="120px" label="Uri" align="center" />
      <el-table-column prop="method" min-width="60px" :label="$t('__method')" align="center" />
    </el-table>

    <el-pagination
      layout="prev, pager, next, jumper"
      class="operationLog-pagination"
      :total="totalCount"
      background
      :page-size="pageSize"
      :current-page.sync="currentPage"
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

const defaultForm = {
  searchTime: getLastDateClearTime(3)
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
  },
  created() {
    this.setHeight()
  },
  methods: {
    onReset() {
      this.searchForm = JSON.parse(JSON.stringify(defaultForm))
    },
    handleRequest(data) {
      this.selectLoading = true
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
      this.currentPage = res.currentPage
      this.totalCount = res.totalCount
      this.selectLoading = false
      this.dataLoading = false
    },
    onSubmit() {
      this.searchForm.page = this.currentPage
      this.searchForm.rowsCount = this.pageSize
      this.handleRequest(this.searchForm)
      operationLogSearch(this.searchForm).then((res) => {
        this.handleRespone(res)
      })
    },
    onExportBtnClick() {
      this.selectLoading = true
      this.dataLoading = true
      this.handleRequest(this.searchForm)
      operationLogExport(this.searchForm).then((res) => {
        this.onDataOut(res.rows)
        this.selectLoading = false
        this.dataLoading = false
      })
    },
    onDataOut(tableData) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        const tHeader = []
        const filterVal = []
        for (const item in tableData[0]) {
          tHeader.push(tableData[0][item])
          filterVal.push(item)
        }
        tableData.splice(0, 1)
        const list = JSON.parse(JSON.stringify(tableData))
        const data = this.formatJson(filterVal, list)
        export_json_to_excel({ header: tHeader, data: data, filename: 'OperationLog_' + getFullDateString(new Date()) })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
.operationLog {
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
</style>
