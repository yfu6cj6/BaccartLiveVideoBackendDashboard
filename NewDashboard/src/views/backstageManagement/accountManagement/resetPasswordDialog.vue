<template>
  <el-dialog
    v-loading="dialogLoading"
    :title="title"
    :visible.sync="visible"
    :width="formWidth"
    :before-close="onClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <label>{{ `${$t('__account')}: ` }}
      <span>{{ `${form.account}` }}</span>
    </label>
    <br>
    <label>{{ `${$t('__newPassword')}: ` }}
      <span>{{ `${form.newPassword}` }}</span>
    </label>
    <span v-if="!dialogLoading" slot="footer">
      <el-button class="bg-yellow" @click="onClose">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'ResetPasswordDialog',
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
    'form': {
      type: Object,
      require: true,
      default() {
        return {}
      }
    }
  },
  data: function() {
    return {
      dialogLoading: false
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    }
  }
}
</script>

<style lang="scss" scoped>
label {
  color: #f9c901;
  font-size: 14px;
  font-weight: 500;
  span {
    color: #fff;
  }
}
</style>
