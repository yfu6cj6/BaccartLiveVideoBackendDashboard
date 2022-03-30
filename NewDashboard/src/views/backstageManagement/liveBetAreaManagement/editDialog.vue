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
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" label-position="left">
      <el-form-item label="ID" prop="id">
        <el-input v-model="editForm.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('__name')" prop="area_name">
        <el-input v-model="editForm.area_name" />
      </el-form-item>
      <el-form-item :label="$t('__code')" prop="area">
        <el-input v-model="editForm.area" />
      </el-form-item>
      <el-form-item :label="$t('__odds')" prop="odds">
        <el-input v-model="editForm.odds" type="number" />
      </el-form-item>
      <el-form-item :label="$t('__betMin')" prop="bet_min">
        <el-input v-model="editForm.bet_min" type="number" />
      </el-form-item>
      <el-form-item :label="$t('__betMax')" prop="bet_max">
        <el-input v-model="editForm.bet_max" type="number" />
      </el-form-item>
      <el-form-item :label="$t('__currency')" prop="currency">
        <el-select v-model="editForm.currency">
          <el-option v-for="item in currency" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__activated')" prop="activated">
        <el-select v-model="editForm.activated">
          <el-option v-for="item in activated" :key="item.key" :label="item.nickname" :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
    <span v-if="!dialogLoading" slot="footer">
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
    },
    'currency': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'activated': {
      type: Array,
      require: true,
      default() {
        return []
      }
    }
  },
  data: function() {
    const validate = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t('__requiredField')))
      } else {
        callback()
      }
    }
    return {
      rules: {
        area_name: [{ required: true, trigger: 'blur', validator: validate }],
        area: [{ required: true, trigger: 'blur', validator: validate }],
        odds: [{ required: true, trigger: 'blur', validator: validate }],
        bet_min: [{ required: true, trigger: 'blur', validator: validate }],
        bet_max: [{ required: true, trigger: 'blur', validator: validate }]
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
      this.$refs.editForm.clearValidate()
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

.el-select,
.el-input {
  width: 90%;
}
</style>
