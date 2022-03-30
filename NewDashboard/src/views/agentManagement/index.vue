<template>
  <div v-loading="dataLoading" class="view-container">
    <el-row class="agentInfoFormData">
      <el-button class="bg-yellow" size="mini" @click="onTableBtnClick(curTableIndex)">{{ $t("__refresh") }}</el-button>
      <label>{{ `${$t('__agent')}:` }}
        <span>{{ agentInfo.fullName }}</span>
      </label>
      <label>{{ `${$t('__currency')}:` }}
        <span>{{ agentInfo.currency }}</span>
      </label>
      <label>{{ `${$t('__balance')}:` }}
        <span :class="{'agentInfoBalance': agentInfo.id === 1}">{{ agentInfoBalance }}</span>
      </label>
      <label>
        <el-button class="bg-yellow" size="mini" @click="onLimitBtnClick(agentInfo.handicaps)">
          {{ $t("_handicapLimit") }}
        </el-button>
      </label>
      <br>
      <label>{{ `${$t('__commissionRate')}:` }}
        <span>{{ numberFormatStr(agentInfo.live_commission_rate) + '%' }}</span>
      </label>
      <label>{{ `${$t('__rollingRate')}:` }}
        <span>{{ numberFormatStr(agentInfo.live_rolling_rate) + '%' }}</span>
      </label>
      <label>{{ `${$t('__accountStatus')}:` }}
        <span :class="{'enable':agentInfo.status === '1', 'disEnable':agentInfo.status !== '1'}">{{ $t(agentInfo.accountStatus) }}</span>
      </label>
      <label>{{ `${$t('__betStatus')}:` }}
        <span :class="{'enable':agentInfo.bet_status === '1', 'disEnable':agentInfo.bet_status !== '1'}">{{ $t(agentInfo.betStatus) }}</span>
      </label>
      <label>{{ `${$t('__directAgentCount')}:` }}
        <span>{{ agentInfo.directAgentCount }}</span>
      </label>
      <label>{{ `${$t('__directPlayerCount')}:` }}
        <span>{{ agentInfo.directPlayerCount }}</span>
      </label>
      <label>
        <el-button class="bg-yellow" size="mini" @click="onTotalPlayerBtnClick()">
          {{ $t("__totalPlayerCount") + ':' }}
          <span>{{ agentInfo.totalPlayerCount }}</span>
        </el-button>
      </label>
      <label>{{ $t('__createdAt') + ':' }}
        <span>{{ agentInfo.created_at }}</span>
      </label>
      <label>{{ $t('__lastLoginAt') + ':' }}
        <span>{{ agentInfo.lastLoginAt }}</span>
      </label>
    </el-row>
    <el-row class="agentInfoForm">
      <el-col :span="5">
        <el-button class="agentInfoFormBtn" :class="{'focus': curTableIndex === tableEnum.agent}" size="mini" @click="onTableBtnClick(tableEnum.agent)">{{ $t("__agent") }}</el-button>
      </el-col>
      <el-col :span="5">
        <el-button class="agentInfoFormBtn" :class="{'focus': curTableIndex === tableEnum.member}" size="mini" @click="onTableBtnClick(tableEnum.member)">{{ $t("__member") }}</el-button>
      </el-col>
      <el-col :span="5">
        <el-button class="agentInfoFormBtn" :class="{'focus': curTableIndex === tableEnum.subAccount}" size="mini" @click="onTableBtnClick(tableEnum.subAccount)">{{ $t("__subAccount") }}</el-button>
      </el-col>
      <el-col :span="9" class="agentInfoFormOther">
        <el-button v-if="!isAgentSubAccount" class="bg-yellow" size="mini" @click="onAddSubBtnClick()">{{ addSubLabel }}</el-button>
      </el-col>
    </el-row>
    <agent
      v-show="curTableIndex === tableEnum.agent"
      ref="agent"
      :view-height="viewHeight"
      @serverResponse="handleRespone"
      @setDataLoading="setDataLoading"
    />
    <member
      v-show="curTableIndex === tableEnum.member"
      ref="member"
      :view-height="viewHeight"
      @serverResponse="handleRespone"
      @setDataLoading="setDataLoading"
    />

    <subAccount
      v-show="curTableIndex === tableEnum.subAccount"
      ref="subAccount"
      :view-height="viewHeight"
      @serverResponse="handleRespone"
      @setDataLoading="setDataLoading"
    />

    <limitDialog
      :title="$t('_handicapLimit')"
      :visible="curDialogIndex === dialogEnum.limit"
      :handicaps="handicaps"
      @close="closeDialogEven"
    />
  </div>
</template>

<script>
import { agentTotalPlayerCount } from '@/api/agentManagement/agent'
import LimitDialog from '@/views/agentManagement/limitDialog'
import Agent from './agent/index'
import Member from './member/index'
import SubAccount from './subAccount/index'
import handleViewResize from '@/layout/mixin/handleViewResize'
import { mapGetters } from 'vuex'
import { numberFormat } from '@/utils/numberFormat'

export default {
  name: 'AgentManagement',
  components: { LimitDialog, Agent, Member, SubAccount },
  mixins: [handleViewResize],
  data() {
    return {
      tableEnum: Object.freeze({
        'agent': 0,
        'member': 1,
        'subAccount': 2
      }),
      dialogEnum: Object.freeze({
        'none': 0,
        'limit': 1
      }),
      agentInfo: {},
      handicaps: [],
      curTableIndex: 0,
      dataLoading: false,
      curDialogIndex: 0,
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType',
      'isAgentSubAccount'
    ]),
    addSubLabel() {
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          return this.$t('__addSubAgent')
        }
        case this.tableEnum.member: {
          return this.$t('__addMember')
        }
        case this.tableEnum.subAccount: {
          return this.$t('__addSubAccount')
        }
      }
      return ''
    },
    agentInfoBalance() {
      return this.agentInfo.id === 1 ? 'oo' : this.agentInfo.balance
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    this.formClassName = ['agentInfoFormData', 'agentInfoForm']
    this.$nextTick(() => {
      this.agentInfo.id = this.$route.params && this.$route.params.id
      this.onTableBtnClick(this.tableEnum.agent)
    })
  },
  methods: {
    setTagsViewTitle() {
      const title = this.$t(this.tempRoute.meta.title)
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.agentInfo.fullName}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    numberFormatStr(number) {
      return numberFormat(number)
    },
    setDataLoading(dataLoading) {
      this.dataLoading = dataLoading
    },
    handleRespone(res) {
      this.$store.dispatch('agentManagement/setAgentLevel', res.agentLevel)
      this.agentInfo = res.agentInfo
      this.agentInfo.currency = this.agentInfo.currency.code
      this.agentInfo.fullName = this.agentInfo.nickname + '(' + this.agentInfo.account + ')'
      this.agentInfo.accountStatus = this.accountStatusType.find(element => element.key === this.agentInfo.status).nickname
      this.agentInfo.betStatus = this.accountStatusType.find(element => element.key === this.agentInfo.bet_status).nickname

      this.setTagsViewTitle()
      this.dataLoading = false
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
      }).catch(() => {
        this.dataLoading = false
      })
    },
    onTableBtnClick(tableEnum) {
      this.curTableIndex = tableEnum
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          this.$refs.agent.onSearch(this.agentInfo.id)
          break
        }
        case this.tableEnum.member: {
          this.$refs.member.onSearch(this.agentInfo.id)
          break
        }
        case this.tableEnum.subAccount: {
          this.$refs.subAccount.onSearch(this.agentInfo.id)
          break
        }
      }
    },
    async onAddSubBtnClick() {
      switch (this.curTableIndex) {
        case this.tableEnum.agent: {
          await this.$refs.agent.create()
          break
        }
        case this.tableEnum.member: {
          await this.$refs.member.create()
          break
        }
        case this.tableEnum.subAccount: {
          await this.$refs.subAccount.create()
          break
        }
      }
    },
    closeDialogEven() {
      this.curDialogIndex = this.dialogEnum.none
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
  font-weight: normal;
}

.agentInfoBalance {
  letter-spacing: -2px;
}

.agentInfoFormData {
  margin: 10px 0 5px 0;
}

.agentInfoForm {
  background: #333;
  height: 44px;
  .agentInfoFormBtn {
    background: #333;
    color: #fff;
    border: 1px solid #d8dce5;
    height: 44px;
    width: 100%;
    padding: 14px 5px;
    font-size: 14px;
    font-weight: 700;
  }
  .agentInfoFormBtn:hover,
  .focus {
    color: #f9c901;
  }
  .agentInfoFormOther {
    height: 44px;
    line-height: 44px;
  }
}

.el-button {
  padding-left: 5px;
  padding-right: 5px;
}

span {
  font-weight: bold;
}

.enable {
  color: rgb(35, 179, 35);
}

.disEnable {
  color: red;
}
.el-button+.el-button {
  margin: 0 0 0 5px;
}
</style>
