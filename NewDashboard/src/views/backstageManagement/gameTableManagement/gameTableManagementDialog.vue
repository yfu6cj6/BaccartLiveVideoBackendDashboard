<template>
  <el-dialog :title="title" :visible.sync="visible" width="25%" :before-close="onClose">
    <el-row>
      <el-col :span="24">
        <el-form ref="editForm" class="row" label-width="auto" :model="editForm" :rules="rules">
          <el-form-item label="ID" prop="id">
            <el-input v-model="editForm.id" :disabled="true" />
          </el-form-item>
          <el-form-item v-if="!isEdit" :label="$t('__tableId')" prop="table_id">
            <el-select v-model="editForm.table_id">
              <el-option v-for="item in tables" :key="item.key" :label="item.nickname" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!isEdit" :label="$t('__liveBetAreaId')" prop="live_bet_area_id">
            <el-select v-model="editForm.live_bet_area_id">
              <el-option v-for="item in liveBetArea" :key="item.key" :label="item.nickname" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__betMin')" prop="bet_min">
            <el-input v-model="editForm.bet_min" type="number" />
          </el-form-item>
          <el-form-item :label="$t('__betMax')" prop="bet_max">
            <el-input v-model="editForm.bet_max" type="number" />
          </el-form-item>
          <el-form-item :label="$t('__totalBetMax')" prop="total_bet_max">
            <el-input v-model="editForm.total_bet_max" type="number" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button icon="el-icon-minus" @click="onReset">{{ $t("__reset") }}</el-button>
      <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'GameTableManagementDialog',
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
    'tables': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'liveBetArea': {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    'isEdit': {
      type: Boolean,
      require: true
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
        bet_min: [{ required: true, trigger: 'blur', validator: validate }],
        bet_max: [{ required: true, trigger: 'blur', validator: validate }],
        total_bet_max: [{ required: true, trigger: 'blur', validator: validate }]
      },
      editForm: {}
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
