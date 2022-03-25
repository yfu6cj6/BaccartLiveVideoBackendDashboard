<template>
  <el-dialog :title="title" :visible.sync="visible" :width="formWidth" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table :data="listData" tooltip-effect="dark" header-cell-class-name="bg-black_table_header" row-class-name="bg-black_table_col" style="background: black;">
      <el-table-column prop="user" :label="$t('__operator')" align="center" />
      <el-table-column v-if="operationType === operationEnum.liveCommissionRate" prop="commission_rate" :label="$t('__liveCommissionRate')" align="center" />
      <el-table-column v-if="operationType === operationEnum.liveRollingRate" prop="rolling_rate" :label="$t('__liveRollingRate')" align="center" />
      <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
    </el-table>
  </el-dialog>
</template>

<script>
import handleDialogWidth from '@/layout/mixin/handleDialogWidth'

export default {
  name: 'AgentRateLogDialog',
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
    'listData': {
      type: Array,
      require: true,
      default() {
        return {}
      }
    },
    'operationType': {
      type: Number,
      require: true,
      default() {
        return 0
      }
    }
  },
  data: function() {
    return {
      operationEnum: Object.freeze({ 'liveCommissionRate': 1, 'liveRollingRate': 2 })
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
