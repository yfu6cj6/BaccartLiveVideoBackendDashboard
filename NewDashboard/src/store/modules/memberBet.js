const state = {
  memberBetTimeType: betTimeType
}

const betTimeType = [{
  key: 'betTime',
  nickname: '__betTime'
},
{
  key: 'payoutTime',
  nickname: '__payoutTime'
}]

const mutations = {
  SET_MEMBETBET_TIME_TYPE(state) {
    state.memberBetTimeType = betTimeType
  }
}
const actions = {
  setMemberBetTimeType({ commit }) {
    commit('SET_MEMBETBET_TIME_TYPE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
