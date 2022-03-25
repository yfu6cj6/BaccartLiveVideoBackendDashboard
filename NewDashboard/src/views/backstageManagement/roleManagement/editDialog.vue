<template>
  <el-dialog v-loading="dialogLoading" :title="title" :visible.sync="visible" width="20%" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
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
      <el-form-item :label="$t('__type')" prop="type">
        <el-select v-model="editForm.type">
          <el-option v-for="item in types" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
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
    'types': {
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
