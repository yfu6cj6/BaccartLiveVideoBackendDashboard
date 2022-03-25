<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="editForm" class="row" :model="editForm" :rules="rules" label-width="60px" label-position="left">
      <el-form-item label="ID" prop="id">
        <el-input v-model="editForm.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('__account')" prop="account">
        <el-input v-model="editForm.account" />
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input v-model="editForm.ip" />
      </el-form-item>
    </el-form>
    <span v-show="!dialogLoading" slot="footer">
      <el-button class="bg-gray" @click="onReset">{{ $t("__reset") }}</el-button>
      <el-button class="bg-yellow" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'EditDialog',
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
    const validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    return {
      rules: {
        account: [{ required: true, trigger: 'blur', validator: validate }],
        ip: [{ required: true, trigger: 'blur', validator: validate }]
      },
      editForm: {},
      dialogLoading: false
    }
  },
  computed: {
  },
  watch: {
    visible() {
      if (this.visible) {
        this.editForm = JSON.parse(JSON.stringify(this.form))
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

<style lang="scss" scoped>
.el-form {
  margin-bottom: 10px;
}
</style>
