<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false">
    <div class="content">
      <span>{{ content }}</span>
    </div>
    <el-form ref="form" label-width="auto" :model="form" :rules="rules">
      <el-form-item :label="$t('__userPassword')" prop="userPassword">
        <el-input v-model="form.userPassword" show-password />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ $t('__confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'OperateDialog',
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
    'content': {
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
    'submitFun': {
      type: Function,
      require: true,
      default() {
        return () => {}
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
      dialogLoading: false
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('__confirmOperation')).then(_ => {
            this.dialogLoading = true
            this.submitFun(this.form).then((res) => {
              this.$emit('editSuccess', res)
              this.dialogLoading = false
            })
          })
        }
      })
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.content {
  text-align: center;
}
</style>
