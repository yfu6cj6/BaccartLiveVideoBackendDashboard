import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.some(permission => ((permission.Code === 999) || (route.meta.permission === permission.Code)))
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

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  RESET_ROUTES(state) {
    state.addRoutes = []
    state.routes = []
  }
}

const actions = {
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      let accessedRoutes
      if (permissions[0].Code === 999) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  resetRoutes({ commit }) {
    commit('RESET_ROUTES')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
