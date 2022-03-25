<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" width="25%" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="editForm" :model="editForm" :rules="rules">
      <el-form-item :label="$t('__account')" prop="account">
        <el-input v-model="editForm.account" />
      </el-form-item>
      <el-form-item v-if="hasPassword" :label="$t('__password')" prop="password">
        <el-input v-model="editForm.password" show-password />
      </el-form-item>
      <el-form-item v-if="hasPassword" :label="$t('__confirmPassword')" prop="confirmPassword">
        <el-input v-model="confirmPassword" show-password />
      </el-form-item>
      <el-form-item :label="$t('__nickname')" prop="nickname">
        <el-input v-model="editForm.nickname" />
      </el-form-item>
      <el-form-item :label="$t('__timeZone')" prop="timeZone">
        <el-select v-model="editForm.timeZone">
          <el-option v-for="item in timeZones" :key="item.key" :label="item.cityName" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__role')" prop="roles">
        <el-select v-model="editForm.roles" multiple>
          <el-option v-for="item in roles" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__agentName')" prop="agentId">
        <el-select v-model="editForm.agentId">
          <el-option v-for="item in agents" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__accountStatus')" prop="status">
        <el-select v-model="editForm.status">
          <el-option v-for="item in accountStatusType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__remark')" prop="remark">
        <el-input v-model="editForm.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <span v-show="!dialogLoading" slot="footer">
      <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
      <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDialog',
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
    'roles': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'agents': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'timeZones': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'accountStatusType': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'hasPassword': {
      type: Boolean,
      require: true,
      default() {
        return true
      }
    }
  },
  data: function() {
    const validate = (rule, value, callback) => {
      if (!value || value.length < 1) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.confirmPassword.length) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.confirmPassword !== this.editForm.password) {
        callback(new Error(`${this.$t('__confirmPassword')}${this.$t('__and')}${this.$t('__password')}${this.$t('__inconsistent')}`))
      } else {
        callback()
      }
    }
    return {
      rules: {
        account: [{ required: true, trigger: 'blur', validator: validate }],
        password: [{ required: true, trigger: 'blur', validator: validate }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        nickname: [{ required: true, trigger: 'blur', validator: validate }],
        roles: [{ required: true, trigger: 'blur', validator: validate }]
      },
      editForm: {},
      confirmPassword: '',
      dialogLoading: false
    }
  },
  computed: {
  },
  watch: {
    visible() {
      if (this.visible) {
        this.editForm = JSON.parse(JSON.stringify(this.form))
        this.confirmPassword = ''
      } else {
        this.$refs.editForm.clearValidate()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', JSON.parse(JSON.stringify(this.editForm)))
        }
      })
    },
    onClose() {
      this.$emit('close')
    },
    onReset() {
      this.editForm = JSON.parse(JSON.stringify(this.form))
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    }
  }
}
</script>

<style>
</style>
