<template>
  <div>
    <el-row class="form-container">
      <div class="title">{{ $t('__projectName') }}</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="account" :class="{'validateSuccess': accountValidateSuccess, 'validateError': accountValidateError}">
          <div>
            <svg-icon class="icon" icon-class="user" />
            <el-input
              ref="account"
              v-model="loginForm.account"
              class="input"
              name="account"
              type="text"
              tabindex="1"
            />
          </div>
        </el-form-item>
        <el-form-item prop="password" :class="{'validateSuccess': passwordValidateSuccess, 'validateError': passwordValidateError}">
          <svg-icon class="icon" icon-class="key" />
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            class="input"
            :type="passwordType"
            name="password"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
          <svg-icon class="show-password" :class="{'isActive': passwordType !== 'password'}" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPwd()" />
        </el-form-item>
        <el-form-item v-if="showCaptcha" prop="captcha" :class="{'validateSuccess': captchaValidateSuccess, 'validateError': captchaValidateError}">
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            class="captchaInput"
            name="captcha"
            type="text"
            @keyup.enter.native="handleLogin"
          />
          <img class="captcha" :src="captchaImg" @click="refreshCaptcha()">
          <i class="el-icon-refresh-right refresh" @click="refreshCaptcha()" />
        </el-form-item>
        <el-button :loading="loading" class="bg-yellow" @click.native.prevent="handleLogin">{{ $t('__login') }}</el-button>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { login, generateCaptcha } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        this.validateAccount = 2
        callback(new Error(' '))
      } else {
        this.validateAccount = 1
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        this.validatePassword = 2
        callback(new Error(' '))
      } else {
        this.validatePassword = 1
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (!value) {
        this.validateCaptcha = 2
        callback(new Error(' '))
      } else {
        this.validateCaptcha = 1
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        captcha: '',
        key: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      loading: false,
      passwordType: 'password',
      captchaData: {},
      validateAccount: 0,
      validatePassword: 0,
      validateCaptcha: 0,
      showCaptcha: process.env.NODE_ENV !== 'development'
    }
  },
  computed: {
    captchaImg() {
      return this.captchaData.img
    },
    accountValidateSuccess() {
      return this.validateAccount === 1
    },
    accountValidateError() {
      return this.validateAccount === 2
    },
    passwordValidateSuccess() {
      return this.validatePassword === 1
    },
    passwordValidateError() {
      return this.validatePassword === 2
    },
    captchaValidateSuccess() {
      return this.validateCaptcha === 1
    },
    captchaValidateError() {
      return this.validateCaptcha === 2
    }
  },
  created() {
    if (this.showCaptcha) {
      this.refreshCaptcha()
    }
  },
  mounted() {
    this.$store.dispatch('tagsView/delAllViews')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    refreshCaptcha() {
      generateCaptcha().then((res) => {
        this.captchaData = res
        this.loginForm.key = this.captchaData.key
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login(this.loginForm).then(async(res) => {
            // status = '0' 已被停權
            if (res.user.status === '0') {
              this.$message({
                message: 'Login failed, the account has been suspended',
                type: 'error'
              })
            } else {
              this.$message({
                message: 'Login successfully',
                type: 'success'
              })
              this.$store.dispatch('user/login', res)
              await this.$store.dispatch('backstageManagement/getAnnouncement')
              this.$router.push({ path: '/home' })
            }
          }).catch((err) => {
            if (this.showCaptcha) {
              this.captchaData = err.data.captcha
              this.loginForm.key = this.captchaData.key
              this.loginForm.captcha = ''
              this.$refs.captcha.focus()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.form-container {
  .el-input__inner {
    border: none;
    font-size: 16px;
    color: #fff;
    background-color: rgba(255,255,255,0);
  }
  .el-form-item__content {
    background-color: rgba(255,255,255,0.08);
  }
}
</style>

<style lang="scss" scoped>
$yellow:#f9c901;

.form-container {
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  background-color: black;
  padding-top: 150px;
}

.title {
  font-size: 1.66667rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1.41667rem;
  color: #b99e71;
}

.icon {
  width: 2rem !important;
  height: 2rem !important;
  display: inline;
  vertical-align: middle;
  color: $yellow;
  padding: 5px;
}

.icon+.input {
  display: inline-block;
  width: calc(100% - 2rem - 1.5em);
}

.input {
  padding-left: 5px;
}

.show-password {
  float: right;
  height: 40px;
  cursor: pointer;
  color: #6e6e6e;
}

.captchaInput {
  width: calc(100% - 100px - 14px);
}

.captcha {
  vertical-align: middle;
  width: 100px;
  display: inline-block;
  cursor: pointer;
}

.show-password.isActive,
.refresh {
  cursor: pointer;
  color: #fff;
}

.el-form-item {
  display: block;
  padding: 0px;
  margin: 20px 0;
  border-bottom: 2px solid $yellow;
  width: 360px;
}

.el-form-item.validateSuccess {
  border-bottom: 2px solid #67c23a;
}

.el-form-item.validateError {
  border-bottom: 2px solid #f56c6c;
}

.el-button {
  margin-top: 10px;
  width: 100%;
  font-size: 20px;
}
</style>
