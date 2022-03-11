<template>
  <div v-loading="dataLoading" class="agentManagement-container">
    <el-row>
      <el-col :span="3">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
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
        <el-row>
          <label class="labelTitle">{{ $t('__agent') + ':' }}
            <span class="labelContent">{{ agentInfo.fullName }}</span>
          </label>
          <label class="labelTitle">{{ $t('__currency') + ':' }}
            <span class="labelContent">{{ agentInfo.currency }}</span>
          </label>
          <label class="labelTitle">{{ $t('__balance') + ':' }}
            <span class="labelContent">{{ agentInfo.balance }}</span>
          </label>
          <label>
            <el-button class="labelButton" type="primary" size="mini" @click="onLimitBtnClick(agentInfo.handicaps)">
              {{ $t("__limit") }}
            </el-button>
          </label>
          <br>
          <label class="labelTitle">{{ $t('__commissionRate') + ':' }}
            <span class="labelContent">{{ numberFormatStr(agentInfo.commission_rate) + '%' }}</span>
          </label>
          <label class="labelTitle">{{ $t('__rollingRate') + ':' }}
            <span class="labelContent">{{ numberFormatStr(agentInfo.rolling_rate) + '%' }}</span>
          </label>
          <label class="labelTitle">{{ $t('__accountStatus') + ':' }}
            <span class="labelContent" :class="{'enable':accountStatusEnable, 'disEnable':!accountStatusEnable}">{{ $t(agentInfo.accountStatus) }}</span>
          </label>
          <label class="labelTitle">{{ $t('__betStatus') + ':' }}
            <span class="labelContent" :class="{'enable':betStatusEnable, 'disEnable':!betStatusEnable}">{{ $t(agentInfo.betStatus) }}</span>
          </label>
          <label class="labelTitle">{{ $t('__directAgentCount') + ':' }}
            <span class="labelContent">{{ agentInfo.directAgentCount }}</span>
          </label>
          <label class="labelTitle">{{ $t('__directPlayerCount') + ':' }}
            <span class="labelContent">{{ agentInfo.directPlayerCount }}</span>
          </label>
          <label>
            <el-button class="labelButton" type="primary" size="mini" @click="onTotalPlayerBtnClick()">
              {{ $t("__totalPlayerCount") + ':' }}
              <span>{{ agentInfo.totalPlayerCount }}</span>
            </el-button>
          </label>
          <label class="labelTitle">{{ $t('__createdAt') + ':' }}
            <span class="labelContent">{{ agentInfo.created_at }}</span>
          </label>
          <label class="labelTitle">{{ $t('__lastLoginAt') + ':' }}
            <span class="labelContent">{{ agentInfo.lastLoginAt }}</span>
          </label>
        </el-row>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onTableBtnClick(tableEnum.agent, agentInfo.id)">{{ $t("__agent") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onTableBtnClick(tableEnum.member, agentInfo.id)">{{ $t("__member") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onTableBtnClick(tableEnum.subAccount, agentInfo.id)">{{ $t("__subAccount") }}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="onAddSubBtnClick()">{{ addSubLabel }}</el-button>
        <Agent
          v-show="curTableIndex === tableEnum.agent"
          ref="agent"
          :view-height="viewHeight"
          @serverResponse="handleAgentRespone"
          @setDataLoading="setDataLoading"
        />
        <Member
          v-show="curTableIndex === tableEnum.member"
          ref="member"
          :view-height="viewHeight"
          @serverResponse="handleMemberRespone"
          @setDataLoading="setDataLoading"
        />
      </el-col>
    </el-row>

    <LimitDialog
      :title="$t('__limit')"
      :visible="curDialogIndex === dialogEnum.limit"
      :handicaps="handicaps"
      :pc-width="'35%'"
      :mobile-width="'40%'"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { agentSearch, agentTotalPlayerCount } from '@/api/agentManagement/agentList'
import { memberSearch } from '@/api/agentManagement/memberList'
import LimitDialog from '@/views/agentManagement/limitDialog'
import Agent from './agent/index'
import Member from './member/index'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { mapGetters } from 'vuex'
import { numberFormat } from '@/utils/numberFormat'

export default {
  name: 'AgentManagement',
  components: { LimitDialog, Agent, Member },
  mixins: [handleViewResize],
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      tableEnum: Object.freeze({
        'agent': 0,
        'member': 1,
        'subAccount': 2
      }),
      dialogEnum: Object.freeze({
        'none': 0,
        '1imit': 1
      }),
      agentLevel: [],
      agentInfo: {},
      handicaps: [],
      curTableIndex: 0,
      accountStatusEnable: false,
      betStatusEnable: false,
      dataLoading: false,
      curDialogIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'agentAccountStatusType'
    ]),
    treeDefaultExpandedKeys() {
      return this.agentLevel.length === 0 ? [] : [this.agentLevel[0].AgentId]
    },
    addSubLabel() {
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          return this.$t('__addSubAgent')
        }
        case this.tableEnum.member: {
          return this.$t('__addMember')
        }
        case this.tableEnum.subAccount: {
          return ''
        }
      }
      return ''
    }
  },
  created() {
    this.setHeight()
    this.onTableBtnClick(this.tableEnum.agent)
  },
  methods: {
    numberFormatStr(number) {
      return numberFormat(number)
    },
    setDataLoading(dataLoading) {
      this.dataLoading = dataLoading
    },
    handleRespone(res) {
      this.agentLevel = res.agentLevel

      this.agentInfo = res.agentInfo
      this.agentInfo.currency = this.agentInfo.currency.code
      this.agentInfo.fullName = this.agentInfo.nickname + '(' + this.agentInfo.account + ')'
      this.agentInfo.accountStatus = this.agentAccountStatusType.find(element => element.key === this.agentInfo.status).nickname
      this.agentInfo.betStatus = this.agentAccountStatusType.find(element => element.key === this.agentInfo.bet_status).nickname

      this.accountStatusEnable = this.agentInfo.status === '1'
      this.betStatusEnable = this.agentInfo.bet_status === '1'
      this.dataLoading = false
    },
    handleAgentRespone(res) {
      this.handleRespone(res)
      this.$refs.agent.setAgentTableData(res.rows, JSON.parse(JSON.stringify(this.agentInfo)))
    },
    handleMemberRespone(res) {
      this.handleRespone(res)
      this.$refs.member.setMemberTableData(res.rows, JSON.parse(JSON.stringify(this.agentInfo)))
    },
    onLimitBtnClick(handicaps) {
      this.handicaps = JSON.parse(JSON.stringify(handicaps))
      this.curDialogIndex = this.dialogEnum.limit
    },
    onTotalPlayerBtnClick() {
      this.dataLoading = true
      agentTotalPlayerCount({ agentId: this.agentInfo.id }).then((res) => {
        this.agentInfo.totalPlayerCount = res.totalPlayerCount
        this.dataLoading = false
      })
    },
    onTableBtnClick(tableEnum, id) {
      this.curTableIndex = tableEnum
      this.dataLoading = true
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          agentSearch({ agentId: id }).then((res) => {
            this.handleAgentRespone(res)
          })
          break
        }
        case this.tableEnum.member: {
          memberSearch({ agentId: id }).then((res) => {
            this.handleMemberRespone(res)
          })
          break
        }
        case this.tableEnum.subAccount: {
          break
        }
      }
    },
    async onAddSubBtnClick() {
      this.dataLoading = true
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          await this.$refs.agent.agentCreate()
          break
        }
        case this.tableEnum.member: {
          break
        }
        case this.tableEnum.subAccount: {
          break
        }
      }
      this.dataLoading = false
    },
    closeDialogEven() {
      this.curDialogIndex = this.dialogEnum.none
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}
        </span>
      )
    },
    handleNodeClick(data) {
      this.onTableBtnClick(this.curTableIndex, data.AgentId)
    }
  }
}
</script>

<style lang="scss" scoped>
.agentManagement {
  &-container {
    margin: 5px;
  }
}

label {
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
}

.labelTitle {
  font-weight: normal;
}

.labelButton {
  padding-left: 5px;
  padding-right: 5px;
}

.labelContent {
  font-weight: bold;
}

.labelContent.enable {
  color: rgb(35, 179, 35);
}

.labelContent.disEnable {
  color: red;
}
</style>
