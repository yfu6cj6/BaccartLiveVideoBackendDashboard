<template>
  <el-dialog :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false">
    <div v-loading="dialogLoading">
      <label class="agentName">{{ $t('__superiorAgent') + ': ' }}
        <span>{{ agentInfo.fullName }}</span>
      </label>
      <el-steps :active="curIndex" align-center finish-status="success">
        <el-step v-if="hasStep('memberInfo')" :description="$t('__memberInfo')" />
        <el-step v-if="hasStep('rate')" :description="$t('__rollingRateAndLimit')" />
        <el-step v-if="hasStep('limit')" :description="$t('_handicapLimit')" />
        <el-step v-if="hasStep('balanceConfig')" :description="$t('__balanceConfig')" />
        <el-step v-if="hasStep('confirm')" :description="$t('__confirm')" />
      </el-steps>
      <el-form v-show="curIndex === stepEnum.memberInfo" ref="step1" :model="form" :rules="step1Rules">
        <el-form-item :label="$t('__accountGenerateMode')">
          <el-switch
            v-model="autoGenerateAccount"
            active-color="blue"
            inactive-color="blue"
            :active-text="$t('__auto')"
            :inactive-text="$t('__manual')"
          />
        </el-form-item>
        <el-form-item :label="$t('__memberAccount')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('__memberNickname')" prop="nick_name">
          <el-input v-model="form.nick_name" />
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
        <el-form-item :label="$t('__remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <el-form v-show="curIndex === stepEnum.rate" ref="step2" :model="form" :rules="step2Rules">
        <el-form-item :label="$t('__liveRollingRate')" prop="live_rolling_rate">
          <el-input v-model="form.live_rolling_rate" type="number" :disabled="agentInfo.live_rolling_rate === 0" min="0" :max="agentInfo.live_rolling_rate" />
          <span class="step2Tip">{{ rollingRateTip }}</span>
        </el-form-item>
        <el-form-item :label="$t('__maxWinAmountLimit')" prop="max_win_amount_limit">
          <el-input v-model="form.max_win_amount_limit" type="number" min="0" />
          <span class="step2Tip">{{ $t('__zeroMeansNoLimit') }}</span>
        </el-form-item>
        <el-form-item :label="$t('__maxLoseAmountLimit')" prop="max_lose_amount_limit">
          <el-input v-model="form.max_lose_amount_limit" type="number" min="0" />
          <span class="step2Tip">{{ $t('__zeroMeansNoLimit') }}</span>
        </el-form-item>
      </el-form>
      <el-table v-show="curIndex === stepEnum.limit" ref="handicapsTable" :data="agentInfo.handicaps" tooltip-effect="dark" @selection-change="handleSelectionHandicaps">
        <el-table-column type="selection" align="center" />
        <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
      </el-table>
      <el-form v-show="curIndex === stepEnum.balanceConfig" ref="step4" :model="form" :rules="step4Rules">
        <label>{{ $t('__superiorAgent') + ': ' }}
          <span>{{ agentInfo.fullName }}</span>
        </label>
        <br>
        <label>{{ $t('__agentBalance') + ': ' }}
          <span>{{ parentBalance }}</span>
        </label>
        <br>
        <label>{{ $t('__member') + ': ' }}
          <span>{{ form.nick_name }}</span>
        </label>
        <br>
        <label>{{ $t('__memberBalance') + ': ' }}
          <span>{{ numberFormatStr(0) }}</span>
        </label>
        <el-form-item :label="$t('__depositBalance')" prop="balance">
          <el-input v-model="form.balance" type="number" :disabled="balanceDisable" min="0" />
        </el-form-item>
      </el-form>
      <el-form v-show="curIndex === stepEnum.confirm" ref="step5" :model="form" :rules="step5Rules">
        <el-row>
          <el-col :span="12">
            <label>{{ $t('__memberInfo') }}</label>
            <br>
            <label>{{ $t('__memberAccount') }}
              <span>{{ form.name }}</span>
            </label>
            <br>
            <label>{{ $t('__memberNickname') }}
              <span>{{ form.nick_name }}</span>
            </label>
            <br>
            <label>{{ $t('__timeZone') }}
              <span>{{ timeZoneCityName }}</span>
            </label>
            <br>
            <template v-if="operationType===operationEnum.create">
              <label>{{ $t('__balance') }}
                <span>{{ numberFormatStr(form.balance) }}</span>
              </label>
              <br>
            </template>
            <label>{{ $t('__remark') }}
              <span>{{ form.remark }}</span>
            </label>
          </el-col>
          <el-col :span="12">
            <label>{{ $t('__rollingRateAndLimit') }}</label>
            <br>
            <label>{{ $t('__liveRollingRate') }}
              <span>{{ numberFormatStr(form.live_rolling_rate) + '%' }}</span>
            </label>
            <br>
            <label>{{ $t('__maxWinAmountLimit') }}
              <span>{{ numberFormatStr(form.max_win_amount_limit) + '%' }}</span>
            </label>
            <br>
            <label>{{ $t('__maxLoseAmountLimit') }}
              <span>{{ numberFormatStr(form.max_lose_amount_limit) + '%' }}</span>
            </label>
          </el-col>
        </el-row>
        <el-row>
          <label>{{ $t('_handicapLimit') }}</label>
          <el-table :data="selectHandicaps" tooltip-effect="dark" max-height="200px">
            <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
          </el-table>
        </el-row>
        <el-form-item v-if="visible" :label="$t('__userPassword')" prop="userPassword">
          <el-input v-model="form.userPassword" show-password />
        </el-form-item>
      </el-form>
    </div>
    <span v-show="!dialogLoading" slot="footer">
      <el-button v-show="previousBtnVisible" @click="onPreviousBtnClick">{{ $t("__previous") }}</el-button>
      <el-button v-show="nextBtnVisible" type="primary" @click="onNextBtnClick">{{ $t("__nextStep") }}</el-button>
      <el-button v-show="confirmBtnVisible" type="primary" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import { memberCreateAccount, memberCreate, memberEdit } from '@/api/agentManagement/memberList'
import { mapGetters } from 'vuex'
import { numberFormat } from '@/utils/numberFormat'

export default {
  name: 'MemberEditDialog',
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
        callback(new Error(this.$t('__lengthLess') + '5'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.password !== this.form.confirmPassword) {
        callback(new Error(this.$t('__confirmPassword') + this.$t('__and') + this.$t('__password') + this.$t('__inconsistent')))
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
    const validateAmountLimit = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
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
      } else if (this.agentInfo.id !== 1 && Number(this.form.balance) > Number(this.agentInfo.balance)) {
        callback(new Error(this.$t('__overMax')))
      } else {
        callback()
      }
    }
    return {
      step1Rules: {
        name: [{ required: true, trigger: 'blur', validator: validatePassword }],
        nick_name: [{ required: true, trigger: 'blur', validator: validate }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      step2Rules: {
        live_rolling_rate: [{ required: true, trigger: 'blur', validator: validateRollingRate }],
        max_win_amount_limit: [{ required: true, trigger: 'blur', validator: validateAmountLimit }],
        max_lose_amount_limit: [{ required: true, trigger: 'blur', validator: validateAmountLimit }]
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
      dialogLoading: false,
      selectHandicaps: []
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType'
    ]),
    rollingRateTip() {
      return this.$t('__range') + '0%-' + this.agentInfo.live_rolling_rate + '%'
    },
    previousBtnVisible() {
      return this.curIndex > this.stepEnum.memberInfo
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
    balanceDisable() {
      if (this.agentInfo.id === 1) {
        return false
      }
      return Number(this.agentInfo.balance) === 0
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
      return this.agentInfo.id === 1 ? '∞' : this.agentInfo.balance
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.curIndex = this.stepEnum.memberInfo
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
        memberCreateAccount().then((res) => {
          this.form.name = res.account
          this.$refs.step1.clearValidate()
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
      if (this.curIndex === this.stepEnum.memberInfo) {
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
          this.dialogLoading = true
          const data = JSON.parse(JSON.stringify(this.form))
          data.handicaps = []
          this.selectHandicaps.forEach(element => {
            data.handicaps.push(element.id)
          })
          if (this.operationType === this.operationEnum.create) {
            data.agent_id = this.agentInfo.id
            memberCreate(data).then((res) => {
              this.$emit('editSuccess', res)
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          } else if (this.operationType === this.operationEnum.edit) {
            this.$confirm(this.$t('__confirmChanges')).then(_ => {
              memberEdit(data).then((res) => {
                this.$emit('editSuccess', res)
                this.dialogLoading = false
              }).catch(() => {
                this.dialogLoading = false
              })
            })
          } else {
            this.dialogLoading = false
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
.agentName {
  font-size: 10px;
}

.step2Tip {
  line-height: 10px;
  display: block;
  font-size: 10px;
}

.el-input {
  width: auto;
}

.el-steps--horizontal {
  margin: 15px 0
}
</style>
