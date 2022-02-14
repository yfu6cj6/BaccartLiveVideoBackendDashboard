<template>
  <el-dialog title="遊戲結果詳情" :visible.sync="visible" :before-close="close">
    <el-row>
      <el-tag type=" " effect="plain">遊戲局號：{{ rowData.roundId }}</el-tag>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-row type="flex" justify="center"><h1>閒</h1></el-row>
        <el-row type="flex" justify="center">
          <span v-for="(card, index) in rowData.playerCard" :key="index" class="card"><img :src="'./images/puke_img/'+ card +'.jpg'"></span>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="center"><h1>莊</h1></el-row>
        <el-row type="flex" justify="center">
          <span v-for="(card, index) in rowData.bankerCard" :key="index" class="card"><img :src="'./images/puke_img/'+ card +'.jpg'"></span>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  props: {
    'visible': {
      type: Boolean
    },
    'rowData': {
      type: Object,
      default: undefined
    }
  },
  created() {
  },
  methods: {
    close() {
      console.log('close')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.card {
    margin: 10px
  }
.el-row {
  flex-wrap: wrap
}
</style>
