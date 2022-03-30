<template>
  <el-dialog v-loading="dialogLoading" :title="`${title} [${form.name}]`" :visible.sync="visible" width="40%" :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table
      v-if="visible"
      ref="multipleTable"
      :data="serverData.allPermissions"
      tooltip-effect="dark"
      header-cell-class-name="bg-black_table_header"
      row-class-name="bg-black_table_col"
      style="background: black;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" :label="$t('__name')" align="center" :show-overflow-tooltip="true" sortable />
      <el-table-column prop="nickname" :label="$t('__nickname')" width="150" align="center" :show-overflow-tooltip="true" sortable />
    </el-table>
    <span v-if="!dialogLoading" slot="footer">
      <el-button class="bg-gray" @click="cancelSelection">{{ $t('__cancelSelect') }}</el-button>
      <el-button class="bg-yellow" @click="onSubmit">{{ confirm }}</el-button>
    </span>
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
      multipleSelection: [],
      serverData: {},
      dialogLoading: false
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
        this.$emit('confirm', JSON.parse(JSON.stringify([administer])))
      } else {
        this.$emit('confirm', JSON.parse(JSON.stringify(this.multipleSelection)))
      }
    },
    onClose() {
      this.$emit('close')
    },
    setData(data) {
      this.serverData = data
      this.$nextTick(() => {
        const administer = this.serverData.allPermissions.find(allPermission => allPermission.name === 'Administer')
        const administerIndex = this.serverData.allPermissions.indexOf(administer)
        if (administerIndex >= 0) {
          this.serverData.allPermissions.splice(administerIndex, 1)
        }
        if (this.serverData.existPermissions[0].name === 'Administer') {
          this.$refs.multipleTable.toggleAllSelection()
        } else {
          this.serverData.allPermissions.forEach(allPermission => {
            if (this.serverData.existPermissions.some(existPermission => existPermission.name === allPermission.name)) {
              this.$refs.multipleTable.toggleRowSelection(allPermission, true)
            }
          })
        }
      })
    },
    setDialogLoading(dialogLoading) {
      this.dialogLoading = dialogLoading
    }
  }
}
</script>

<style>
</style>
