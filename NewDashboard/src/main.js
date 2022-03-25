import Vue from 'vue'
import { i18n } from './lang/lang'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import vuetify from '@/plugins/vuetify' // path to vuetify export

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$stringFormat = function stringFormat(formatted, args) {
  for (let i = 0; i < args.length; i++) {
    const regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
})
