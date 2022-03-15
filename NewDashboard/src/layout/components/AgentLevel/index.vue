<template>
  <div ref="agentLevel" :class="{show:agentLevelSidebar}" class="agentLevel-container">
    <div class="agentLevel">
      <div class="agentLevel-items">
        <div class="handle-button" @click="show=onHandleBtnClick()">
          <i class="el-icon-close" />
        </div>
        <el-card shadow="never">
          <el-scrollbar>
            <el-tree
              v-loading="dataLoading"
              :data="agentLevel"
              :props="defaultProps"
              node-key="AgentId"
              :default-expanded-keys="treeDefaultExpandedKeys"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :indent="14"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { agentSearch } from '@/api/agentManagement/agentList'
import { mapGetters } from 'vuex'

export default {
  name: 'AgentLevel',
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      agentInfo: {},
      dataLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'agentLevelSidebar',
      'agentLevel'
    ]),
    treeDefaultExpandedKeys() {
      return this.agentLevel.length === 0 ? [] : [this.agentInfo.id]
    }
  },
  watch: {
    agentLevelSidebar(value) {
      if (value) {
        this.dataLoading = true
        agentSearch().then((res) => {
          this.$store.dispatch('app/setAgentLevel', res.agentLevel)
          this.agentInfo = res.agentInfo
          this.dataLoading = false
        })
      }
    }
  },
  methods: {
    onHandleBtnClick() {
      this.$store.dispatch('app/closeAgentLevelSideBar')
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='font-size: 14px'>
          {data.AgentName}
        </span>
      )
    },
    async handleNodeClick(data) {
      this.dataLoading = true
      this.$store.dispatch('app/setAgentId', data.AgentId)
      await this.$router.push({ path: '/agentManagement/agentManagement', query: { agentId: data.AgentId }})
      this.dataLoading = false
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
