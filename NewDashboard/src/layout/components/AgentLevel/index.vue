<template>
  <div ref="agentLevel" :class="{show:agentLevelSidebar}" class="agentLevel-container">
    <div class="agentLevel">
      <div class="agentLevel-items">
        <div class="handle-button" @click="onHandleBtnClick()">
          <i class="el-icon-close" />
        </div>
        <el-card shadow="never">
          <el-scrollbar>
            <el-input
              v-model="filterText"
              :placeholder="$t('__enterKeys')"
            />
            <el-tree
              ref="tree"
              v-loading="agentLevelLoading"
              :data="agentLevel"
              :props="defaultProps"
              node-key="AgentId"
              :default-expanded-keys="treeDefaultExpandedKeys"
              :render-content="renderContent"
              :indent="14"
              :filter-node-method="filterNode"
              highlight-current
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AgentLevel',
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      filterText: ''
    }
  },
  computed: {
    ...mapGetters([
      'agentLevelSidebar',
      'agentLevel',
      'agentLevelLoading',
      'agentLevelExpandedKeys'
    ]),
    treeDefaultExpandedKeys() {
      return (!this.agentLevelExpandedKeys || this.agentLevelExpandedKeys.length === 0) ? [] : this.agentLevelExpandedKeys
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.AgentName.indexOf(value) !== -1
    },
    onHandleBtnClick() {
      this.$store.dispatch('agentManagement/closeAgentLevelSideBar')
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}
        </span>
      )
    },
    async handleNodeClick(data) {
      this.$store.dispatch('agentManagement/setAgentLevelLoading', true)
      await this.$router.push({ path: `/agentManagement/agentManagement/${data.AgentId}` })
      this.$store.dispatch('agentManagement/setAgentLevelLoading', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.agentLevel {
  width: 100%;
  max-width: 170px;
  height: 100vh;
  position: fixed;
  top: 0%;
  right: 100%;
  transform-origin: right top;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  background: #fff;
  transition: all .4s cubic-bezier(.7, .3, .1, 1);
  transform: translate(0%);
  z-index: 1002;
}

.show {
  transition: all .4s cubic-bezier(.7, .3, .1, 1);

  .agentLevel {
    transform: translate(100%);
  }
}
</style>
