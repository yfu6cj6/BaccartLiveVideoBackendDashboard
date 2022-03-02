<template>
  <el-dialog :title="title" :visible.sync="visible" width="25%" :before-close="onClose">
    <el-row>
      <el-col :span="24">
        <el-form ref="editForm" class="row" label-width="auto" :model="editForm" :rules="rules">
          <el-form-item label="ID" prop="id">
            <el-input v-model="editForm.id" :disabled="true" />
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__marquee')" prop="is_marquee">
            <el-select v-model="editForm.is_marquee">
              <el-option v-for="item in announcementMarquee" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('__announcementTitle')" prop="title">
            <el-input v-model="editForm.title" />
          </el-form-item>
          <el-form-item :label="$t('__announcementType')" prop="type">
            <el-select v-model="editForm.type">
              <el-option v-for="item in methodType" :key="item.key" :label="$t(item.nickname)" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__announcementDate')" prop="announcementedAt">
            <el-date-picker
              v-model="editForm.announcementedAt"
              type="datetimerange"
              align="right"
              unlink-panels
              :range-separator="$t('__to')"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item class="inputTitle" :label="$t('__maintainDate')" prop="maintainedAt">
            <el-date-picker
              v-model="editForm.maintainedAt"
              type="datetimerange"
              align="right"
              unlink-panels
              :range-separator="$t('__to')"
              :start-placeholder="$t('__startDate')"
              :end-placeholder="$t('__endDate')"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item :label="$t('__announcementContent')" prop="content">
            <el-input v-model="editForm.content" type="textarea" :rows="2" />
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
  name: 'AnnouncementManagementDialog',
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
    'pickerOptions': {
      type: Object,
      require: true,
      default() {
        return {}
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
    },
    'announcementMarquee': {
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
        title: [{ required: true, trigger: 'blur', validator: validate }],
        announcementedAt: [{ required: true, trigger: 'blur', validator: validate }],
        maintainedAt: [{ required: true, trigger: 'blur', validator: validate }]
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

<style lang="scss" scoped>
.el-select {
  width: 180px;
}

.el-input {
  width: 220px;
}
</style>
