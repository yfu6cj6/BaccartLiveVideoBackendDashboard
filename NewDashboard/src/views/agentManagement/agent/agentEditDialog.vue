<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <label class="agentNameLabel">{{ `${$t('__superiorAgent')}: ` }}
      <span class="agentNameSpan">{{ agentInfo.fullName }}</span>
    </label>
    <el-steps v-if="visible" :active="curIndex" align-center finish-status="success">
      <el-step v-if="hasStep('agentInfo')" :description="$t('__agentInfo')" />
      <el-step v-if="hasStep('rate')" :description="$t('__rate')" />
      <el-step v-if="hasStep('limit')" :description="$t('_handicapLimit')" />
      <el-step v-if="hasStep('balanceConfig')" :description="$t('__balanceConfig')" />
      <el-step v-if="hasStep('confirm')" :description="$t('__confirm')" />
    </el-steps>
    <el-form v-show="curIndex === stepEnum.agentInfo" ref="step1" :model="form" :rules="step1Rules" label-width="80px" :label-position="formLabelPosition">
      <el-form-item :label="$t('__accountGenerateMode')">
        <el-switch
          v-model="autoGenerateAccount"
          active-color="#f9c901"
          inactive-color="#f9c901"
          :active-text="$t('__auto')"
          :inactive-text="$t('__manual')"
        />
      </el-form-item>
      <el-form-item :label="$t('__agentAccount')" prop="account">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item :label="$t('__agentNickname')" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item v-if="operationType===operationEnum.create&&visible" :label="$t('__password')" prop="password">
        <el-input v-model="form.password" show-password />
      </el-form-item>
      <el-form-item v-if="operationType===operationEnum.create&&visible" :label="$t('__confirmPassword')" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" show-password />
      </el-form-item>
      <el-form-item :label="$t('__accountStatus')" prop="status">
        <el-select v-model="form.status">
          <el-option v-for="item in accountStatusType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__betStatus')" prop="bet_status">
        <el-select v-model="form.bet_status">
          <el-option v-for="item in accountStatusType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__timeZone')" prop="time_zone">
        <el-select v-model="form.time_zone">
          <el-option v-for="item in time_zone" :key="item.id" :label="item.city_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showCurrency" :label="$t('__currency')" prop="currency">
        <el-select v-model="form.currency">
          <el-option v-for="item in currency" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__remark')" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <el-form v-show="curIndex === stepEnum.rate" ref="step2" :model="form" :rules="step2Rules" label-width="120px" :label-position="formLabelPosition">
      <el-form-item :label="$t('__liveCommissionRate')" prop="live_commission_rate">
        <el-input v-model="form.live_commission_rate" class="step2Input" type="number" :disabled="agentInfo.live_commission_rate === 0" min="0" :max="agentInfo.live_commission_rate" />
        <span class="step2Span">{{ commissionRateTip }}</span>
      </el-form-item>
      <el-form-item :label="$t('__liveRollingRate')" prop="live_rolling_rate">
        <el-input v-model="form.live_rolling_rate" class="step2Input" type="number" :disabled="agentInfo.live_rolling_rate === 0" min="0" :max="agentInfo.live_rolling_rate" />
        <span class="step2Span">{{ rollingRateTip }}</span>
      </el-form-item>
    </el-form>
    <el-table
      v-show="curIndex === stepEnum.limit"
      ref="handicapsTable"
      :data="agentInfo.handicaps"
      tooltip-effect="dark"
      header-cell-class-name="bg-black_table_header"
      row-class-name="bg-black_table_col"
      style="background: black;"
      @selection-change="handleSelectionHandicaps"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
    </el-table>
    <el-form v-show="curIndex === stepEnum.balanceConfig" ref="step4" :model="form" :rules="step4Rules" label-width="70px" :label-position="formLabelPosition">
      <template>
        <div class="step4Info">
          <label>{{ `${$t('__superiorAgent')}: ` }}
            <span>{{ agentBalanceInfo.parent }}</span>
          </label>
          <br>
          <label>{{ `${$t('__balance')}: ` }}
            <span>{{ parentBalance }}</span>
          </label>
          <br>
          <label>{{ `${$t('__agentAccount')}: ` }}
            <span>{{ agentBalanceInfo.agent }}</span>
          </label>
          <br>
          <label>{{ `${$t('__balance')}: ` }}
            <span>{{ agentBalanceInfo.agentBalance }}</span>
          </label>
        </div>
      </template>
      <el-form-item :label="$t('__depositBalance')" prop="balance">
        <el-input v-model="form.balance" type="number" :disabled="balanceDisable" min="0" />
      </el-form-item>
    </el-form>
    <el-form v-show="curIndex === stepEnum.confirm" ref="step5" :model="form" :rules="step5Rules" label-width="80px" :label-position="formLabelPosition">
      <el-row>
        <el-col :span="12">
          <label class="step5Header">{{ $t('__agentInfo') }}</label>
          <div class="v-line96" />
          <div class="step5Info">
            <label>{{ $t('__agentAccount') }}
              <span>{{ form.account }}</span>
            </label>
            <br>
            <label>{{ $t('__agentNickname') }}
              <span>{{ form.nickname }}</span>
            </label>
            <br>
            <label>{{ $t('__timeZone') }}
              <span>{{ timeZoneCityName }}</span>
            </label>
            <br>
            <template v-if="showCurrency">
              <label>{{ $t('__currency') }}
                <span>{{ currencyName }}</span>
              </label>
              <br>
            </template>
            <template v-if="operationType===operationEnum.create">
              <label>{{ $t('__balance') }}
                <span>{{ numberFormatStr(form.balance) }}</span>
              </label>
              <br>
            </template>
            <label>{{ $t('__remark') }}
              <span>{{ form.remark }}</span>
            </label>
          </div>
        </el-col>
        <el-col :span="12">
          <label class="step5Header">{{ $t('__rate') }}</label>
          <div class="v-line96" />
          <div class="step5Info">
            <label>{{ $t('__liveCommissionRate') }}
              <span>{{ `${numberFormatStr(form.live_commission_rate)}%` }}</span>
            </label>
            <br>
            <label>{{ $t('__liveRollingRate') }}
              <span>{{ `${numberFormatStr(form.live_rolling_rate)}%` }}</span>
            </label>
          </div>
        </el-col>
      </el-row>
      <el-row class="rowStep5LimitTable">
        <label class="step5Header">{{ $t('_handicapLimit') }}</label>
        <div class="v-line100" />
        <el-table
          :data="selectHandicaps"
          tooltip-effect="dark"
          header-cell-class-name="bg-black_table_header"
          row-class-name="bg-black_table_col"
          style="background: black;"
        >
          <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
        </el-table>
        <el-form-item v-if="visible" :label="$t('__userPassword')" prop="userPassword" style="text-align: left;">
          <el-input v-model="form.userPassword" show-password />
        </el-form-item>
      </el-row>
    </el-form>
    <span v-show="!dialogLoading" slot="footer">
      <el-button v-show="previousBtnVisible" class="bg-gray" @click="onPreviousBtnClick">{{ $t("__previous") }}</el-button>
      <el-button v-show="nextBtnVisible" class="bg-yellow" @click="onNextBtnClick">{{ $t("__nextStep") }}</el-button>
      <el-button v-show="confirmBtnVisible" class="bg-yellow" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import { agentCreateAccount, agentGetSetBalanceInfo, agentCreate, agentEdit } from '@/api/agentManagement/agent'
import { mapGetters } from 'vuex'
import { numberFormat } from '@/utils/numberFormat'

export default {
  name: 'AgentEditDialog',
  mixins: [handleDialogWidth],
  props: {
    'title': {
      type: String,
      require: true,
      default() {
        return ''
      }
    },
    'visible': {
      type: Boolean,
      require: true
    },
    'operationType': {
      type: Number,
      require: true,
      default() {
        return 0
      }
    },
    'agentInfo': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    },
    'confirm': {
      type: String,
      require: true,
      default() {
        return ''
      }
    },
    'form': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    },
    'stepEnum': {
      type: Object,
      require: true,
      default() {
        return Object.freeze({ 'agentInfo': 0, 'rate': 1, 'limit': 2, 'balanceConfig': 3, 'confirm': 4 })
      }
    }
  },
  data: function() {
    const validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else if (value.trim().length < 5) {
        callback(new Error(`${this.$t('__lengthLess')}5`))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.password !== this.form.confirmPassword) {
        callback(new Error(`${this.$t('__confirmPassword')}${this.$t('__and')}${this.$t('__password')}${this.$t('__inconsistent')}`))
      } else {
        callback()
      }
    }
    const validateCommissionRate = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.live_commission_rate > this.agentInfo.live_commission_rate) {
        callback(new Error(this.$t('__overMax')))
      } else if (this.form.live_commission_rate < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else {
        callback()
      }
    }
    const validateRollingRate = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.live_rolling_rate > this.agentInfo.live_rolling_rate) {
        callback(new Error(this.$t('__overMax')))
      } else if (this.form.live_rolling_rate < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else {
        callback()
      }
    }
    const validateBlance = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.balance < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else if (this.agentBalanceInfo.parentId !== 1 && Number(this.form.balance) > Number(this.agentBalanceInfo.parentBalance)) {
        callback(new Error(this.$t('__overMax')))
      } else {
        callback()
      }
    }
    return {
      step1Rules: {
        account: [{ required: true, trigger: 'blur', validator: validatePassword }],
        nickname: [{ required: true, trigger: 'blur', validator: validate }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      step2Rules: {
        live_commission_rate: [{ required: true, trigger: 'blur', validator: validateCommissionRate }],
        live_rolling_rate: [{ required: true, trigger: 'blur', validator: validateRollingRate }]
      },
      step4Rules: {
        balance: [{ required: true, trigger: 'blur', validator: validateBlance }]
      },
      step5Rules: {
        userPassword: [{ required: true, trigger: 'blur', validator: validate }]
      },
      operationEnum: Object.freeze({ 'create': 1, 'edit': 2 }),
      autoGenerateAccount: false,
      curIndex: 0,
      time_zone: [],
      currency: [],
      agentBalanceInfo: {},
      dialogLoading: false,
      selectHandicaps: []
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType'
    ]),
    formLabelPosition() {
      return 'left'
    },
    commissionRateTip() {
      return `${this.$t('__range')}0%-${this.agentInfo.live_commission_rate}%`
    },
    rollingRateTip() {
      return `${this.$t('__range')}0%-${this.agentInfo.live_rolling_rate}%`
    },
    previousBtnVisible() {
      return this.curIndex > this.stepEnum.agentInfo
    },
    nextBtnVisible() {
      if (this.curIndex === this.stepEnum.limit) {
        return this.selectHandicaps.length > 0
      }
      return this.curIndex < this.stepEnum.confirm
    },
    confirmBtnVisible() {
      return this.curIndex >= this.stepEnum.confirm
    },
    showCurrency() {
      return this.operationType === this.operationEnum.create && this.agentInfo.id === 1
    },
    balanceDisable() {
      if (this.agentBalanceInfo.parentId === 1) {
        return false
      }
      return Number(this.agentBalanceInfo.parentBalance) === 0
    },
    timeZoneCityName() {
      const timeZoneData = this.time_zone.find(timezone => this.form.time_zone === timezone.id)
      return timeZoneData ? timeZoneData.city_name : ''
    },
    currencyName() {
      const currencyData = this.currency.find(currencyItem => this.form.currency === currencyItem.id)
      return currencyData ? currencyData.name : ''
    },
    parentBalance() {
      return this.agentBalanceInfo.parentId === 1 ? '∞' : this.agentBalanceInfo.parentBalance
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.curIndex = this.stepEnum.agentInfo
      } else {
        this.autoGenerateAccount = false
        this.$refs.step1.clearValidate()
        this.$refs.step2.clearValidate()
        this.$refs.step4.clearValidate()
        this.$refs.step5.clearValidate()
      }
    },
    autoGenerateAccount() {
      if (this.autoGenerateAccount) {
        agentCreateAccount().then((res) => {
          this.form.account = res.account
          this.$refs.step1.clearValidate()
        }).catch(() => {
          this.autoGenerateAccount = false
        })
      }
    },
    curIndex() {
      if (this.curIndex === this.stepEnum.limit) {
        this.agentInfo.handicaps.forEach(agentInfoHandicap => {
          if (this.form.handicaps.some(formHandicaps => formHandicaps.id === agentInfoHandicap.id)) {
            this.$refs.handicapsTable.toggleRowSelection(agentInfoHandicap, true)
          }
        })
      } else if (this.curIndex === this.stepEnum.balanceConfig) {
        const id = this.operationType === this.operationEnum.create ? this.agentInfo.id : this.form.id
        this.dialogLoading = true
        agentGetSetBalanceInfo({ agentId: id }).then((res) => {
          this.agentBalanceInfo = res.rows
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    }
  },
  methods: {
    hasStep(step) {
      for (const stepKey in this.stepEnum) {
        if (step === stepKey) {
          return true
        }
      }
      return false
    },
    numberFormatStr(number) {
      return numberFormat(number)
    },
    handleSelectionHandicaps(val) {
      this.selectHandicaps = val
    },
    onNextBtnClick() {
      let next = false
      if (this.curIndex === this.stepEnum.agentInfo) {
        this.$refs.step1.validate((valid) => {
          next = valid
        })
      } else if (this.curIndex === this.stepEnum.rate) {
        this.$refs.step2.validate((valid) => {
          next = valid
        })
      } else if (this.curIndex === this.stepEnum.limit) {
        next = true
      } else if (this.curIndex === this.stepEnum.balanceConfig) {
        this.$refs.step4.validate((valid) => {
          next = valid
        })
      }

      if (next) {
        this.curIndex++
      }
    },
    onPreviousBtnClick() {
      this.curIndex--
    },
    onClose() {
      this.$emit('close')
    },
    onSubmit() {
      this.$refs.step5.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          data.handicaps = []
          this.selectHandicaps.forEach(element => {
            data.handicaps.push(element.id)
          })
          if (this.operationType === this.operationEnum.create) {
            data.parent = this.agentInfo.id
            this.dialogLoading = true
            agentCreate(data).then((res) => {
              this.$emit('editSuccess', JSON.parse(JSON.stringify(res)))
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          } else if (this.operationType === this.operationEnum.edit) {
            this.confirmMsg(`${this.$t('__confirmChanges')}?`, () => {
              this.dialogLoading = true
              agentEdit(data).then((res) => {
                this.$emit('editSuccess', JSON.parse(JSON.stringify(res)))
                this.dialogLoading = false
              }).catch(() => {
                this.dialogLoading = false
              })
            })
          }
        }
      })
    },
    setTimeZone(data) {
      this.time_zone = data
    },
    setCurrency(data) {
      this.currency = data
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  font-weight: 300;
}

.agentNameLabel {
  font-size: 14px;
  color: #fff
}

.agentNameSpan {
  color: #f9c901;
}

span {
  color: #fff;
}

.step2Input.el-input {
  width: 70%;
}

.step2Span {
  line-height: 10px;
  display: inline;
  font-size: 10px;
  padding: 0 0 0 10px;
  color: #bbb;
}

.step4Info {
  margin: 10px 0 0 0;
  label {
    color: #f9c901;
    font-size: 10px;
    font-weight: 500;
  }
}

.step5Header {
  font-size: 16px;
  color: #f9c901;
  font-weight: 600;
}

.step5Info {
  label {
    color: #f9c901;
    font-size: 10px;
    font-weight: 500;
  }
  span {
    float: right;
    margin-right: 20px;
  }
}

.rowStep5LimitTable {
  text-align: center;
}

.v-line100 {
  border-bottom: 0.08333rem solid #f9c901;
  width: 100%;
  height: 1px;
}

.v-line96 {
  border-bottom: 0.08333rem solid #f9c901;
  width: 96%;
  height: 1px;
}

.el-steps--horizontal {
  margin: 15px 0;
}

.el-button {
  width: 150px;
  padding: 8px 0;
}

.el-select,
.el-input,
.el-textarea{
  width: 90%;
}
</style>
