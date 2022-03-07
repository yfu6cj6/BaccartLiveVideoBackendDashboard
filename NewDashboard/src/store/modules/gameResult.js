const state = {
  gameResultTimeType: resultTimeType
}

const resultTimeType = [{
  key: 'startTime',
  nickname: '__gameStartTime'
},
{
  key: 'endTime',
  nickname: '__gameEndTime'
}]

const mutations = {
  SET_GAMERESULT_TIME_TYPE(state) {
    state.gameResultTimeType = resultTimeType
  }
}
const actions = {
  setGameResultTimeType({ commit }) {
    commit('SET_GAMERESULT_TIME_TYPE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
