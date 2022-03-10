<template>
  <div class="navbar">
    <hamburger :is-active="!isCollapse" class="hamburger" @toggleClick="toggleSideBar" />
    <div>
      <el-col class="language-container" :span="12">
        <el-dropdown trigger="click">
          <span class="language-dropdown">
            {{ $t(getLang($i18n.locale)) }}<i class="el-icon-arrow-down el-icon--right" />
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
          {{ $t('__agent') }}: {{ agentFullName }}
        </span>
        <span class="language-item">
          {{ $t('__balance') }}: {{ balance }}
        </span>
        <span v-if="marqueeMsg.length > 0" class="marquee">
          <p>{{ marqueeMsg }}</p>
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
      'marqueeMsg',
      'agentFullName',
      'nickname',
      'balance'
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
.language {
  &-container {
    height: 50px;
    line-height: 50px;
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
.marquee {
  width: 100%;
  max-width: 45%;
	background-color: #0d325e;
	color: white;
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  right: 0%;
}
.marquee p {
  display: inline-block;
  padding-left: 100%;
  line-height: 0%;
  animation: marquee 15s linear infinite;
}
@keyframes marquee {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
</style>
