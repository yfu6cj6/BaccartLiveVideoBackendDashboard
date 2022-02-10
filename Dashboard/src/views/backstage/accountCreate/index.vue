<template>
  <div class="accountCreate-container">
    <el-row>
      <el-col v-loading="roleLoading" :span="6">
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              :data="treeData.agentLevelInfo"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form
          ref="form"
          v-loading="infoLoading"
          class="filterForm"
          label-width="150px"
          style="max-width: 400px; margin: 0 auto;"
          :model="form"
          :rules="rules"
        >
          <el-form-item :label="$t('__toAddAgentID')">
            <el-input
              v-model="formAgentId"
              :disabled="true"
            />
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
              <el-option
                v-for="item in getRole"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("__create") }}</el-button>
            <el-button @click="reset">{{ $t("__reset") }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { form } from './model.js'
import { getAgentRole, createUser, getAgentLevelInfo } from '@/api/backstage'
import { validAccount } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'AccountCreate',
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
      form: JSON.parse(JSON.stringify(form)),
      defaultForm: JSON.parse(JSON.stringify(form)),
      rules: {
        account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
        nickname: [{ required: true, validator: validateNickName, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }]
      },
      treeData: {
        agentLevelInfo: []
      },
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      getRole: [],
      roleLoading: false,
      infoLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'visitedViews'
    ]),
    formAgentId() {
      return this.form.agentId
    }
  },
  created() {
    this.roleLoading = true
    this.infoLoading = true
    getAgentRole(this.token).then((res) => {
      const { Data } = res
      this.getRole = Data
      this.roleLoading = false
    })
    getAgentLevelInfo(this.token).then((res) => {
      this.treeData.agentLevelInfo = [res.Data.AgentLevelInfo]
      this.form.agentId = res.Data.AgentLevelInfo.AgentId
      this.form.role = this.getRole[0].Id
      this.defaultForm.agentId = res.Data.AgentLevelInfo.AgentId
      this.defaultForm.role = this.form.role
      this.infoLoading = false
    })
  },
  methods: {
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
            let hasV = false
            for (let i = 0, max = this.visitedViews.length; i < max; i++) {
              if (this.visitedViews[i].name === 'AccountList') {
                hasV = true
                this.$store.dispatch('tagsView/delCachedView', this.visitedViews[i]).then(() => {
                  const { fullPath } = this.visitedViews[i]
                  this.$nextTick(() => {
                    this.$router.replace({ path: '/redirect' + fullPath })
                  })
                })
                break
              }
            }
            if (!hasV) {
              this.$router.push({ name: 'AccountList' })
            }
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
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    handleNodeClick(data) {
      this.form.agentId = data.AgentId
      this.defaultForm.agentId = data.AgentId
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}，ID: {data.AgentId}
        </span>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.accountCreate {
  &-container {
    margin: 20px;
  }
}
.el-input {
  width: 150px;
}
.el-select {
  width: 150px;
}
.el-tree {
  display:inline-block;
}
</style>
