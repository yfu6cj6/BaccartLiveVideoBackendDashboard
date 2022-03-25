<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" width="30%" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="editForm" class="row" :model="editForm" :rules="rules">
      <el-form-item label="ID" prop="id">
        <el-input v-model="editForm.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('__name')" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item :label="$t('__nickname')" prop="nickname">
        <el-input v-model="editForm.nickname" />
      </el-form-item>
      <el-form-item label="Uri" prop="uri">
        <el-input v-model="editForm.uri" />
      </el-form-item>
      <el-form-item :label="$t('__method')" prop="method">
        <el-select v-model="editForm.method">
          <el-option v-for="item in methodType" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="requestContent" prop="request_content">
        <el-input v-model="editForm.request_content" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="responseContent" prop="response_content">
        <el-input v-model="editForm.response_content" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <span v-show="!dialogLoading" slot="footer">
      <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
      <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDialog',
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
    'methodType': {
      type: Array,
      require: true,
      default() {
        return []
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
        name: [{ required: true, trigger: 'blur', validator: validate }],
        nickname: [{ required: true, trigger: 'blur', validator: validate }]
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

<style>
</style>
