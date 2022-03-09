const state = {
  agentAccountStatusType: agentAccountStatusType
}

const agentAccountStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const mutations = {
  SET_AGENT_ACCOUNT_STATUSTYPE(state) {
    state.agentAccountStatusType = agentAccountStatusType
  }
}
const actions = {
  setAgentAccountStatusType({ commit }) {
    commit('SET_AGENT_ACCOUNT_STATUSTYPE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
