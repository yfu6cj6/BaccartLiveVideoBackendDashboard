<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <a href="#/" class="sidebar-logo-link" />
    <transition name="sidebarLogoFade">
      <hamburger :is-active="!collapse" class="hamburger-container" @toggleClick="toggleSideBar" />
    </transition>
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'

export default {
  name: 'SidebarLogo',
  components: {
    Hamburger
  },
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
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
  }

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

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
