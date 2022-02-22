<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <a href="#/" class="sidebar-logo-link" />
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  height: 50px;
  background: #0f476d;
  text-align: center;
  overflow: hidden;
  display: flex;

  & .sidebar-logo-link {
    height: 100%;
    text-align: left;
    font-size: 16px;
  }
}
</style>
