<template>
  <el-dialog :title="title" :visible.sync="visible" width="25%" :before-close="onClose">
    <el-row>
      <el-col :span="24">
        <el-form ref="editForm" class="row" label-width="auto" :model="editForm" :rules="rules">
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
          <el-form-item :label="$t('__status')" prop="status">
            <el-select v-model="editForm.status">
              <el-option v-for="item in accountStatus" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__remark')" prop="remark">
            <el-input v-model="editForm.remark" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
            <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'AccountManagementDialog',
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
    'accountStatus': {
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
      if (value === undefined || value.length < 1) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.confirmPassword.length < 1) {
        callback(new Error(this.$t('__requiredField')))
      } else if (this.confirmPassword !== this.editForm.password) {
        callback(new Error(this.$t('__confirmPassword') + this.$t('__and') + this.$t('__password') + this.$t('__inconsistent')))
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
        timeZone: [{ required: true, trigger: 'blur', validator: validate }],
        roles: [{ required: true, trigger: 'blur', validator: validate }],
        agentId: [{ required: true, trigger: 'blur', validator: validate }],
        status: [{ required: true, trigger: 'blur', validator: validate }]
      },
      editForm: {},
      confirmPassword: ''
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
          this.$emit('confirm', this.editForm)
        }
      })
    },
    onClose() {
      this.$emit('close')
    },
    onReset() {
      this.editForm = JSON.parse(JSON.stringify(this.form))
    }
  }
}
</script>

<style>
</style>
