<template>
  <div class="app-container">
    <el-form
      ref="form"
      class="filterForm"
      style="margin: 0 auto"
      label-width="110px"
      :model="form"
      :rules="rules"
    >
      <el-form-item :label="$t('__oldPassword')" prop="oldPassword">
        <el-input v-model="form.oldPassword" />
      </el-form-item>
      <el-form-item :label="$t('__newPassword')" prop="newPassword">
        <el-input v-model="form.newPassword" show-password />
      </el-form-item>
      <el-form-item :label="$t('__confirmPassword')" prop="confirmPassword">
        <el-input v-model="confirmPassword" show-password />
      </el-form-item>
      <div clsss="row">
        <el-button type="primary" style="margin: 0 auto; display: block" :disabled="checkInput" @click="onSubmit">{{ $t("__confirm") }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { modifyPassword } from '@/api/backstage'
import { mapGetters } from 'vuex'

export default {
  name: 'PasswordReset',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) callback(new Error(this.$t('__enter') + this.$t('__password')))
      if (value.trim().length < 5) callback(new Error(this.$t('__lengthLess') + '5'))
      callback()
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.confirmPassword !== this.form.newPassword) callback(new Error(this.$t('__confirmPassword') + this.$t('__and') + this.$t('__newPassword') + this.$t('__inconsistent')))
      callback()
    }
    return {
      form: {
        oldPassword: '',
        newPassword: ''
      },
      confirmPassword: '',
      rules: {
        newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['token']),
    checkInput() {
      return this.form.oldPassword && this.form.newPassword && !this.confirmPassword
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          modifyPassword(this.token, this.form).then((res) => {
            this.reset()
            this.$message({
              title: res.Error.Code,
              message: this.$t('__revise') + this.$t('__success'),
              type: 'success'
            })
          }).catch((error) => {
            this.$message({
              title: error.Error.Code,
              message: this.$t('__revise') + this.$t('__fail'),
              type: 'error'
            })
          })
        }
      })
    },
    reset() {
      this.form.oldPassword = ''
      this.form.newPassword = ''
      this.confirmPassword = ''
    }
  }
}
</script>

<style scoped>
</style>
