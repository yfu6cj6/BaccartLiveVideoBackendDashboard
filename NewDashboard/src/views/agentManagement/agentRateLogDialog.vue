<template>
  <el-dialog :title="title" :visible.sync="visible" width="40%" :before-close="onClose">
    <el-table :data="listData" tooltip-effect="dark" max-height="400px">
      <el-table-column prop="user" :label="$t('__user')" align="center" />
      <el-table-column v-if="operationType === 1" prop="commission_rate" :label="$t('__commissionRate')" align="center" />
      <el-table-column v-if="operationType === 2" prop="rolling_rate" :label="$t('__rollingRate')" align="center" />
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
    // operationType === 1 輸贏佔成
    // operationType === 2 洗碼佔成
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
