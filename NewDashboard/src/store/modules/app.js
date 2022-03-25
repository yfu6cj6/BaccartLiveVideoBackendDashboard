import store from '@/store'

const state = {
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') ? localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    localStorage.setItem('sidebarStatus', state.sidebar.opened)
  },
  SET_SIDEBAR: (state, { opened, withoutAnimation }) => {
    localStorage.setItem('sidebarStatus', opened)
    state.sidebar.opened = opened
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  openSideBar({ commit }, { withoutAnimation }) {
    commit('SET_SIDEBAR', { opened: true, withoutAnimation })
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('SET_SIDEBAR', { opened: false, withoutAnimation })
    store.dispatch('agentManagement/closeAgentLevelSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
