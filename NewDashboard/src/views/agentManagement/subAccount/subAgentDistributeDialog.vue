<template>
  <el-dialog v-loading="dialogLoading" :title="`${title} [${form.fullName}]`" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table
      ref="subAgentsTable"
      :data="subAgents"
      tooltip-effect="dark"
      header-cell-class-name="bg-black_table_header"
      row-class-name="bg-black_table_col"
      style="background: black;"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="nickname" :label="$t('__agent')" align="center" :show-overflow-tooltip="true" />
    </el-table>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <el-form-item :label="$t('__userPassword')" prop="userPassword">
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

export default {
  name: 'SubAgentDistributeDialog',
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
    'subAgents': {
      type: Array,
      require: true,
      default() {
        return []
      }
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
    return {
      rules: {
        userPassword: [{ required: true, trigger: 'blur', validator: validate }]
      },
      dialogLoading: false,
      multipleSelection: []
    }
  },
  methods: {
    handleSelection(val) {
      this.multipleSelection = val
    },
    setData(boundAgents) {
      this.subAgents.forEach(subAgent => {
        if (boundAgents.some(boundAgent => boundAgent === subAgent.key)) {
          this.$refs.subAgentsTable.toggleRowSelection(subAgent, true)
        }
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmMsg(`${this.$t('__confirmOperation')}?`, () => {
            const data = JSON.parse(JSON.stringify(this.form))
            data.agents = []
            this.multipleSelection.forEach(element => {
              data.agents.push(element.key)
            })
            this.$emit('onSubmit', data)
          })
        }
      })
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.el-table--fit {
  padding: 0 0 10px 0
}
</style>
