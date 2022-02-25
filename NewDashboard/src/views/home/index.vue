<template>
  <div class="home-container">
    <el-collapse class="home-collapse">
      <el-collapse-item
        v-for="item in agentAnnouncements"
        :key="item.id"
        :title="item.title"
        class="item"
      >
        <template>
          {{ item.fullContent }}
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="home-collapse">
      <el-collapse-item
        v-for="item in gameAnnouncements"
        :key="item.id"
        :title="item.title"
        style="border-right: none"
      >
        <template>
          {{ item.fullContent }}
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { announcementSearch } from '@/api/backstageManagement/announcementManagement'

export default {
  name: 'Home',
  data() {
    return {
      activeNames1: ['1'],
      agentAnnouncements: [],
      gameAnnouncements: []
    }
  },
  created() {
    announcementSearch({}).then((res) => {
      res.rows.forEach(element => {
        if (element.type === 'game') {
          this.gameAnnouncements.push(element)
        } else if (element.type === 'agent') {
          this.agentAnnouncements.push(element)
        }
      })
    })
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

  &-collapse {
    padding: 0 15px;
    width: 50%;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
