<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false">
    <el-form ref="form" label-width="auto" :model="form" :rules="rules">
      <el-form-item :label="$t('__agent') + ': '">
        <span>{{ agentBalanceInfo.parent }}</span>
      </el-form-item>
      <el-form-item :label="$t('__balance') + ': '">
        <span>{{ parentBalance }}</span>
      </el-form-item>
      <el-form-item :label="$t('__agentAccount') + ': '">
        <span>{{ agentBalanceInfo.agent }}</span>
      </el-form-item>
      <el-form-item :label="$t('__balance') + ': '">
        <span>{{ agentBalanceInfo.agentBalance }}</span>
      </el-form-item>
      <el-form-item :label="balanceLabelTitle" prop="amount">
        <el-input v-model="form.amount" type="number" :disabled="balanceDisable" min="0" />
      </el-form-item>
      <el-form-item v-if="visible" :label="$t('__userPassword')" prop="userPassword">
        <el-input v-model="form.userPassword" show-password />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import { agentGetSetBalanceInfo } from '@/api/agentManagement/agentList'

export default {
  name: 'BalanceDialog',
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
    'operationType': {
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
    const validateBlance = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.form.amount < 0) {
        callback(new Error(this.$t('__lowerMin')))
      } else if (Number(this.form.amount) === 0) {
        callback(new Error(this.$t('__meaningless')))
      } else if (this.operationType === this.operationEnum.depositBalance) {
        if (this.agentBalanceInfo.parentId !== 1 && Number(this.form.amount) > Number(this.agentBalanceInfo.parentBalance)) {
          callback(new Error(this.$t('__overMax')))
        } else {
          callback()
        }
      } else if (this.operationType === this.operationEnum.withdrawBalance) {
        if (Number(this.form.amount) > Number(this.agentBalanceInfo.agentBalance)) {
          callback(new Error(this.$t('__overMax')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      rules: {
        amount: [{ required: true, trigger: 'blur', validator: validateBlance }],
        userPassword: [{ required: true, trigger: 'blur', validator: validate }]
      },
      operationEnum: Object.freeze({ 'depositBalance': 1, 'withdrawBalance': 2 }),
      agentBalanceInfo: {},
      dialogLoading: false
    }
  },
  computed: {
    balanceLabelTitle() {
      return this.operationType === this.operationEnum.depositBalance ? this.$t('__depositBalance') : this.$t('__withdrawBalance')
    },
    balanceDisable() {
      if (this.operationType === this.operationEnum.depositBalance) {
        if (this.agentBalanceInfo.parentId === 1) {
          return false
        } else {
          return Number(this.agentBalanceInfo.parentBalance) === 0
        }
      } else {
        return Number(this.agentBalanceInfo.agentBalance) === 0
      }
    },
    parentBalance() {
      return this.agentBalanceInfo.parentId === 1 ? '∞' : this.agentBalanceInfo.parentBalance
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.dialogLoading = true
        agentGetSetBalanceInfo({ agentId: this.form.agentId }).then((res) => {
          this.agentBalanceInfo = res.rows
          this.dialogLoading = false
        })
      } else {
        this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('__confirmOperation')).then(_ => {
            this.dialogLoading = true
            const data = JSON.parse(JSON.stringify(this.form))
            if (this.operationType === this.operationEnum.depositBalance) {
              this.$emit('depositBalance', data)
            } else if (this.operationType === this.operationEnum.withdrawBalance) {
              this.$emit('withdrawBalance', data)
            } else {
              this.dialogLoading = false
            }
          })
        }
      })
    },
    onClose() {
      this.$emit('close')
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    }
  }
}
</script>

<style scoped>
.el-table--fit {
  padding: 0 0 10px 0
}
</style>
