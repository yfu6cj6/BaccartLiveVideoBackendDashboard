<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <label class="agentNameLabel">{{ `${$t('__superiorAgent')}: ` }}
      <span class="agentNameSpan">{{ agentInfo.fullName }}</span>
    </label>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <el-form-item :label="$t('__accountGenerateMode')">
        <el-switch
          v-model="autoGenerateAccount"
          active-color="#f9c901"
          inactive-color="#f9c901"
          :active-text="$t('__auto')"
          :inactive-text="$t('__manual')"
        />
      </el-form-item>
      <el-form-item :label="$t('__account')" prop="account">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item :label="$t('__nickname')" prop="nickname">
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
      <el-form-item :label="$t('__timeZone')" prop="timeZone">
        <el-select v-model="form.timeZone">
          <el-option v-for="item in time_zone" :key="item.id" :label="item.city_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.effectAgentLine" class="red-tick" :label="$t('__effectAgentLine')" />
        <el-checkbox v-model="form.isAdmin" class="red-tick" :label="$t('__admin')" />
      </el-form-item>
      <el-form-item :label="$t('__remark')" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item v-if="visible" :label="$t('__userPassword')" prop="userPassword">
        <el-input v-model="form.userPassword" show-password />
      </el-form-item>
    </el-form>
    <span v-if="!dialogLoading" slot="footer">
      <el-button class="bg-yellow" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'
import common from '@/layout/mixin/common'
import { subAccountCreateAccount, subAccountCreate, subAccountEdit } from '@/api/agentManagement/subAccount'
import { mapGetters } from 'vuex'

export default {
  name: 'SubAccountEditDialog',
  mixins: [handleDialogWidth, common],
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
    'confirm': {
      type: String,
      require: true,
      default() {
        return ''
      }
    },
    'agentInfo': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    },
    'form': {
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
      } else if (this.form.password !== this.form.confirmPassword) {
        callback(new Error(`${this.$t('__confirmPassword')}${this.$t('__and')}${this.$t('__password')}${this.$t('__inconsistent')}`))
      } else {
        callback()
      }
    }
    return {
      rules: {
        account: [{ required: true, trigger: 'blur', validator: validatePassword }],
        nickname: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        userPassword: [{ required: true, trigger: 'blur', validator: validate }]
      },
      operationEnum: Object.freeze({ 'create': 1, 'edit': 2 }),
      time_zone: [],
      autoGenerateAccount: false,
      dialogLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'accountStatusType'
    ])
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.$refs.form.clearValidate()
      }
    },
    autoGenerateAccount() {
      if (this.autoGenerateAccount) {
        subAccountCreateAccount().then((res) => {
          this.form.account = res.account
          this.$refs.form.clearValidate()
        }).catch(() => {
          this.autoGenerateAccount = false
        })
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          data.effectAgentLine = data.effectAgentLine ? '1' : '0'
          data.isAdmin = data.isAdmin ? '1' : '0'
          if (this.operationType === this.operationEnum.create) {
            data.agentId = this.agentInfo.id
            this.dialogLoading = true
            subAccountCreate(data).then((res) => {
              this.$emit('editSuccess', JSON.parse(JSON.stringify(res)))
              this.dialogLoading = false
            }).catch(() => {
              this.dialogLoading = false
            })
          } else if (this.operationType === this.operationEnum.edit) {
            this.confirmMsg(`${this.$t('__confirmChanges')}?`, () => {
              this.dialogLoading = true
              subAccountEdit(data).then((res) => {
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
    onClose() {
      this.$emit('close')
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    },
    setTimeZone(data) {
      this.time_zone = data
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

.el-checkbox,
.agentNameSpan {
  color: #f9c901;
}

.el-checkbox+.el-checkbox {
  margin-left:50px;
}

.el-steps--horizontal {
  margin: 15px 0
}

.el-select,
.el-input,
.el-textarea{
  width: 90%;
}
</style>
