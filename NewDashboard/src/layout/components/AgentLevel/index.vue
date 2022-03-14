<template>
  <div ref="agentLevel" :class="{show:agentLevelVisable}" class="agentLevel-container">
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
import { sendData, register, unRegister } from '@/utils/sendTool'

export default {
  name: 'AgentLevel',
  data() {
    return {
      defaultProps: {
        children: 'SubAgentLevelInfos',
        label: 'AgentName'
      },
      agentLevel: [],
      agentInfo: {},
      dataLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'agentLevelVisable',
      'visitedViews',
      'cachedViews'
    ]),
    treeDefaultExpandedKeys() {
      return this.agentLevel.length === 0 ? [] : [this.agentInfo.id]
    }
  },
  watch: {
    agentLevelVisable(value) {
      if (value) {
        this.addEventClick()
        this.dataLoading = true
        agentSearch().then((res) => {
          this.agentLevel = res.agentLevel
          this.agentInfo = res.agentInfo
          this.dataLoading = false
        })
      }
    }
  },
  created() {
    register('agentLevelInfo', this.agentLevelInfo)
  },
  mounted() {
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.agentLevel
    elx.remove()
    unRegister('agentLevelInfo', this.agentLevelInfo)
  },
  methods: {
    agentLevelInfo(agentLevel) {
      this.agentLevel = agentLevel
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.agentLevel')
      if (!parent) {
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.agentLevel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    },
    onHandleBtnClick() {
      this.$store.dispatch('agentManagement/setAgentManagementSideBarVisable', false)
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
      const awaitTime = !this.cachedViews.some(v => v.name === 'AgentManagement')
      this.$router.push({ path: '/agentManagement/agentManagement' })
      if (awaitTime) {
        await this.delay(1000)
      }
      sendData('agentLevel_AgentId', data.AgentId)
      this.dataLoading = false
    },
    delay(n) {
      return new Promise(function(resolve) {
        setTimeout(resolve, n)
      })
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
  z-index: 40000;
}

.show {
  transition: all .4s cubic-bezier(.7, .3, .1, 1);

  .agentLevel {
    transform: translate(100%);
  }
}
</style>
