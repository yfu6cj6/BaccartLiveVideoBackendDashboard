<template>
  <el-dialog :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose">
    <label class="agentName">{{ $t('__superiorAgent') + ': ' }}{{ agentInfo.AgentName }}</label>
    <el-steps :active="curIndex" align-center finish-status="success">
      <el-step :description="$t('__agentInfo')" />
      <el-step :description="$t('__rate')" />
      <el-step :description="$t('__limit')" />
      <el-step :description="$t('__quotaConfiguration')" />
      <el-step :description="$t('__confirm')" />
    </el-steps>
    <el-form v-show="curIndex === 0" ref="form0" class="row" label-width="auto" :model="form0" :rules="form0Rules">
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
      <el-form-item :label="$t('__remark')" prop="remark">
        <el-input v-model="form0.remark" />
      </el-form-item>
    </el-form>
    <el-form v-show="curIndex === 1" ref="form1" class="row" label-width="auto" :model="form1" :rules="form1Rules">
      <el-form-item :label="$t('__commissionRate')" prop="commission_rate">
        <el-input v-model="form1.commission_rate" type="number" :disabled="commissionRate === 0" />
        <span class="form1Tip">{{ commissionRateTip }}</span>
      </el-form-item>
      <el-form-item :label="$t('__rollingRate')" prop="rolling_rate">
        <el-input v-model="form1.rolling_rate" type="number" :disabled="rollingRate === 0" />
        <span class="form1Tip">{{ rollingRateTip }}</span>
      </el-form-item>
    </el-form>
    <el-form v-show="curIndex === 2" ref="form2" class="row" label-width="auto" :model="form2" :rules="form2Rules">
      <el-form-item :label="$t('__commissionRate')" prop="commission_rate">
        <el-input v-model="form2.commission_rate" type="number" :disabled="commissionRate === 0" />
        <span class="form2Tip">{{ commissionRateTip }}</span>
      </el-form-item>
      <el-form-item :label="$t('__rollingRate')" prop="rolling_rate">
        <el-input v-model="form2.rolling_rate" type="number" :disabled="rollingRate === 0" />
        <span class="form2Tip">{{ rollingRateTip }}</span>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button v-show="curIndex > 0" @click="onPrevious">{{ $t("__previous") }}</el-button>
      <el-button v-show="curIndex < 4" type="primary" @click="onNextStep">{{ $t("__nextStep") }}</el-button>
      <el-button v-show="curIndex >= 4" type="primary" @click="onSubmit">{{ $t("__confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import { agentCreateAccount } from '@/api/agentManagement/agentList'

const defaultForm0 = {
  account: '',
  nickname: '',
  password: '',
  confirmPassword: ''
}

const defaultForm1 = {
  commission_rate: '0',
  rolling_rate: '0'
}

const defaultForm2 = {
  commission_rate: '0',
  rolling_rate: '0'
}

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
    'commissionRate': {
      type: Number,
      require: true,
      default() {
        return 0
      }
    },
    'rollingRate': {
      type: Number,
      require: true,
      default() {
        return 0
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
    return {
      form0Rules: {
        account: [{ required: true, trigger: 'blur', validator: validatePassword }],
        nickname: [{ required: true, trigger: 'blur', validator: validate }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      form1Rules: {
        commission_rate: [{ required: true, trigger: 'blur', validator: validate }],
        rolling_rate: [{ required: true, trigger: 'blur', validator: validate }]
      },
      form2Rules: {
        commission_rate: [{ required: true, trigger: 'blur', validator: validate }],
        rolling_rate: [{ required: true, trigger: 'blur', validator: validate }]
      },
      autoGenerateAccount: false,
      form0: JSON.parse(JSON.stringify(defaultForm0)),
      form1: JSON.parse(JSON.stringify(defaultForm1)),
      form2: JSON.parse(JSON.stringify(defaultForm2)),
      curIndex: 0
    }
  },
  computed: {
    commissionRateTip() {
      return this.$t('__range') + '0%-' + this.commissionRate + '%'
    },
    rollingRateTip() {
      return this.$t('__range') + '0%-' + this.rollingRate + '%'
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.curIndex = 0
        this.form0 = JSON.parse(JSON.stringify(defaultForm0))
        this.form1 = JSON.parse(JSON.stringify(defaultForm1))
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
    }
  },
  methods: {
    onNextStep() {
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
    onPrevious() {
      this.curIndex--
    },
    onClose() {
      this.$emit('close')
    },
    onSubmit() {
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
