<template>
  <div class="navbar">
    <div class="bulletin">
      <i class="el-icon-mic" />
      <marquee direction="left">
        {{ bulletinMsg }}
      </marquee>
    </div>
    <div class="right-Agent">
      {{ $t('__agent') }}: {{ agentName }}
    </div>
    <div class="right-prId">
      {{ $t('__productID') }}: 1
    </div>
    <div>
      <el-col :span="12">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ $t(getLang($i18n.locale)) }}
            <span class="el-dropdown-link">
              {{ $t('__laguage') }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeLocale('zh_cht')">{{ $t(getLang('zh_cht')) }}</el-dropdown-item>
            <el-dropdown-item @click.native="changeLocale('zh_chs')">{{ $t(getLang('zh_chs')) }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getLanguage, setLanguage } from '@/lang/lang'

export default {
  data: function() {
    return {
      agentName: this.$store.getters.account,
      bulletinMsg: '12345678910'
    }
  },
  methods: {
    changeLocale: function(locale) {
      setLanguage(locale)
      this.$store.dispatch('backstage/changeSelectLang')
      this.$store.dispatch('customerServiceManage/changeSelectLang')
      this.$store.dispatch('operation_member/changeSelectLang')
      this.$store.dispatch('operation_agent/changeSelectLang')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #1a6396;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.bulletin {
  width: 50%;
  max-width: 500px;
  background-color: #0d325e;
  color: #fff;
  position: absolute;
  top: 0.75em;
  left: 25%;
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
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  display: flex;
  height: 50px;
  padding-left: 15px;
  align-items: center;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.right-Agent {
  float: right;
  color: #fff;
  height: 50px;
  line-height: 50px;
  padding: 0 1em;
  font-size: .9em;
}
.right-prId {
  float: right;
  color: #fff;
  height: 50px;
  line-height: 50px;
  padding: 0 1em;
    font-size: .9em;
}
</style>
