import { getInfo } from '@/api/user'
import { removeToken, removeTokenType } from '@/utils/auth'

const getDefaultState = () => {
  return {
    account: '',
    agent_id: undefined,
    agentName: '',
    nickname: '',
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, data) => {
    state.account = data.user.account
    state.agent_id = data.user.agent_id
    state.agentName = data.user.agentName
    state.nickname = data.user.nickname
    state.permissions = data.permissions
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    commit('SET_USER', userInfo)
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        commit('SET_USER', res)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    removeTokenType()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeTokenType()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

