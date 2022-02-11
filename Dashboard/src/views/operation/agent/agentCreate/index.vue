<template>
  <div class="agentCreate-container">
    <el-row>
      <el-col :span="6">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              :data="treeData.subAgentLevelInfos"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form
          ref="form"
          class="filterForm"
          label-width="170px"
          style="max-width: 450px; margin: 0 auto"
          :model="searchForm"
        >
          <el-form-item :label="$t('__toAddAgentID')">
            <el-input
              v-model="searchForm.parentAgentId"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('__name')">
            <el-input v-model="searchForm.name" />
          </el-form-item>
          <el-form-item :label="$t('__betRange')">
            <el-select v-model="searchForm.oddType">
              <el-option
                v-for="item in oddType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__gameClientUrl')">
            <el-input v-model="searchForm.gameClientUrl" />
          </el-form-item>
          <el-form-item :label="$t('__currency')">
            <el-select v-model="searchForm.currency">
              <el-option
                v-for="item in currencyList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__walletType')">
            <el-select v-model="searchForm.walletType">
              <el-option
                v-for="item in walletType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__domain')">
            <el-input v-model="searchForm.domain" />
          </el-form-item>
          <el-form-item :label="$t('__timezone')">
            <el-select v-model="searchForm.timeZone">
              <el-option
                v-for="item in timeZoneList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__commissionRate')">
            <el-input v-model="searchForm.commissionRate" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{
              $t("__create")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAgentCreate } from '../Data'
import { mapGetters } from 'vuex'
import { getAgentCreateSelect, createAgent, getAgentLevelInfo } from '@/api/operation_agent'

export default {
  name: 'AgentCreate',
  data() {
    return {
      searchForm: getAgentCreate(),
      currencyList: [],
      treeData: {
        subAgentLevelInfos: []
      },
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      oddType: 0,
      walletType: 0
    }
  },
  computed: {
    ...mapGetters([
      'token'
      // 'oddType',
      // 'walletType',
      // 'getTimezoneList'
    ]),
    timeZoneList: {
      get() {
        return this.getTimezoneList
      },
      set() {}
    }
  },
  created() {
    this.initAllSelectMenu()
  },
  methods: {
    onSubmit() {
      createAgent(this.token, this.searchForm).then((res) => {
        this.treeData = { subAgentLevelInfos: [] }
        getAgentLevelInfo(this.token).then((res) => {
          this.treeData.subAgentLevelInfos = [res.Data.AgentLevelInfo]
          this.searchForm.agentId = res.Data.AgentLevelInfo.AgentId
        }).catch((e) => {

        })
      })
    },
    async initAllSelectMenu() {
      // 初始化下拉選單的值
      await getAgentCreateSelect(this.token).then((res) => {
        this.currencyList = res.Data.Currencies
        this.timeZoneList = res.Data.TimeZones
        // this.$store.dispatch('select_menu/changeSelectLang')
        this.searchForm.currency = this.currencyList[0].Code
        // this.searchForm.timeZone = this.timeZoneList[0].Id
        this.searchForm.timeZone = 0
        // this.searchForm.oddType = this.oddType[0].value
        // this.searchForm.walletType = this.walletType[0].value
        this.searchForm.oddType = 0
        this.searchForm.walletType = 0
      })
      getAgentLevelInfo(this.token).then((res) => {
        this.treeData.subAgentLevelInfos = [res.Data.AgentLevelInfo]
        this.searchForm.agentId = res.Data.AgentLevelInfo.AgentId
      })
    },
    handleNodeClick(data) {
      this.searchForm.parentAgentId = data.AgentId
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}，ID: {data.AgentId}
        </span>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.agentCreate {
  &-container {
    margin: 20px;
  }
}
.el-input {
  width: 150px;
}
.el-select {
  width: 150px;
}
.el-tree {
  display:inline-block;
}
</style>
