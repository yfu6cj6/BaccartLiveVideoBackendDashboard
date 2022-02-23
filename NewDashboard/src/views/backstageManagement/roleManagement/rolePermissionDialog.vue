<template>
  <el-dialog :title="title" :visible.sync="visible" width="40%" :before-close="onClose">
    <el-row>
      <el-col :span="24">
        <el-table ref="multipleTable" v-loading="dataLoading" :data="serverData.allPermissions" tooltip-effect="dark" height="300" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="name" :label="$t('__name')" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="nickname" :label="$t('__nickname')" width="150" align="center" :show-overflow-tooltip="true" />
        </el-table>
        <div style="margin-top: 20px">
          <el-button icon="el-icon-minus" @click="cancelSelection">{{ $t('__cancelSelect') }}</el-button>
          <el-button type="primary" icon="el-icon-check" @click="onSubmit">{{ confirm }}</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'RolePermissionDialog',
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
    'dataLoading': {
      type: Boolean,
      require: true,
      default() {
        return false
      }
    }
  },
  data: function() {
    return {
      multipleSelection: [],
      serverData: {},
      test: false
    }
  },
  methods: {
    cancelSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      const administer = this.multipleSelection.find(element => element.name === 'Administer')
      if (administer) {
        this.$emit('confirm', [administer])
      } else {
        this.$emit('confirm', this.multipleSelection)
      }
    },
    onClose() {
      this.$emit('close')
    },
    setData(data) {
      this.serverData = data
      this.$nextTick(() => {
        this.serverData.allPermissions.forEach(allPermission => {
          if (this.serverData.existPermissions.some(existPermission => existPermission && existPermission.name === allPermission.name)) {
            this.$refs.multipleTable.toggleRowSelection(allPermission, true)
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
