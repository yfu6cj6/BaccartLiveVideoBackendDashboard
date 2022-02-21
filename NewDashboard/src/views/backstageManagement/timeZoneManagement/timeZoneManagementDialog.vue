<template>
  <el-dialog :title="$t('__edit')" :visible.sync="visible" :before-close="close">
    <el-row>
      <el-col :span="18">
        <el-form
          ref="form"
          label-width="150px"
          :model="form"
        >
          <el-form-item label="ID" prop="id">
            <el-input v-model="form.id" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('__timeZone')" prop="time_zone">
            <el-input v-model="form.time_zone" />
          </el-form-item>
          <el-form-item :label="$t('__cityName')" prop="city_name">
            <el-input v-model="form.city_name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t("__revise") }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'TimeZoneManagementDialog',
  props: {
    'visible': {
      type: Boolean,
      require: true
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
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    onSubmit() {
      this.$emit('edit', this.form)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>
