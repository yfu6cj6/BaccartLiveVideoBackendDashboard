<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="onClose" :close-on-press-escape="false">
    <el-row>
      <el-col :span="24">
        <el-form ref="editForm" class="row" label-width="auto" :model="editForm" :rules="rules">
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
          <el-form-item>
            <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
            <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'RoleManagementDialog',
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
      if (value === undefined || value.length < 1) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [{ required: true, trigger: 'change', validator: validate }],
        nickname: [{ required: true, trigger: 'change', validator: validate }],
        type: [{ required: true, trigger: 'change', validator: validate }]
      },
      editForm: {}
    }
  },
  computed: {
  },
  watch: {
    visible() {
      this.editForm = JSON.parse(JSON.stringify(this.form))
      if (!this.visible) {
        this.$refs.editForm.clearValidate()
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.editForm)
        }
      })
    },
    onClose() {
      this.$emit('close')
    },
    onReset() {
      this.editForm = JSON.parse(JSON.stringify(this.form))
    }
  }
}
</script>

<style>
</style>
