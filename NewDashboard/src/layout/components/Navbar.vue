<template>
  <div class="navbar">
    <hamburger :is-active="!isCollapse" class="hamburger" @toggleClick="toggleSideBar" />
    <div>
      <el-col class="language-container" :span="12">
        <span class="language-title">
          {{ $t(getLang($i18n.locale)) }}
        </span>
        <el-dropdown trigger="click">
          <span class="language-dropdown">
            {{ $t('__laguage') }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeLocale('zh_cht')">{{ $t(getLang('zh_cht')) }}</el-dropdown-item>
            <el-dropdown-item @click.native="changeLocale('zh_chs')">{{ $t(getLang('zh_chs')) }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="language-item">
          Hi, {{ nickname }}
        </span>
        <span class="language-item">
          {{ $t('__agent') }}: {{ agentName }}
        </span>
        <span class="language-item">
          {{ $t('__creditlimit') }}: {{ credit_limit }}
        </span>
        <span v-if="marquee" class="bulletin">
          <i class="el-icon-mic" />
          <marquee direction="left">
            {{ bulletinMsg }}
          </marquee>
        </span>
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { getLanguage, setLanguage } from '@/lang/lang'

export default {
  components: {
    Hamburger
  },
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'marquee',
      'agentName',
      'nickname',
      'credit_limit',
      'bulletinMsg'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
  },
  methods: {
    changeLocale: function(locale) {
      setLanguage(locale)
    },
    getLang: function(lang) {
      switch (lang) {
        case 'zh_cht':
          return '__traditionalChinese'
        case 'zh_chs':
          return '__simplifiedChinese'
        default:
          return this.getLang(getLanguage())
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #1a6396;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.bulletin {
  width: 100%;
  max-width: 50%;
  background-color: #0d325e;
  color: #fff;
  position: absolute;
  top: 25%;
  right: 0%;
  border-radius: 1em;
  padding: 0.5em 1.5em 0.25em 2.5em;
  font-size: 14px;
  line-height: 14px;
}
.el-icon-mic {
  position: absolute;
  font-size: 14px;
  color: #ff9800;
  font-size: 1.4em;
  left: 0.5em;
  top: 0.25em;
}
.language {
  &-container {
    height: 50px;
    line-height: 50px;
  }
  &-title {
    color: #ffffff;
    display: inline-block;
    height: 50px;
    padding-left: 15px;
  }
  &-dropdown {
    cursor: pointer;
    color: #ffffff;
    display: inline-block;
    height: 50px;
    padding-left: 15px;
  }
  &-item {
    margin: 0 0 0 1.5em;
    color: #fff;
    line-height: 50px;
    font-size: .9em;
  }
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
