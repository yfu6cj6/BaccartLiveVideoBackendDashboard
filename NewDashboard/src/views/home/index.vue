<template>
  <div class="home-container">
    <el-tag type="info">{{ $t('__agencyAnnouncement') }}</el-tag>
    <el-tag type="info">{{ $t('__gameAnnouncement') }}</el-tag>
    <el-collapse v-if="showAgentAnnouncements">
      <el-collapse-item
        v-for="item in agentAnnouncements"
        :key="item.id"
        :title="item.title"
      >
        <template>
          {{ item.fullContent }}
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-tag v-else type="info">{{ $t('__noMore') }}</el-tag>
    <el-collapse v-if="showGameAnnouncements">
      <el-collapse-item
        v-for="item in gameAnnouncements"
        :key="item.id"
        :title="item.title"
      >
        <template>
          {{ item.fullContent }}
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-tag v-else type="info">{{ $t('__noMore') }}</el-tag>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'gameAnnouncements',
      'agentAnnouncements'
    ]),
    showGameAnnouncements() {
      return this.gameAnnouncements.length > 0
    },
    showAgentAnnouncements() {
      return this.agentAnnouncements.length > 0
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 10px;
  }
}

.el-collapse {
  padding: 5px 15px 0 15px;
  width: 50%;
  display: inline-block;
  vertical-align: top;
}

.el-tag {
  padding: 0 15px;
  width: 50%;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  color: #e6a23c;
  font-size: 16px;
  font-weight: bold;
  background-color: white;
  border: none;
}
</style>
