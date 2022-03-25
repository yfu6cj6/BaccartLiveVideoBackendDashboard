<template>
  <div v-loading="submitLoading" class="passwordReset-container">
    <el-form
      ref="form"
      class="filterForm"
      label-width="110px"
      :model="form"
      :rules="rules"
    >
      <el-form-item class="passwordReset-item" :label="$t('__currentPassword')" prop="currentPassword">
        <el-input v-model="form.currentPassword" show-password />
      </el-form-item>
      <el-form-item class="passwordReset-item" :label="$t('__newPassword')" prop="newPassword">
        <el-input v-model="form.newPassword" show-password />
      </el-form-item>
      <el-form-item class="passwordReset-item" :label="$t('__confirmPassword')" prop="newPassword_confirmation">
        <el-input v-model="form.newPassword_confirmation" show-password />
      </el-form-item>
      <div>
        <el-button class="bg-yellow" :disabled="checkInput" @click="onSubmit">{{ $t("__confirm") }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { modifyPassword } from '@/api/user'

export default {
  name: 'ModPassword',
  data() {
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
      form: {
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: ''
      },
      rules: {
        currentPassword: [{ required: true, validator: validate, trigger: 'blur' }],
        newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        newPassword_confirmation: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      },
      submitLoading: false
    }
  },
  computed: {
    checkInput() {
      return this.form.currentPassword && this.form.newPassword && !this.form.newPassword_confirmation
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          modifyPassword(this.form).then((res) => {
            this.submitLoading = false
            this.reset()
            this.$message({
              message: 'Modify successfully',
              type: 'success'
            })
          }).catch((err) => {
            this.submitLoading = false
            if (err.data.code !== 401) {
              const { currentPassword, newPassword, newPassword_confirmation } = err.data.message
              const log = () => {
                if (currentPassword !== undefined) {
                  return currentPassword[0]
                } else if (newPassword !== undefined) {
                  return newPassword[0]
                } else if (newPassword_confirmation !== undefined) {
                  return newPassword_confirmation[0]
                } else {
                  return 'Reset failed'
                }
              }
              this.$message({
                message: log(),
                type: 'error'
              })
            }
          })
        }
      })
    },
    reset() {
      this.form.currentPassword = ''
      this.form.newPassword = ''
      this.form.newPassword_confirmation = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.passwordReset {
  &-container {
    margin: 20px;
    padding: 1em;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
  &-item {
    padding-right: 15px;
  }
}

.el-form {
  background: #333;
}

.el-button {
  margin: 0 auto;
  display: block;
}
</style>
