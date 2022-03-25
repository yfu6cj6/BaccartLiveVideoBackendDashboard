<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <label class="agentNameLabel">{{ nameLabel }}
      <span class="agentNameSpan">{{ form.fullName }}</span>
    </label>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <el-form-item v-if="visible" :label="$t('__newPassword')" prop="newPassword">
        <el-input v-model="form.newPassword" show-password />
      </el-form-item>
      <el-form-item v-if="visible" :label="$t('__confirmPassword')" prop="newPassword_confirmation">
        <el-input v-model="form.newPassword_confirmation" show-password />
      </el-form-item>
      <el-form-item v-if="visible" :label="$t('__userPassword')" prop="userPassword">
        <el-input v-model="form.userPassword" show-password />
      </el-form-item>
    </el-form>
    <span v-show="!dialogLoading" slot="footer">
      <el-button class="bg-yellow" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'ModPasswordDialog',
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
    'nameLabel': {
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
      } else if (this.form.newPassword !== this.form.newPassword_confirmation) {
        callback(new Error(`${this.$t('__confirmPassword')}${this.$t('__and')}${this.$t('__password')}${this.$t('__inconsistent')}`))
      } else {
        callback()
      }
    }
    return {
      rules: {
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword_confirmation: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        userPassword: [{ required: true, trigger: 'blur', validator: validate }]
      },
      dialogLoading: false
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmMsg(`${this.$t('__confirmChanges')}?`, () => {
            const data = JSON.parse(JSON.stringify(this.form))
            this.$emit('modPassword', data)
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

.agentNameLabel {
  font-size: 14px;
  color: #fff
}

.agentNameSpan {
  color: #f9c901;
}
</style>
