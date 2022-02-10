<template>
  <div class="roleGroup-container">
    <el-form class="filterForm" style="max-width: 450px; margin: 0 auto" label-width="120px">
      <el-form-item :label="$t('__select') + $t('__roleGroup')" style="border-bottom: 1px solid #ebebeb">
        <el-select v-model="group">
          <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { groups } from './index.json'

export default {
  name: 'RoleGroup',
  data() {
    return {
      group: '',
      groups: JSON.parse(JSON.stringify(groups))
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
