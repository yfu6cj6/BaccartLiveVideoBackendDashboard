const state = {
  agentLevelVisable: false
}

const mutations = {
  SET_AGENTMANAGEMENT_SIDEBAR_VISABLE(state, visable) {
    state.agentLevelVisable = visable
  }
}
const actions = {
  setAgentManagementSideBarVisable({ commit }, visable) {
    commit('SET_AGENTMANAGEMENT_SIDEBAR_VISABLE', visable)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
