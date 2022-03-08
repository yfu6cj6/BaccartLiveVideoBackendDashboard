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
          <el-table-column :label="$t('__operate')" align="center" width="auto" min-width="200px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEditBtnClick(scope.row)">{{ $t("__edit") }}</el-button>
            </template>
          </el-table-column>
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

    <AgentEditDialog
      :title="$t('__edit')"
      :visible="editDialogVisible"
      :confirm="$t('__revise')"
      :form="selectForm"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
      @confirm="editDialogConfirmEven"
    />

    <AgentCreateDialog
      :title="$t('__create')"
      :visible="createDialogVisible"
      :agent-info="selectAgentInfo"
      :pc-width="'30%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { agentSearch, agentCreate, agentEdit } from '@/api/agentManagement/agentList'
import handlePageChange from '@/layout/mixin/handlePageChange'
import shared from '@/layout/mixin/shared'
import handleViewResize from '@/layout/mixin/handleViewResize'
import AgentCreateDialog from './agentCreateDialog'
import AgentEditDialog from './agentEditDialog'

export default {
  name: 'AgentList',
  components: { AgentCreateDialog, AgentEditDialog },
  mixins: [handlePageChange, shared, handleViewResize],
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      agentLevel: [],
      selectAgentInfo: {},
      selectForm: {},
      createDialogVisible: false,
      editDialogVisible: false
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
      this.editDialogVisible = false
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
    onEditBtnClick(item) {
      this.selectForm = JSON.parse(JSON.stringify(item))
      this.createDialogVisible = false
      this.editDialogVisible = true
    },
    editDialogConfirmEven(data) {
      this.$confirm(this.$t('__confirmChanges')).then(_ => {
        this.editDialogVisible = false
        this.dataLoading = true
        agentEdit(data).then((res) => {
          this.handleRespone(res)
        }).catch(() => {
          this.handleResponeError()
        })
      }).catch(_ => {})
    },
    closeDialogEven() {
      this.editDialogVisible = false
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
