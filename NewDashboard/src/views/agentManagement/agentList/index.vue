<template>
  <div class="currencyManagement-container">
    <el-row>
      <el-col :span="3">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              v-loading="dataLoading"
              :data="agentLevel"
              :props="defaultProps"
              node-key="AgentId"
              :default-expanded-keys="treeDefaultExpandedKeys"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :indent="14"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="21">
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onCreateBtnClick()">{{ $t("__create") }}</el-button>
        <el-table v-loading="dataLoading" :data="tableData" border :max-height="viewHeight">
          <el-table-column prop="account" :label="$t('__agentAccount')" align="center" />
          <el-table-column prop="nickname" :label="$t('__agentNickname')" align="center" />
          <el-table-column prop="currency.code" :label="$t('__currency')" align="center" />
          <el-table-column prop="timeZone.city_name" :label="$t('__timeZone')" align="center" />
          <el-table-column prop="totalPlayer" :label="$t('__totalPlayer')" align="center" />
          <el-table-column prop="commission_rate" :label="$t('__commissionRate')" align="center" />
          <el-table-column prop="rolling_rate" :label="$t('__rollingRate')" align="center" />
          <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
        </el-table>

        <el-pagination
          layout="prev, pager, next, jumper"
          class="currencyManagement-pagination"
          :total="totalCount"
          background
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChangeByClient"
        />
      </el-col>
    </el-row>
    <AgentListDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :agent-info="selectAgentInfo"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { agentSearch, agentCreate } from '@/api/agentManagement/agentList'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AgentListDialog from './agentListDialog'

export default {
  name: 'AgentList',
  components: { AgentListDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      agentLevel: [],
      selectAgentInfo: {},
      createDialogVisible: false
    }
  },
  computed: {
    treeDefaultExpandedKeys() {
      return this.agentLevel.length === 0 ? [] : [this.agentLevel[0].AgentId]
    }
  },
  created() {
    this.setHeight()
    this.handleCurrentChange(1)
  },
  methods: {
    handleRespone(res) {
      this.allDataByClient = res.rows
      this.totalCount = res.rows.length
      this.handlePageChangeByClient(this.currentPage)
      this.agentLevel = res.agentLevel
      this.selectAgentInfo = JSON.parse(JSON.stringify(this.agentLevel[0]))
      this.dataLoading = false
    },
    handleResponeError() {
      this.dataLoading = false
    },
    onSubmit() {
      this.tableData = []
      this.dataLoading = true
      agentSearch().then((res) => {
        this.handleRespone(res)
      })
    },
    onCreateBtnClick() {
      this.createDialogVisible = true
    },
    createDialogConfirmEven(data) {
      this.createDialogVisible = false
      this.dataLoading = true
      agentCreate(data).then((res) => {
        this.handleRespone(res)
      }).catch(() => {
        this.handleResponeError()
      })
    },
    closeDialogEven() {
      this.createDialogVisible = false
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}
        </span>
      )
    },
    handleNodeClick(data) {
      this.selectAgentInfo = JSON.parse(JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss" scoped>
.currencyManagement {
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
