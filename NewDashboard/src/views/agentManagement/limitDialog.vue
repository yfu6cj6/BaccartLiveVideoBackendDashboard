<template>
  <el-dialog :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false">
    <el-table :data="handicaps" tooltip-effect="dark" max-height="400px">
      <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="nickname" :label="$t('__nickname')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_min" :label="$t('__betMin')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="bet_max" :label="$t('__betMax')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="currency" :label="$t('__currency')" align="center" :show-overflow-tooltip="true" />
    </el-table>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'LimitDialog',
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
    'handicaps': {
      type: Array,
      require: true,
      default() {
        return []
      }
    }
  },
  data: function() {
    return {
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.el-table--fit {
  padding: 0 0 10px 0
}
</style>
