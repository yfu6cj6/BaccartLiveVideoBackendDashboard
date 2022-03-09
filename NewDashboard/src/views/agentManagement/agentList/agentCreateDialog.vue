<template>
  <el-dialog :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose">
    <label class="agentName">{{ $t('__superiorAgent') + ': ' }}{{ agentInfo.fullName }}</label>
    <el-steps :active="curIndex" align-center finish-status="success">
      <el-step :description="$t('__agentInfo')" />
      <el-step :description="$t('__rate')" />
      <el-step :description="$t('__limit')" />
      <el-step :description="$t('__quotaConfiguration')" />
      <el-step :description="$t('__confirm')" />
    </el-steps>
    <el-form v-show="curIndex === 0" ref="form0" label-width="auto" :model="form0" :rules="form0Rules">
      <el-form-item :label="$t('__accountGenerateMode')">
        <el-switch
          v-model="autoGenerateAccount"
          active-color="blue"
          inactive-color="blue"
          :active-text="$t('__auto')"
          :inactive-text="$t('__manual')"
        />
      </el-form-item>
      <el-form-item :label="$t('__account')" prop="account">
        <el-input v-model="form0.account" />
      </el-form-item>
      <el-form-item :label="$t('__nickname')" prop="nickname">
        <el-input v-model="form0.nickname" />
      </el-form-item>
      <el-form-item :label="$t('__password')" prop="password">
        <el-input v-model="form0.password" show-password />
      </el-form-item>
      <el-form-item :label="$t('__confirmPassword')" prop="confirmPassword">
        <el-input v-model="form0.confirmPassword" show-password />
      </el-form-item>
      <el-form-item :label="$t('__timeZone')" prop="time_zone">
        <el-select v-model="form0.time_zone">
          <el-option v-for="item in time_zone" :key="item.id" :label="item.city_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__currency')" prop="currency">
        <el-select v-model="form0.currency">
          <el-option v-for="item in currency" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__remark')" prop="remark">
        <el-input v-model="form0.remark" />
      </el-form-item>
    </el-form>
    <el-form v-show="curIndex === 1" ref="form1" label-width="auto" :model="form1" :rules="form1Rules">
      <el-form-item :label="$t('__commissionRate')" prop="commission_rate">
        <el-input v-model="form1.commission_rate" type="number" :disabled="agentInfo.commission_rate === 0" min="0" :max="agentInfo.commission_rate" />
        <span class="form1Tip">{{ commissionRateTip }}</span>
      </el-form-item>
      <el-form-item :label="$t('__rollingRate')" prop="rolling_rate">
        <el-input v-model="form1.rolling_rate" type="number" :disabled="agentInfo.rolling_rate === 0" min="0" :max="agentInfo.rolling_rate" />
        <span class="form1Tip">{{ rollingRateTip }}</span>
      </el-form-item>
    </el-form>
    <el-table v-show="curIndex === 2" :data="agentInfo.handicaps" tooltip-effect="dark" @selection-change="handleSelectionHandicaps">
      <el-table-column type="selection" align="center" />
      <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
    </el-table>
    <span slot="footer">
      <el-button v-show="previousBtnVisible" @click="onPreviousBtnClick">{{ $t("__previous") }}</el-button>
      <el-button v-show="nextBtnVisible" type="primary" @click="onNextBtnClick">{{ $t("__nextStep") }}</el-button>
      <el-button v-show="confirmBtnVisible" type="primary" @click="onSubmit">{{ $t("__confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import { agentCreateAccount, agentGetSetBalanceInfo } from '@/api/agentManagement/agentList'

export default {
  name: 'AgentCreateDialog',
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
    'agentInfo': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    },
    'form0': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    },
    'form1': {
      type: Object,
      require: true,
      default() {
        return {}
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
      } else if (this.form0.password !== this.form0.confirmPassword) {
        callback(new Error(this.$t('__confirmPassword') + this.$t('__and') + this.$t('__password') + this.$t('__inconsistent')))
      } else {
        callback()
      }
    }
    const validateCommissionRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form1.commission_rate > this.agentInfo.commission_rate) {
        callback(new Error(this.$t('__overMax')))
      } else if (this.form1.commission_rate < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else {
        callback()
      }
    }
    const validateRollingRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form1.rolling_rate > this.agentInfo.rolling_rate) {
        callback(new Error(this.$t('__overMax')))
      } else if (this.form1.rolling_rate < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else {
        callback()
      }
    }
    return {
      form0Rules: {
        account: [{ required: true, trigger: 'blur', validator: validatePassword }],
        nickname: [{ required: true, trigger: 'blur', validator: validate }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      form1Rules: {
        commission_rate: [{ required: true, trigger: 'blur', validator: validateCommissionRate }],
        rolling_rate: [{ required: true, trigger: 'blur', validator: validateRollingRate }]
      },
      autoGenerateAccount: false,
      curIndex: 0,
      time_zone: [],
      currency: [],
      selectionHandicaps: []
    }
  },
  computed: {
    commissionRateTip() {
      return this.$t('__range') + '0%-' + this.agentInfo.commission_rate + '%'
    },
    rollingRateTip() {
      return this.$t('__range') + '0%-' + this.agentInfo.rolling_rate + '%'
    },
    previousBtnVisible() {
      return this.curIndex > 0
    },
    nextBtnVisible() {
      if (this.curIndex === 2) {
        return this.selectionHandicaps.length > 0
      }
      return this.curIndex < 4
    },
    confirmBtnVisible() {
      return this.curIndex >= 4
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.curIndex = 0
      } else {
        this.$refs.form0.clearValidate()
        this.$refs.form1.clearValidate()
      }
    },
    autoGenerateAccount() {
      if (this.autoGenerateAccount) {
        agentCreateAccount().then((res) => {
          this.form0.account = res.account
          this.$refs.form0.clearValidate()
        })
      }
    },
    curIndex() {
      if (this.curIndex === 3) {
        agentGetSetBalanceInfo({ agentId: this.agentInfo.id }).then((res) => {
          console.log(res)
        })
      }
    }
  },
  methods: {
    handleSelectionHandicaps(val) {
      this.selectionHandicaps = val
    },
    onNextBtnClick() {
      let next = false
      if (this.curIndex === 0) {
        this.$refs.form0.validate((valid) => {
          next = valid
        })
      } else if (this.curIndex === 1) {
        this.$refs.form1.validate((valid) => {
          next = valid
        })
      } else {
        next = true
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

.form1Tip {
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
