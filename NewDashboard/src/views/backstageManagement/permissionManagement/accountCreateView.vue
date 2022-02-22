<template>
  <el-dialog :title="$t('__accountCreate')" :visible.sync="visible" width="30%" :before-close="close">
    <el-row>
      <el-col :span="18">
        <el-form
          ref="form"
          label-width="150px"
          :model="form"
          :rules="rules"
        >
          <el-form-item :label="$t('__toAddAgentID')">
            <el-input v-model="form.agentId" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('__account')" prop="account">
            <el-input v-model="form.account" />
          </el-form-item>
          <el-form-item :label="$t('__nickname')" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item>
          <el-form-item :label="$t('__password')" prop="password">
            <el-input v-model="form.password" show-password />
          </el-form-item>
          <el-form-item :label="$t('__roleGroup')" prop="role">
            <el-select v-model="form.role">
              <el-option v-for="item in accountCreateAgentRole" :key="item.Id" :label="item.Name" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("__create") }}</el-button>
            <el-button @click="reset">{{ $t("__reset") }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { form1 } from './model.js'
import { createUser, getAgentRole, getAgentLevelInfo } from '@/api/backstageManagement'
import { mapGetters } from 'vuex'
import { validAccount } from '@/utils/validate'

export default {
  name: 'AccountCreateView',
  props: {
    'visible': {
      type: Boolean,
      require: true
    }
  },
  data: function() {
    const validateAccount = (rule, value, callback) => {
      const checkFirstStr = validAccount(value)
      if (!value) { callback(new Error(this.$t('__enter') + this.$t('__account'))) }
      if (checkFirstStr === 1) callback(new Error(this.$t('__inclub') + this.$t('__upperEn')))
      if (checkFirstStr === 2) callback(new Error(this.$t('__inclub') + this.$t('__lowerEn')))
      if (checkFirstStr === 3) callback(new Error(this.$t('__inclub') + this.$t('__number')))
      callback()
    }
    const validateNickName = (rule, value, callback) => {
      if (!value) { callback(new Error(this.$t('__enter') + this.$t('__nickname'))) }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) callback(new Error(this.$t('__enter') + this.$t('__password')))
      if (value.trim().length < 5) callback(new Error(this.$t('__lengthLess') + '5'))
      callback()
    }
    return {
      rules: {
        account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
        nickname: [{ required: true, validator: validateNickName, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }]
      },
      form: JSON.parse(JSON.stringify(form1))
    }
  },
  computed: {
    ...mapGetters([
      'accountCreateAgentRole'
    ])
  },
  created() {
    this.initAllSelectMenu()
  },
  methods: {
    initAllSelectMenu() {
      getAgentRole(this.token).then((res) => {
        this.$store.dispatch('backstageManagement/setAccountCreateAgentRole', res.Data)
        this.form.role = this.accountCreateAgentRole[0].Id
      }).then(() => {
        getAgentLevelInfo(this.token).then((res) => {
          this.form.agentId = res.Data.AgentLevelInfo.AgentId
          this.$emit('init', this.accountCreateAgentRole, res.Data.AgentLevelInfo.AgentId)
        })
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createUser(this.token, this.form).then((res) => {
            this.reset()
            this.$message({
              title: res.Error.Code,
              message: this.$t('__create') + this.$t('__success'),
              type: 'success'
            })
          }).catch((error) => {
            this.$message({
              title: error.Error.Code,
              message: this.$t('__create') + this.$t('__fail'),
              type: 'error'
            })
          })
        }
      })
    },
    reset() {
      this.form = JSON.parse(JSON.stringify(form1))
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 200px;
}
.el-select {
  width: 200px;
}
.el-tree {
  display:inline-block;
}
</style>
