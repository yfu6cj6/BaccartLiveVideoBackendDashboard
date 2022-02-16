<template>
  <div class="agentCreate-container">
    <el-row>
      <el-col v-loading="roleLoading" :span="6">
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
          v-loading="infoLoading"
          class="filterForm"
          label-width="170px"
          style="max-width: 450px; margin: 0 auto"
          :model="form"
        >
          <el-form-item :label="$t('__toAddAgentID')">
            <el-input
              v-model="form.parentAgentId"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('__name')">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item :label="$t('__betRange')">
            <el-select v-model="form.oddType">
              <el-option
                v-for="item in oddType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__gameClientUrl')">
            <el-input v-model="form.gameClientUrl" />
          </el-form-item>
          <el-form-item :label="$t('__currency')">
            <el-select v-model="form.currency">
              <el-option
                v-for="item in currencyList"
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__walletType')">
            <el-select v-model="form.walletType">
              <el-option
                v-for="item in walletType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__domain')">
            <el-input v-model="form.domain" />
          </el-form-item>
          <el-form-item :label="$t('__timezone')">
            <el-select v-model="form.timeZone">
              <el-option
                v-for="item in timezoneList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__commissionRate')">
            <el-input v-model="form.commissionRate" />
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
import { mapGetters } from 'vuex'
import { getAgentCreateSelect, createAgent, getAgentLevelInfo } from '@/api/operation_agent'
import { form } from './model.js'

export default {
  name: 'AgentCreate',
  data() {
    return {
      form: JSON.parse(JSON.stringify(form)),
      defaultForm: JSON.parse(JSON.stringify(form)),
      currencyList: [],
      treeData: {
        subAgentLevelInfos: []
      },
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      roleLoading: false,
      infoLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'timezoneList',
      'oddType',
      'walletType'
    ])
  },
  created() {
    this.initAllSelectMenu()
  },
  methods: {
    async initAllSelectMenu() {
      this.$store.dispatch('operation_agent/setSelectMenu')
      this.roleLoading = true
      this.infoLoading = true
      // 初始化下拉選單的值
      await getAgentCreateSelect(this.token).then((res) => {
        this.currencyList = res.Data.Currencies
        this.form.currency = this.currencyList[0].Code
        this.form.timeZone = this.timezoneList[0].value
        this.form.oddType = this.oddType[0].value
        this.form.walletType = this.walletType[0].value
        this.roleLoading = false
      }).then(() => {
        getAgentLevelInfo(this.token).then((res) => {
          this.treeData.subAgentLevelInfos = [res.Data.AgentLevelInfo]
          this.form.parentAgentId = res.Data.AgentLevelInfo.AgentId
          this.infoLoading = false
        })
      })
    },
    onSubmit() {
      createAgent(this.token, this.form).then(getAgentLevelInfo(this.token).then((res) => {
        this.treeData.subAgentLevelInfos = [res.Data.AgentLevelInfo]
        this.form.parentAgentId = res.Data.AgentLevelInfo.AgentId
        this.reset()
        this.infoLoading = false
      }))
    },
    reset() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    handleNodeClick(data) {
      this.form.parentAgentId = data.AgentId
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
