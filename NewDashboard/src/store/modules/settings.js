import defaultSettings from '@/settings'

const state = defaultSettings

const mutations = {
  CHANGE_SETTING: (state, data) => {
    // eslint-disable-next-line no-prototype-builtins
    for (const key in data) {
      state[key] = data[key]
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

