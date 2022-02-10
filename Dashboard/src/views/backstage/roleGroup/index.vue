<template>
  <div class="roleGroup-container">
    <el-form class="filterForm" style="max-width: 350px; margin: 0 auto" label-width="120px">
      <el-form-item :label="$t('__select') + $t('__roleGroup')" style="border-bottom: 1px solid #ebebeb">
        <el-select v-model="group">
          <el-option v-for="item in groups" :key="item.id" :label="item.id" :value="$t(item)" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RoleGroup',
  data() {
    const groups = ['__admin', '__agentAccount', '__customerServiceAccount', '__business', '__agentAccount_seamlessWallet', '__finance', '__bdl_customerService']
    return {
      group: '',
      groups: groups
    }
  }
}
</script>

<style lang="scss" scoped>
.roleGroup {
  &-container {
    margin: 20px;
  }
}
</style>
