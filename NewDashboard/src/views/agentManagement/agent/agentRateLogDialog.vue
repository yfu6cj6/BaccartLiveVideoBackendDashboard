<template>
  <el-dialog :title="title" :visible.sync="visible" width="40%" :before-close="onClose" :close-on-click-modal="false">
    <el-table :data="listData" tooltip-effect="dark" max-height="400px">
      <el-table-column prop="user" :label="$t('__user')" align="center" />
      <el-table-column v-if="operationType === operationEnum.commissionRate" prop="commission_rate" :label="$t('__commissionRate')" align="center" />
      <el-table-column v-if="operationType === operationEnum.rollingRate" prop="rolling_rate" :label="$t('__rollingRate')" align="center" />
      <el-table-column prop="created_at" :label="$t('__createdAt')" align="center" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'AgentRateLogDialog',
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
      operationEnum: Object.freeze({ 'commissionRate': 1, 'rollingRate': 2 })
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
