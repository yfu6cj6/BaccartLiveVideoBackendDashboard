import { getInfo } from '@/api/user'
import { removeToken, removeTokenType } from '@/utils/auth'
import { asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'
import { resetRouter } from '@/router'
import store from '@/store'

const getDefaultState = () => {
  return {
    account: '',
    agent_id: 0,
    agentName: '',
    nickname: '',
    permissions: [],
    balance: '',
    agentFullName: '',
    permission_routes: [],
    isAdminister: null,
    isAgentSubAccount: null
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
    state.balance = data.user.agent.balance
    state.agentFullName = `${data.user.agentName}(${data.user.agent.user.account})`
    state.isAdminister = data.roles.some(role => role === 'Administer')
    state.isAgentSubAccount = data.roles.some(role => role === 'AgentSubAccount')
  },
  SET_ROUTES: (state, permissions) => {
    let accessedRoutes
    if (permissions[0] === 'Administer') {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
    }
    state.permission_routes = constantRoutes.concat(accessedRoutes)

    resetRouter()
    router.addRoutes(accessedRoutes)
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login({ commit }, res) {
    commit('SET_USER', res)
    commit('SET_ROUTES', res.permissions)
    store.dispatch('common/setCommonType')
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        commit('SET_USER', res)
        commit('SET_ROUTES', res.permissions)
        store.dispatch('common/setCommonType')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
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

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.some(permission => ((permission === 'Administer') || (permission === route.meta.permission)))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

