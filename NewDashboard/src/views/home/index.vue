<template>
  <div class="home-container">
    <el-tag class="home-tags" type="info">{{ $t('__agencyAnnouncement') }}</el-tag>
    <el-tag class="home-tags" type="info">{{ $t('__gameAnnouncement') }}</el-tag>
    <el-collapse v-if="showAgentAnnouncements" class="home-collapse">
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
    <el-tag v-else class="home-noMore" type="info">{{ $t('__noMore') }}</el-tag>
    <el-collapse v-if="showGameAnnouncements" class="home-collapse">
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
    <el-tag v-else class="home-noMore" type="info">{{ $t('__noMore') }}</el-tag>
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
    margin: 30px;
  }

  &-tags {
    padding: 0 15px;
    width: 50%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    color: #e6a23c;
    font-size: 16px;
    font-weight: bold;
    background-color: white;
  }

  &-collapse {
    padding: 5px 15px 0 15px;
    width: 50%;
    display: inline-block;
    vertical-align: top;
  }

  &-noMore {
    padding: 0 15px;
    width: 50%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    font-size: 16px;
    background-color: white;
  }
}
</style>
